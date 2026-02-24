from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.db.models import RoleAccess, Module
from app.db.database import db

module_bp = Blueprint("modules", __name__)

@module_bp.route("/", methods=["GET", "OPTIONS"])
@jwt_required()
def get_modules():

    # ✅ Allow preflight requests
    if request.method == "OPTIONS":
        return jsonify({}), 200

    claims = get_jwt()
    role_id = claims.get("role_id")

    permissions = (
        db.session.query(RoleAccess, Module)
        .join(Module, RoleAccess.module_id == Module.module_id)
        .filter(RoleAccess.role_id == role_id)
        .filter(RoleAccess.view_flag == True)
        .filter(RoleAccess.status == True)
        .filter(Module.status == True)
        .order_by(Module.module_order)
        .all()
    )

    modules = []

    for access, module in permissions:
        modules.append({
            "module_id": str(module.module_id),
            "module_name": module.module_name,
            "module_type": module.module_type,
            "module_order": module.module_order,
            "parent_module_id": str(module.parent_module_id) if module.parent_module_id else None,
        })

    module_dict = {m["module_id"]: m for m in modules}
    tree = []

    for module in modules:
        if module["parent_module_id"]:
            parent = module_dict.get(module["parent_module_id"])
            if parent:
                parent.setdefault("children", []).append(module)
        else:
            module.setdefault("children", [])
            tree.append(module)

    return jsonify(tree), 200
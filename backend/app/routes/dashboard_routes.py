from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.db.models import RoleAccess, Module
from app.db.database import db

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/", methods=["GET"])
@jwt_required()
def get_dashboard():

    claims = get_jwt()
    role_id = claims.get("role_id")

    permissions = (
        db.session.query(RoleAccess, Module)
        .join(Module, RoleAccess.module_id == Module.module_id)
        .filter(RoleAccess.role_id == role_id)
        .filter(RoleAccess.status == True)
        .all()
    )

    response = []

    for access, module in permissions:
        response.append({
            "module": module.module_name,
            "view": access.view_flag,
            "add": access.add_flag,
            "edit": access.edit_flag,
            "delete": access.delete_flag,
            "approve": access.approve_flag
        })

    return jsonify({
        "dashboard_permissions": response
    }), 200
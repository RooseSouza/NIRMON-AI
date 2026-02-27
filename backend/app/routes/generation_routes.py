from flask import Blueprint, request, jsonify
from app.services.layout_engine import LayoutEngine
from app.services.rule_engine import RuleEngine
from app.services.dxf_generator import DXFGenerator

from app.db.models import AIGAOutput
from app.db.models import GAInputMaster, HullGeometry
from app.db.models import RuleMaster
from app.services.hull_geometry_builder import HullGeometryBuilder
from app.db.database import db

generation_bp = Blueprint("generation", __name__)

@generation_bp.route("/generate", methods=["POST"])
def generate_ga():
    data = request.get_json()
    ga_input_id = data.get("ga_input_id")
    if not ga_input_id:
        return jsonify({"error": "ga_input_id is required"}), 400

    ga_input = GAInputMaster.query.filter_by(
        ga_input_id=ga_input_id, is_active=True
    ).first()
    if not ga_input:
        return jsonify({"error": "GA Input not found"}), 404

    hull = HullGeometry.query.filter_by(ga_input_id=ga_input_id).first()
    if not hull:
        return jsonify({"error": "Hull geometry not found"}), 404

    # Build internal model
    hull_model = HullGeometryBuilder.build(hull)

    # Generate DXF
    file_path=DXFGenerator.generate(hull_model, "outputs/my_hull.dxf", generate_image=True)

    return jsonify({
        "status": "success",
        "geometry_model": hull_model.to_dict(),
        "hull_parameters": {
            column.name: getattr(hull, column.name)
            for column in hull.__table__.columns
        },
        "file_path": file_path
    }), 200
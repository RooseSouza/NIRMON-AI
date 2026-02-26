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

    # 1️⃣ Fetch GA Input
    ga_input = GAInputMaster.query.filter_by(
        ga_input_id=ga_input_id,
        is_active=True
    ).first()

    if not ga_input:
        return jsonify({"error": "GA Input not found"}), 404

    # 2️⃣ Fetch Hull Geometry
    hull = HullGeometry.query.filter_by(
        ga_input_id=ga_input_id
    ).first()

    if not hull:
        return jsonify({"error": "Hull geometry not found"}), 404

    # Build internal geometry model
    geometry_model = HullGeometryBuilder.build(hull)

    # 🔹 Generate DXF file
    dxf_generator = DXFGenerator()
    file_path = dxf_generator.generate(geometry_model, "hull_output.dxf")

    print("DXF saved at:", file_path)

    return jsonify({
        "status": "success",
        "geometry_model": geometry_model.to_dict(),
        "file_path": file_path
    })
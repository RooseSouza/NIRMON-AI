from flask import Blueprint, request, jsonify
from app.services.layout_engine import LayoutEngine
from app.services.rule_engine import RuleEngine
from app.services.dxf_generator import DXFGenerator

from app.db.models import AIGAOutput
from app.db.models import GAInputMaster, HullGeometry
from app.db.models import RuleMaster
from app.services.hull_geometry_builder import HullGeometryBuilder
from app.db.database import db
import uuid


generation_bp = Blueprint("generation", __name__)


@generation_bp.route("/generate", methods=["POST"])
def generate_ga():

    data = request.get_json()

    if not data or "ga_input_id" not in data:
        return jsonify({"error": "ga_input_id is required"}), 400

    try:
        ga_input_id = str(uuid.UUID(data["ga_input_id"].strip()))
    except (ValueError, AttributeError):
        return jsonify({"error": "Invalid UUID format"}), 400

    ga_input = GAInputMaster.query.filter_by(
        ga_input_id=ga_input_id,
        is_active=True
    ).first()

    if not ga_input:
        return jsonify({"error": "GA Input not found"}), 404

    hull = HullGeometry.query.filter_by(
        ga_input_id=ga_input_id
    ).first()

    if not hull:
        return jsonify({"error": "Hull geometry not found"}), 404

    hull_model = HullGeometryBuilder.build(
        hull_db_object=hull,
        num_stations=getattr(hull, "num_stations", 20),
        num_waterlines=getattr(hull, "num_waterlines", 6),
        num_buttocks=getattr(hull, "num_buttocks", 5)
    )


    file_path = DXFGenerator.generate(
        hull_model,
        "outputs/my_hull.dxf"
    )

    return jsonify({
        "status": "success",
        "geometry_model": hull_model.to_dict(),
        "hull_parameters": {
            column.name: getattr(hull, column.name)
            for column in hull.__table__.columns
        },
        "file_path": file_path
    }), 200
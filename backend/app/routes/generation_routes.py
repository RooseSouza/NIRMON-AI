from flask import Blueprint, request, jsonify
from app.services.rule_engine import RuleEngine
from app.services.hull_generator import HullGenerator
from app.services.dxf_generator import DXFGenerator
from app.db.models import GAInputMaster, HullGeometry
from app.services.hull_geometry_builder import HullGeometryBuilder
from app import db
import uuid

generation_bp = Blueprint("generation", __name__)


@generation_bp.route("/generate", methods=["POST"])
def generate_ga():
    data = request.get_json()

    # -------------------------------
    # Validate input
    # -------------------------------
    if not data or "ga_input_id" not in data:
        return jsonify({"error": "ga_input_id is required"}), 400

    try:
        ga_input_id = str(uuid.UUID(data["ga_input_id"].strip()))
    except (ValueError, AttributeError):
        return jsonify({"error": "Invalid UUID format"}), 400

    # -------------------------------
    # 1️⃣ FETCH GA INPUT
    # -------------------------------
    ga_input = GAInputMaster.query.filter_by(
        ga_input_id=ga_input_id,
        is_active=True
    ).first()

    if not ga_input:
        return jsonify({"error": "GA Input not found"}), 404

    # -------------------------------
    # 2️⃣ FETCH HULL DB OBJECT
    # -------------------------------
    hull_db = HullGeometry.query.filter_by(
        ga_input_id=ga_input_id
    ).first()

    if not hull_db:
        return jsonify({"error": "Hull geometry not found"}), 404

    # -------------------------------
    # 3️⃣ BUILD DOMAIN MODEL
    # -------------------------------
    hull_model = HullGeometryBuilder.build(hull_db)

    # Attach vessel type safely
    if not ga_input.vessel:
        return jsonify({"error": "Vessel not linked to GA Input"}), 400

    vessel_type_id = ga_input.vessel.vessel_type_id
    hull_model.vessel_type_id = vessel_type_id

    # -------------------------------
    # 4️⃣ APPLY RULE ENGINE
    # -------------------------------
    engine = RuleEngine()
    hull_model = engine.apply_derived_rules(
        hull_model,
        module="HULL",
        vessel_type_id=vessel_type_id
    )

    # -------------------------------
    # 5️⃣ GENERATE GEOMETRY
    # -------------------------------
    L = getattr(hull_model, "length_between_perpendiculars", 0)

    geometry = {
        "profile": HullGenerator.generate_profile(hull_model),
        "body": HullGenerator.generate_body_section(
            hull_model, float(L) / 2 if L else 0
        ),
        "top": HullGenerator.generate_top_view(hull_model)
    }

    # -------------------------------
    # 6️⃣ GENERATE DXF
    # -------------------------------
    file_path = DXFGenerator.generate(
        hull_model,
        geometry,
        "outputs/generated_hull.dxf"
    )

    # -------------------------------
    # 7️⃣ RESPONSE
    # -------------------------------
    return jsonify({
        "status": "success",
        "derived_hull_model": hull_model.to_dict(),
        "file_path": file_path
    }), 200
from flask import Blueprint, request, jsonify
from app.services.layout_engine import LayoutEngine
from app.services.rule_engine import RuleEngine
from app.services.dxf_generator import DXFGenerator

from app.db.models import AIGAOutput
from app.db.models import GAInputMaster, HullGeometry
from app.db.models import RuleMaster
from app.db.database import db

generation_bp = Blueprint("generation", __name__)

@generation_bp.route("/generate", methods=["POST"])
def generate_ga():

    data = request.get_json()

    ga_input_id = data.get("ga_input_id")

    if not ga_input_id:
        return jsonify({"error": "ga_input_id is required"}), 400

    # Fetch GA Input Master
    ga_input = GAInputMaster.query.filter_by(
        ga_input_id=ga_input_id,
        is_active=True
    ).first()

    if not ga_input:
        return jsonify({"error": "GA Input not found"}), 404

    # Fetch Hull Geometry (1-to-1)
    hull = GAInputHullGeometry.query.filter_by(
        ga_input_id=ga_input_id
    ).first()

    if not hull:
        return jsonify({"error": "Hull geometry not found"}), 404

    # 🧠 Print to console (for debugging)
    print("----- HULL DATA FETCHED -----")
    print("LOA:", hull.length_overall)
    print("LBP:", hull.length_between_perpendiculars)
    print("BREADTH:", hull.breadth_moulded)
    print("DEPTH:", hull.depth_moulded)
    print("DRAFT:", hull.design_draft)
    print("-----------------------------")

    # Return hull values to Postman
    return jsonify({
        "status": "success",
        "ga_input_id": str(ga_input_id),
        "hull_geometry": {
            "length_overall": float(hull.length_overall),
            "length_between_perpendiculars": float(hull.length_between_perpendiculars),
            "breadth_moulded": float(hull.breadth_moulded),
            "depth_moulded": float(hull.depth_moulded),
            "design_draft": float(hull.design_draft)
        }
    })
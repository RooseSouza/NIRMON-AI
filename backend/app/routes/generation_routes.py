from flask import Blueprint, request, jsonify
from app.services.layout_engine import LayoutEngine
from app.services.rule_engine import RuleEngine
from app.services.dxf_generator import DXFGenerator

from app.db.models import AIGAOutput
from app.db.database import db

generation_bp = Blueprint("generation", __name__)

@generation_bp.route("/generate", methods=["POST"])
def generate_ga():

    data = request.get_json()

    layout_engine = LayoutEngine()
    rule_engine = RuleEngine()
    dxf_generator = DXFGenerator()

    layout = layout_engine.generate_layout(data)
    violations = rule_engine.validate(layout, data)

    # If critical violation → do NOT generate file
    if any(v["severity"] == "CRITICAL" for v in violations):
        return jsonify({
            "status": "failed",
            "violations": violations
        }), 400

    file_path = dxf_generator.generate(layout, data, "test_layout.dxf")

    new_output = AIGAOutput(
        cad_file_path=file_path,
        layout_data_json=layout,
        ai_model_version="RuleBasedEngine v1.0",
        generation_type="Fresh Generation",
        output_status="Generated"
    )

    db.session.add(new_output)
    db.session.commit()

    return jsonify({
        "status": "success",
        "layout": layout,
        "violations": violations,
        "file_path": file_path
    })
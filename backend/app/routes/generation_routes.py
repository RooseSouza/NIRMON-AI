from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from app.services.design_ai_service import generate_ship_coordinates
from app.services.dxf_service import create_dxf_from_json

generation_bp = Blueprint("generation", __name__)

@generation_bp.route("/generate-rsv", methods=["POST", "OPTIONS"])
@cross_origin()
@jwt_required()
def generate_rsv_design():
    try:
        # 1. AI Generation
        geometry_json = generate_ship_coordinates()
        
        # Check if AI failed nicely
        if not geometry_json or "hull_outline" not in geometry_json:
             print("⚠️ AI returned empty or invalid data. Using fallback.")

        # 2. Drawing
        svg_image, dxf_path = create_dxf_from_json(geometry_json)

        return jsonify({
            "message": "Design Generated",
            "svg": svg_image,
            "raw_data": geometry_json
        }), 200

    except Exception as e:
        # THIS PRINTS THE REAL ERROR TO YOUR TERMINAL
        print(f"❌ SERVER CRASH in /generate-rsv: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
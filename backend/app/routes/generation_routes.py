from flask import Blueprint, jsonify, request, send_from_directory, current_app
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from app.services.design_ai_service import generate_ship_coordinates
from app.services.dxf_service import create_dxf_from_json
from app.db.models import GAInputMaster, HullGeometry
import os

generation_bp = Blueprint("generation", __name__)

# --- GENERATE ROUTE ---
@generation_bp.route("/generate-rsv", methods=["POST", "OPTIONS"])
@cross_origin()
@jwt_required()
def generate_rsv_design():
    try:
        data = request.get_json()
        project_id = data.get("project_id")
        
        if not project_id:
            return jsonify({"error": "Project ID is required"}), 400

        # 1. Fetch DB Data
        ga_input = GAInputMaster.query.filter_by(
            project_id=project_id, is_active=True
        ).order_by(GAInputMaster.version_number.desc()).first()

        hull_geom = HullGeometry.query.filter_by(ga_input_id=ga_input.ga_input_id).first()
        
        if not hull_geom:
            return jsonify({"error": "Hull Geometry not defined yet"}), 404

        # 2. Prepare Params
        design_params = {
            "LOA": float(hull_geom.length_overall),
            "LBP": float(hull_geom.length_between_perpendiculars),
            "B": float(hull_geom.breadth_moulded),
            "D": float(hull_geom.depth_moulded),
            "T": float(hull_geom.design_draft),
            # Add defaults for optional fields if needed
            "ER_LEN": float(hull_geom.length_between_perpendiculars) * 0.22
        }

        # 3. AI Generation
        geometry_json = generate_ship_coordinates(design_params)
        
        if not geometry_json or "hull_outline" not in geometry_json:
             return jsonify({"error": "AI Generation Failed"}), 500

        # 4. Draw & Save Files (Pass project_id for naming)
        svg_image, dxf_filename = create_dxf_from_json(geometry_json, project_id)

        return jsonify({
            "message": "Design Generated",
            "svg": svg_image,
            "dxf_file": dxf_filename
        }), 200

    except Exception as e:
        print(f"❌ SERVER CRASH: {str(e)}")
        return jsonify({"error": str(e)}), 500

# --- NEW: GET PREVIEW ROUTE ---
@generation_bp.route("/preview/<string:project_id>", methods=["GET"])
@cross_origin()
@jwt_required()
def get_design_preview(project_id):
    try:
        # Path to static/outputs
        output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/outputs'))
        svg_filename = f"{project_id}.svg"
        file_path = os.path.join(output_dir, svg_filename)

        if os.path.exists(file_path):
            # Read SVG content
            with open(file_path, 'r') as f:
                svg_content = f.read()
            return jsonify({"exists": True, "svg": svg_content}), 200
        else:
            return jsonify({"exists": False}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
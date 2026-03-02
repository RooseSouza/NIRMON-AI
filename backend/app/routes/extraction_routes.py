from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from app.services.pdf_service import extract_text_from_pdf
from app.services.llm_service import extract_rules_with_llm

extraction_bp = Blueprint("extraction", __name__)

@extraction_bp.route("/upload-rules", methods=["POST", "OPTIONS"])
@cross_origin() # ✅ Fixes the Preflight CORS error
@jwt_required()
def upload_rules_pdf():
    # Handle Preflight manually if needed (cross_origin usually handles this)
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # ✅ Reset pointer (Critical for reading)
        file.seek(0)
        
        raw_text = extract_text_from_pdf(file)
        if not raw_text:
            return jsonify({"error": "Could not extract text from PDF"}), 400

        result = extract_rules_with_llm(raw_text)

        if "error" in result:
            return jsonify({"error": result["error"]}), result["status"]

        return jsonify({
            "message": "Extraction successful",
            "count": len(result["data"]),
            "rules": result["data"]
        }), 200

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500
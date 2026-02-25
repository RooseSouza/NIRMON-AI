from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.db.database import db
from app.db.models import Vessel, VesselTypeMaster

vessel_bp = Blueprint("vessels", __name__)

@vessel_bp.route("/", methods=["POST"])
@jwt_required()
def create_vessel():

    data = request.get_json()
    current_user_id = get_jwt_identity()

    #  Required fields validation
    required_fields = [
        "vesselTypeId",
        "loa",
        "beam",
        "draft",
        "navigationArea",
        "classSociety",
        "versionNumber"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # Check vessel type exists
    vessel_type = VesselTypeMaster.query.filter_by(
        vessel_type_id=data["vesselTypeId"]
    ).first()

    if not vessel_type:
        return jsonify({"error": "Invalid vessel type"}), 400

    #Create vessel object
    new_vessel = Vessel(
        vessel_type_id=data["vesselTypeId"],
        loa=data["loa"],
        beam=data["beam"],
        draft=data["draft"],
        depth=data.get("depth"),
        displacement=data.get("displacement"),
        design_speed=data.get("designSpeed"),
        navigation_area=data["navigationArea"],
        class_society=data["classSociety"],
        created_by=current_user_id,
        version_number=data["versionNumber"]
    )

    db.session.add(new_vessel)
    db.session.commit()

    return jsonify({
        "message": "Vessel created successfully",
        "vessel_id": str(new_vessel.vessel_id)
    }), 201
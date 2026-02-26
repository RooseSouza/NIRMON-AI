from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app.db.database import db
from app.db.models import GAInputMaster
import uuid
from datetime import datetime

ga_input_bp = Blueprint("gainputs", __name__)


@ga_input_bp.route("/", methods=["POST"])
@jwt_required()
def create_ga_input_master():

    try:
        data = request.get_json()
        current_user = get_jwt_identity()

        # -----------------------------
        # Required Fields
        # -----------------------------
        required_fields = [
            "project_id",
            "vessel_id",
            "regulatory_framework",
            "crew_count",
            "officer_count",
            "rating_count",
            "endurance_days"
        ]

        for field in required_fields:
            if field not in data or data[field] in [None, ""]:
                return jsonify({"error": f"{field} is required"}), 400

        # -----------------------------
        # Crew Validation
        # -----------------------------
        if data["crew_count"] != (
            data["officer_count"] + data["rating_count"]
        ):
            return jsonify({
                "error": "crew_count must equal officer_count + rating_count"
            }), 400

        # -----------------------------
        # Auto Version Increment
        # -----------------------------
        latest_version = db.session.query(
            func.max(GAInputMaster.version_number)
        ).filter(
            GAInputMaster.project_id == uuid.UUID(data["project_id"]),
            GAInputMaster.is_active == True
        ).scalar()

        new_version_number = (latest_version or 0) + 1

        # -----------------------------
        # Set Previous Versions Inactive
        # -----------------------------
        GAInputMaster.query.filter_by(
            project_id=uuid.UUID(data["project_id"]),
            is_current_version=True
        ).update({"is_current_version": False})

        # -----------------------------
        # Create New Record
        # -----------------------------
        new_record = GAInputMaster(
            ga_input_id=uuid.uuid4(),

            project_id=uuid.UUID(data["project_id"]),
            vessel_id=uuid.UUID(data["vessel_id"]),

            version_number=new_version_number,
            version_status="draft",
            is_current_version=True,

            regulatory_framework=data["regulatory_framework"],
            class_notation=data.get("class_notation"),

            gross_tonnage=data.get("gross_tonnage"),
            deadweight=data.get("deadweight"),

            crew_count=data["crew_count"],
            officer_count=data["officer_count"],
            rating_count=data["rating_count"],
            passenger_count=data.get("passenger_count", 0),

            endurance_days=data["endurance_days"],
            voyage_duration_days=data.get("voyage_duration_days"),

            ums_notation=data.get("ums_notation", False),

            created_by=uuid.UUID(current_user),
            created_at=datetime.utcnow(),
            modified_at=datetime.utcnow(),

            is_active=True,
            notes=data.get("notes")
        )

        db.session.add(new_record)
        db.session.commit()

        return jsonify({
            "message": "GA Input Master created successfully",
            "ga_input_id": str(new_record.ga_input_id),
            "version_number": new_version_number,
            "status": "draft"
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
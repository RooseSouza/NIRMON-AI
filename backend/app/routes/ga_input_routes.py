from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app.db.database import db
from app.db.models import GAInputMaster
from app.db.models import HullGeometry
import uuid
from datetime import datetime

ga_input_bp = Blueprint("gainputs", __name__)

# ==============================================================================
# 1. GA INPUT MASTER (PAGE 1)
# ==============================================================================

@ga_input_bp.route("/", methods=["POST"])
@jwt_required()
def create_ga_input_master():
    try:
        data = request.get_json()
        current_user = get_jwt_identity()

        required_fields = [
            "project_id", "vessel_id", "regulatory_framework",
            "crew_count", "officer_count", "rating_count", "endurance_days"
        ]

        for field in required_fields:
            if field not in data or data[field] in [None, ""]:
                return jsonify({"error": f"{field} is required"}), 400

        # Crew Validation
        if data["crew_count"] != (data["officer_count"] + data["rating_count"]):
            return jsonify({"error": "crew_count must equal officer_count + rating_count"}), 400

        # Auto Version Increment
        latest_version = db.session.query(func.max(GAInputMaster.version_number)).filter(
            GAInputMaster.project_id == uuid.UUID(data["project_id"]),
            GAInputMaster.is_active == True
        ).scalar()

        new_version_number = (latest_version or 0) + 1

        # Set Previous Versions Inactive
        GAInputMaster.query.filter_by(
            project_id=uuid.UUID(data["project_id"]),
            is_current_version=True
        ).update({"is_current_version": False})

        # Create New Record
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


@ga_input_bp.route("/project/<uuid:project_id>/latest", methods=["GET"])
@jwt_required()
def get_latest_ga_input(project_id):
    ga_input = GAInputMaster.query.filter_by(
        project_id=project_id,
        is_active=True,
        is_current_version=True
    ).order_by(GAInputMaster.version_number.desc()).first()

    if not ga_input:
        return jsonify({"message": "No data found"}), 404

    return jsonify({
        "ga_input_id": str(ga_input.ga_input_id),
        "regulatory_framework": ga_input.regulatory_framework,
        "class_notation": ga_input.class_notation,
        "ums_notation": "Yes" if ga_input.ums_notation else "No",
        "gross_tonnage": float(ga_input.gross_tonnage) if ga_input.gross_tonnage else "",
        "deadweight": float(ga_input.deadweight) if ga_input.deadweight else "",
        "crew_count": ga_input.crew_count,
        "officer_count": ga_input.officer_count,
        "rating_count": ga_input.rating_count,
        "passenger_count": ga_input.passenger_count,
        "endurance_days": float(ga_input.endurance_days),
        "voyage_duration_days": float(ga_input.voyage_duration_days) if ga_input.voyage_duration_days else "",
        "status": ga_input.version_status
    }), 200


@ga_input_bp.route("/<uuid:ga_input_id>", methods=["PUT"])
@jwt_required()
def update_ga_input(ga_input_id):
    try:
        data = request.get_json()
        ga_input = GAInputMaster.query.get(ga_input_id)

        if not ga_input:
            return jsonify({"error": "Record not found"}), 404

        if "regulatory_framework" in data: ga_input.regulatory_framework = data["regulatory_framework"]
        if "class_notation" in data: ga_input.class_notation = data["class_notation"]
        if "ums_notation" in data: ga_input.ums_notation = data["ums_notation"]
        if "gross_tonnage" in data: ga_input.gross_tonnage = data["gross_tonnage"]
        if "deadweight" in data: ga_input.deadweight = data["deadweight"]
        if "crew_count" in data: ga_input.crew_count = data["crew_count"]
        if "officer_count" in data: ga_input.officer_count = data["officer_count"]
        if "rating_count" in data: ga_input.rating_count = data["rating_count"]
        if "passenger_count" in data: ga_input.passenger_count = data["passenger_count"]
        if "endurance_days" in data: ga_input.endurance_days = data["endurance_days"]
        if "voyage_duration_days" in data: ga_input.voyage_duration_days = data["voyage_duration_days"]
        
        ga_input.modified_at = datetime.utcnow()
        db.session.commit()

        return jsonify({"message": "Updated successfully", "ga_input_id": str(ga_input.ga_input_id)}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ==============================================================================
# 2. HULL GEOMETRY (PAGE 2)
# ==============================================================================

@ga_input_bp.route("/<uuid:ga_input_id>/hull", methods=["POST"])
@jwt_required()
def create_hull(ga_input_id):
    data = request.get_json()

    # Check GA Input exists
    ga_input = GAInputMaster.query.get(ga_input_id)
    if not ga_input:
        return jsonify({"error": "GA Input not found"}), 404

    # Prevent duplicate hull
    existing = HullGeometry.query.filter_by(ga_input_id=ga_input_id).first()
    if existing:
        return jsonify({"error": "Hull already exists"}), 400

    try:
        new_hull = HullGeometry(
            # Principal Dimensions
            ga_input_id=ga_input_id,
            length_overall=data["length_overall"],
            length_between_perpendiculars=data["length_between_perpendiculars"],
            breadth_moulded=data["breadth_moulded"],
            depth_moulded=data["depth_moulded"],
            design_draft=data["design_draft"],
            baseline_z=data.get("baseline_z", 0.00),
            centerline_y=data.get("centerline_y", 0.00),

            # Hydrostatic Coefficients
            block_coefficient=data["block_coefficient"],
            prismatic_coefficient=data.get("prismatic_coefficient"),
            midship_coefficient=data.get("midship_coefficient"),
            waterplane_coefficient=data.get("waterplane_coefficient"),

            # Longitudinal Distribution
            parallel_midbody_length=data.get("parallel_midbody_length"),
            entrance_length=data.get("entrance_length"),
            run_length=data.get("run_length"),
            bow_rake_angle=data.get("bow_rake_angle"),
            stern_rake_angle=data.get("stern_rake_angle"),

            # Transverse Shape
            bilge_radius=data.get("bilge_radius"),
            flare_angle=data.get("flare_angle"),
            deadrise_angle=data.get("deadrise_angle"),

            # Bow / Stern Features
            bulbous_bow=data.get("bulbous_bow", False),
            bulb_length=data.get("bulb_length"),
            bulb_height=data.get("bulb_height"),
            stern_type=data.get("stern_type"),
            skeg_enabled=data.get("skeg_enabled", False),

            # Structural Grid
            frame_spacing=data["frame_spacing"],
            frame_numbering_origin=data["frame_numbering_origin"],
            frame_numbering_direction=data["frame_numbering_direction"],

            # Optional
            hull_form_type=data.get("hull_form_type"),
            notes=data.get("notes")
        )

        db.session.add(new_hull)
        db.session.commit()

        return jsonify({
            "message": "Hull geometry created successfully",
            "hull_geometry_id": str(new_hull.hull_geometry_id)
        }), 201

    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@ga_input_bp.route("/<uuid:ga_input_id>/hull", methods=["GET"])
@jwt_required()
def get_hull_geometry(ga_input_id):
    hull = HullGeometry.query.filter_by(ga_input_id=ga_input_id).first()

    if not hull:
        return jsonify({"message": "Hull not found"}), 404

    return jsonify({
        "hull_geometry_id": str(hull.hull_geometry_id),
        "length_overall": float(hull.length_overall),
        "length_between_perpendiculars": float(hull.length_between_perpendiculars),
        "breadth_moulded": float(hull.breadth_moulded),
        "depth_moulded": float(hull.depth_moulded),
        "design_draft": float(hull.design_draft),
        "baseline_z": float(hull.baseline_z),
        "centerline_y": float(hull.centerline_y),
        
        # Coefficients
        "block_coefficient": float(hull.block_coefficient) if hull.block_coefficient else "",
        "prismatic_coefficient": float(hull.prismatic_coefficient) if hull.prismatic_coefficient else "",
        "midship_coefficient": float(hull.midship_coefficient) if hull.midship_coefficient else "",
        "waterplane_coefficient": float(hull.waterplane_coefficient) if hull.waterplane_coefficient else "",

        # Longitudinal
        "parallel_midbody_length": float(hull.parallel_midbody_length) if hull.parallel_midbody_length else "",
        "entrance_length": float(hull.entrance_length) if hull.entrance_length else "",
        "run_length": float(hull.run_length) if hull.run_length else "",
        "bow_rake_angle": float(hull.bow_rake_angle) if hull.bow_rake_angle else "",
        "stern_rake_angle": float(hull.stern_rake_angle) if hull.stern_rake_angle else "",

        # Transverse
        "bilge_radius": float(hull.bilge_radius) if hull.bilge_radius else "",
        "flare_angle": float(hull.flare_angle) if hull.flare_angle else "",
        "deadrise_angle": float(hull.deadrise_angle) if hull.deadrise_angle else "",

        # Features
        "bulbous_bow": hull.bulbous_bow,
        "bulb_length": float(hull.bulb_length) if hull.bulb_length else "",
        "bulb_height": float(hull.bulb_height) if hull.bulb_height else "",
        "stern_type": hull.stern_type,
        "skeg_enabled": hull.skeg_enabled,

        # Grid
        "frame_spacing": float(hull.frame_spacing),
        "frame_numbering_origin": hull.frame_numbering_origin,
        "frame_numbering_direction": hull.frame_numbering_direction,
        "hull_form_type": hull.hull_form_type,
        "notes": hull.notes or ""
    }), 200


@ga_input_bp.route("/<uuid:ga_input_id>/hull", methods=["PUT"])
@jwt_required()
def update_hull_geometry(ga_input_id):
    try:
        data = request.get_json()
        hull = HullGeometry.query.filter_by(ga_input_id=ga_input_id).first()

        if not hull:
            return jsonify({"error": "Hull record not found"}), 404

        # Update fields
        hull.length_overall = data["length_overall"]
        hull.length_between_perpendiculars = data["length_between_perpendiculars"]
        hull.breadth_moulded = data["breadth_moulded"]
        hull.depth_moulded = data["depth_moulded"]
        hull.design_draft = data["design_draft"]
        hull.baseline_z = data.get("baseline_z", 0)
        hull.centerline_y = data.get("centerline_y", 0)

        hull.block_coefficient = data.get("block_coefficient")
        hull.prismatic_coefficient = data.get("prismatic_coefficient")
        hull.midship_coefficient = data.get("midship_coefficient")
        hull.waterplane_coefficient = data.get("waterplane_coefficient")

        hull.parallel_midbody_length = data.get("parallel_midbody_length")
        hull.entrance_length = data.get("entrance_length")
        hull.run_length = data.get("run_length")
        hull.bow_rake_angle = data.get("bow_rake_angle")
        hull.stern_rake_angle = data.get("stern_rake_angle")

        hull.bilge_radius = data.get("bilge_radius")
        hull.flare_angle = data.get("flare_angle")
        hull.deadrise_angle = data.get("deadrise_angle")

        hull.bulbous_bow = data.get("bulbous_bow", False)
        hull.bulb_length = data.get("bulb_length")
        hull.bulb_height = data.get("bulb_height")
        hull.stern_type = data.get("stern_type")
        hull.skeg_enabled = data.get("skeg_enabled", False)

        hull.frame_spacing = data["frame_spacing"]
        hull.frame_numbering_origin = data["frame_numbering_origin"]
        hull.frame_numbering_direction = data["frame_numbering_direction"]
        hull.hull_form_type = data.get("hull_form_type")
        hull.notes = data.get("notes")
        
        hull.modified_at = datetime.utcnow()
        db.session.commit()

        return jsonify({"message": "Hull updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
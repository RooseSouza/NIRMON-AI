from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, date
from app.db.database import db
from app.db.models import ShipProject

project_bp = Blueprint("projects", __name__)


@project_bp.route("/", methods=["POST"])
@jwt_required()
def create_project():

    data = request.get_json()
    current_user_id = get_jwt_identity()

    # Validate required fields
    required_fields = ["projectName", "projectCode", "vesselType", "projectType"]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # Check duplicate project code
    existing = ShipProject.query.filter_by(
        project_code=data["projectCode"],
        is_deleted=False
    ).first()

    if existing:
        return jsonify({"error": "Project code already exists"}), 400

    # Create project object
    new_project = ShipProject(
        vessel_id=data["vesselType"],
        project_code=data["projectCode"],
        project_name=data["projectName"],
        project_type=data["projectType"],
        client_name=data.get("clientName"),
        shipyard_name=data.get("shipyardName"),
        project_status=data.get("projectStatus", "Active"),
        start_date=date.today(),
        target_delivery_date=data.get("targetDeliveryDate"),
        created_by=current_user_id
    )

    db.session.add(new_project)
    db.session.commit()

    return jsonify({
        "message": "Project created successfully",
        "project_id": str(new_project.project_id)
    }), 201

# Get All Project 

@project_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_projects():

    projects = ShipProject.query.filter_by(is_deleted=False).all()

    result = []

    for project in projects:
        result.append({
            "project_id": str(project.project_id),
            "project_code": project.project_code,
            "project_name": project.project_name,
            "project_type": project.project_type,
            "client_name": project.client_name,
            "shipyard_name": project.shipyard_name,
            "project_status": project.project_status,
            "start_date": project.start_date.strftime("%Y-%m-%d"),
            "target_delivery_date": project.target_delivery_date.strftime("%Y-%m-%d") if project.target_delivery_date else None,
            "vessel_id": str(project.vessel_id),
            "created_by": str(project.created_by),
            "created_at": project.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })

    return jsonify({
        "total_projects": len(result),
        "projects": result
    }), 200
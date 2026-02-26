from app import db
import uuid
from datetime import datetime
from sqlalchemy import CheckConstraint
from sqlalchemy import Enum
from sqlalchemy.dialects.postgresql import UUID


class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_id = db.Column(db.UUID(as_uuid=True), nullable=False)
    name = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    status = db.Column(db.Boolean, default=True)

class Module(db.Model):
    __tablename__ = "module"

    module_id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.Boolean, default=True)
    module_type = db.Column(db.String(50), nullable=False)
    module_order = db.Column(db.Integer, nullable=False)
    parent_module_id = db.Column(db.UUID(as_uuid=True), nullable=True)

class RoleAccess(db.Model):
    __tablename__ = "role_access"

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    module_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey("module.module_id"))
    role_id = db.Column(db.UUID(as_uuid=True))

    view_flag = db.Column(db.Boolean, default=False)
    add_flag = db.Column(db.Boolean, default=False)
    edit_flag = db.Column(db.Boolean, default=False)
    delete_flag = db.Column(db.Boolean, default=False)
    approve_flag = db.Column(db.Boolean, default=False)
    status = db.Column(db.Boolean, default=True)

class Role(db.Model):
    __tablename__ = "roles"

    role_id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_name = db.Column(db.Text, unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.Boolean, default=True)

class VesselTypeMaster(db.Model):
    __tablename__ = "vessel_type_master"

    vessel_type_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    type_code = db.Column(db.String(50), unique=True, nullable=False)
    type_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

    ai_weightage = db.Column(db.Numeric(3, 2),CheckConstraint('ai_weightage >= 0 AND ai_weightage <= 1'),nullable=True)

    machinery_mandatory = db.Column(db.Boolean, nullable=False)
    tank_module_enabled = db.Column(db.Boolean, nullable=False)
    fire_zones_required = db.Column(db.Boolean, nullable=False)

    created_date = db.Column(db.DateTime,server_default=db.func.now())

    # Relationship
    vessels = db.relationship("Vessel", backref="vessel_type", lazy=True)

class Vessel(db.Model):
    __tablename__ = "vessel"

    vessel_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    vessel_type_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("vessel_type_master.vessel_type_id"),
        nullable=False
    )

    loa = db.Column(db.Numeric(8, 2), nullable=False)
    beam = db.Column(db.Numeric(8, 2), nullable=False)
    draft = db.Column(db.Numeric(8, 2), nullable=False)
    depth = db.Column(db.Numeric(8, 2))
    displacement = db.Column(db.Numeric(10, 2))
    design_speed = db.Column(db.Numeric(5, 2))

    navigation_area = db.Column(
        Enum('SEA', 'COASTAL', 'RIVER', name='navigation_area_enum'),
        nullable=False
    )

    class_society = db.Column(db.String(50), nullable=False)

    created_by = db.Column(UUID(as_uuid=True), nullable=False)
    created_date = db.Column(db.DateTime,
                             server_default=db.func.now())

    version_number = db.Column(db.String(10), nullable=False)

    # ✅ Validation Constraints
    __table_args__ = (
        CheckConstraint('loa > 0', name='check_loa_positive'),
        CheckConstraint('beam > 0', name='check_beam_positive'),
        CheckConstraint('draft > 0', name='check_draft_positive'),
        CheckConstraint('displacement >= 0', name='check_displacement_positive'),
        CheckConstraint('design_speed >= 0', name='check_speed_positive'),
    )
    projects = db.relationship("ShipProject", backref="vessel", lazy=True)


class ShipProject(db.Model):
    __tablename__ = "ship_projects"

    project_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    vessel_id = db.Column(UUID(as_uuid=True),
                db.ForeignKey("vessel.vessel_id", onupdate="CASCADE", ondelete="RESTRICT"),nullable=False)

    project_code = db.Column(db.String(50), unique=True, nullable=False)
    project_name = db.Column(db.String(150), nullable=False)
    project_type = db.Column(db.String(50), nullable=False)

    client_name = db.Column(db.String(150))
    shipyard_name = db.Column(db.String(150))

    project_status = db.Column(db.String(30), nullable=False, default="Active")

    start_date = db.Column(db.Date, nullable=False)
    target_delivery_date = db.Column(db.Date)

    created_by = db.Column(UUID(as_uuid=True),
                db.ForeignKey("users.user_id", onupdate="CASCADE", ondelete="RESTRICT"),nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    updated_by = db.Column(UUID(as_uuid=True),
                db.ForeignKey("users.user_id", onupdate="CASCADE", ondelete="SET NULL"))

    updated_at = db.Column(db.DateTime)

    deleted_by = db.Column(UUID(as_uuid=True),
                db.ForeignKey("users.user_id", onupdate="CASCADE", ondelete="SET NULL"))

    deleted_at = db.Column(db.DateTime)

    is_deleted = db.Column(db.Boolean, default=False, nullable=False)

class GAInputMaster(db.Model):
    __tablename__ = "ga_input_master"

    # -----------------------------
    # Primary Key
    # -----------------------------
    ga_input_id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    # -----------------------------
    # Foreign Keys
    # -----------------------------
    project_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("ship_projects.project_id"),
        nullable=False
    )

    vessel_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("vessel.vessel_id"),
        nullable=False
    )

    created_by = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.user_id"),
        nullable=False
    )

    modified_by = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.user_id"),
        nullable=True
    )

    submitted_by = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.user_id"),
        nullable=True
    )

    approved_by = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.user_id"),
        nullable=True
    )

    # -----------------------------
    # Versioning
    # -----------------------------
    version_number = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )

    version_status = db.Column(
        Enum(
            "draft",
            "submitted",
            "approved",
            "rejected",
            "superseded",
            name="ga_version_status_enum"
        ),
        nullable=False,
        default="draft"
    )

    is_current_version = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

    # -----------------------------
    # Regulatory & Vessel Info
    # -----------------------------
    regulatory_framework = db.Column(
        db.String(50),
        nullable=False
    )

    class_notation = db.Column(
        db.String(100),
        nullable=True
    )

    gross_tonnage = db.Column(
        db.Numeric(10, 2),
        nullable=True
    )

    deadweight = db.Column(
        db.Numeric(10, 2),
        nullable=True
    )

    # -----------------------------
    # Manning Details
    # -----------------------------
    crew_count = db.Column(
        db.Integer,
        nullable=False
    )

    officer_count = db.Column(
        db.Integer,
        nullable=False
    )

    rating_count = db.Column(
        db.Integer,
        nullable=False
    )

    passenger_count = db.Column(
        db.Integer,
        nullable=True,
        default=0
    )

    # -----------------------------
    # Operational Parameters
    # -----------------------------
    endurance_days = db.Column(
        db.Numeric(5, 1),
        nullable=False
    )

    voyage_duration_days = db.Column(
        db.Numeric(5, 1),
        nullable=True
    )

    ums_notation = db.Column(
        db.Boolean,
        default=False
    )

    # -----------------------------
    # Audit Fields
    # -----------------------------
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    modified_at = db.Column(
        db.DateTime,
        nullable=True
    )

    submitted_at = db.Column(
        db.DateTime,
        nullable=True
    )

    approved_at = db.Column(
        db.DateTime,
        nullable=True
    )

    is_active = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

    # -----------------------------
    # Notes
    # -----------------------------
    notes = db.Column(
        db.Text,
        nullable=True
    )

       # relationships
    project = db.relationship("ShipProject", backref="ga_inputs")
    vessel = db.relationship("Vessel", backref="ga_inputs")

class HullGeometry(db.Model):
    __tablename__ = "hull_geometry"

    # -----------------------------
    # Primary Key
    # -----------------------------
    hull_geometry_id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    # -----------------------------
    # One-to-One with GA Input
    # -----------------------------
    ga_input_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("ga_input_master.ga_input_id"),
        nullable=False,
        unique=True  # ensures one-to-one
    )

    # -----------------------------
    # Principal Dimensions
    # -----------------------------
    length_overall = db.Column(db.Numeric(8, 2), nullable=False)
    length_between_perpendiculars = db.Column(db.Numeric(8, 2), nullable=False)
    breadth_moulded = db.Column(db.Numeric(7, 2), nullable=False)
    depth_moulded = db.Column(db.Numeric(6, 2), nullable=False)
    design_draft = db.Column(db.Numeric(6, 2), nullable=False)

    # -----------------------------
    # Geometry Controls
    # -----------------------------
    baseline_z = db.Column(db.Numeric(6, 2), default=0.000)
    frame_spacing = db.Column(db.Numeric(6, 2), nullable=False)

    frame_numbering_origin = db.Column(
        db.String(20),
        nullable=False
        # Expected values: AP, FP, MIDSHIP
    )

    frame_numbering_direction = db.Column(
        db.String(20),
        nullable=False
        # Expected values: FWD_TO_AFT, AFT_TO_FWD
    )

    centerline_y = db.Column(db.Numeric(4, 2), default=0.000)

    # -----------------------------
    # Hull Form Properties
    # -----------------------------
    hull_form_type = db.Column(db.String(30))
    block_coefficient = db.Column(db.Numeric(4, 3))

    notes = db.Column(db.Text)

    # -----------------------------
    # Audit Fields
    # -----------------------------
    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    modified_at = db.Column(
        db.DateTime,
        onupdate=datetime.utcnow
    )

    # -----------------------------
    # Relationship
    # -----------------------------
    ga_input = db.relationship(
        "GAInputMaster",
        backref=db.backref("hull_geometry", uselist=False)
    )
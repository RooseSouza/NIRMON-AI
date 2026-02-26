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
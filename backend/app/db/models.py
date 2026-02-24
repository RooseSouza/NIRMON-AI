from app import db
import uuid


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
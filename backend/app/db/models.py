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

class Role(db.Model):
    __tablename__ = "roles"

    role_id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_name = db.Column(db.Text, unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.Boolean, default=True)
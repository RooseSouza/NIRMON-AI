from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from app.db.models import User, Role
from flask_jwt_extended import create_access_token
from app import db   
from flask_jwt_extended import jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)

# testing connection
@auth_bp.route("/test")
def test_route():
    return jsonify({"message": "Auth Route Working"})

# login api 
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    user = User.query.filter_by(email=email, status=True).first()

    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    if not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401

    role_entry = Role.query.filter_by(role_id=user.role_id).first()
    role_name = role_entry.role_name if role_entry else "User"

    # 3. Create Token
    access_token = create_access_token(
        identity=str(user.user_id),
        additional_claims={
            "role_id": str(user.role_id),
            "role_name": role_name 
        }
    )

    # 4. Return everything the frontend needs
    return jsonify({
        "token": access_token,
        "user_id": str(user.user_id),
        "name": user.name,
        "email": user.email,
        "role_id": str(user.role_id),
        "role_name": role_name  # <--- Sending this now!
    }), 200


#preventing unautharized access

from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

@auth_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    user_id = get_jwt_identity()   # from identity
    claims = get_jwt()             # full token data
    
    role_id = claims.get("role_id")

    return jsonify({
        "message": "Access granted",
        "user_id": user_id,
        "role_id": role_id
    }), 200
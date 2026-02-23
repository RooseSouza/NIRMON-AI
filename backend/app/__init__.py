from flask import Flask
from flask_cors import CORS 
from app.core.config import Config
from app.db.database import db
from flask_jwt_extended import JWTManager
from app.routes.auth_routes import auth_bp
def create_app():
    app = Flask(__name__)

    CORS(app)   # Allow frontend connection
    app.config.from_object(Config)

    db.init_app(app)
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    print("SECRET_KEY:", app.config["SECRET_KEY"])
    return app
from flask import Flask
from flask_cors import CORS 
from app.core.config import Config
from app.db.database import db
from flask_jwt_extended import JWTManager
from app.routes.auth_routes import auth_bp
from app.routes.dashboard_routes import dashboard_bp
from app.routes.module_routes import module_bp
from app.routes.project_routes import project_bp
from app.routes.vessel_routes import vessel_bp

from app.routes.generation_routes import generation_bp
from app.db import models

def create_app():
    app = Flask(__name__)

    CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    expose_headers=["Authorization"],
    ) 
     # Allow frontend connection
    app.config.from_object(Config)

    db.init_app(app)
    JWTManager(app)

    with app.app_context():
        db.create_all()


    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(module_bp, url_prefix="/api/modules")
    app.register_blueprint(project_bp, url_prefix="/api/projects")
    app.register_blueprint(vessel_bp, url_prefix="/api/vessels")
    app.register_blueprint(generation_bp, url_prefix="/api/generation")

    print("SECRET_KEY:", app.config["SECRET_KEY"])
    return app
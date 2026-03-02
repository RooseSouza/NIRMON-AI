from flask import Flask
from flask_cors import CORS 
from app.core.config import Config
from app.db.database import db
from flask_jwt_extended import JWTManager
from datetime import timedelta

# Import Blueprints
from app.routes.auth_routes import auth_bp
from app.routes.dashboard_routes import dashboard_bp
from app.routes.module_routes import module_bp
from app.routes.project_routes import project_bp
from app.routes.vessel_routes import vessel_bp
from app.routes.ga_input_routes import ga_input_bp
from app.routes.generation_routes import generation_bp
from app.routes.extraction_routes import extraction_bp # <--- Import this

def create_app():
    app = Flask(__name__)

    # ✅ ROBUST CORS CONFIGURATION
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"], 
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    ) 
    
    app.config.from_object(Config)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1) 

    db.init_app(app)
    JWTManager(app)

    with app.app_context():
        db.create_all()

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(module_bp, url_prefix="/api/modules")
    app.register_blueprint(project_bp, url_prefix="/api/projects")
    app.register_blueprint(vessel_bp, url_prefix="/api/vessels")
    app.register_blueprint(ga_input_bp, url_prefix="/api/gainputs")
    app.register_blueprint(generation_bp, url_prefix="/api/generation")
    app.register_blueprint(extraction_bp, url_prefix="/api/extraction") # <--- Register this

    return app
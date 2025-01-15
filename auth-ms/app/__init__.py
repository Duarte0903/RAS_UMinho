from flask import Flask
from app.db import init_db
import app.config as config
from app.router import app_router  # Import the Blueprint

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    init_db(app)
    app.register_blueprint(app_router)  # Register the Blueprint
    return app

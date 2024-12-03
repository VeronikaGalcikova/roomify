import os
from flask import Flask
from api import api_blueprint


# Function to create the Flask application
def create_app():
    app = Flask(__name__)
    app.secret_key = os.urandom(12).hex()  # Generate a random secret key for the application
    app.config.from_object('config.Config')
    app.register_blueprint(api_blueprint, url_prefix='/api')
    return app

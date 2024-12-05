from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from config import Config

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config.from_object(Config)
    
    mongo.init_app(app)
    
    from app.routes import abonnes, documents, emprunts, stats
    app.register_blueprint(abonnes.bp, url_prefix='/api')
    app.register_blueprint(documents.bp, url_prefix='/api')
    app.register_blueprint(emprunts.bp, url_prefix='/api')
    app.register_blueprint(stats.bp, url_prefix='/api')
    
    return app
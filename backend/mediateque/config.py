import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mediatheque')
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
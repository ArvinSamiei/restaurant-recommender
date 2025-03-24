import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URI)
db = client.bain_db
users_collection = db.users
ratings_collection = db.ratings
preferred_collection = db.preferred_restaurants
yelp_cache = db.yelp_cache

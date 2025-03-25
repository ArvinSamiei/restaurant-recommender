from datetime import datetime

import httpx
from bson import ObjectId
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from auth_utils import create_token, get_current_user, hash_password, verify_password
from db import users_collection, ratings_collection
from models import User, Rating, SearchParams
from yelp import search_restaurants, fetch_yelp_details

app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://frontend-262362604888.us-central1.run.app", "http://localhost", "http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------
# Helpers
# ---------------------------

async def get_partner_score(restaurant_id: str) -> float | None:
    ratings = await ratings_collection.find({"restaurant_id": restaurant_id}).to_list(length=None)
    if ratings:
        return sum(r["rating"] for r in ratings) / len(ratings)
    return None


def format_review(rating_doc):
    return {
        "id": str(rating_doc["_id"]),
        "username": rating_doc["username"],
        "user_id": rating_doc["user_id"],
        "rating": rating_doc["rating"],
        "comment": rating_doc.get("comment", "")
    }


async def get_curated_results(yelp_results):
    curated = []
    for r in yelp_results:
        if r.get("is_closed"):
            continue
        if r.get("rating", 0) < 4.0:
            continue
        if any("fast food" in cat["alias"] for cat in r.get("categories", [])):
            continue

        r["partner_score"] = await get_partner_score(r["id"])
        curated.append(r)
    return curated


# ---------------------------
# Routes
# ---------------------------

@app.post("/register")
async def register(user: User):
    if await users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    await users_collection.insert_one({"username": user.username, "password": hashed_pw})
    return {"message": "User created"}


@app.post("/login")
async def login(user: User):
    db_user = await users_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(str(db_user["_id"]))
    return {"token": token}


@app.get("/restaurants")
async def get_restaurants(params: SearchParams = Depends()):
    params.categories = f"restaurants,{params.categories}" if params.categories else "restaurants"
    yelp_results = await search_restaurants(params)
    curated = await get_curated_results(yelp_results)
    curated.sort(key=lambda r: (r.get("partner_score") or 0, r.get("rating", 0)), reverse=True)
    return {"restaurants": curated}


@app.get("/restaurant/{restaurant_id}")
async def get_restaurant_detail(restaurant_id: str):
    try:
        yelp_data = await fetch_yelp_details(restaurant_id)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Failed to fetch Yelp data")

    reviews = await ratings_collection.find({"restaurant_id": restaurant_id}).sort("created_at", -1).to_list(100)

    return {
        "restaurant": yelp_data,
        "partner_score": await get_partner_score(restaurant_id),
        "partner_comments": [format_review(r) for r in reviews if r.get("comment")],
    }


@app.post("/rate")
async def rate_restaurant(rating: Rating, user=Depends(get_current_user)):
    rating_doc = {
        "username": user["username"],
        "user_id": str(user["_id"]),
        "restaurant_id": rating.restaurant_id,
        "rating": rating.rating,
        "comment": rating.comment,
        "created_at": datetime.utcnow()
    }
    await ratings_collection.insert_one(rating_doc)
    return {"message": "Rating submitted successfully"}


@app.delete("/rate/{rating_id}")
async def delete_rating(rating_id: str, user=Depends(get_current_user)):
    try:
        rating = await ratings_collection.find_one({"_id": ObjectId(rating_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid rating ID format")

    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")

    if rating["username"] != user["username"]:
        raise HTTPException(status_code=403, detail="You can only delete your own review")

    await ratings_collection.delete_one({"_id": ObjectId(rating_id)})
    return {"message": "Review deleted successfully"}

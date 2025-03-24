import hashlib
import json
import os
from http.client import HTTPException

import httpx
from dotenv import load_dotenv

from db import yelp_cache
from models import SearchParams

load_dotenv()

YELP_API_KEY = os.getenv("YELP_API_KEY")
YELP_API_URL = "https://api.yelp.com/v3/businesses"
HEADERS = {
    "Authorization": f"Bearer {YELP_API_KEY}",
    "Accept": "application/json",
}

from fastapi import HTTPException


def make_cache_key(params: dict) -> str:
    key_string = json.dumps(params, sort_keys=True)
    return hashlib.md5(key_string.encode()).hexdigest()


async def search_restaurants(params: SearchParams):
    query_params = {
        "term": params.term,
        "price": params.price if params.price else None,
        "limit": 10
    }

    base_category = "restaurants"
    category_list = [base_category] + params.categories.split(",") if params.categories else [base_category]
    unique_categories = ",".join(sorted(set(category_list)))
    query_params["categories"] = unique_categories

    query_params['attributes'] = 'alcohol:full_bar,reservation'

    query_params = {k: v for k, v in query_params.items() if v not in [None, "", []]}

    if params.latitude is not None and params.longitude is not None:
        query_params["latitude"] = params.latitude
        query_params["longitude"] = params.longitude
    elif params.location:
        query_params["location"] = params.location
    else:
        raise HTTPException(status_code=400, detail="Location or coordinates required")

    cache_key = make_cache_key(query_params)
    cached = await yelp_cache.find_one({"_id": cache_key})

    if cached:
        print('returned cached result')
        return cached["results"]

    async with httpx.AsyncClient() as client:
        print("Params:", query_params)
        response = await client.get(f'{YELP_API_URL}/search', headers=HEADERS, params=query_params)
        if response.status_code != 200:
            print("Yelp API error:", response.status_code, response.text)
            response.raise_for_status()

        results = response.json()["businesses"]

        yelp_cache.insert_one({
            "_id": cache_key,
            "params": query_params,
            "results": results
        })

        return results


async def fetch_yelp_details(business_id: str):
    async with httpx.AsyncClient() as client:
        url = f"{YELP_API_URL}/{business_id}"
        print(url)
        response = await client.get(url, headers=HEADERS)
        print(response)
        response.raise_for_status()
        return response.json()

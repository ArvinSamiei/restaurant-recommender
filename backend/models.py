from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    username: str
    password: str


class Rating(BaseModel):
    restaurant_id: str
    rating: int
    comment: Optional[str] = None


class SearchParams(BaseModel):
    location: Optional[str] = None
    term: str = ""
    price: str = ""
    categories: str = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None

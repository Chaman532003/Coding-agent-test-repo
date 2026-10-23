from pydantic import BaseModel
from typing import List


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    image_url: str
    description: str


class UserResponse(BaseModel):
    email: str
    name: str


class CartItem(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int
    line_total: float


class CartResponse(BaseModel):
    items: List[CartItem]
    total: float
    count: int


class AddToCartRequest(BaseModel):
    product_id: int
    quantity: int = 1

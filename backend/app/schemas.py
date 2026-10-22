"""Pydantic schemas for API requests and responses."""
from pydantic import BaseModel, Field
from typing import List


class LoginRequest(BaseModel):
    """Request body for POST /api/login."""
    email: str
    password: str


class LoginResponse(BaseModel):
    """Response returned after successful login."""
    access_token: str
    token_type: str = 'bearer'


class Product(BaseModel):
    """Product representation returned by GET /api/products."""
    id: int
    name: str
    price: float
    image_url: str
    description: str


class CartItem(BaseModel):
    """A line item in a cart representation."""
    product_id: int
    name: str
    price: float
    quantity: int
    line_total: float


class Cart(BaseModel):
    """Cart aggregation returned by cart endpoints."""
    items: List[CartItem]
    count: int
    total: float


class AddItemRequest(BaseModel):
    """Request to add an item to the cart."""
    product_id: int
    quantity: int = Field(..., ge=1)

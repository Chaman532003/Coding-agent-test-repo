from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from ..schemas import CartResponse, AddToCartRequest
from ..auth import verify_token
from ..store import add_to_cart, remove_from_cart, get_cart, get_product

router = APIRouter(prefix="/api")


def extract_user_from_token(authorization: Optional[str] = None):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = parts[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Not authenticated")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return email


@router.get("/cart", response_model=CartResponse)
async def get_cart_items(authorization: Optional[str] = Header(None)):
    email = extract_user_from_token(authorization)
    cart = get_cart(email)
    return CartResponse(items=cart["items"], total=cart["total"], count=cart["count"])


@router.post("/cart/items", response_model=CartResponse)
async def add_item(
    request: AddToCartRequest, authorization: Optional[str] = Header(None)
):
    email = extract_user_from_token(authorization)
    product = get_product(request.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart = add_to_cart(email, request.product_id, request.quantity)
    return CartResponse(items=cart["items"], total=cart["total"], count=cart["count"])


@router.delete("/cart/items/{product_id}", response_model=CartResponse)
async def remove_item(
    product_id: int, authorization: Optional[str] = Header(None)
):
    email = extract_user_from_token(authorization)
    cart = remove_from_cart(email, product_id)
    if cart is None:
        raise HTTPException(status_code=404, detail="Item not in cart")

    return CartResponse(items=cart["items"], total=cart["total"], count=cart["count"])

"""Cart router: get cart, add items and remove items for authenticated users."""

from fastapi import APIRouter, Depends, HTTPException
from ..schemas import Cart, AddItemRequest
from ..auth import current_user
from .. import store
from typing import Any

router = APIRouter()


@router.get('/cart', response_model=Cart)
def get_cart(user_email: str = Depends(current_user)) -> Any:
    """Return the cart for the authenticated user."""
    return store.store.get_cart_for_email(user_email)


@router.post('/cart/items', response_model=Cart)
def add_item(req: AddItemRequest, user_email: str = Depends(current_user)) -> Any:
    """Add quantity of a product to the user's cart and return the updated cart.

    Raises HTTPException(404) if the product does not exist.
    """
    try:
        cart = store.store.add_item(user_email, req.product_id, req.quantity)
        return cart
    except KeyError:
        raise HTTPException(status_code=404, detail='Product not found')


@router.delete('/cart/items/{product_id}', response_model=Cart)
def delete_item(product_id: int, user_email: str = Depends(current_user)) -> Any:
    """Remove a product from the user's cart and return the updated cart.

    Raises HTTPException(404) if the item is not present in the cart.
    """
    try:
        cart = store.store.remove_item(user_email, product_id)
        return cart
    except KeyError:
        raise HTTPException(status_code=404, detail='Item not in cart')

"""Products router exposing seeded product list."""

from fastapi import APIRouter
from typing import List, Any
from ..schemas import Product
from .. import store

router = APIRouter()


@router.get('/products', response_model=List[Product])
def list_products() -> Any:
    """Return the list of seeded products.

    The response is a list of product objects matching the Product schema.
    """
    return store.store.products

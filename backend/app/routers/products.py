from fastapi import APIRouter
from ..schemas import ProductResponse
from ..store import products_db
from typing import List

router = APIRouter(prefix="/api")


@router.get("/products", response_model=List[ProductResponse])
async def get_products():
    return products_db

from fastapi import APIRouter, HTTPException
from ..schemas import ProductResponse
from ..store import products_db
from typing import List, Optional

router = APIRouter(prefix="/api")


@router.get("/products", response_model=List[ProductResponse])
async def get_products(q: Optional[str] = None, sort: Optional[str] = None):
    # Start from the store copy (preserve original ordering)
    results = list(products_db)

    # Filtering by q: case-insensitive substring in name or description
    if q:
        q_lower = q.lower()
        results = [
            p
            for p in results
            if q_lower in p.get("name", "").lower() or q_lower in p.get("description", "").lower()
        ]

    # Sorting
    if sort:
        if sort == "price_asc":
            results = sorted(results, key=lambda p: p.get("price", 0))
        elif sort == "price_desc":
            results = sorted(results, key=lambda p: p.get("price", 0), reverse=True)
        elif sort == "name":
            results = sorted(results, key=lambda p: p.get("name", ""))
        else:
            raise HTTPException(status_code=422, detail="Unknown sort value")

    return results

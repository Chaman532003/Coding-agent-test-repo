from fastapi import APIRouter, HTTPException
from ..schemas import ProductResponse
from ..store import products_db
from typing import List, Optional

router = APIRouter(prefix="/api")


@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    q: Optional[str] = None,
    sort: Optional[str] = None,
    min_price: Optional[str] = None,
    max_price: Optional[str] = None,
):
    # Start from the store copy (preserve original ordering)
    results = list(products_db)

    # Filtering by q: trim whitespace and do case-insensitive substring in name or description
    if q:
        q_stripped = q.strip()
        if not q_stripped:
            # query was only whitespace -> no matches
            return []
        q_lower = q_stripped.lower()
        results = [
            p
            for p in results
            if q_lower in p.get("name", "").lower() or q_lower in p.get("description", "").lower()
        ]

    # Parse and validate min_price / max_price (if provided)
    min_val = None
    max_val = None
    try:
        if min_price is not None:
            # allow numeric strings like "10" or "10.5"
            min_val = float(min_price)
        if max_price is not None:
            max_val = float(max_price)
    except (ValueError, TypeError):
        raise HTTPException(status_code=422, detail="min_price and max_price must be numbers")

    if min_val is not None and max_val is not None and min_val > max_val:
        raise HTTPException(status_code=422, detail="min_price cannot be greater than max_price")

    # Apply numeric inclusive filtering after q filtering and before sorting
    if min_val is not None or max_val is not None:
        def in_range(p):
            price = p.get("price", 0)
            if min_val is not None and price < min_val:
                return False
            if max_val is not None and price > max_val:
                return False
            return True

        results = [p for p in results if in_range(p)]

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

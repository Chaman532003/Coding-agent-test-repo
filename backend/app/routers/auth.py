from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from ..schemas import LoginRequest, TokenResponse, UserResponse
from ..auth import verify_password, create_access_token, verify_token
from ..store import users_db

router = APIRouter(prefix="/api")


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    user = users_db.get(request.email)
    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": request.email})
    return TokenResponse(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_profile(authorization: Optional[str] = Header(None)):
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

    user = users_db.get(email)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return UserResponse(email=user["email"], name=user["name"])

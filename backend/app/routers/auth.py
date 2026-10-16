"""Authentication router exposing POST /api/login."""

from fastapi import APIRouter, HTTPException
from ..schemas import LoginRequest, LoginResponse
from .. import auth
from typing import Dict

router = APIRouter()


@router.post('/login', response_model=LoginResponse)
def login_endpoint(req: LoginRequest) -> Dict[str, str]:
    """Authenticate credentials and return an access token.

    Returns a mapping with access_token and token_type on success. On
    authentication failure an HTTPException with status 401 is raised.
    """
    try:
        token = auth.login_user(req.email, req.password)
        return {'access_token': token, 'token_type': 'bearer'}
    except ValueError:
        raise HTTPException(status_code=401, detail='Invalid email or password')

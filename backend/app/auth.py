"""Authentication helpers used by the backend routers.

This module implements a minimal password verification routine (using
hashlib.pbkdf2_hmac) and token issuance/validation integrated with the
in-memory store. No external libraries are used so the test harness can
exercise authentication deterministically.
"""

from fastapi import HTTPException, Header
from typing import Optional
import hashlib

from . import store as store_mod


def _hash_password(password: str, salt: bytes = b'static_salt') -> str:
    """Return a hex-encoded PBKDF2-HMAC-SHA256 derived key for the password.

    The salt is fixed for the purposes of the kata; production code should
    use a per-user random salt and a password hashing library.
    """
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000).hex()


def verify_password(password: str, hashed: str) -> bool:
    """Verify that ``password`` matches the stored ``hashed`` value.

    Args:
        password: plain-text password to verify.
        hashed: hex-encoded derived key previously stored.

    Returns:
        True if the password derives to the same value, False otherwise.
    """
    return _hash_password(password) == hashed


def login_user(email: str, password: str) -> str:
    """Authenticate a user and issue a bearer token.

    Raises ValueError on authentication failure.

    Returns the newly-issued token string on success.
    """
    user = store_mod.store.users.get(email)
    if not user:
        raise ValueError('Invalid email or password')
    if not verify_password(password, user.get('password', '')):
        raise ValueError('Invalid email or password')
    token = store_mod.store.issue_token(email)
    return token


def current_user(authorization: Optional[str] = Header(None)) -> str:
    """FastAPI dependency that resolves the current user email from a Bearer token.

    The function reads the ``Authorization`` header and returns the email
    associated with the token held in the in-memory store. If the header is
    missing or the token is unknown an HTTPException with status 401 is
    raised so endpoints using this as a dependency enforce authentication.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail='Not authenticated')
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        raise HTTPException(status_code=401, detail='Not authenticated')
    token = parts[1]
    email = store_mod.store.email_for_token(token)
    if not email:
        raise HTTPException(status_code=401, detail='Not authenticated')
    return email

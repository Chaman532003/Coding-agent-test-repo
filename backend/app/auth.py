import json
import hmac
import hashlib
import base64
import time
from datetime import datetime, timedelta
from typing import Optional

SECRET_KEY = "change-me"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
SALT = "ecommerce-salt-change-me"


def hash_password(password: str) -> str:
    salt = SALT.encode()
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100000)
    return base64.b64encode(hashed).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    hashed = hash_password(plain_password)
    return hmac.compare_digest(hashed, hashed_password)


def get_password_hash(password: str) -> str:
    return hash_password(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire.timestamp()})

    header = {"alg": "HS256", "typ": "JWT"}
    header_bytes = base64.urlsafe_b64encode(json.dumps(header).encode()).rstrip(b"=")
    payload_bytes = base64.urlsafe_b64encode(json.dumps(to_encode).encode()).rstrip(b"=")

    message = header_bytes + b"." + payload_bytes
    signature = base64.urlsafe_b64encode(
        hmac.new(SECRET_KEY.encode(), message, hashlib.sha256).digest()
    ).rstrip(b"=")

    token = (message + b"." + signature).decode()
    return token


def verify_token(token: str) -> Optional[dict]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None

        header_bytes, payload_bytes, signature = parts

        def add_padding(s):
            padding = 4 - len(s) % 4
            if padding != 4:
                s += "=" * padding
            return s

        payload = json.loads(
            base64.urlsafe_b64decode(add_padding(payload_bytes))
        )

        message = (header_bytes + "." + payload_bytes).encode()
        expected_signature = base64.urlsafe_b64encode(
            hmac.new(SECRET_KEY.encode(), message, hashlib.sha256).digest()
        ).rstrip(b"=").decode()

        if not hmac.compare_digest(signature, expected_signature):
            return None

        if "exp" in payload and payload["exp"] < time.time():
            return None

        return payload
    except Exception:
        return None

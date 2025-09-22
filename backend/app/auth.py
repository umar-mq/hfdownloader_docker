import os
from jose import JWTError, jwt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

JWT_SECRET = os.environ.get('JWT_SECRET','please-set-me')
algo = 'HS256'
bearer = HTTPBearer()

def create_jwt(sub: str):
    return jwt.encode({'sub':sub}, JWT_SECRET, algorithm=algo)

def verify_jwt(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[algo])
        return payload.get('sub')
    except JWTError:
        return None

def require_jwt(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    token = credentials.credentials
    user = verify_jwt(token)
    if not user:
        raise HTTPException(status_code=403, detail='invalid token')
    return user

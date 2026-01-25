from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from schemas import TokenData
import models
from database import get_db 

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SecretKey = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
Algorithm = "HS256"
access_token_expire_minutes = 30

def create_access_token(data: dict):
     to_encode = data.copy()
     
     expire = datetime.utcnow() + timedelta(minutes=access_token_expire_minutes)
     to_encode.update({"exp": expire})
     encoded_jwt = jwt.encode(to_encode, SecretKey, algorithm=Algorithm)
     return encoded_jwt 

def verify_token(token: str, credentials_exception: HTTPException, db: Session=Depends(get_db)):
    try:
        payload = jwt.decode(token, SecretKey, algorithms=[Algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(email=username)
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == username).first()
    if user is None:
        raise credentials_exception    
    return token_data

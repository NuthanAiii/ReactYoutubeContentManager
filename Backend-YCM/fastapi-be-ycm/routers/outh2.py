from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from routers.token import verify_token
from sqlalchemy.orm import Session
from database import get_db
import schemas


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user = verify_token(token, credentials_exception, db)
    return schemas.GetUser.model_validate(user)
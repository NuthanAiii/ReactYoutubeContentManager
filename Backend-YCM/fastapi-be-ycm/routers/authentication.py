
from email import message

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas
from database import get_db
import models
router = APIRouter(tags=['Auths'])

@router.post('/signIn')
def signIn(req: schemas.User, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if user:
        raise HTTPException(status_code= 409, detail="User already exists")
        
    newUser = models.User(**req.model_dump())
    db.add(newUser)
    db.commit()
    db.refresh(newUser)
    return{ "message": f"Signin sucessfull for the user {req.name}"}

@router.post('/login')
def login(req: schemas.Login, db: Session=Depends(get_db)):
    user = db.query(models.User).filter((models.User.email == req.email) & (models.User.password == req.password)).first()
    if not(user):
        raise HTTPException(status_code=409, detail="Invalid credentials")

    return user    




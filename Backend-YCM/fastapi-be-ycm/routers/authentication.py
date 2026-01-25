
from email import message

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.schema import default_is_clause_element
import schemas
from database import get_db
import models
from hashing import Hash
router = APIRouter(tags=['Auths'])

@router.post('/signIn')
def signIn(req: schemas.User, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if user:
        raise HTTPException(status_code= 409, detail="User already exists")

    data = req.model_dump()
    data['password'] = Hash.hash(req.password)    
    newUser = models.User(**data)
    db.add(newUser)
    db.commit()
    db.refresh(newUser)
    return{ "message": f"Signin sucessfull for the user {req.name}"}

@router.post('/login', response_model=schemas.GetUser)
def login(req: schemas.Login, db: Session=Depends(get_db)):
    user = db.query(models.User).filter((models.User.email == req.email)).first()
    if not(user):
        raise HTTPException(status_code=409, detail="User Not Found!")
    if not Hash.verify(req.password, user.password):
        raise HTTPException(status_code=409,detail="Incorrect passowrd")


    return (user)




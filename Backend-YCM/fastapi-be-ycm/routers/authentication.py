
from email import message

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.schema import default_is_clause_element
import schemas
from database import get_db
import models
from routers.token import create_access_token
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

@router.post('/login')
def login(req: schemas.Login, db: Session=Depends(get_db)):
    user = db.query(models.User).filter((models.User.email == req.email)).first()
    if not(user):
        raise HTTPException(status_code=409, detail="User Not Found!")
    if not Hash.verify(req.password, user.password):
        raise HTTPException(status_code=409,detail="Incorrect passowrd")
 #here while createing access tocken i will sedning email, so while verifing we will checking weather 
 #that email is exist in the tocken.
    access_token = create_access_token(data={"sub": user.email}) # In JWT, sub stands for “Subject”. here 
    return {"access_token": access_token, "token_type": "bearer"}    


    





from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
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
        raise HTTPException(status_code=409, detail="User already exists")

    data = req.model_dump()
    data['password'] = Hash.hash(req.password)    
    newUser = models.User(**data)
    db.add(newUser)
    db.commit()
    db.refresh(newUser)
    return {"message": f"Signin sucessfull for the user {req.name}"}

@router.post('/login', response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User Not Found!")
    if not Hash.verify(form_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
    #here while createing access tocken i will sedning email, so while verifing we will checking weather 
    #that email is exist in the tocken.
    access_token = create_access_token(data={"sub": user.email}) # In JWT, sub stands for "Subject". here 
    return {"access_token": access_token, "token_type": "bearer"}    


    




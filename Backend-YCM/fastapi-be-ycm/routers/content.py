from fastapi import APIRouter, Depends
import schemas
import models
from database import get_db
from sqlalchemy.orm import Session

from routers.outh2 import get_current_user

router = APIRouter(tags=['content'])

@router.get('/getContent', response_model=list[schemas.GetContent])
def getContent(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    content = db.query(models.Data).all()
    return content


@router.post("/setContent")
def setContent(req: schemas.Content, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user) ):
    new_content = models.Data(
        **req.model_dump()
    )
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    return new_content

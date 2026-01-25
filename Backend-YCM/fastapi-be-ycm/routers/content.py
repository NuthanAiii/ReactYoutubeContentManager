from fastapi import APIRouter, Depends
import schemas
import models
from database import get_db
from sqlalchemy.orm import Session

router = APIRouter(tags=['content'])

@router.get('/getContent', response_model=list[schemas.GetContent])
def getContent(db: Session = Depends(get_db)):
    content = db.query(models.Data).all()
    return content


@router.post("/setContent")
def setContent(req: schemas.Content, db: Session = Depends(get_db)):
    new_content = models.Data(
        **req.model_dump()
    )
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    return new_content

from fastapi import APIRouter, Depends
import schemas
import models
from database import get_db
from sqlalchemy.orm import Session
from fastapi import Query

from routers.outh2 import get_current_user

router = APIRouter(tags=['content'])

@router.get('/getContent', response_model=schemas.fetchContetOnPageReq)
#here skip and limit are query parameters
# skip is used to skip certain number of records
# limit is used to limit the number of records returned, means 10 record, if limit is 10
def getContent(skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=40), db: Session = Depends(get_db), user: schemas.GetUser = Depends(get_current_user)):
    content = db.query(models.Data).order_by(models.Data.id.desc()).offset(skip).limit(limit).all()
    total = db.query(models.Data).count()
    page = (skip // limit) + 1
    return {"page": page, "total": total, "data": content}


@router.post("/setContent")
def setContent(req: schemas.Content, db: Session = Depends(get_db), user: schemas.GetUser = Depends(get_current_user) ):
    new_content = models.Data(
        **req.model_dump()
    )
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    return new_content
@router.post("/deleteContent")
def deleteContent(req: schemas.deleteContentReq, db: Session = Depends(get_db), user: schemas.GetUser = Depends(get_current_user) ):
    content = db.query(models.Data).filter(models.Data.id == req.id).first()
    if content:
        db.delete(content)
        db.commit()
        return {"message": "Content deleted successfully"}
    else:
        return {"message": "Content not found"}

@router.post("/updateContent")
def updateContent(req: schemas.GetContent, db: Session = Depends(get_db), user: schemas.GetUser = Depends(get_current_user) ):
    content = db.query(models.Data).filter(models.Data.id == req.id).first()
    if content:
        for key, value in req.model_dump().items():
            setattr(content, key, value)
        db.commit()
        db.refresh(content)
        return content
    else:
        return {"message": "Content not found"}
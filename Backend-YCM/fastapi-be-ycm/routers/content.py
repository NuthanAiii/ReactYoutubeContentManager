from fastapi import APIRouter, Depends, HTTPException
import schemas
import models
from database import get_db
from sqlalchemy.orm import Session
from fastapi import Query
from datetime import date
from routers.outh2 import get_current_user
from typing import Optional, List
from ragimp.contentrag import text_splitter, embeddings, llm
from sqlalchemy import text
router = APIRouter(tags=['content'])

@router.post('/getContent', response_model=schemas.fetchContetOnPageReq)
#here skip and limit are query parameters
# skip is used to skip certain number of records
# limit is used to limit the number of records returned, means 10 record, if limit is 10
# and here we have introduced search request body to filter the content based on certain criteria
def getContent(req: Optional[schemas.searchContentReq] = None,skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=40), db: Session = Depends(get_db), user: schemas.GetUser = Depends(get_current_user)):

    user_id = user.id
    data= db.query(models.Data).filter(models.Data.user_id == user_id) # here we are filtering the content based on user id, so that user can only see his content

    if req:
        if req.from_date:
            data = data.filter(models.Data.publishDate >= req.from_date)
        if req.to_date:
            data = data.filter(models.Data.publishDate <= req.to_date)
        if req.type:
            data = data.filter(models.Data.type == req.type)
        if req.search:
            search_term = f"%{req.search}%"
            data = data.filter(
                models.Data.title.ilike(search_term) | models.Data.description.ilike(search_term)
            )
        if req.status == 'uploaded':
            data = data.filter(models.Data.uploaded.is_(True))


        elif req.status == 'scheduled':
            data = data.filter(
                models.Data.publishDate > date.today(),
                models.Data.uploaded.is_(False)
            )

        elif req.status == 'overdue':
            data = data.filter(
                models.Data.publishDate < date.today(),
                models.Data.uploaded.is_(False)
            )

    content = data.order_by(models.Data.id.desc()).offset(skip).limit(limit).all()
    total = data.count()
    page = (skip // limit) + 1
    return {"page": page, "total": total, "data": content}


@router.post("/setContent")
def setContent(req: schemas.Content, db: Session = Depends(get_db), user: schemas.GetUser = Depends(get_current_user)):
    user_id = user.id

    new_content = models.Data(
        **req.model_dump(),
        user_id=user_id
    )
    db.add(new_content)
    db.flush()  # get new_content.id without committing yet

    try:
        content_text = "\n".join([f"{k}:{v}" for k, v in {**req.model_dump(), "user_id": user_id}.items()])
        chunks = text_splitter.split_text(content_text)
        vectors = embeddings.embed_documents(chunks)
        for chunk, vector in zip(chunks, vectors):
            new_vector = models.VectorDB(content_id=new_content.id, user_id=user_id, chunk_text=chunk, embedding=vector)
            db.add(new_vector)
        db.commit()
        db.refresh(new_content)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=503, detail=f"Embedding failed, content not saved: {str(e)}")

    return new_content


@router.post("/deleteContent")
def deleteContent(req: schemas.deleteContentReq, db: Session = Depends(get_db), user: schemas.GetUser = Depends(get_current_user)):
    user_id = user.id
    data = db.query(models.Data).filter(models.Data.user_id == user_id)
    content = data.filter(models.Data.id == req.id).first()
    vecData = db.query(models.VectorDB).filter(models.VectorDB.user_id == user_id)
    vecContent = vecData.filter(models.VectorDB.content_id == req.id).all()
    if content:
        db.delete(content)
        for vec in vecContent:
            db.delete(vec)
        db.commit()
        return {"message": "Content deleted successfully"}
    else:
        return {"message": "Content not found"}


@router.post("/updateContent")
def updateContent(req: schemas.GetContent, db: Session = Depends(get_db), user: schemas.GetUser = Depends(get_current_user)):
    user_id = user.id
    data = db.query(models.Data).filter(models.Data.user_id == user_id)
    vecData = db.query(models.VectorDB).filter(models.VectorDB.user_id == user_id)

    TEXT_FIELDS = {"title", "description", "script", "platform", "type", "category"}

    content = data.filter(models.Data.id == req.id).first()
    if content:
        # check if any text field that affects meaning has actually changed
        req_data = req.model_dump()
        text_changed = any(
            str(req_data.get(field)) != str(getattr(content, field, ""))
            for field in TEXT_FIELDS
        )

        if text_changed:
            try:
                content_text = "\n".join([f"{k}:{v}" for k, v in {**req_data, "user_id": user_id}.items()])
                chunks = text_splitter.split_text(content_text)
                vectors = embeddings.embed_documents(chunks)

                # only delete old vectors after new ones are successfully generated
                vecContent = vecData.filter(models.VectorDB.content_id == req.id).all()
                for vec in vecContent:
                    db.delete(vec)

                for chunk, vector in zip(chunks, vectors):
                    new_vector = models.VectorDB(content_id=req.id, user_id=user_id, chunk_text=chunk, embedding=vector)
                    db.add(new_vector)
            except Exception as e:
                db.rollback()
                raise HTTPException(status_code=503, detail=f"Embedding failed, content not updated: {str(e)}")

        for key, value in req.model_dump().items():
            setattr(content, key, value)
        db.commit()
        db.refresh(content)
        return content
    else:
        return {"message": "Content not found"}

@router.post("/ask")
def askQuestion(req: schemas.askQuestionReq, db: Session = Depends(get_db), user: schemas.GetUser = Depends(get_current_user)):
    user_id = user.id

    try:
        question = req.question
        SIMILARITY_THRESHOLD = 0.7  # cosine distance: 0=identical, 1=orthogonal, 2=opposite
        question_vector = embeddings.embed_query(question)
        top_matches = db.execute(
            text('SELECT chunk_text FROM "Vectors" WHERE user_id = :user_id AND (embedding <=> CAST(:vec AS vector)) < :threshold ORDER BY embedding <=> CAST(:vec AS vector) LIMIT 5'),
            {"user_id": user_id, "vec": str(question_vector), "threshold": SIMILARITY_THRESHOLD}
        ).fetchall()
        if len(top_matches) > 0:
            context = "\n".join([row.chunk_text for row in top_matches])
            prompt = f"""You are a helpful AI assistant.

Answer the question ONLY using the context provided below.

Rules:
- Do NOT make up information
- If the answer is not in the context, say: "I don't know"
- Keep the answer clear and concise
- If possible, include exact values (like dates, numbers)

Context:
{context}

Question:
{question}

Answer:
"""
            answer = llm.invoke(prompt)
            answer_text = answer.content if hasattr(answer, "content") else str(answer)
            return {"answer": answer_text.strip()}
        else:
            return {"answer": "No relevant content found"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Question answering failed: {str(e)}") 



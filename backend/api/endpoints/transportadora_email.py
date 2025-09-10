from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import schemas
from ...crud.transportadora_email import get_transportadora_email, get_transportadora_emails, get_transportadoras_email , create_transportadora_email 
from ...database import get_db

router = APIRouter(
    prefix="/transportadoras-email",
    tags=["Transportadoras-email"]
)

@router.post("/", response_model=schemas.TransportadoraEmail)
def criar_transportadora_email(transportadora_email: schemas.TransportadoraEmailCreate, db: Session = Depends(get_db)):
    return create_transportadora_email(db=db, transportadora_email=transportadora_email)

@router.get("/", response_model=List[schemas.TransportadoraEmail])
def ler_transportadora_email(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transportadoras = get_transportadoras_email(db, skip=skip, limit=limit)
    return transportadoras

@router.get("/{transportadora_email_id}", response_model=schemas.TransportadoraEmail)
def ler_transportadora_email(transportadora_email_id: int, db: Session = Depends(get_db)):
    db_transportadora_email = get_transportadora_email(db, transportadora_email_id=transportadora_email_id)
    if db_transportadora_email is None:
        raise HTTPException(status_code=404, detail="Email não encontrado")
    return db_transportadora_email

@router.get("-transportadora/{transportadora_id}", response_model=List[schemas.TransportadoraEmail])
def ler_transportadora_email(transportadora_id: int, db: Session = Depends(get_db)):
    db_transportadora_email = get_transportadora_emails(db, transportadora_id=transportadora_id)
    if db_transportadora_email is None:
        raise HTTPException(status_code=404, detail="Email não encontrado")
    return db_transportadora_email

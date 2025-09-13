from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import schemas
from ...crud.transportadora import get_transportadora_email, get_transportadora_emails, get_transportadoras_email , create_transportadora_email, delete_transportadora_email, update_transportadora_email
from ...database import get_db

router = APIRouter(
    prefix="/transportadoras-email",
    tags=["Transportadoras-email"]
)

MSG_ERRO_404 = "Email não encontrado"

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
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    return db_transportadora_email

@router.get("-transportadora/{transportadora_id}", response_model=List[schemas.TransportadoraEmail])
def ler_transportadora_email(transportadora_id: int, db: Session = Depends(get_db)):
    db_transportadora_email = get_transportadora_emails(db, transportadora_id=transportadora_id)
    if db_transportadora_email is None:
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    return db_transportadora_email

@router.put("/{transportadora_email_id}", response_model=schemas.TransportadoraEmail)
def atualizar_transportadora_email(transportadora_email_id: int, transportadora_email_data: schemas.TransportadoraEmailUpdate, db: Session = Depends(get_db)):
    db_transportadora_email = get_transportadora_email(db, transportadora_email_id=transportadora_email_id)
    if db_transportadora_email is None:
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    updated_transportadora_email = update_transportadora_email(db, transportadora_email_id=transportadora_email_id, transportadora_email_data=transportadora_email_data)
    return updated_transportadora_email

@router.delete("/{transportadora_email_id}", response_model=schemas.TransportadoraEmail)
def deletar_transportadora_email(transportadora_email_id: int, db: Session = Depends(get_db)):
    db_transportadora_email = get_transportadora_email(db, transportadora_email_id=transportadora_email_id)
    if db_transportadora_email is None:
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    deleted_transportadora_email = delete_transportadora_email(db, transportadora_email_id=transportadora_email_id)
    return deleted_transportadora_email
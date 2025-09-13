from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import schemas
from ...crud.cliente import (
    create_cliente_email, get_cliente_email, get_cliente_emails, update_cliente_email, delete_cliente_email, get_clientes_email
    )
from ...database import get_db

router = APIRouter(
    prefix="/clientes-email",
    tags=["Clientes-email"]
)

MSG_ERRO_404 = "Email não encontrado"

@router.post("/", response_model=schemas.ClienteEmail)
def criar_cliente_email(cliente_email: schemas.ClienteEmailCreate, db: Session = Depends(get_db)):
    return create_cliente_email(db=db, cliente_email=cliente_email)

@router.get("/", response_model=List[schemas.ClienteEmail])
def ler_clientes_email(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clientes = get_clientes_email(db, skip=skip, limit=limit)
    return clientes

@router.get("/{cliente_email_id}", response_model=schemas.ClienteEmail)
def ler_cliente_email(cliente_email_id: int, db: Session = Depends(get_db)):
    db_cliente_email = get_cliente_email(db, cliente_email_id=cliente_email_id)
    if db_cliente_email is None:
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    return db_cliente_email

@router.get("-cliente/{cliente_id}", response_model=List[schemas.ClienteEmail])
def ler_cliente_email(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente_email = get_cliente_emails(db, cliente_id=cliente_id)
    if db_cliente_email is None:
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    return db_cliente_email

@router.put("/{cliente_email_id}", response_model=schemas.ClienteEmail)
def atualizar_cliente_email(cliente_email_id: int, cliente_email_data: schemas.ClienteEmailUpdate, db: Session = Depends(get_db)):
    db_cliente_email = get_cliente_email(db, cliente_email_id=cliente_email_id)
    if db_cliente_email is None:
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    return update_cliente_email(db=db, cliente_email_id=cliente_email_id, cliente_email_data=cliente_email_data)

@router.delete("/{cliente_email_id}", response_model=schemas.ClienteEmail)
def deletar_cliente_email(cliente_email_id: int, db: Session = Depends(get_db)):
    db_cliente_email = get_cliente_email(db, cliente_email_id=cliente_email_id)
    if db_cliente_email is None:
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    deleted_cliente_email = delete_cliente_email(db, cliente_email_id=cliente_email_id)
    return deleted_cliente_email
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import schemas
from ...crud.cliente_email import create_cliente_email, get_clientes_email, get_cliente_email, get_cliente_emails
from ...database import get_db

router = APIRouter(
    prefix="/clientes-email",
    tags=["Clientes-email"]
)

@router.post("/", response_model=schemas.ClienteEmail, tags=["Clientes-email"])
def criar_cliente_email(cliente_email: schemas.ClienteEmailCreate, db: Session = Depends(get_db)):
    return create_cliente_email(db=db, cliente_email=cliente_email)

@router.get("/", response_model=List[schemas.ClienteEmail], tags=["Clientes-email"])
def ler_clientes_email(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clientes = get_clientes_email(db, skip=skip, limit=limit)
    return clientes

@router.get("-id/{cliente_email_id}", response_model=schemas.ClienteEmail, tags=["Clientes-email"])
def ler_cliente_email(cliente_email_id: int, db: Session = Depends(get_db)):
    db_cliente_email = get_cliente_email(db, cliente_email_id=cliente_email_id)
    if db_cliente_email is None:
        raise HTTPException(status_code=404, detail="Email não encontrado")
    return db_cliente_email

@router.get("-cliente/{cliente_id}", response_model=List[schemas.ClienteEmail], tags=["Clientes-email"])
def ler_cliente_email(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente_email = get_cliente_emails(db, cliente_id=cliente_id)
    if db_cliente_email is None:
        raise HTTPException(status_code=404, detail="Email não encontrado")
    return db_cliente_email

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import schemas
from ...crud.cliente_telefone import create_cliente_telefone, get_clientes_telefone, get_cliente_telefone, get_cliente_telefones
from ...database import get_db

router = APIRouter(
    prefix="/clientes-telefone",
    tags=["Clientes-telefone"]
)

@router.post("/", response_model=schemas.ClienteTelefone, tags=["Clientes-telefone"])
def criar_cliente_telefone(cliente_telefone: schemas.ClienteTelefoneCreate, db: Session = Depends(get_db)):
    return create_cliente_telefone(db=db, cliente_telefone=cliente_telefone)

@router.get("/", response_model=List[schemas.ClienteTelefone], tags=["Clientes-telefone"])
def ler_clientes_telefone(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clientes = get_clientes_telefone(db, skip=skip, limit=limit)
    return clientes

@router.get("-id/{cliente_telefone_id}", response_model=schemas.ClienteTelefone, tags=["Clientes-telefone"])
def ler_cliente_telefone(cliente_telefone_id: int, db: Session = Depends(get_db)):
    db_cliente_telefone = get_cliente_telefone(db, cliente_telefone_id=cliente_telefone_id)
    if db_cliente_telefone is None:
        raise HTTPException(status_code=404, detail="Telefone não encontrado")
    return db_cliente_telefone

@router.get("-cliente/{cliente_id}", response_model=List[schemas.ClienteTelefone], tags=["Clientes-telefone"])
def ler_cliente_telefones(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente_telefones = get_cliente_telefones(db, cliente_id=cliente_id)
    if db_cliente_telefones is None:
        raise HTTPException(status_code=404, detail="Telefones não encontrados")
    return db_cliente_telefones
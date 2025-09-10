from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import schemas
from ...crud.cliente import create_cliente, get_clientes, get_cliente, update_cliente, delete_cliente
from ...database import get_db

router = APIRouter(
    prefix="/clientes",
    tags=["Clientes"]
)

@router.post("/", response_model=schemas.Cliente)
def criar_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    return create_cliente(db=db, cliente=cliente)

@router.get("/", response_model=List[schemas.Cliente])
def ler_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clientes = get_clientes(db, skip=skip, limit=limit)
    return clientes

@router.get("/{cliente_id}", response_model=schemas.Cliente)
def ler_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = get_cliente(db, cliente_id=cliente_id)
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return db_cliente

@router.put("/{cliente_id}", response_model=schemas.Cliente)
def atualizar_cliente(cliente_id: int, cliente_data: schemas.ClienteUpdate, db: Session = Depends(get_db)):
    return update_cliente(db=db, cliente_id=cliente_id, cliente_data=cliente_data)

@router.delete("/{cliente_id}", response_model=schemas.Cliente)
def deletar_cliente(cliente_id: int,db: Session = Depends(get_db)):
    return delete_cliente(db=db, cliente_id=cliente_id)
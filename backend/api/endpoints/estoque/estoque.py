from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.estoque import create_estoque, get_estoques, get_estoque, update_estoque, delete_estoque
from ....database import get_db

router = APIRouter(
    prefix="/estoque",
    tags=["Estoque"]
)

@router.post("/", response_model=schemas.Estoque)
def criar_estoque(estoque: schemas.EstoqueCreate, db: Session = Depends(get_db)):
    return create_estoque(db=db, estoque=estoque)

@router.get("/", response_model=List[schemas.Estoque])
def ler_estoques(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    estoques = get_estoques(db, skip=skip, limit=limit)
    return estoques

@router.get("/{estoque_id}", response_model=schemas.Estoque)
def ler_estoque(estoque_id: int, db: Session = Depends(get_db)):
    db_estoque = get_estoque(db, estoque_id=estoque_id)
    if db_estoque is None:
        raise HTTPException(status_code=404, detail="Estoque não encontrado")
    return db_estoque

@router.put("/{estoque_id}", response_model=schemas.Estoque)
def atualizar_estoque(estoque_id: int, estoque_data: schemas.EstoqueUpdate, db: Session = Depends(get_db)):
    return update_estoque(db=db, estoque_id=estoque_id, estoque=estoque_data)

@router.delete("/{estoque_id}", response_model=schemas.Estoque)
def deletar_estoque(estoque_id: int, db: Session = Depends(get_db)):
    return delete_estoque(db=db, estoque_id=estoque_id)
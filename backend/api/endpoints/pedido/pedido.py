
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.pedido import create_pedido, get_pedidos, get_pedido, update_pedido, delete_pedido
from ....database import get_db

router = APIRouter(
    prefix="/pedido",
    tags=["pedido"]
)

@router.post("/", response_model=schemas.Pedido)
def criar_pedido(pedido: schemas.PedidoCreate, db: Session = Depends(get_db)):
    return create_pedido(db=db, pedido=pedido)

@router.get("/", response_model=List[schemas.Pedido])
def ler_pedido(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    pedido = get_pedidos(db, skip=skip, limit=limit)
    return pedido

@router.get("/{pedido_id}", response_model=schemas.Pedido)
def ler_pedido(pedido_id: int, db: Session = Depends(get_db)):
    db_pedido = get_pedido(db, pedido_id=pedido_id)
    if db_pedido is None:
        raise HTTPException(status_code=404, detail="pedido não encontrado")
    return db_pedido

@router.put("/{pedido_id}", response_model=schemas.Pedido)
def atualizar_pedido(pedido_id: int, pedido_data: schemas.PedidoUpdate, db: Session = Depends(get_db)):
    return update_pedido(db=db, pedido_id=pedido_id, pedido=pedido_data)

@router.delete("/{pedido_id}", response_model=schemas.Pedido)
def deletar_pedido(pedido_id: int, db: Session = Depends(get_db)):
    return delete_pedido(db=db, pedido_id=pedido_id)
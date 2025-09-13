
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.pedido import create_pedido_produto, get_pedido_produtos, update_pedido_produto, delete_pedido_produto
from ....database import get_db

router = APIRouter(
    prefix="/pedido-produto",
    tags=["pedido-produto"]
)

@router.post("/", response_model=schemas.PedidoProduto)
def criar_pedido_produto(pedido_produto: schemas.PedidoProdutoCreate, db: Session = Depends(get_db)):
    return create_pedido_produto(db=db, pedido_produto=pedido_produto)

@router.get("/", response_model=List[schemas.PedidoProduto])
def ler_pedido_produto(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_pedido_produtos(db, skip=skip, limit=limit)

@router.get("/{pedido_produto_id}", response_model=schemas.PedidoProduto)
def ler_pedido_produto(pedido_produto_id: int, db: Session = Depends(get_db)):
    db_pedido_produto = get_pedido_produtos(db, pedido_produto_id=pedido_produto_id)
    if db_pedido_produto is None:
        raise HTTPException(status_code=404, detail="Pedido-Produto não encontrado")
    return db_pedido_produto

@router.put("/{pedido_produto_id}", response_model=schemas.PedidoProduto)
def atualizar_pedido_produto(pedido_produto_id: int, pedido_produto_data: schemas.PedidoProdutoUpdate, db: Session = Depends(get_db)):
    return update_pedido_produto(db=db, pedido_produto_id=pedido_produto_id, pedido_produto_data=pedido_produto_data)

@router.delete("/{pedido_produto_id}", response_model=schemas.PedidoProduto)
def deletar_pedido_produto(pedido_produto_id: int, db: Session = Depends(get_db)):
    return delete_pedido_produto(db=db, pedido_produto_id=pedido_produto_id)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.produto import create_produto, get_produtos, get_produto, update_produto
from ....database import get_db

router = APIRouter(
    prefix="/produto",
    tags=["Produto"]
)

@router.post("/", response_model=schemas.Produto)
def criar_produto(produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    return create_produto(db=db, produto=produto)

@router.get("/", response_model=List[schemas.Produto])
def ler_produtos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    produtos = get_produtos(db, skip=skip, limit=limit)
    return produtos

@router.get("/{produto_id}", response_model=schemas.Produto)
def ler_produto(produto_id: int, db: Session = Depends(get_db)):
    db_produto = get_produto(db, produto_id=produto_id)
    if db_produto is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto

@router.patch("/{produto_id}", response_model=schemas.Produto)
def atualizar_produto(produto_id: int, produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    db_produto = update_produto(db, produto_id=produto_id, produto=produto)
    if db_produto is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto

@router.delete("/{produto_id}")
def deletar_produto(produto_id: int, db: Session = Depends(get_db)):
    db_produto = get_produto(db, produto_id=produto_id)
    if db_produto is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(db_produto)
    db.commit()
    return {"detail": "Produto deletado com sucesso"}
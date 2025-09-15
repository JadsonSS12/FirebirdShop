from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.produto import create_produto_traducao, get_produtos_traducoes, get_produto_traducao,update_produto_traducao
from ....database import get_db

router = APIRouter(
    prefix="/produto-traducao",
    tags=["Produto-Tradução"]
)

@router.post("/", response_model=schemas.ProdutoTraducao)
def criar_produto_traducao(produto_traducao: schemas.ProdutoTraducaoCreate, db: Session = Depends(get_db)):
    return create_produto_traducao(db=db, produto_traducao=produto_traducao)

@router.get("/", response_model=List[schemas.ProdutoTraducao])
def ler_produtos_traducao(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    produtos_traducao = get_produtos_traducoes(db, skip=skip, limit=limit)
    return produtos_traducao

@router.get("/{produto_traducao_id}", response_model=schemas.ProdutoTraducao)
def ler_produto_traducao(produto_traducao_id: int, db: Session = Depends(get_db)):
    db_produto_traducao = get_produto_traducao(db, produto_traducao_id=produto_traducao_id)
    if db_produto_traducao is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto_traducao

@router.patch("/{produto_traducao_id}", response_model=schemas.ProdutoTraducao)
def atualizar_produto_traducao(produto_traducao_id: int, db: Session = Depends(get_db)):
    db_produto_traducao = update_produto_traducao(db, produto_traducao_id=produto_traducao_id)
    if db_produto_traducao is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto_traducao
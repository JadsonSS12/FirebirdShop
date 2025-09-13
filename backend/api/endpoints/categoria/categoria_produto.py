from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.categoria import get_categoria_produto, get_categorias_produto, create_categoria_produto, delete_categoria_produto, update_categoria_produto
from ....database import get_db

router = APIRouter(
    prefix="/categoria_produto",
    tags=["Categoria_Produto"]
)

@router.post("/", response_model=schemas.CategoriaProduto)
def criar_categoria_produto(categoria_produto: schemas.CategoriaProdutoCreate, db: Session = Depends(get_db)):
    return create_categoria_produto(db=db, categoria_produto=categoria_produto)

@router.get("/", response_model=List[schemas.CategoriaProduto])
def ler_categorias_produto(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categorias_produto = get_categorias_produto(db, skip=skip, limit=limit)
    return categorias_produto

@router.get("/{categoria_produto_id}", response_model=schemas.CategoriaProduto)
def ler_categoria_produto(categoria_produto_id: int, db: Session = Depends(get_db)):
    db_categoria_produto = get_categoria_produto(db, categoria_produto_id=categoria_produto_id)
    if db_categoria_produto is None:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return db_categoria_produto

@router.put("/{categoria_produto_id}", response_model=schemas.CategoriaProduto)
def atualizar_categoria_produto(categoria_produto_id: int, categoria_data: schemas.CategoriaProdutoUpdate, db: Session = Depends(get_db)):
    return update_categoria_produto(db=db, categoria_produto_id=categoria_produto_id, categoria_data=categoria_data)

@router.delete("/{categoria_produto_id}", response_model=schemas.CategoriaProduto)
def deletar_categoria_produto(categoria_produto_id: int, db: Session = Depends(get_db)):
    return delete_categoria_produto(db=db, categoria_produto_id=categoria_produto_id)
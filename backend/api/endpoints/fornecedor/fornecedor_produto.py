
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.fornecedor import create_fornecedor_produto, get_fornecedores_produto, get_fornecedor_produto, update_fornecedor_produto, delete_fornecedor_produto
from ....database import get_db

router = APIRouter(
    prefix="/fornecedor_produto",
    tags=["Fornecedor-Produto"]
)

@router.post("/", response_model=schemas.FornecedorProduto)
def criar_fornecedor_produto(fornecedor_produto: schemas.FornecedorProdutoCreate, db: Session = Depends(get_db)):
    return create_fornecedor_produto(db=db, fornecedor_produto=fornecedor_produto)

@router.get("/", response_model=List[schemas.FornecedorProduto])
def ler_fornecedor_produto(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    fornecedores_produto = get_fornecedores_produto(db, skip=skip, limit=limit)
    return fornecedores_produto

@router.get("/{fornecedor_produto_id}", response_model=schemas.FornecedorProduto)
def ler_fornecedor_produto(fornecedor_produto_id: int, db: Session = Depends(get_db)):
    db_fornecedor_produto = get_fornecedor_produto(db, fornecedor_produto_id=fornecedor_produto_id)
    if db_fornecedor_produto is None:
        raise HTTPException(status_code=404, detail="fornecedor não encontrado")
    return db_fornecedor_produto

@router.put("/{fornecedor_produto_id}", response_model=schemas.FornecedorProduto)
def atualizar_fornecedor_produto(fornecedor_produto_id: int, fornecedor_data: schemas.FornecedorProdutoUpdate, db: Session = Depends(get_db)):
    return update_fornecedor_produto(db=db, fornecedor_produto_id=fornecedor_produto_id, fornecedor_data=fornecedor_data)

@router.delete("/{fornecedor_produto_id}", response_model=schemas.FornecedorProduto)
def deletar_fornecedor_produto(fornecedor_produto_id: int, db: Session = Depends(get_db)):
    return delete_fornecedor_produto(db=db, fornecedor_produto_id=fornecedor_produto_id)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.fornecedor import create_fornecedor, get_fornecedores, get_fornecedor, update_fornecedor, delete_fornecedor
from ....database import get_db

router = APIRouter(
    prefix="/fornecedor",
    tags=["Fornecedor"]
)

@router.post("/", response_model=schemas.Fornecedor)
def criar_fornecedor(fornecedor: schemas.FornecedorCreate, db: Session = Depends(get_db)):
    return create_fornecedor(db=db, fornecedor=fornecedor)

@router.get("/", response_model=List[schemas.Fornecedor])
def ler_fornecedor(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    fornecedores = get_fornecedores(db, skip=skip, limit=limit)
    return fornecedores

@router.get("/{fornecedor_id}", response_model=schemas.Fornecedor)
def ler_fornecedor(fornecedor_id: int, db: Session = Depends(get_db)):
    db_fornecedor = get_fornecedor(db, fornecedor_id=fornecedor_id)
    if db_fornecedor is None:
        raise HTTPException(status_code=404, detail="fornecedor não encontrado")
    return db_fornecedor

@router.put("/{fornecedor_id}", response_model=schemas.Fornecedor)
def atualizar_fornecedor(fornecedor_id: int, fornecedor_data: schemas.FornecedorUpdate, db: Session = Depends(get_db)):
    return update_fornecedor(db=db, fornecedor_id=fornecedor_id, fornecedor_data=fornecedor_data)

@router.delete("/{fornecedor_id}", response_model=schemas.Fornecedor)
def deletar_fornecedor(fornecedor_id: int, db: Session = Depends(get_db)):
    return delete_fornecedor(db=db, fornecedor_id=fornecedor_id)
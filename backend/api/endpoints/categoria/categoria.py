from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.categoria import get_categoria, get_categorias, create_categoria, delete_categoria, update_categoria  
from ....database import get_db

router = APIRouter(
    prefix="/categoria",
    tags=["Categoria"]
)

@router.post("/", response_model=schemas.Categoria)
def criar_categoria(categoria: schemas.CategoriaCreate, db: Session = Depends(get_db)):
    return create_categoria(db=db, categoria=categoria)

@router.get("/", response_model=List[schemas.Categoria])
def ler_categorias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categorias = get_categorias(db, skip=skip, limit=limit)
    return categorias

@router.get("/{categoria_id}", response_model=schemas.Categoria)
def ler_categoria(categoria_id: int, db: Session = Depends(get_db)):
    db_categoria = get_categoria(db, categoria_id=categoria_id)
    if db_categoria is None:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return db_categoria

@router.put("/{categoria_id}", response_model=schemas.Categoria)
def atualizar_categoria(categoria_id: int, categoria_data: schemas.CategoriaUpdate, db: Session = Depends(get_db)):
    return update_categoria(db=db, categoria_id=categoria_id, categoria_data=categoria_data)

@router.delete("/{categoria_id}", response_model=schemas.Categoria)
def deletar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    return delete_categoria(db=db, categoria_id=categoria_id)
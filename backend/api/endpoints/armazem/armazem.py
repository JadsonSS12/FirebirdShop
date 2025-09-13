from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.armazem import get_armazem, get_armazems, create_armazem, delete_armazem, update_armazem
from ....database import get_db

router = APIRouter(
    prefix="/armazem",
    tags=["Armazém"]
)

@router.post("/", response_model=schemas.Armazem)
def criar_armazem(armazem: schemas.ArmazemCreate, db: Session = Depends(get_db)):
    return create_armazem(db=db, armazem=armazem)

@router.get("/", response_model=List[schemas.Armazem])
def ler_armazens(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    armazens = get_armazems(db, skip=skip, limit=limit)
    return armazens

@router.get("/{armazem_id}", response_model=schemas.Armazem)
def ler_armazem(armazem_id: int, db: Session = Depends(get_db)):
    db_armazem = get_armazem(db, armazem_id=armazem_id)
    if db_armazem is None:
        raise HTTPException(status_code=404, detail="Armazém não encontrado")
    return db_armazem

@router.put("/{armazem_id}", response_model=schemas.Armazem)
def atualizar_armazem(armazem_id: int, armazem_data: schemas.ArmazemUpdate, db: Session = Depends(get_db)):
    return update_armazem(db=db, armazem_id=armazem_id, armazem_data=armazem_data)

@router.delete("/{armazem_id}", response_model=schemas.Armazem)
def deletar_armazem(armazem_id: int, db: Session = Depends(get_db)):
    return delete_armazem(db=db, armazem_id=armazem_id)
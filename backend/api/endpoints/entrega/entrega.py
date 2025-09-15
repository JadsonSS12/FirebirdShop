from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.entrega import create_entrega, get_entregas, get_entrega, update_entrega, delete_entrega
from ....database import get_db

router = APIRouter(
    prefix="/entrega",
    tags=["Entrega"]
)

@router.post("/", response_model=schemas.Entrega)
def criar_entrega(entrega: schemas.EntregaCreate, db: Session = Depends(get_db)):
    return create_entrega(db=db, entrega=entrega)

@router.get("/", response_model=List[schemas.Entrega])
def ler_entregas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    entregas = get_entregas(db, skip=skip, limit=limit)
    return entregas

@router.get("/{entrega_id}", response_model=schemas.Entrega)
def ler_entrega(entrega_id: int, db: Session = Depends(get_db)):
    db_entrega = get_entrega(db, entrega_id=entrega_id)
    if db_entrega is None:
        raise HTTPException(status_code=404, detail="Entrega não encontrada")
    return db_entrega

@router.put("/{entrega_id}", response_model=schemas.Entrega)
def atualizar_entrega(entrega_id: int, entrega_data: schemas.EntregaUpdate, db: Session = Depends(get_db)):
    return update_entrega(db=db, entrega_id=entrega_id, entrega=entrega_data)

@router.delete("/{entrega_id}", response_model=schemas.Entrega)
def deletar_entrega(entrega_id: int, db: Session = Depends(get_db)):
    return delete_entrega(db=db, entrega_id=entrega_id)
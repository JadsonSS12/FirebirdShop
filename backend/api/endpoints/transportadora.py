from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ... import schemas
from ...crud.transportadora import get_transportadora, get_transportadoras, create_transportadora, update_transportadora, delete_transportadora
from ...database import get_db

router = APIRouter(
    prefix="/transportadoras",
    tags=["Transportadoras"]
)

MSG_404 = "Transportadora não encontrada"

@router.post("/", response_model=schemas.Transportadora)
def criar_transportadora(transportadora: schemas.TransportadoraCreate, db: Session = Depends(get_db)):
    return create_transportadora(db=db, transportadora=transportadora)

@router.get("/", response_model=List[schemas.Transportadora])
def ler_transportadoras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transportadoras = get_transportadoras(db, skip=skip, limit=limit)
    return transportadoras

@router.get("/{transportadora_id}", response_model=schemas.Transportadora)
def ler_transportadora(transportadora_id: int, db: Session = Depends(get_db)):
    db_transportadora = get_transportadora(db, transportadora_id=transportadora_id)
    if db_transportadora is None:
        raise HTTPException(status_code=404, detail=MSG_404)
    return db_transportadora

@router.put("/{transportadora_id}", response_model=schemas.Transportadora)
def atualizar_transportadora(transportadora_id: int, transportadora_data: schemas.TransportadoraUpdate, db: Session = Depends(get_db)):
    db_transportadora = get_transportadora(db, transportadora_id=transportadora_id)
    if db_transportadora is None:
        raise HTTPException(status_code=404, detail=MSG_404)
    updated_transportadora = update_transportadora(db, transportadora_id=transportadora_id, transportadora_data=transportadora_data)
    return updated_transportadora

@router.delete("/{transportadora_id}", response_model=schemas.Transportadora)
def deletar_transportadora(transportadora_id: int, db: Session = Depends(get_db)):
    db_transportadora = get_transportadora(db, transportadora_id=transportadora_id)
    if db_transportadora is None:
        raise HTTPException(status_code=404, detail=MSG_404)
    deleted_transportadora = delete_transportadora(db, transportadora_id=transportadora_id)
    return deleted_transportadora

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .... import schemas
from ....crud.transportadora import (
    get_transportadora_telefone, get_transportadora_telefones, get_transportadoras_telefone, 
    create_transportadora_telefone, delete_transportadora_telefone, update_transportadora_telefone)
from ....database import get_db

router = APIRouter(
    prefix="/transportadora-telefone",
    tags=["Transportadora-telefone"]
)

MSG_ERRO_404 = "Telefone não encontrado"

@router.post("/", response_model=schemas.TransportadoraTelefone)
def criar_transportadora_telefone(transportadora_telefone: schemas.TransportadoraTelefoneCreate, db: Session = Depends(get_db)):
    return create_transportadora_telefone(db=db, transportadora_telefone=transportadora_telefone)

@router.get("/", response_model=List[schemas.TransportadoraTelefone])
def ler_transportadoras_telefone(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    transportadoras = get_transportadoras_telefone(db, skip=skip, limit=limit)
    return transportadoras

@router.get("/{transportadora_telefone_id}", response_model=schemas.TransportadoraTelefone)
def ler_transportadora_telefone(transportadora_telefone_id: int, db: Session = Depends(get_db)):
    db_transportadora_telefone = get_transportadora_telefone(db, transportadora_telefone_id=transportadora_telefone_id)
    if db_transportadora_telefone is None:
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    return db_transportadora_telefone

@router.get("-transportadora/{transportadora_id}", response_model=List[schemas.TransportadoraTelefone])
def ler_transportadora_telefones(transportadora_id: int, db: Session = Depends(get_db)):
    db_transportadora_telefones = get_transportadora_telefones(db, transportadora_id=transportadora_id)
    if db_transportadora_telefones is None:
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    return db_transportadora_telefones

@router.put("/{transportadora_telefone_id}", response_model=schemas.TransportadoraTelefone)
def atualizar_transportadora_telefone(transportadora_telefone_id: int, transportadora_telefone_data: schemas.TransportadoraTelefoneUpdate, db: Session = Depends(get_db)):
    db_transportadora_telefone = get_transportadora_telefone(db, transportadora_telefone_id=transportadora_telefone_id)
    if db_transportadora_telefone is None:
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    updated_transportadora_telefone = update_transportadora_telefone(db, transportadora_telefone_id=transportadora_telefone_id, transportadora_telefone_data=transportadora_telefone_data)
    return updated_transportadora_telefone

@router.delete("/{transportadora_telefone_id}", response_model=schemas.TransportadoraTelefone)
def deletar_transportadora_telefone(transportadora_telefone_id: int, db: Session = Depends(get_db)):
    db_transportadora_telefone = get_transportadora_telefone(db, transportadora_telefone_id=transportadora_telefone_id)
    if db_transportadora_telefone is None:
        raise HTTPException(status_code=404, detail=MSG_ERRO_404)
    deleted_transportadora_telefone = delete_transportadora_telefone(db, transportadora_telefone_id=transportadora_telefone_id)
    return deleted_transportadora_telefone
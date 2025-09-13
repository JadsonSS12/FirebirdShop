from sqlalchemy.orm import Session
from ... import models, schemas

def get_transportadoras_telefone(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TransportadoraTelefone).offset(skip).limit(limit).all()

def get_transportadora_telefone(db: Session, transportadora_telefone_id: int):
    return db.query(models.TransportadoraTelefone).filter(models.TransportadoraTelefone.id == transportadora_telefone_id).first()

def get_transportadora_telefones(db: Session, transportadora_id: int):
    return db.query(models.TransportadoraTelefone).filter(models.TransportadoraTelefone.transportadora_id == transportadora_id).all()

def create_transportadora_telefone(db: Session, transportadora_telefone: schemas.TransportadoraTelefoneCreate):
    last_id = db.query(models.TransportadoraTelefone.id).order_by(models.TransportadoraTelefone.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1
    
    telefone_data = transportadora_telefone.dict()
    
    db_transportadora_telefone = models.TransportadoraTelefone(id=next_id, **telefone_data)
    db.add(db_transportadora_telefone)
    db.commit()
    db.refresh(db_transportadora_telefone)
    return db_transportadora_telefone

def update_transportadora_telefone(db: Session, transportadora_telefone_id: int, transportadora_telefone_data: schemas.TransportadoraTelefoneUpdate):
    db_transportadora_telefone = db.query(models.TransportadoraTelefone).filter(models.TransportadoraTelefone.id == transportadora_telefone_id).first()
    if db_transportadora_telefone is None:
        return None
    
    update_data = transportadora_telefone_data.model_dump(exclude_unset=True)
    
    if not update_data:
        return db_transportadora_telefone
    
    db.query(models.TransportadoraTelefone).filter(models.TransportadoraTelefone.id == transportadora_telefone_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.TransportadoraTelefone).filter(models.TransportadoraTelefone.id == transportadora_telefone_id).first()

def delete_transportadora_telefone(db: Session, transportadora_telefone_id: int):
    db_transportadora_telefone = db.query(models.TransportadoraTelefone).filter(models.TransportadoraTelefone.id == transportadora_telefone_id).first()
    if db_transportadora_telefone:
        db.delete(db_transportadora_telefone)
        db.commit()
    return db_transportadora_telefone

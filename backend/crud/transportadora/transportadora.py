from sqlalchemy.orm import Session
from ... import models, schemas

def get_transportadora(db: Session, transportadora_id: int):
    return db.query(models.Transportadora).filter(models.Transportadora.id == transportadora_id).first()

def get_transportadoras(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Transportadora).offset(skip).limit(limit).all()

def create_transportadora(db: Session, transportadora: schemas.TransportadoraCreate):
    # ATENÇÃO: Gerenciamento manual do ID para este exemplo.
    # Em um sistema real, o ID viria de um Generator/Sequence.
    last_id = db.query(models.Transportadora.id).order_by(models.Transportadora.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_transportadora = models.Transportadora(
        id=next_id,
        nome=transportadora.nome,
        nome_fantasia=transportadora.nome_fantasia,
        cnpj=transportadora.cnpj,
        cep=transportadora.cep,
        estado=transportadora.estado,
        cidade=transportadora.cidade,
        bairro=transportadora.bairro,
        rua=transportadora.rua,
        numero=transportadora.numero
    )
    db.add(db_transportadora)
    db.commit()
    db.refresh(db_transportadora)
    return db_transportadora

def update_transportadora(db: Session, transportadora_id: int, transportadora_data: schemas.TransportadoraUpdate):
    db_transportadora = db.query(models.Transportadora).filter(models.Transportadora.id == transportadora_id).first()
    if db_transportadora is None:
        return None

    update_data = transportadora_data.model_dump(exclude_unset=True)

    if not update_data:
        return db_transportadora

    db.query(models.Transportadora).filter(models.Transportadora.id == transportadora_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.Transportadora).filter(models.Transportadora.id == transportadora_id).first()

def delete_transportadora(db: Session, transportadora_id: int):
    db_transportadora = db.query(models.Transportadora).filter(models.Transportadora.id == transportadora_id).first()
    if db_transportadora:
        db.delete(db_transportadora)
        db.commit()
    return db_transportadora


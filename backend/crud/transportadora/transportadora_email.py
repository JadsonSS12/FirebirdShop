from sqlalchemy.orm import Session
from ... import models, schemas

def get_transportadoras_email(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.TransportadoraEmail).offset(skip).limit(limit).all()

def get_transportadora_email(db: Session, transportadora_email_id: int):
    return db.query(models.TransportadoraEmail).filter(models.TransportadoraEmail.id == transportadora_email_id).first()

def get_transportadora_emails(db: Session, transportadora_id: int):
    return db.query(models.TransportadoraEmail).filter(models.TransportadoraEmail.transportadora_id == transportadora_id).all()

def create_transportadora_email(db: Session, transportadora_email: schemas.TransportadoraEmailCreate):
    last_id = db.query(models.TransportadoraEmail.id).order_by(models.TransportadoraEmail.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    email_data = transportadora_email.model_dump()

    db_transportadora_email = models.TransportadoraEmail(id=next_id, **email_data)
    db.add(db_transportadora_email)
    db.commit()
    db.refresh(db_transportadora_email)
    return db_transportadora_email

def update_transportadora_email(db: Session, transportadora_email_id: int, transportadora_email_data: schemas.TransportadoraEmailUpdate):
    # Verificar se o email da transportadora existe
    db_transportadora_email = db.query(models.TransportadoraEmail).filter(models.TransportadoraEmail.id == transportadora_email_id).first()
    if db_transportadora_email is None:
        return None

    update_data = transportadora_email_data.model_dump(exclude_unset=True)

    if not update_data:
        return db_transportadora_email

    db.query(models.TransportadoraEmail).filter(models.TransportadoraEmail.id == transportadora_email_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.TransportadoraEmail).filter(models.TransportadoraEmail.id == transportadora_email_id).first()

def delete_transportadora_email(db: Session, transportadora_email_id: int):
    db_transportadora_email = db.query(models.TransportadoraEmail).filter(models.TransportadoraEmail.id == transportadora_email_id).first()
    if db_transportadora_email:
        db.delete(db_transportadora_email)
        db.commit()
    return db_transportadora_email
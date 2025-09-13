from sqlalchemy.orm import Session
from ... import models, schemas

def get_entrega(db: Session, entrega_id: int):
    return db.query(models.Entrega).filter(models.Entrega.id == entrega_id).first()

def get_entregas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Entrega).offset(skip).limit(limit).all()

def create_entrega(db: Session, entrega: schemas.EntregaCreate):
    last_id = db.query(models.Entrega.id).order_by(models.Entrega.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_entrega = models.Entrega(
        id=next_id,
        pedido_id=entrega.pedido_id,
        transportadora_id=entrega.transportadora_id,
        prazo=entrega.prazo,
        preco=entrega.preco,
        status=entrega.status,
        cep=entrega.cep,
        estado=entrega.estado,
        cidade=entrega.cidade,
        bairro=entrega.bairro,
        rua=entrega.rua,
        numero=entrega.numero,
    )

    db.add(db_entrega)
    db.commit()
    db.refresh(db_entrega)
    return db_entrega

def update_entrega(db: Session, entrega_id: int, entrega: schemas.EntregaUpdate):

    db_entrega = get_entrega(db, entrega_id=entrega_id)
    if db_entrega is None:
        return None

    update_data = entrega.model_dump(exclude_unset=True)

    if not update_data:
        return db_entrega

    db.query(models.Entrega).filter(models.Entrega.id == entrega_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.Entrega).filter(models.Entrega.id == entrega_id).first()

def delete_entrega(db: Session, entrega_id: int):
    db_entrega = get_entrega(db, entrega_id=entrega_id)
    if db_entrega:
        db.delete(db_entrega)
        db.commit()
    return db_entrega
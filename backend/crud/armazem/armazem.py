from sqlalchemy.orm import Session
from ... import models, schemas

def get_armazem(db: Session, armazem_id: int):
    return db.query(models.Armazem).filter(models.Armazem.id == armazem_id).first()

def get_armazems(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Armazem).offset(skip).limit(limit).all()

def create_armazem(db: Session, armazem: schemas.ArmazemCreate):
    last_id = db.query(models.Armazem.id).order_by(models.Armazem.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_armazem = models.Armazem(
        id=next_id,
        nome=armazem.nome,
        pais=armazem.pais,
        estado=armazem.estado,
        cidade=armazem.cidade, 
        bairro=armazem.bairro,
        rua=armazem.rua,
        numero=armazem.numero,
        cep=armazem.cep,
    )

    db.add(db_armazem)
    db.commit()
    db.refresh(db_armazem)
    return db_armazem

def update_armazem(db: Session, armazem_id: int, armazem: schemas.ArmazemUpdate):

    db_armazem = get_armazem(db, armazem_id=armazem_id)
    if db_armazem is None:
        return None

    update_data = armazem.model_dump(exclude_unset=True)

    if not update_data:
        return db_armazem

    db.query(models.Armazem).filter(models.Armazem.id == armazem_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.Armazem).filter(models.Armazem.id == armazem_id).first()

def delete_armazem(db: Session, armazem_id: int):
    db_armazem = get_armazem(db, armazem_id=armazem_id)
    if db_armazem:
        db.delete(db_armazem)
        db.commit()
    return db_armazem
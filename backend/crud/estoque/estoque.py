from sqlalchemy.orm import Session
from ... import models, schemas

def get_estoque(db: Session, estoque_id: int):
    return db.query(models.Estoque).filter(models.Estoque.id == estoque_id).first()

def get_estoques(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Estoque).offset(skip).limit(limit).all()

def create_estoque(db: Session, estoque: schemas.EstoqueCreate):
    last_id = db.query(models.Estoque.id).order_by(models.Estoque.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_estoque = models.Estoque(
        id=next_id,
        armazem_id=estoque.armazem_id,
        produto_id=estoque.produto_id,
        quantidade=estoque.quantidade,
        codigo=estoque.codigo,
    )

    db.add(db_estoque)
    db.commit()
    db.refresh(db_estoque)
    return db_estoque

def update_estoque(db: Session, estoque_id: int, estoque: schemas.EstoqueUpdate):

    db_estoque = get_estoque(db, estoque_id=estoque_id)
    if db_estoque is None:
        return None

    update_data = estoque.model_dump(exclude_unset=True)

    if not update_data:
        return db_estoque

    db.query(models.Estoque).filter(models.Estoque.id == estoque_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.Estoque).filter(models.Estoque.id == estoque_id).first()

def delete_estoque(db: Session, estoque_id: int):
    db_estoque = get_estoque(db, estoque_id=estoque_id)
    if db_estoque:
        db.delete(db_estoque)
        db.commit()
    return db_estoque
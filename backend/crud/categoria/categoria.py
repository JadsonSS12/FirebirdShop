from sqlalchemy.orm import Session
from ... import models, schemas

def get_categoria(db: Session, categoria_id: int):
    return db.query(models.Categoria).filter(models.Categoria.id == categoria_id).first()

def get_categorias(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Categoria).offset(skip).limit(limit).all()

def create_categoria(db: Session, categoria: schemas.CategoriaCreate):
    last_id = db.query(models.Categoria.id).order_by(models.Categoria.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_categoria = models.Categoria(
        id=next_id,
        nome=categoria.nome,
        descricao=categoria.descricao
    )

    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def update_categoria(db: Session, categoria_id: int, categoria: schemas.CategoriaUpdate):

    db_categoria = get_categoria(db, categoria_id=categoria_id)
    if db_categoria is None:
        return None

    update_data = categoria.model_dump(exclude_unset=True)

    if not update_data:
        return db_categoria

    db.query(models.Categoria).filter(models.Categoria.id == categoria_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.Categoria).filter(models.Categoria.id == categoria_id).first()

def delete_categoria(db: Session, categoria_id: int):
    db_categoria = get_categoria(db, categoria_id=categoria_id)
    if db_categoria:
        db.delete(db_categoria)
        db.commit()
    return db_categoria
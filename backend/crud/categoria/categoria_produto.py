from sqlalchemy.orm import Session
from ... import models, schemas

def get_categoria_produto(db: Session, categoria_produto_id: int):
    return db.query(models.CategoriaProduto).filter(models.CategoriaProduto.id == categoria_produto_id).first()

def get_categorias_produtos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CategoriaProduto).offset(skip).limit(limit).all()

def get_categorias_produto(db: Session, categoria_produto_id: int):
    return db.query(models.CategoriaProduto).filter(models.CategoriaProduto.id == categoria_produto_id).all()


def create_categoria_produto(db: Session, categoria_produto: schemas.CategoriaProdutoCreate):
    last_id = db.query(models.CategoriaProduto.id).order_by(models.CategoriaProduto.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_categoria_produto = models.CategoriaProduto(
        id=next_id,
        categoria_id=categoria_produto.categoria_id,
        produto_id=categoria_produto.produto_id
    )

    db.add(db_categoria_produto)
    db.commit()
    db.refresh(db_categoria_produto)
    return db_categoria_produto

def update_categoria_produto(db: Session, categoria_produto_id: int, categoria_produto: schemas.CategoriaProdutoUpdate):

    db_categoria_produto = get_categoria_produto(db, categoria_produto_id=categoria_produto_id)
    if db_categoria_produto is None:
        return None

    update_data = categoria_produto.model_dump(exclude_unset=True)

    if not update_data:
        return db_categoria_produto

    db.query(models.CategoriaProduto).filter(models.CategoriaProduto.id == categoria_produto_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.CategoriaProduto).filter(models.CategoriaProduto.id == categoria_produto_id).first()

def delete_categoria_produto(db: Session, categoria_produto_id: int):
    db_categoria_produto = get_categoria_produto(db, categoria_produto_id=categoria_produto_id)
    if db_categoria_produto:
        db.delete(db_categoria_produto)
        db.commit()
    return db_categoria_produto
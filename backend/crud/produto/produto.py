from sqlalchemy.orm import Session
from ... import models, schemas

def get_produto(db: Session, produto_id: int):
    return db.query(models.Produto).filter(models.Produto.id == produto_id).first()

def get_produtos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Produto).offset(skip).limit(limit).all()

def create_produto(db: Session, produto: schemas.ProdutoCreate):
    last_id = db.query(models.Produto.id).order_by(models.Produto.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_produto = models.Produto(
        id=next_id,
        nome=produto.nome,
        status=produto.status,
        preco_minimo=produto.preco_minimo,
        preco_venda=produto.preco_venda,
        data_garantia=produto.data_garantia,
    )
    
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

def update_produto(db: Session, produto_id: int, produto: schemas.ProdutoUpdate):

    db_produto = get_produto(db, produto_id=produto_id)
    if db_produto is None:
        return None

    update_data = produto.model_dump(exclude_unset=True)

    if not update_data:
        return db_produto

    db.query(models.Produto).filter(models.Produto.id == produto_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.Produto).filter(models.Produto.id == produto_id).first()

def delete_produto(db: Session, produto_id: int):
    db_produto = get_produto(db, produto_id=produto_id)
    if db_produto:
        db.delete(db_produto)
        db.commit()
    return db_produto
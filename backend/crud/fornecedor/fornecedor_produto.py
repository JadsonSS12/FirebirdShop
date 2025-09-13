from sqlalchemy.orm import Session
from ... import models, schemas

def get_fornecedor_produto(db: Session, fornecedor_produto_id: int):
    return db.query(models.FornecedorProduto).filter(models.FornecedorProduto.id == fornecedor_produto_id).first()

def get_fornecedores_produto(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.FornecedorProduto).offset(skip).limit(limit).all()

def create_fornecedor_produto(db: Session, fornecedor_produto: schemas.FornecedorProdutoCreate):
    last_id = db.query(models.FornecedorProduto.id).order_by(models.FornecedorProduto.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_fornecedor_produto = models.FornecedorProduto(
        id=next_id,
        fornecedor_id=fornecedor_produto.fornecedor_id,
        produto_id=fornecedor_produto.produto_id,
    )

    db.add(db_fornecedor_produto)
    db.commit()
    db.refresh(db_fornecedor_produto)
    return db_fornecedor_produto

def update_fornecedor_produto(db: Session, fornecedor_produto_id: int, fornecedor_produto: schemas.FornecedorProdutoUpdate):

    db_fornecedor_produto = get_fornecedor_produto(db, fornecedor_produto_id=fornecedor_produto_id)
    if db_fornecedor_produto is None:
        return None

    update_data = fornecedor_produto.model_dump(exclude_unset=True)

    if not update_data:
        return db_fornecedor_produto

    db.query(models.FornecedorProduto).filter(models.FornecedorProduto.id == fornecedor_produto_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.FornecedorProduto).filter(models.FornecedorProduto.id == fornecedor_produto_id).first()

def delete_fornecedor_produto(db: Session, fornecedor_produto_id: int):
    db_fornecedor_produto = get_fornecedor_produto(db, fornecedor_produto_id=fornecedor_produto_id)
    if db_fornecedor_produto:
        db.delete(db_fornecedor_produto)
        db.commit()
    return db_fornecedor_produto
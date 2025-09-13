from sqlalchemy.orm import Session
from ... import models, schemas

def get_pedido_produto(db: Session, pedido_produto_id: int):
    return db.query(models.PedidoProduto).filter(models.PedidoProduto.id == pedido_produto_id).first()

def get_pedido_produtos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.PedidoProduto).offset(skip).limit(limit).all()

def create_pedido_produto(db: Session, pedido_produto: schemas.PedidoProdutoCreate):
    last_id = db.query(models.PedidoProduto.id).order_by(models.PedidoProduto.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_pedido_produto = models.PedidoProduto(
        id=next_id,
        pedido_id=pedido_produto.pedido_id,
        produto_id=pedido_produto.produto_id,
        quantidade=pedido_produto.quantidade,
        preco_unitario=pedido_produto.preco_unitario,
        preco_total=pedido_produto.preco_total,
    )

    db.add(db_pedido_produto)
    db.commit()
    db.refresh(db_pedido_produto)
    return db_pedido_produto

def update_pedido_produto(db: Session, pedido_produto_id: int, pedido_produto: schemas.PedidoProdutoUpdate):

    db_pedido_produto = get_pedido_produto(db, pedido_produto_id=pedido_produto_id)
    if db_pedido_produto is None:
        return None

    update_data = pedido_produto.model_dump(exclude_unset=True)

    if not update_data:
        return db_pedido_produto

    db.query(models.PedidoProduto).filter(models.PedidoProduto.id == pedido_produto_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.PedidoProduto).filter(models.PedidoProduto.id == pedido_produto_id).first()

def delete_pedido_produto(db: Session, pedido_produto_id: int):
    db_pedido_produto = get_pedido_produto(db, pedido_produto_id=pedido_produto_id)
    if db_pedido_produto:
        db.delete(db_pedido_produto)
        db.commit()
    return db_pedido_produto
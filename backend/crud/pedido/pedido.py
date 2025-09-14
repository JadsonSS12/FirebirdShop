from sqlalchemy.orm import Session
from ... import models, schemas

def get_pedido(db: Session, pedido_id: int):
    return db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()

def get_pedidos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Pedido).offset(skip).limit(limit).all()

def create_pedido(db: Session, pedido: schemas.PedidoCreate):
    last_id = db.query(models.Pedido.id).order_by(models.Pedido.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_pedido = models.Pedido(
        id=next_id,
        cliente_id=pedido.cliente_id,
        data_pedido=pedido.data_pedido,
        data_prazo_entrega=pedido.data_prazo_entrega,
        modo_encomenda=pedido.modo_encomenda,
        status=pedido.status,
        preco_total=pedido.preco_total,
    )

    db.add(db_pedido)
    db.commit()
    db.refresh(db_pedido)
    return db_pedido

def update_pedido(db: Session, pedido_id: int, pedido: schemas.PedidoUpdate):

    db_pedido = get_pedido(db, pedido_id=pedido_id)
    if db_pedido is None:
        return None

    update_data = pedido.model_dump(exclude_unset=True)

    if not update_data:
        return db_pedido

    db.query(models.Pedido).filter(models.Pedido.id == pedido_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.Pedido).filter(models.Pedido.id == pedido_id).first()

def delete_pedido(db: Session, pedido_id: int):
    db_pedido = get_pedido(db, pedido_id=pedido_id)
    if db_pedido:
        db.delete(db_pedido)
        db.commit()
    return db_pedido
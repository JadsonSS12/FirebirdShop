from sqlalchemy.orm import Session
from ... import models, schemas

def get_entrega(db: Session, entrega_id: int):
    return db.query(models.Entrega).filter(models.Entrega.id == entrega_id).first()

def get_entregas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Entrega).offset(skip).limit(limit).all()

def create_entrega(db: Session, entrega: schemas.EntregaCreate):
    entrega_existente = db.query(models.Entrega).filter(models.Entrega.pedido_id == entrega.pedido_id).first()
    if entrega_existente:
        raise Exception("Já existe uma entrega cadastrada para este pedido.")


    last_id = db.query(models.Entrega.id).order_by(models.Entrega.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    pedido = db.query(models.Pedido).filter(models.Pedido.id == entrega.pedido_id).first()
    if not pedido:
        raise Exception("Pedido não encontrado para a entrega.")

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

    db.query(models.Pedido).filter(models.Pedido.id == pedido.id).update(
        {"preco_total": pedido.preco_total + entrega.preco}, synchronize_session="fetch"
    )

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

    pedido = db.query(models.Pedido).filter(models.Pedido.id == db_entrega.pedido_id).first()
    if pedido:
        novo_preco = update_data.get("preco", db_entrega.preco)
        diferenca = novo_preco - db_entrega.preco
        db.query(models.Pedido).filter(models.Pedido.id == pedido.id).update(
            {"preco_total": pedido.preco_total + diferenca}, synchronize_session="fetch"
        )
            
    db.query(models.Entrega).filter(models.Entrega.id == entrega_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.Entrega).filter(models.Entrega.id == entrega_id).first()

def delete_entrega(db: Session, entrega_id: int):
    db_entrega = get_entrega(db, entrega_id=entrega_id)
    if db_entrega:
        pedido = db.query(models.Pedido).filter(models.Pedido.id == db_entrega.pedido_id).first()
        if pedido:
            db.query(models.Pedido).filter(models.Pedido.id == pedido.id).update(
                {"preco_total": pedido.preco_total - db_entrega.preco}, synchronize_session="fetch"
            )
        db.delete(db_entrega)
        db.commit()
    return db_entrega
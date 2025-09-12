from sqlalchemy.orm import Session
from .. import models, schemas

# Função para buscar uma lista de todos os telefones de clientes
def get_clientes_telefone(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ClienteTelefone).offset(skip).limit(limit).all()

# Função para buscar um telefone de cliente por ID
def get_cliente_telefone(db: Session, cliente_telefone_id: int):
    return db.query(models.ClienteTelefone).filter(models.ClienteTelefone.id == cliente_telefone_id).first()

# Função para buscar todos os telefones de um cliente específico
def get_cliente_telefones(db: Session, cliente_id: int):
    return db.query(models.ClienteTelefone).filter(models.ClienteTelefone.cliente_id == cliente_id).all()

# Função para criar um novo telefone de cliente
def create_cliente_telefone(db: Session, cliente_telefone: schemas.ClienteTelefoneCreate):
     # ATENÇÃO: Gerenciamento manual do ID para este exemplo.
    # Em um sistema real, o ID viria de um Generator/Sequence.
    last_id = db.query(models.ClienteTelefone.id).order_by(models.ClienteTelefone.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1
    
    # Cria um dicionário dos dados
    telefone_data = cliente_telefone.model_dump()
    
    # Adiciona o ID manualmente
    db_cliente_telefone = models.ClienteTelefone(id=next_id, **telefone_data)
    db.add(db_cliente_telefone)
    db.commit()
    db.refresh(db_cliente_telefone)
    return db_cliente_telefone

def update_cliente_telefone(db: Session, cliente_telefone_id: int, cliente_telefone_data: schemas.ClienteTelefoneUpdate):
    db_cliente_telefone = db.query(models.ClienteTelefone).filter(models.ClienteTelefone.id == cliente_telefone_id).first()
    if db_cliente_telefone is None:
        return None
    
    update_data = cliente_telefone_data.model_dump(exclude_unset=True)
    
    if not update_data:
        return db_cliente_telefone
    
    db.query(models.ClienteTelefone).filter(models.ClienteTelefone.id == cliente_telefone_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.ClienteTelefone).filter(models.ClienteTelefone.id == cliente_telefone_id).first()

def delete_cliente_telefone(db: Session, cliente_telefone_id: int):
    db_cliente_telefone = db.query(models.ClienteTelefone).filter(models.ClienteTelefone.id == cliente_telefone_id).first()
    if db_cliente_telefone:
        db.delete(db_cliente_telefone)
        db.commit()
    return db_cliente_telefone
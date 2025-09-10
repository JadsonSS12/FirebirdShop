from sqlalchemy.orm import Session
from .. import models, schemas

# Função para buscar um cliente por ID
def get_cliente_telefone(db: Session, cliente_telefone_id: int):
    return db.query(models.ClienteTelefone).filter(models.ClienteTelefone.id == cliente_telefone_id).first()

# Função para buscar uma lista de clientes
def get_clientes_telefone(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ClienteTelefone).offset(skip).limit(limit).all()

# Função para criar um novo cliente
def create_cliente_telefone(db: Session, cliente_telefone: schemas.ClienteTelefoneCreate):
     # ATENÇÃO: Gerenciamento manual do ID para este exemplo.
    # Em um sistema real, o ID viria de um Generator/Sequence.
    last_id = db.query(models.ClienteTelefone.id).order_by(models.ClienteTelefone.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1
    
    # Cria um dicionário dos dados
    telefone_data = cliente_telefone.dict()
    
    # Adiciona o ID manualmente
    db_cliente_telefone = models.ClienteTelefone(id=next_id, **telefone_data)
    db.add(db_cliente_telefone)
    db.commit()
    db.refresh(db_cliente_telefone)
    return db_cliente_telefone

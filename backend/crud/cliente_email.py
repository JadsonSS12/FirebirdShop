from sqlalchemy.orm import Session
from .. import models, schemas

# Função para buscar um cliente por ID
def get_cliente_email(db: Session, cliente_email_id: int):
    return db.query(models.ClienteEmail).filter(models.ClienteEmail.id == cliente_email_id).first()

# Função para buscar uma lista de clientes
def get_clientes_email(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ClienteEmail).offset(skip).limit(limit).all()

# Função para criar um novo cliente
def create_cliente_email(db: Session, cliente_email: schemas.ClienteEmailCreate):
     # ATENÇÃO: Gerenciamento manual do ID para este exemplo.
    # Em um sistema real, o ID viria de um Generator/Sequence.
    last_id = db.query(models.ClienteEmail.id).order_by(models.ClienteEmail.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1
    
    # Cria um dicionário dos dados
    email_data = cliente_email.dict()

    # Adiciona o ID manualmente
    db_cliente_email = models.ClienteEmail(id=next_id, **email_data)
    db.add(db_cliente_email)
    db.commit()
    db.refresh(db_cliente_email)
    return db_cliente_email

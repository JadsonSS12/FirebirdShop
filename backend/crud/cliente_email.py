from sqlalchemy.orm import Session
from .. import models, schemas

# Função para buscar uma lista de emails dos clientes
def get_clientes_email(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ClienteEmail).offset(skip).limit(limit).all()

# Função para buscar um email do cliente por ID
def get_cliente_email(db: Session, cliente_email_id: int):
    return db.query(models.ClienteEmail).filter(models.ClienteEmail.id == cliente_email_id).first()

# Função para buscar todos os emails de um cliente específico
def get_cliente_emails(db: Session, cliente_id: int):
    return db.query(models.ClienteEmail).filter(models.ClienteEmail.cliente_id == cliente_id).all()

# Função para criar um novo email de cliente
def create_cliente_email(db: Session, cliente_email: schemas.ClienteEmailCreate):
     # ATENÇÃO: Gerenciamento manual do ID para este exemplo.
    # Em um sistema real, o ID viria de um Generator/Sequence.
    last_id = db.query(models.ClienteEmail.id).order_by(models.ClienteEmail.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1
    
    # Cria um dicionário dos dados
    email_data = cliente_email.model_dump()

    # Adiciona o ID manualmente
    db_cliente_email = models.ClienteEmail(id=next_id, **email_data)
    db.add(db_cliente_email)
    db.commit()
    db.refresh(db_cliente_email)
    return db_cliente_email

def update_cliente_email(db: Session, cliente_email_id: int, cliente_email_data: schemas.ClienteEmailUpdate):
    # Verificar se o email do cliente existe
    db_cliente_email = db.query(models.ClienteEmail).filter(models.ClienteEmail.id == cliente_email_id).first()
    if db_cliente_email is None:
        return None
    
    update_data = cliente_email_data.model_dump(exclude_unset=True)
    
    if not update_data:
        return db_cliente_email
    
    db.query(models.ClienteEmail).filter(models.ClienteEmail.id == cliente_email_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.ClienteEmail).filter(models.ClienteEmail.id == cliente_email_id).first()


def delete_cliente_email(db: Session, cliente_email_id: int):
    db_cliente_email = db.query(models.ClienteEmail).filter(models.ClienteEmail.id == cliente_email_id).first()
    if db_cliente_email:
        db.delete(db_cliente_email)
        db.commit()
    return db_cliente_email

from sqlalchemy.orm import Session
from .. import models, schemas

# Função para buscar um cliente por ID
def get_cliente(db: Session, cliente_id: int):
    return db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()

# Função para buscar uma lista de clientes
def get_clientes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Cliente).offset(skip).limit(limit).all()

# Função para criar um novo cliente
def create_cliente(db: Session, cliente: schemas.ClienteCreate):
    # ATENÇÃO: Gerenciamento manual do ID para este exemplo.
    # Em um sistema real, o ID viria de um Generator/Sequence.
    last_id = db.query(models.Cliente.id).order_by(models.Cliente.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_cliente = models.Cliente(
        id=next_id,
        nome=cliente.nome,
        cpf_cnpj=cliente.cpf_cnpj,
        limite_de_credito=cliente.limite_de_credito,
        cep=cliente.cep,
        estado=cliente.estado,
        cidade=cliente.cidade,
        bairro=cliente.bairro,
        rua=cliente.rua,
        numero=cliente.numero
    )
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente
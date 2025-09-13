from sqlalchemy.orm import Session
from backend import models, schemas

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
        data_cadastro=cliente.data_cadastro,
        pais=cliente.pais,
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

# Função para atualizar um cliente existente
def update_cliente(db: Session, cliente_id: int, cliente_data: schemas.ClienteUpdate):
    # Verificar se o cliente existe
    db_cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if db_cliente is None:
        return None
    
    update_data = cliente_data.model_dump(exclude_unset=True)
    
    if not update_data:
        # Se não houver dados para atualizar, apenas retorne o cliente
        return db_cliente
    
    # Realizar o update diretamente usando a query
    db.query(models.Cliente).filter(models.Cliente.id == cliente_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    # Buscar o objeto atualizado para retornar
    return db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()

# Função para excluir um cliente
def delete_cliente(db: Session, cliente_id: int):
    db_cliente = db.query(models.Cliente).filter(models.Cliente.id == cliente_id).first()
    if db_cliente is None:
        return None
    
    db.delete(db_cliente)
    db.commit()
    return db_cliente
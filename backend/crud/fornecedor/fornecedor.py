from sqlalchemy.orm import Session
from ... import models, schemas

def get_fornecedor(db: Session, fornecedor_id: int):
    return db.query(models.Fornecedor).filter(models.Fornecedor.id == fornecedor_id).first()

def get_fornecedores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Fornecedor).offset(skip).limit(limit).all()

def create_fornecedor(db: Session, fornecedor: schemas.FornecedorCreate):
    last_id = db.query(models.Fornecedor.id).order_by(models.Fornecedor.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_fornecedor = models.Fornecedor(
        id=next_id,
        nome=fornecedor.nome,
        cpf_cnpj=fornecedor.cpf_cnpj,
        pais=fornecedor.pais,
        estado=fornecedor.estado,
        cidade=fornecedor,
        bairro=fornecedor.bairro,
        rua=fornecedor.rua,
        numero=fornecedor.numero,
        cep=fornecedor.cep,
    )

    db.add(db_fornecedor)
    db.commit()
    db.refresh(db_fornecedor)
    return db_fornecedor

def update_fornecedor(db: Session, fornecedor_id: int, fornecedor: schemas.FornecedorUpdate):

    db_fornecedor = get_fornecedor(db, fornecedor_id=fornecedor_id)
    if db_fornecedor is None:
        return None

    update_data = fornecedor.model_dump(exclude_unset=True)

    if not update_data:
        return db_fornecedor

    db.query(models.Fornecedor).filter(models.Fornecedor.id == fornecedor_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.Fornecedor).filter(models.Fornecedor.id == fornecedor_id).first()

def delete_fornecedor(db: Session, fornecedor_id: int):
    db_fornecedor = get_fornecedor(db, fornecedor_id=fornecedor_id)
    if db_fornecedor:
        db.delete(db_fornecedor)
        db.commit()
    return db_fornecedor
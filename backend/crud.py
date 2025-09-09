# crud.py

from sqlalchemy.orm import Session
from . import models, schemas

# Função para buscar um produto por ID
def get_produto(db: Session, produto_id: int):
    return db.query(models.Produto).filter(models.Produto.id == produto_id).first()

# Função para buscar uma lista de produtos
def get_produtos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Produto).offset(skip).limit(limit).all()

# Função para criar um novo produto
def create_produto(db: Session, produto: schemas.ProdutoCreate):
    # ATENÇÃO: Gerenciamento manual do ID para este exemplo.
    # Em um sistema real, o ID viria de um Generator/Sequence.
    last_id = db.query(models.Produto.id).order_by(models.Produto.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_produto = models.Produto(
        id=next_id,
        nome=produto.nome,
        descricao=produto.descricao,
        preco=produto.preco,
        estoque=produto.estoque
    )
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto
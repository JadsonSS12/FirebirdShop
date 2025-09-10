from sqlalchemy.orm import Session
from sqlalchemy import update
from .. import models, schemas

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

def update_produto(db: Session, produto_id: int, produto: schemas.ProdutoCreate):
    # First check if the product exists
    db_produto = get_produto(db, produto_id=produto_id)
    if not db_produto:
        return None
    
    # Get the data from the Pydantic model, excluding None values
    produto_data = produto.model_dump(exclude_unset=True)
    
    if produto_data:  # Only update if there's data to update
        try:
            # Use SQLAlchemy's update() method directly
            stmt = update(models.Produto).where(models.Produto.id == produto_id).values(**produto_data)
            result = db.execute(stmt)
            db.commit()
            
            # Fetch the updated product
            db_produto = get_produto(db, produto_id=produto_id)
        except Exception as e:
            db.rollback()
            raise e
    
    return db_produto
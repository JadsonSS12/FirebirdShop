from sqlalchemy.orm import Session
from ... import models, schemas

def get_produto_traducao(db: Session, produto_traducao_id: int):
    return db.query(models.ProdutoTraducao).filter(models.ProdutoTraducao.id == produto_traducao_id).first()

def get_produtos_traducao(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ProdutoTraducao).offset(skip).limit(limit).all()

def get_produtos_traducoes(db: Session, produto_traducao_id: int):
    return db.query(models.ProdutoTraducao).filter(models.ProdutoTraducao.produto_id == produto_traducao_id).all()

def create_produto_traducao(db: Session, produto_traducao: schemas.ProdutoTraducaoCreate):
    last_id = db.query(models.ProdutoTraducao.id).order_by(models.ProdutoTraducao.id.desc()).first()
    next_id = (last_id[0] if last_id else 0) + 1

    db_produto_traducao = models.ProdutoTraducao(
        id=next_id,
        produto_id=produto_traducao.produto_id,
        nome=produto_traducao.nome,
        descricao=produto_traducao.descricao,
        idioma=produto_traducao.idioma,
    )

    db.add(db_produto_traducao)
    db.commit()
    db.refresh(db_produto_traducao)
    return db_produto_traducao

def update_produto_traducao(db: Session, produto_traducao_id: int, produto_traducao: schemas.ProdutoTraducaoUpdate):

    db_produto_traducao = get_produto_traducao(db, produto_traducao_id=produto_traducao_id)
    if db_produto_traducao is None:
        return None

    update_data = produto_traducao.model_dump(exclude_unset=True)

    if not update_data:
        return db_produto_traducao

    db.query(models.ProdutoTraducao).filter(models.ProdutoTraducao.id == produto_traducao_id).update(
        update_data, synchronize_session="fetch"
    )
    
    db.commit()
    return db.query(models.ProdutoTraducao).filter(models.ProdutoTraducao.id == produto_traducao_id).first()

def delete_produto_traducao(db: Session, produto_traducao_id: int):
    db_produto_traducao = get_produto_traducao(db, produto_traducao_id=produto_traducao_id)
    if db_produto_traducao:
        db.delete(db_produto_traducao)
        db.commit()
    return db_produto_traducao
# main.py

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import crud, models, schemas
from .database import SessionLocal, engine, get_db

# Cria as tabelas no banco de dados (se não existirem)
# Em produção, você usaria uma ferramenta de migração como Alembic.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Firebird com FastAPI",
    description="Exemplo de manipulação de um banco Firebird .fdb com Python.",
    version="1.0.0",
)


@app.post("/produtos/", response_model=schemas.Produto, tags=["Produtos"])
def criar_produto(produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    # Aqui poderíamos verificar se já existe um produto com o mesmo nome, etc.
    return crud.create_produto(db=db, produto=produto)


@app.get("/produtos/", response_model=List[schemas.Produto], tags=["Produtos"])
def ler_produtos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    produtos = crud.get_produtos(db, skip=skip, limit=limit)
    return produtos


@app.get("/produtos/{produto_id}", response_model=schemas.Produto, tags=["Produtos"])
def ler_produto(produto_id: int, db: Session = Depends(get_db)):
    db_produto = crud.get_produto(db, produto_id=produto_id)
    if db_produto is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto

@app.get("/", include_in_schema=False)
def root():
    return {"message": "API conectada ao Firebird! Acesse /docs para ver os endpoints."}
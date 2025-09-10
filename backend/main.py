from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas
from .crud import create_produto, get_produtos, get_produto
from .crud import create_cliente, get_clientes, get_cliente
from .database import engine, get_db

# Cria as tabelas no banco de dados (se não existirem)
# Em produção, você usaria uma ferramenta de migração como Alembic.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Firebird com FastAPI",
    description="Exemplo de manipulação de um banco Firebird .fdb com Python.",
    version="1.0.0",
)

# Endpoints para produtos
@app.post("/produtos/", response_model=schemas.Produto, tags=["Produtos"])
def criar_produto(produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    # Aqui poderíamos verificar se já existe um produto com o mesmo nome, etc.
    return create_produto(db=db, produto=produto)

@app.get("/produtos/", response_model=List[schemas.Produto], tags=["Produtos"])
def ler_produtos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    produtos = get_produtos(db, skip=skip, limit=limit)
    return produtos

@app.get("/produtos/{produto_id}", response_model=schemas.Produto, tags=["Produtos"])
def ler_produto(produto_id: int, db: Session = Depends(get_db)):
    db_produto = get_produto(db, produto_id=produto_id)
    if db_produto is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto

# Endpoints para clientes
@app.post("/clientes/", response_model=schemas.Cliente, tags=["Clientes"])
def criar_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    return create_cliente(db=db, cliente=cliente)

@app.get("/clientes/", response_model=List[schemas.Cliente], tags=["Clientes"])
def ler_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clientes = get_clientes(db, skip=skip, limit=limit)
    return clientes

@app.get("/clientes/{cliente_id}", response_model=schemas.Cliente, tags=["Clientes"])
def ler_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = get_cliente(db, cliente_id=cliente_id)
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return db_cliente

@app.get("/", include_in_schema=False)
def root():
    return {"message": "API conectada ao Firebird! Acesse /docs para ver os endpoints."}
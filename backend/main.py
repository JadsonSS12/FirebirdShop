from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas
from .crud import create_produto, get_produtos, get_produto, update_produto
from .crud import create_cliente, get_clientes, get_cliente
from .crud import create_cliente_email, get_clientes_email, get_cliente_email, get_cliente_emails
from .crud import create_cliente_telefone, get_clientes_telefone, get_cliente_telefone, get_cliente_telefones
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

@app.patch("/produtos/{produto_id}", response_model=schemas.Produto, tags=["Produtos"])
def atualizar_produto(produto_id: int, produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    db_produto = update_produto(db, produto_id=produto_id, produto=produto)
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

# Endpoints para clientes-telefone
@app.post("/clientes-telefone/", response_model=schemas.ClienteTelefone, tags=["Clientes-telefone"])
def criar_cliente_telefone(cliente_telefone: schemas.ClienteTelefoneCreate, db: Session = Depends(get_db)):
    return create_cliente_telefone(db=db, cliente_telefone=cliente_telefone)

@app.get("/clientes-telefone/", response_model=List[schemas.ClienteTelefone], tags=["Clientes-telefone"])
def ler_clientes_telefone(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clientes = get_clientes_telefone(db, skip=skip, limit=limit)
    return clientes

@app.get("/clientes-telefone-id/{cliente_telefone_id}", response_model=schemas.ClienteTelefone, tags=["Clientes-telefone"])
def ler_cliente_telefone(cliente_telefone_id: int, db: Session = Depends(get_db)):
    db_cliente_telefone = get_cliente_telefone(db, cliente_telefone_id=cliente_telefone_id)
    if db_cliente_telefone is None:
        raise HTTPException(status_code=404, detail="Telefone não encontrado")
    return db_cliente_telefone

@app.get("/clientes-telefone-cliente/{cliente_id}", response_model=List[schemas.ClienteTelefone], tags=["Clientes-telefone"])
def ler_cliente_telefones(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente_telefones = get_cliente_telefones(db, cliente_id=cliente_id)
    if db_cliente_telefones is None:
        raise HTTPException(status_code=404, detail="Telefones não encontrados")
    return db_cliente_telefones

# Endpoints para clientes
@app.post("/clientes-email/", response_model=schemas.ClienteEmail, tags=["Clientes-email"])
def criar_cliente_email(cliente_email: schemas.ClienteEmailCreate, db: Session = Depends(get_db)):
    return create_cliente_email(db=db, cliente_email=cliente_email)

@app.get("/clientes-email/", response_model=List[schemas.ClienteEmail], tags=["Clientes-email"])
def ler_clientes_email(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clientes = get_clientes_email(db, skip=skip, limit=limit)
    return clientes

@app.get("/clientes-email-id/{cliente_email_id}", response_model=schemas.ClienteEmail, tags=["Clientes-email"])
def ler_cliente_email(cliente_email_id: int, db: Session = Depends(get_db)):
    db_cliente_email = get_cliente_email(db, cliente_email_id=cliente_email_id)
    if db_cliente_email is None:
        raise HTTPException(status_code=404, detail="Email não encontrado")
    return db_cliente_email

@app.get("/clientes-email-cliente/{cliente_id}", response_model=List[schemas.ClienteEmail], tags=["Clientes-email"])
def ler_cliente_email(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente_email = get_cliente_emails(db, cliente_id=cliente_id)
    if db_cliente_email is None:
        raise HTTPException(status_code=404, detail="Email não encontrado")
    return db_cliente_email


@app.get("/reset-db/")
def reset_db():
    try:
        engine.dispose()
        
        from sqlalchemy import create_engine
        from .database import SQLALCHEMY_DATABASE_URL
        reset_engine = create_engine(SQLALCHEMY_DATABASE_URL)
        models.Base.metadata.drop_all(bind=reset_engine)
        models.Base.metadata.create_all(bind=reset_engine)
        reset_engine.dispose()
        
        return {"message": "Database has been reset successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting database: {str(e)}")

@app.get("/", include_in_schema=False)
def root():
    return {"message": "API conectada ao Firebird! Acesse /docs para ver os endpoints."}
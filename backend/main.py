from fastapi import FastAPI, HTTPException
from . import models
from .database import engine
from .api.router import api_router
from fastapi.middleware.cors import CORSMiddleware

# Cria as tabelas no banco de dados (se não existirem)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Firebird com FastAPI",
    description="Exemplo de manipulação de um banco Firebird .fdb com Python.",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",  # A porta padrão do React com Vite
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Lista de origens permitidas
    allow_credentials=True,       # Permite cookies de credenciais
    allow_methods=["*"],          # Permite todos os métodos (GET, POST, PUT, etc.)
    allow_headers=["*"],          # Permite todos os cabeçalhos
)

# Inclui todas as rotas da API
app.include_router(api_router)

@app.get("/reset-db/")
def reset_db():
    try:
        from .reset_db import reset_database
        result = reset_database()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting database: {str(e)}")

@app.get("/", include_in_schema=False)
def root():
    return {"message": "API conectada ao Firebird! Acesse /docs para ver os endpoints."}
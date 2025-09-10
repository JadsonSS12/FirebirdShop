from fastapi import FastAPI, HTTPException
from . import models
from .database import engine
from .api.router import api_router

# Cria as tabelas no banco de dados (se não existirem)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Firebird com FastAPI",
    description="Exemplo de manipulação de um banco Firebird .fdb com Python.",
    version="1.0.0",
)

# Inclui todas as rotas da API
app.include_router(api_router)

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
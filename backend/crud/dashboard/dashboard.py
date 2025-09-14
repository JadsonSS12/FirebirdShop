# No seu arquivo de crud (ex: backend/crud/crud_dashboard.py)
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from ... import models # Supondo que você tenha modelos para Venda, Despesa, etc.

def get_dashboard_kpis(db: Session):

    today = datetime.now()
    
    # contagem de totais gerais
    total_produtos = db.query(func.count(models.produto.Produto.id)).scalar() or 0.0

    total_pedidos = db.query(func.count(models.pedido.Pedido.id)).scalar() or 0.0

    total_clientes = db.query(func.count(models.cliente.Cliente.id)).scalar() or 0.0

    total_entregas =db.query(func.count(models.entrega.Entrega.id)).scalar() or 0.0

    return {
        "total_produtos": total_produtos,
        "total_pedidos": total_pedidos,
        "total_clientes": total_clientes,
        "total_entregas": total_entregas
    }
from pydantic import BaseModel
from decimal import Decimal

class DashboardKPIs(BaseModel):
    total_produtos: Decimal
    total_pedidos: Decimal
    total_clientes: Decimal
    total_entregas: Decimal

    class Config:
        from_attributes = True
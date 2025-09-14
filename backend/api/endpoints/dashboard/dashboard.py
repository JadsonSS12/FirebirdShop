from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ....schemas.dashboard import dashboard as dashboard_schema
from ....crud.dashboard import dashboard as dashboard_crud
from ....database import get_db

router = APIRouter()

# Use o apelido para acessar a classe DashboardKPIs
@router.get("/dashboard/kpis", response_model=dashboard_schema.DashboardKPIs)
def read_dashboard_kpis(db: Session = Depends(get_db)):
    kpis = dashboard_crud.get_dashboard_kpis(db=db)
    return kpis
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KpiCard from '../components/KsiCard';
import './DashboardPage.css';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaReceipt, FaBoxOpen, FaUserFriends, FaTruck } from 'react-icons/fa';
import ActionButton from '../components/ActionButton';


// Interface para os dados que virão da API
interface DashboardData {
  total_produtos: number;
  total_pedidos: number;
  total_clientes: number;
  total_entregas: number;
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os dados da API
    axios.get<DashboardData>('http://127.0.0.1:8000/dashboard/kpis')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados do dashboard:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Carregando dashboard...</p>;
  }

  if (!data) {
    return <p>Não foi possível carregar os dados.</p>;
  }

  return (
        <div className="dashboard-layout">
      <div className="content-wrapper">
        <main className="main-content">
          {loading && <p>Carregando...</p>}
          {data && (
            <>
              <div className="kpi-grid">
                <KpiCard title="Produtos" value={data.total_produtos} color="teal" />
                <KpiCard title="Pedidos no mês" value={data.total_pedidos} color="green" />
                <KpiCard title="Clientes no mês" value={data.total_clientes} color="yellow" />
                <KpiCard title="Entregas no mês" value={data.total_entregas} color="red" />
              </div>

              <div className="action-grid">
                <Link to="/produtos">
                  <ActionButton label="Produtos" icon={<FaBoxOpen />} />
                </Link>
                <Link to="/cliente">
                  <ActionButton label="Cliente" icon={<FaUserFriends />} />
                </Link>
                <Link to="/fornecedores">
                  <ActionButton label="Fornecedor" icon={<FaTruck />} />
                </Link>
                <Link to="/pedidos">
                  <ActionButton label="Pedido" icon={<FaShoppingCart />} />
                </Link>
              </div>

              <div className="upgrade-banner">
                {/* Conteúdo do banner de upgrade aqui */}
              </div>
            </>
          )}
        </main>
      </div>
    </div>

  );
};

export default DashboardPage;
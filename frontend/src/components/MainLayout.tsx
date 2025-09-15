import React from 'react';
import { FaBoxOpen, FaClipboardList, FaShippingFast, FaTachometerAlt, FaTruck, FaUserFriends, FaWarehouse, FaReceipt } from 'react-icons/fa';
import { NavLink, Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
       <aside className="sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" title="Dashboard">
                <FaTachometerAlt size={22} />
              </NavLink>
            </li>
            <li>
              <NavLink to="/produtos" title="Produtos">
                <FaBoxOpen size={22} />
              </NavLink>
            </li>
            <li>
              <NavLink to="/cliente" title="Clientes">
                <FaUserFriends size={22} />
              </NavLink>
            </li>
            <li>
              <NavLink to="/pedidos" title="Pedidos">
                <FaClipboardList size={22} />
              </NavLink>
            </li>
            <li>
              <NavLink to="/fornecedores" title="Fornecedores">
                <FaTruck size={22} />
              </NavLink>
            </li>
            <li>
              <NavLink to="/entregas" title="Entregas">
                <FaShippingFast size={22} />
              </NavLink>
            </li>
            <li>
              <NavLink to="/armazem" title="Armazém">
                <FaWarehouse size={22} />
              </NavLink>
            </li>
            <li>
              <NavLink to="/estoque" title="Estoque">
                <FaReceipt size={22} />
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main className="main-content">
        {/* O Outlet é onde o componente da rota atualserá renderizado */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
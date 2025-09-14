// src/components/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Importe o Outlet

const MainLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        {/* barra lateral */}
      </aside>
      
      <main className="main-content">
        {/* O Outlet é onde o componente da rota atualserá renderizado */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
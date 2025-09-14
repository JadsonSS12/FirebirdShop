import React from 'react';
// 1. Importe os componentes de roteamento
import { Routes, Route, Link } from 'react-router-dom';

// 2. Importe suas páginas (componentes)
import DashboardPage from './pages/DashboardPage'; // Certifique-se que o caminho está correto
import './App.css';

// Vamos criar um componente simples para a página inicial como exemplo
const HomePage: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Página Inicial</h1>
        <nav>
          {/* O componente <Link> é a forma correta de criar links de navegação */}
          <Link to="/dashboard">Ir para o Dashboard</Link>
        </nav>
      </header>
    </div>
  );
};

// O componente App agora define a estrutura das rotas
const App: React.FC = () => {
  return (
    <div>
      {/* O componente <Routes> funciona como um switch,
          ele renderiza o primeiro <Route> que corresponder à URL atual. */}
      <Routes>
        {/* Rota para a página inicial */}
        <Route path="/" element={<HomePage />} />
        
        {/* Rota para a sua página de dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Você pode adicionar outras rotas aqui, como /produtos, /clientes, etc. */}
        {/* <Route path="/produtos" element={<ProdutosPage />} /> */}
      </Routes>
    </div>
  );
};

export default App;


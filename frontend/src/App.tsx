import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ClientsPage from './pages/ClientsPage'; 
/*import ProductsPage from './pages/ProductsPage';
import SuppliersPage from './pages/SuppliersPage';*/
import DashboardPage from './pages/DashboardPage';
import MainLayout from './components/MainLayout';
import './App.css';
import AddClientPage from './pages/AddClientPage';
import EditClientPage from './pages/EditClientPage';

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
        <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        
        {/* Rota para a sua página de dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cliente" element={<ClientsPage />} />
        <Route path="/cliente/novo" element={<AddClientPage />} />
        <Route path="/clientes/editar/:id" element={<EditClientPage />} />
        {/*<Route path="/produtos" element={<ProductsPage />} />
        <Route path="/fornecedores" element={<SuppliersPage />} />*/}
        </Route>
      </Routes>
    </div>
  );
};

export default App;


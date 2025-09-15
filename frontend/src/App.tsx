import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ClientsPage from "./pages/ClientsPage";
import ProductPage from "./pages/ProductPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import DashboardPage from "./pages/DashboardPage";
import MainLayout from "./components/MainLayout";
import "./App.css";
import AddClientPage from "./pages/AddClientPage";
import EditClientPage from "./pages/EditClientPage";
import HomePage from "./pages/HomePage";


// O componente App agora define a estrutura das rotas
const App: React.FC = () => {
  return (
    <div>
      <Routes>
          <Route path="/" element={<HomePage />} />




          <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cliente" element={<ClientsPage />} />
          <Route path="/cliente/novo" element={<AddClientPage />} />
          <Route path="/clientes/editar/:id" element={<EditClientPage />} />
          <Route path="/produtos" element={<ProductPage />} />
          <Route path="/produtos/novo" element={<AddProductPage />} />
          <Route path="/produtos/editar/:id" element={<EditProductPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

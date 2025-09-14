import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// 1. ATUALIZE A INTERFACE para corresponder ao backend
interface Product {
  id: number;
  fornecedor_id: number;
  status: string;
  preco_venda: number; // TypeScript geralmente usa 'number' para Decimal
  data_garantia: string;
  nome: string // Datas geralmente vêm como strings da API
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // O endpoint /produto/ deve retornar uma LISTA de produtos
    const apiUrl = 'http://127.0.0.1:8000/produto/'; 

    axios.get<Product[]>(apiUrl)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados da API:", error);
        setError("Não foi possível carregar os produtos.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Produtos FirebirdShop</h1>
        <ul>
          {/* 2. EXIBA DADOS QUE EXISTEM, por exemplo, o status e o preço */}
          {products.map(produto => (
            <li key={produto.id}>
              Nome: {produto.nome} - Status: {produto.status} - Preço: R$ {produto.preco_venda}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
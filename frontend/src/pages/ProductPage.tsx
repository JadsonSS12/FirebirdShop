// frontend/src/pages/ProductPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import { Link, useNavigate } from "react-router-dom";
import "./CrudPage.css";

interface Product {
  id: number;
  nome: string;
  preco_venda: number;
  preco_minimo: number;
  status: string;
  data_garantia: string;
  fornecedor_id: number;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const handleEdit = (id: number) => {
    navigate(`/produtos/editar/${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      axios
        .delete(`http://127.0.0.1:8000/produto/${id}`)
        .then(() => {
          setProducts(products.filter((product) => product.id !== id));
        })
        .catch((error) => console.error("Erro ao deletar produto:", error));
    }
  };

  useEffect(() => {
    axios
      .get<Product[]>("http://127.0.0.1:8000/produto/")
      .then((response) => setProducts(response.data));
  }, []);

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Preço Venda", accessor: "preco_venda" },
    { header: "Preço Mínimo", accessor: "preco_minimo" },
    { header: "Status", accessor: "status" },
    { header: "Data Garantia", accessor: "data_garantia" },
    { header: "Fornecedor", accessor: "fornecedor_id" },
  ];

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Produtos</h1>
        <div className="header-actions">
          <Link to="/produtos/novo">
            <button className="btn-primary">Adicionar Produto</button>
          </Link>
        </div>
      </header>
    
      <div className="table-container">
        <DataTable
          columns={columns}
          data={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ProductPage;

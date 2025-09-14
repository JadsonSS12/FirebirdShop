// frontend/src/pages/AddProductPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CrudPage.css";

const initialFormState = {
  nome: "",
  preco_venda: 0,
  preco_minimo: 0,
  status: "",
  data_garantia: "",
  fornecedor_id: 0,
};

const AddProductPage: React.FC = () => {
  const [formData, setFormData] = useState(initialFormState);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        name === "preco_venda" ||
        name === "preco_minimo" ||
        name === "fornecedor_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    axios
      .post("http://127.0.0.1:8000/produto/", formData)
      .then(() => {
        navigate("/produtos");
      })
      .catch((error) => {
        alert(
          `Erro ao adicionar produto: ${
            error.response?.data?.detail || error.message
          }`
        );
      });
  };

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Adicionar Novo Produto</h1>
      </header>
      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="preco_venda">Preço de Venda</label>
            <input
              id="preco_venda"
              name="preco_venda"
              type="number"
              step="0.01"
              value={formData.preco_venda}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="preco_minimo">Preço Mínimo</label>
            <input
              id="preco_minimo"
              name="preco_minimo"
              type="number"
              step="0.01"
              value={formData.preco_minimo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <input
              id="status"
              name="status"
              type="text"
              value={formData.status}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="data_garantia">Data Garantia</label>
            <input
              id="data_garantia"
              name="data_garantia"
              type="date"
              value={formData.data_garantia}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fornecedor_id">Fornecedor ID</label>
            <input
              id="fornecedor_id"
              name="fornecedor_id"
              type="number"
              value={formData.fornecedor_id}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn-primary">
          Salvar Produto
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;

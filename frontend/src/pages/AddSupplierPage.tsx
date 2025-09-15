import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CrudPage.css";

interface Fornecedor {
  nome: string;
  cpf_cnpj: string;
  pais: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  cep: string;
}

const initialFormState: Fornecedor = {
  nome: "",
  cpf_cnpj: "",
  pais: "Brasil",
  estado: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: "",
  cep: "",
};

const AddSupplierPage: React.FC = () => {
  const [formData, setFormData] = useState<Fornecedor>(initialFormState);
  const [loading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.nome.trim()) {
      alert("Por favor, informe o nome do fornecedor.");
      return;
    }
    if (!formData.cpf_cnpj.trim()) {
      alert("Por favor, informe CPF/CNPJ.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/fornecedor/", formData);
      navigate("/fornecedores");
    } catch (error: any) {
      alert(`Erro ao criar fornecedor: ${error.response?.data?.detail || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="crud-page">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Criar Novo Fornecedor</h1>
      </header>

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="cpf_cnpj">CPF / CNPJ</label>
            <input id="cpf_cnpj" name="cpf_cnpj" value={formData.cpf_cnpj} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="pais">País</label>
            <input id="pais" name="pais" value={formData.pais} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <input id="estado" name="estado" value={formData.estado} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="cidade">Cidade</label>
            <input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="bairro">Bairro</label>
            <input id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="rua">Rua</label>
            <input id="rua" name="rua" value={formData.rua} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="numero">Número</label>
            <input id="numero" name="numero" value={formData.numero} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="cep">CEP</label>
            <input id="cep" name="cep" value={formData.cep} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate("/fornecedores")}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Criar Fornecedor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplierPage;
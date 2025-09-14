// frontend/src/pages/AddClientPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CrudPage.css';

// Estrutura do formulário, baseada no seu Pydantic Schema
const initialFormState = {
    nome: '',
    cpf_cnpj: '',
    limite_de_credito: 0,
    pais: 'Brasil', // Valor padrão
    data_cadastro: new Date().toISOString().split('T')[0],
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
};

const AddClientPage: React.FC = () => {
  const [formData, setFormData] = useState(initialFormState);
  const navigate = useNavigate();

  // Função genérica para a mudança em qualquer input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    axios.post('http://127.0.0.1:8000/cliente/', formData)
    .then(() => {
      navigate('/cliente');
    })
    .catch(error => {
        console.error("Erro ao adicionar cliente:", error);
        // Opcional: Mostrar um alerta para o usuário
        alert(`Erro ao adicionar cliente: ${error.response?.data?.detail || error.message}`);
    });
  };

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Adicionar Novo Cliente</h1>
      </header>
      
      <form className="crud-form" onSubmit={handleSubmit}>
        {/* Usaremos um grid para organizar o formulário */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
            <input id="cpf_cnpj" name="cpf_cnpj" type="text" value={formData.cpf_cnpj} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="limite_de_credito">Limite de Crédito</label>
            <input id="limite_de_credito" name="limite_de_credito" type="number" step="0.01" value={formData.limite_de_credito} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="cep">CEP</label>
            <input id="cep" name="cep" type="text" value={formData.cep} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="rua">Rua</label>
            <input id="rua" name="rua" type="text" value={formData.rua} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="numero">Número</label>
            <input id="numero" name="numero" type="text" value={formData.numero} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="bairro">Bairro</label>
            <input id="bairro" name="bairro" type="text" value={formData.bairro} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label htmlFor="cidade">Cidade</label>
            <input id="cidade" name="cidade" type="text" value={formData.cidade} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <input id="estado" name="estado" type="text" value={formData.estado} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="pais">País</label>
            <input id="pais" name="pais" type="text" value={formData.pais} onChange={handleChange} required />
          </div>

          <div className="form-group full-width">
            <label htmlFor="complemento">Complemento</label>
            <input id="complemento" name="complemento" type="text" value={formData.complemento} onChange={handleChange} />
          </div>
        </div>
        
        <button type="submit" className="btn-primary">Salvar Cliente</button>
      </form>
    </div>
  );
};

export default AddClientPage;
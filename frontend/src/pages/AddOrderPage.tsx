import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CrudPage.css";

interface Cliente {
  id: number;
  nome: string;
}

const initialFormState = {
  cliente_id: 0,
  data_pedido: "",
  data_prazo_entrega: "",
  modo_encomenda: "Presencial" as "Presencial" | "Online",
  status: "",
  preco_total: 0,
};

const AddOrderPage: React.FC = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/cliente/");
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        name === "cliente_id" || name === "preco_total"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.cliente_id || formData.cliente_id === 0) {
      alert("Por favor, selecione um cliente");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/pedido/", formData);
      navigate("/pedidos");
    } catch (error: any) {
      alert(
        `Erro ao criar pedido: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="crud-page">
        <div>Carregando clientes...</div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <header className="page-header">
        <h1>Criar Novo Pedido</h1>
      </header>
      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="cliente_id">Cliente</label>
            <select
              id="cliente_id"
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
              required
            >
              <option value={0}>Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="data_pedido">Data do Pedido</label>
            <input
              id="data_pedido"
              name="data_pedido"
              type="date"
              value={formData.data_pedido}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="data_prazo_entrega">Prazo de Entrega</label>
            <input
              id="data_prazo_entrega"
              name="data_prazo_entrega"
              type="date"
              value={formData.data_prazo_entrega}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="modo_encomenda">Modo da Encomenda</label>
            <select
              id="modo_encomenda"
              name="modo_encomenda"
              value={formData.modo_encomenda}
              onChange={handleChange}
              required
            >
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <input
              id="status"
              name="status"
              type="text"
              value={formData.status}
              onChange={handleChange}
              placeholder="Ex: Pendente, Em Andamento, Concluído"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="preco_total">Preço Total</label>
            <input
              id="preco_total"
              name="preco_total"
              type="number"
              step="0.01"
              value={formData.preco_total}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate("/pedidos")}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Criar Pedido
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrderPage;
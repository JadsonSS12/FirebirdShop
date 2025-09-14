import React from 'react';
import './KsiCard.css';
import { FaArrowUp } from 'react-icons/fa';


interface KpiCardProps {
  title: string;
  value: number;
  color: 'teal' | 'green' | 'yellow' | 'red';
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const KpiCard: React.FC<KpiCardProps> = ({ title, value, color }) => {
  const iconColor = color === 'red' ? '#D32F2F' : '#4CAF50';

  return (
    <div className={`kpi-card ${color}`}>
      <span className="card-title">{title}</span>
      <span className="card-value">{currencyFormatter.format(value)}</span>
      <div className="card-icon">
        <FaArrowUp size={18} color={iconColor} />
      </div>
    </div>
  );
};

export default KpiCard;
import React from 'react';
import './ActionButton.css';

interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, icon }) => {
  return (
    <button className="action-button">
      <div className="action-icon">{icon}</div>
      <span className="action-label">{label}</span>
    </button>
  );
};

export default ActionButton;
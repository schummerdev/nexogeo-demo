import React from 'react';
import './DashboardLayout.css';

const Header = ({ title, subtitle }) => {
  // Busca informações do usuário do localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userName = userData.nome || 'Administrador';

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-titles">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        
        <div className="header-user-info">
          <div className="user-avatar">
            <span className="user-initial">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="user-details">
            <span className="user-greeting">Olá, {userName}</span>
            <span className="user-role">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
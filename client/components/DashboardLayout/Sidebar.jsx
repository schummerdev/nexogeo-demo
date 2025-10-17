import React from 'react';
import { NavLink } from 'react-router-dom';
import './DashboardLayout.css';

const Sidebar = () => {
  const handleLogout = () => {
    // Remove o token de autenticação
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Redireciona para a tela de login
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* <img src="/logo-emissora.png" alt="Logo" className="sidebar-logo" /> */}
        <h2 className="sidebar-title">🎯 NexoGeo</h2>
        <p className="sidebar-subtitle">Painel Administrativo</p>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" end className="nav-item">
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>
        
        <NavLink to="/dashboard/promocoes" className="nav-item">
          <span className="nav-icon">🎁</span>
          Promoções
        </NavLink>
        
        <NavLink to="/dashboard/participantes" className="nav-item">
          <span className="nav-icon">👥</span>
          Participantes
        </NavLink>
        
        <NavLink to="/dashboard/gerador-links" className="nav-item">
          <span className="nav-icon">🔗</span>
          Gerador de Links
        </NavLink>
        
        <NavLink to="/dashboard/sorteio" className="nav-item">
          <span className="nav-icon">🎲</span>
          Módulo de Sorteio
        </NavLink>
        
        <NavLink to="/dashboard/configuracoes" className="nav-item">
          <span className="nav-icon">⚙️</span>
          Configurações
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <span className="logout-icon">🚪</span>
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 
import React from 'react';
import Header from '../components/DashboardLayout/Header';
import './DashboardPages.css';

const DashboardHomePage = () => {
  return (
    <>
      <Header 
        title="Dashboard" 
        subtitle="Visão geral do sistema de promoções"
      />
      
      <div className="dashboard-content">
        {/* Cards de KPIs */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon">📊</div>
            <div className="kpi-content">
              <h3 className="kpi-value">0</h3>
              <p className="kpi-label">Total de Promoções</p>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <h3 className="kpi-value">0</h3>
              <p className="kpi-label">Total de Participantes</p>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-icon">🎯</div>
            <div className="kpi-content">
              <h3 className="kpi-value">0</h3>
              <p className="kpi-label">Promoções Ativas</p>
            </div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-icon">📈</div>
            <div className="kpi-content">
              <h3 className="kpi-value">0</h3>
              <p className="kpi-label">Participações Hoje</p>
            </div>
          </div>
        </div>

        {/* Área de Gráficos */}
        <div className="charts-section">
          <div className="chart-card">
            <h3 className="chart-title">Participações por Hora (Últimas 24h)</h3>
            <div className="chart-placeholder">
              <p>📊 Gráfico de participações será implementado aqui</p>
            </div>
          </div>
          
          <div className="chart-card">
            <h3 className="chart-title">Origem dos Cadastros</h3>
            <div className="chart-placeholder">
              <p>🥧 Gráfico de pizza será implementado aqui</p>
            </div>
          </div>
        </div>

        {/* Área de Ações Rápidas */}
        <div className="quick-actions">
          <h3 className="section-title">Ações Rápidas</h3>
          <div className="actions-grid">
            <button className="action-button">
              <span className="action-icon">➕</span>
              Nova Promoção
            </button>
            <button className="action-button">
              <span className="action-icon">🔗</span>
              Gerar Link
            </button>
            <button className="action-button">
              <span className="action-icon">📊</span>
              Ver Relatórios
            </button>
            <button className="action-button">
              <span className="action-icon">🎲</span>
              Realizar Sorteio
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHomePage; 
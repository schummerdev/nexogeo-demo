import React from 'react';
import Header from '../components/DashboardLayout/Header';
import './DashboardPages.css';

const PromocoesPage = () => {
  return (
    <>
      <Header 
        title="Gerenciar Promoções" 
        subtitle="Crie, edite e gerencie suas campanhas de promoção"
      />
      
      <div className="promocoes-content">
        {/* Barra de Ações */}
        <div className="actions-bar">
          <button className="btn-primary">
            <span className="btn-icon">➕</span>
            Nova Promoção
          </button>
          
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Buscar promoções..." 
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* Tabela de Promoções */}
        <div className="table-container">
          <table className="promocoes-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Data Início</th>
                <th>Data Fim</th>
                <th>Status</th>
                <th>Participantes</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="empty-state">
                <td colSpan="7">
                  <div className="empty-message">
                    <span className="empty-icon">📭</span>
                    <p>Nenhuma promoção encontrada</p>
                    <p className="empty-subtitle">
                      Crie sua primeira promoção para começar!
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="pagination">
          <button className="pagination-btn" disabled>
            ← Anterior
          </button>
          <span className="pagination-info">
            Página 1 de 1
          </span>
          <button className="pagination-btn" disabled>
            Próxima →
          </button>
        </div>
      </div>
    </>
  );
};

export default PromocoesPage; 
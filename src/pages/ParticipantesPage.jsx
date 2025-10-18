import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/DashboardLayout/Header';
import ConfirmModal from '../components/DashboardLayout/ConfirmModal';
import EditParticipanteModal from '../components/EditParticipanteModal';
import './DashboardPages.css';
import { fetchParticipantes, deleteParticipante, updateParticipante } from '../services/participanteService';
import { fetchPromocoes } from '../services/promocaoService';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { auditHelpers } from '../services/auditService';
import ExcelJS from 'exceljs';

const ParticipantesPage = () => {
  const { showToast } = useToast();
  const { 
    canViewParticipants, 
    canExportData, 
    canDeletePromotion,
    userRole 
  } = useAuth();
  
  const [participantes, setParticipantes] = useState([]);
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterPromocao, setFilterPromocao] = useState('todas');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [participanteToDelete, setParticipanteToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [participanteToEdit, setParticipanteToEdit] = useState(null);

  // Buscar participantes e promoções ao carregar o componente
  useEffect(() => {
    let isMounted = true; // Flag para evitar setState após unmount

    const loadData = async () => {
      try {
        setLoading(true);

        // Buscar participantes
        const participantesData = await fetchParticipantes();

        if (!isMounted) return; // Cancelar se componente foi desmontado

        // Ajustar os nomes dos campos para corresponder ao frontend
        const formattedParticipantes = (participantesData || []).map(participante => ({
          id: participante.id,
          nome: participante.nome,
          telefone: participante.telefone,
          bairro: participante.bairro,
          cidade: participante.cidade,
          email: participante.email,
          latitude: participante.latitude,
          longitude: participante.longitude,
          promocao_id: participante.promocao_id,
          promocao: participante.promocao_nome || participante.promocao,
          dataParticipacao: participante.participou_em || participante.data_participacao
        }));
        setParticipantes(formattedParticipantes);

        // Buscar promoções para o filtro
        const promocoesData = await fetchPromocoes();
        if (!isMounted) return; // Cancelar se componente foi desmontado

        setPromocoes(promocoesData);
      } catch (err) {
        if (!isMounted) return; // Cancelar se componente foi desmontado
        setError('Falha ao carregar dados');
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function para evitar setState em componente desmontado
    return () => {
      isMounted = false;
    };
  }, []);

  // Função para filtrar participantes
  const filteredParticipantes = useMemo(() => {
    return participantes.filter(participante => {
      // Filtro por texto (nome, telefone, bairro, cidade)
      const matchesSearch = 
        !searchText || 
        participante.nome.toLowerCase().includes(searchText.toLowerCase()) ||
        participante.telefone.toLowerCase().includes(searchText.toLowerCase()) ||
        participante.bairro.toLowerCase().includes(searchText.toLowerCase()) ||
        participante.cidade.toLowerCase().includes(searchText.toLowerCase());
      
      // Filtro por promoção
      const matchesPromocao = 
        filterPromocao === 'todas' || 
        participante.promocao === filterPromocao;
      
      return matchesSearch && matchesPromocao;
    });
  }, [participantes, searchText, filterPromocao]);

  const handleDeleteParticipante = (participanteId) => {
    const participante = participantes.find(p => p.id === participanteId);
    setParticipanteToDelete({ id: participanteId, nome: participante?.nome || 'este participante' });
    setShowConfirmModal(true);
  };

  const confirmDeleteParticipante = async () => {
    if (!participanteToDelete) return;
    
    try {
      await deleteParticipante(participanteToDelete.id);
      // Atualizar a lista local após exclusão bem-sucedida
      setParticipantes(prev => prev.filter(p => p.id !== participanteToDelete.id));
      showToast('Participante excluído com sucesso!', 'success');
    } catch (err) {
      showToast('Falha ao excluir participante: ' + err.message, 'error');
      console.error(err);
    } finally {
      setShowConfirmModal(false);
      setParticipanteToDelete(null);
    }
  };

  const handleEditParticipante = (participante) => {
    setParticipanteToEdit(participante);
    setShowEditModal(true);
  };

  const handleSaveParticipante = async (updatedData) => {
    try {
      await updateParticipante(updatedData.id, updatedData);
      
      // Atualizar a lista local
      setParticipantes(prev => prev.map(p => 
        p.id === updatedData.id 
          ? { ...p, ...updatedData }
          : p
      ));
      
      setShowEditModal(false);
      setParticipanteToEdit(null);
      showToast('Participante atualizado com sucesso!', 'success');
    } catch (error) {
      showToast('Falha ao atualizar participante: ' + error.message, 'error');
      throw error; // Para o modal saber que houve erro
    }
  };

  const handleExportData = async () => {
    try {
      console.log('Iniciando exportação de dados');
      console.log('Número de participantes filtrados:', filteredParticipantes.length);
      console.log('Primeiros 3 participantes:', filteredParticipantes.slice(0, 3));
      
      // Preparar os dados para exportação
      const exportData = filteredParticipantes.map(participante => ({
        'Nome': participante.nome,
        'Telefone': participante.telefone,
        'Bairro': participante.bairro,
        'Cidade': participante.cidade,
        'Promoção': participante.promocao,
        'Data de Participação': participante.dataParticipacao && !isNaN(new Date(participante.dataParticipacao)) 
          ? new Date(participante.dataParticipacao).toLocaleDateString('pt-BR')
          : 'Data inválida'
      }));
      
      console.log('Dados preparados para exportação:', exportData.slice(0, 3));

      // Criar workbook com ExcelJS
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Participantes');
      
      // Definir colunas com larguras
      worksheet.columns = [
        { header: 'Nome', key: 'Nome', width: 20 },
        { header: 'Telefone', key: 'Telefone', width: 15 },
        { header: 'Bairro', key: 'Bairro', width: 15 },
        { header: 'Cidade', key: 'Cidade', width: 15 },
        { header: 'Promoção', key: 'Promoção', width: 20 },
        { header: 'Data de Participação', key: 'Data de Participação', width: 15 }
      ];
      
      // Adicionar dados
      worksheet.addRows(exportData);
      
      // Estilizar cabeçalho
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      
      console.log('Workbook criado, iniciando exportação para arquivo');
      
      // Exportar como arquivo Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Criar link de download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'participantes_export.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('Arquivo exportado com sucesso');

      // Log de auditoria para exportação de dados
      try {
        auditHelpers.exportData('excel', { count: filteredParticipantes.length });
        console.log('🔐 Exportação de dados auditada');
      } catch (auditError) {
        console.warn('⚠️ Erro no log de auditoria (exportação):', auditError);
      }

      showToast('Dados exportados com sucesso!', 'success');
    } catch (err) {
      console.error('Erro ao exportar dados:', err);
      showToast('Falha ao exportar dados: ' + err.message, 'error');
    }
  };

  if (loading) {
    return (
      <>
        <Header 
          title="Gerenciar Participantes" 
          subtitle="Visualize e gerencie os participantes das promoções"
        />
        <div className="participantes-content">
          <div className="loading-message">
            <p>Carregando participantes...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header 
          title="Gerenciar Participantes" 
          subtitle="Visualize e gerencie os participantes das promoções"
        />
        <div className="participantes-content">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Tentar novamente</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header 
        title="Gerenciar Participantes" 
        subtitle="Visualize e gerencie os participantes das promoções"
      />
      
      <div className="participantes-content">
        {/* Barra de Ações */}
        <div className="actions-bar">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Buscar participantes..." 
              className="search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-box">
            <select 
              className="filter-select"
              value={filterPromocao}
              onChange={(e) => setFilterPromocao(e.target.value)}
            >
              <option value="todas">Todas as promoções</option>
              {[...new Set(promocoes.map(p => p.nome))].map(promocao => (
                <option key={promocao} value={promocao}>{promocao}</option>
              ))}
            </select>
          </div>
          
          {canExportData() && (
            <button className="btn-primary" onClick={handleExportData}>
              <span className="btn-icon">📥</span>
              Exportar Dados
            </button>
          )}
        </div>

        {/* Tabela de Participantes */}
        <div className="table-container">
          <table className="participantes-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Bairro</th>
                <th>Cidade</th>
                <th>Promoção</th>
                <th>Data de Participação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipantes.length > 0 ? (
                filteredParticipantes.map(participante => (
                  <tr key={participante.id}>
                    <td>{participante.nome}</td>
                    <td>{participante.telefone}</td>
                    <td>{participante.bairro}</td>
                    <td>{participante.cidade}</td>
                    <td>{participante.promocao}</td>
                    <td>{
                      participante.dataParticipacao && !isNaN(new Date(participante.dataParticipacao)) 
                        ? new Date(participante.dataParticipacao).toLocaleDateString('pt-BR')
                        : 'Data inválida'
                    }</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon-small"
                          onClick={() => handleEditParticipante(participante)}
                          title="Editar"
                          style={{ marginRight: '8px' }}
                        >
                          <span className="icon">✏️</span>
                        </button>
                        {canDeletePromotion() && (
                          <button 
                            className="btn-icon-small"
                            onClick={() => handleDeleteParticipante(participante.id)}
                            title="Excluir"
                          >
                            <span className="icon">🗑️</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-state">
                  <td colSpan="7">
                    <div className="empty-message">
                      <span className="empty-icon">📭</span>
                      <p>Nenhum participante encontrado</p>
                      <p className="empty-subtitle">
                        {searchText || filterPromocao !== 'todas' 
                          ? 'Tente ajustar seus filtros de busca.' 
                          : 'Os participantes aparecerão aqui quando se inscreverem nas promoções.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
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

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDeleteParticipante}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o participante "${participanteToDelete?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      {/* Modal de Edição */}
      <EditParticipanteModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setParticipanteToEdit(null);
        }}
        participante={participanteToEdit}
        promocoes={promocoes}
        onSave={handleSaveParticipante}
      />
    </>
  );
};

export default ParticipantesPage;
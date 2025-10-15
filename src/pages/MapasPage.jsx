// MapasPage.jsx - Página dedicada aos mapas
import React, { useState, useEffect } from 'react';
import Header from '../components/DashboardLayout/Header';
import { InteractiveMap } from '../components/Maps/InteractiveMap';
import { fetchParticipantes } from '../services/participanteService';
import { fetchPromocoes } from '../services/promocaoService';
import { LoadingSpinner } from '../components/LoadingComponents';

// Funções auxiliares para mapeamento de origem
const getOrigemColor = (source) => {
  const colors = {
    facebook: '#1877F2',
    instagram: '#E4405F', 
    youtube: '#FF0000',
    whatsapp: '#25D366',
    website: '#6366F1',
    tv: '#8B5CF6',
    direto: '#6B7280'
  };
  return colors[source] || colors.direto;
};

const getOrigemLabel = (source, medium) => {
  const labels = {
    facebook: '📘 Facebook',
    instagram: '📸 Instagram',
    youtube: '📺 YouTube', 
    whatsapp: '💬 WhatsApp',
    website: '🌐 Website',
    tv: '📺 TV',
    direto: '🔗 Direto'
  };
  const base = labels[source] || labels.direto;
  return medium && medium !== 'link' ? `${base} (${medium})` : base;
};

const MapasPage = () => {
  const [viewMode, setViewMode] = useState('markers'); // 'markers' ou 'neighborhoods'
  const [selectedPromotion, setSelectedPromotion] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedOrigem, setSelectedOrigem] = useState('all');
  const [participantes, setParticipantes] = useState([]);
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detectar se está em modo janela externa
  const urlParams = new URLSearchParams(window.location.search);
  const isExternalWindow = urlParams.get('external') === 'true';

  // Forçar redimensionamento quando é janela externa
  useEffect(() => {
    if (isExternalWindow) {
      console.log('🖼️ Janela externa detectada');

      // Para janelas externas, usar uma abordagem mais simples
      document.body.style.overflow = 'hidden';
      document.body.style.margin = '0';
      document.body.style.padding = '0';

      return () => {
        document.body.style.overflow = '';
        document.body.style.margin = '';
        document.body.style.padding = '';
      };
    }
  }, [isExternalWindow]);

  // Aplicar parâmetros da URL se em modo externo
  useEffect(() => {
    if (isExternalWindow) {
      const view = urlParams.get('view');
      const promotion = urlParams.get('promotion');
      const city = urlParams.get('city');
      const origem = urlParams.get('origem');

      if (view && ['markers', 'neighborhoods'].includes(view)) {
        setViewMode(view);
      }
      if (promotion && promotion !== 'null') {
        setSelectedPromotion(promotion);
      }
      if (city && city !== 'null') {
        setSelectedCity(city);
      }
      if (origem && origem !== 'null') {
        setSelectedOrigem(origem);
      }
    }
  }, [isExternalWindow]);

  // Buscar dados da API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [participantesData, promocoesData] = await Promise.all([
          fetchParticipantes(),
          fetchPromocoes()
        ]);
        
        // Usar apenas dados reais com coordenadas válidas
        const participantesComCoords = (participantesData || [])
          .filter(p => p.latitude && p.longitude) // Filtrar apenas participantes com coordenadas
          .map(p => ({
            ...p,
            lat: parseFloat(p.latitude),
            lng: parseFloat(p.longitude),
            intensity: 75, // Intensidade padrão para visualização
            district: p.bairro || 'Não informado',
            city: p.cidade || 'Não informado',
            name: p.nome || 'Participante',
            // Dados de origem dos links
            origem_source: p.origem_source || 'direto',
            origem_medium: p.origem_medium || 'link',
            origem_color: getOrigemColor(p.origem_source || 'direto'),
            origem_label: getOrigemLabel(p.origem_source || 'direto', p.origem_medium)
          }));
        
        setParticipantes(participantesComCoords);
        setPromocoes(promocoesData || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Em caso de erro, manter array vazio
        setParticipantes([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Atualização automática a cada 5 minutos (300000ms)
    const autoRefreshInterval = setInterval(() => {
      console.log('🔄 Auto-refresh: Recarregando dados do mapa...');
      loadData();
    }, 300000); // 5 minutos

    // Limpar interval quando componente for desmontado
    return () => {
      clearInterval(autoRefreshInterval);
    };
  }, []);

  // Função para obter estatísticas por origem
  const getOrigemStats = () => {
    const stats = {};
    participantes.forEach(p => {
      const key = p.origem_source || 'direto';
      if (!stats[key]) {
        stats[key] = { 
          count: 0, 
          color: getOrigemColor(key),
          label: getOrigemLabel(key, p.origem_medium)
        };
      }
      stats[key].count++;
    });
    
    return Object.entries(stats)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 5); // Top 5
  };

  // Função para filtrar participantes
  const getFilteredParticipantes = () => {
    return participantes.filter(p => {
      if (selectedPromotion !== 'all' && p.promocao_id != selectedPromotion) return false;
      if (selectedCity !== 'all' && p.cidade !== selectedCity) return false;
      if (selectedOrigem !== 'all' && (p.origem_source || 'direto') !== selectedOrigem) return false;
      return true;
    });
  };

  // Função para agrupar participantes por bairro
  const getParticipantesPorBairro = () => {
    const filtered = getFilteredParticipantes();
    const bairros = {};
    
    filtered.forEach(p => {
      const bairro = p.district || p.bairro || 'Sem bairro';
      if (!bairros[bairro]) {
        bairros[bairro] = {
          nome: bairro,
          participantes: [],
          count: 0,
          lat: p.lat,
          lng: p.lng,
          origens: {}
        };
      }
      
      bairros[bairro].participantes.push(p);
      bairros[bairro].count++;
      
      // Agrupar por origem
      const origem = p.origem_source || 'direto';
      if (!bairros[bairro].origens[origem]) {
        bairros[bairro].origens[origem] = 0;
      }
      bairros[bairro].origens[origem]++;
    });
    
    return Object.values(bairros).sort((a, b) => b.count - a.count);
  };


  if (loading) {
    return (
      <>
        {!isExternalWindow && (
          <Header
            title="📍 Mapas Interativos"
            subtitle="Visualização geográfica dos participantes"
          />
        )}
        <div className={isExternalWindow ? "external-window-content" : "dashboard-content"} style={{
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px'
        }}>
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  // Layout simplificado para janela externa
  if (isExternalWindow) {
    return (
      <div style={{
        padding: '16px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-background)',
        color: 'var(--color-text)'
      }}>
        {/* Header Compacto */}
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          background: 'var(--color-card)',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
            🗺️ Mapa - {getFilteredParticipantes().length} participantes
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-small ${viewMode === 'markers' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('markers')}
            >
              📍 Marcadores
            </button>
            <button
              className={`btn btn-small ${viewMode === 'neighborhoods' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('neighborhoods')}
            >
              🏘️ Bairros
            </button>
          </div>
        </div>

        {/* Mapa em Tela Cheia */}
        <div style={{
          flex: 1,
          minHeight: '500px',
          height: '100%',
          width: '100%',
          position: 'relative',
          background: 'var(--color-card)',
          borderRadius: '8px',
          border: '1px solid var(--color-border)'
        }}>
          {participantes.length === 0 && loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <LoadingSpinner />
              <p>Carregando participantes...</p>
            </div>
          ) : getFilteredParticipantes().length === 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column',
              gap: '16px',
              padding: '40px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px' }}>🗺️</div>
              <h3>Nenhum participante encontrado</h3>
              <p>Ajuste os filtros para visualizar os dados no mapa.</p>
            </div>
          ) : viewMode === 'markers' ? (
            <div style={{ height: '100%', width: '100%', position: 'relative' }}>
              {/* Fallback se o mapa não carregar */}
              <div
                id="map-fallback"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  zIndex: 1000,
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid var(--color-border)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                <h4 style={{ margin: '0 0 12px 0', color: 'var(--color-text)' }}>Mapa Interativo</h4>
                <p style={{ margin: '0 0 16px 0', color: 'var(--color-text-secondary)' }}>
                  {getFilteredParticipantes().length} participantes em Cacoal, Cacoal
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      window.open('https://maps.google.com/maps?q=Cacoal,+RO,+Brasil', '_blank');
                    }}
                    style={{ fontSize: '0.875rem' }}
                  >
                    🌐 Ver no Google Maps
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => window.location.reload()}
                    style={{ fontSize: '0.875rem' }}
                  >
                    🔄 Recarregar
                  </button>
                </div>
              </div>

              <div style={{ height: '100%', width: '100%' }}>
                <InteractiveMap
                  participants={getFilteredParticipantes()}
                  height="100%"
                  title="Mapa Externo"
                  zoom={12}
                  showFilters={false}
                  promotions={promocoes}
                  selectedPromotion={selectedPromotion}
                  onFilterChange={setSelectedPromotion}
                  selectedCity={selectedCity}
                  onCityFilterChange={setSelectedCity}
                  key={`external-map-${Date.now()}`}
                />
              </div>

              {/* Lista de participantes como fallback visual */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                zIndex: 1000
              }}>
                📍 {getFilteredParticipantes().length} participantes no mapa
              </div>
            </div>
          ) : (
            <div style={{
              padding: '20px',
              background: 'var(--color-card)',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              height: '100%',
              overflow: 'auto'
            }}>
              <h3>🏘️ Participantes por Bairro</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {getParticipantesPorBairro().slice(0, 12).map((bairro, index) => (
                  <div key={bairro.nome} style={{
                    padding: '16px',
                    background: 'var(--color-background)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)'
                  }}>
                    <h4 style={{ margin: '0 0 8px 0' }}>#{index + 1} {bairro.nome}</h4>
                    <p style={{ margin: '0', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                      {bairro.count} participantes
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Header 
        title="📍 Mapas Interativos" 
        subtitle="Visualização geográfica dos participantes"
      />
      
      <div className="dashboard-content" style={{ padding: '24px' }}>
        {/* Controles */}
        <div className="card-modern" style={{ 
          padding: '20px', 
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h3 style={{ 
              margin: '0 0 8px 0',
              color: 'var(--color-text)',
              fontSize: '1.125rem'
            }}>
              Modo de Visualização
            </h3>
            <p style={{ 
              margin: 0,
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem'
            }}>
              Escolha como visualizar os dados no mapa
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className={`btn transition-normal ${viewMode === 'markers' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('markers')}
            >
              📍 Marcadores
            </button>
            <button
              className={`btn transition-normal ${viewMode === 'neighborhoods' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('neighborhoods')}
            >
              🏘️ Por Bairros
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                const url = `/external/mapas?external=true&view=${viewMode}&promotion=${selectedPromotion}&city=${selectedCity}&origem=${selectedOrigem}`;
                window.open(url, 'MapasNexoGeo', 'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes');
              }}
              title="Abrir mapa em janela separada"
            >
              🪟 Nova Janela
            </button>
          </div>
        </div>

        {/* Filtros Avançados */}
        <div className="card-modern" style={{ 
          padding: '20px', 
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <label style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: 'var(--color-text)',
              fontSize: '0.875rem'
            }}>
              Filtrar por Origem
            </label>
            <select
              value={selectedOrigem}
              onChange={(e) => setSelectedOrigem(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                background: 'var(--color-background)',
                color: 'var(--color-text)'
              }}
            >
              <option value="all">Todas as origens</option>
              {getOrigemStats().map(([origem, stats]) => (
                <option key={origem} value={origem}>
                  {stats.label} ({stats.count})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: 'var(--color-text)',
              fontSize: '0.875rem'
            }}>
              Filtrar por Promoção
            </label>
            <select
              value={selectedPromotion}
              onChange={(e) => setSelectedPromotion(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                background: 'var(--color-background)',
                color: 'var(--color-text)'
              }}
            >
              <option value="all">Todas as promoções</option>
              {promocoes.map(promo => (
                <option key={promo.id} value={promo.id}>
                  {promo.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-4" style={{ gap: '16px', marginBottom: '32px' }}>
          <div className="card-modern" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📍</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: 'var(--color-text)',
              margin: '0 0 4px 0'
            }}>
              {getFilteredParticipantes().length}
            </h3>
            <p style={{ 
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              margin: 0
            }}>
              Participantes Filtrados
            </p>
          </div>

          <div className="card-modern" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: 'var(--color-text)',
              margin: '0 0 4px 0'
            }}>
              {getOrigemStats().length}
            </h3>
            <p style={{ 
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              margin: 0
            }}>
              Canais Ativos
            </p>
          </div>

          <div className="card-modern" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: 'var(--color-text)',
              margin: '0 0 4px 0'
            }}>
              {getOrigemStats()[0] ? getOrigemStats()[0][1].label.split(' ')[1] : 'N/A'}
            </h3>
            <p style={{ 
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              margin: 0
            }}>
              Canal Principal
            </p>
          </div>

          <div className="card-modern" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📈</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: 'var(--color-text)',
              margin: '0 0 4px 0'
            }}>
              {getOrigemStats()[0] ? Math.round((getOrigemStats()[0][1].count / participantes.length) * 100) : 0}%
            </h3>
            <p style={{ 
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              margin: 0
            }}>
              Taxa do Principal
            </p>
          </div>
        </div>

        {/* Mapa Principal */}
        {viewMode === 'markers' ? (
          <InteractiveMap 
            participants={getFilteredParticipantes()}
            height="600px"
            title="Localização dos Participantes"
            zoom={12}
            showFilters={false}
            promotions={promocoes}
            selectedPromotion={selectedPromotion}
            onFilterChange={setSelectedPromotion}
            selectedCity={selectedCity}
            onCityFilterChange={setSelectedCity}
          />
        ) : (
          /* Visualização por Bairros */
          <div className="card-modern" style={{ padding: '24px' }}>
            <h3 style={{ 
              marginBottom: '24px',
              color: 'var(--color-text)',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🏘️ Participantes por Bairro
            </h3>
            
            <div className="grid grid-2" style={{ gap: '24px' }}>
              {getParticipantesPorBairro().slice(0, 8).map((bairro, index) => (
                <div key={bairro.nome} className="card-modern" style={{ 
                  padding: '20px',
                  border: '2px solid var(--color-border)',
                  position: 'relative'
                }}>
                  {/* Ranking Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '16px',
                    background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--color-primary)',
                    color: index < 3 ? '#000' : '#fff',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    #{index + 1}
                  </div>
                  
                  {/* Nome do Bairro */}
                  <h4 style={{ 
                    margin: '0 0 12px 0',
                    color: 'var(--color-text)',
                    fontSize: '1.125rem'
                  }}>
                    {bairro.nome}
                  </h4>
                  
                  {/* Estatísticas */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        color: 'var(--color-primary)'
                      }}>
                        {bairro.count}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        Participantes
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        color: 'var(--color-success)'
                      }}>
                        {Object.keys(bairro.origens).length}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        Canais
                      </div>
                    </div>
                  </div>
                  
                  {/* Origens */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {Object.entries(bairro.origens)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([origem, count]) => (
                        <div key={origem} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '4px 0'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: getOrigemColor(origem)
                            }}/>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>
                              {getOrigemLabel(origem).split(' ')[1] || origem}
                            </span>
                          </div>
                          <span style={{ 
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: 'var(--color-text-secondary)'
                          }}>
                            {count}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="grid grid-2" style={{ gap: '24px', marginTop: '32px' }}>
          <div className="card-modern" style={{ padding: '24px' }}>
            <h4 style={{ 
              marginBottom: '16px',
              color: 'var(--color-text)',
              fontSize: '1.125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📊 Top 5 - Origens dos Links
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {getOrigemStats().map(([origem, stats], index) => (
                <div key={origem} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < getOrigemStats().length - 1 ? '1px solid var(--color-border)' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: stats.color
                      }}
                    />
                    <span style={{ 
                      fontSize: '0.875rem',
                      color: 'var(--color-text)'
                    }}>
                      {stats.label}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--color-primary)'
                  }}>
                    {stats.count} ({Math.round((stats.count / participantes.length) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-modern" style={{ padding: '24px' }}>
            <h4 style={{ 
              marginBottom: '16px',
              color: 'var(--color-text)',
              fontSize: '1.125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🎯 Insights de Marketing
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderLeft: '3px solid var(--color-success)',
                borderRadius: '8px'
              }}>
                <p style={{ 
                  fontSize: '0.875rem',
                  color: 'var(--color-text)',
                  margin: 0
                }}>
                  <strong>Canal mais eficaz:</strong> {getOrigemStats()[0] ? getOrigemStats()[0][1].label : 'N/A'} representa {getOrigemStats()[0] ? Math.round((getOrigemStats()[0][1].count / participantes.length) * 100) : 0}% das participações
                </p>
              </div>
              
              <div style={{
                padding: '12px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderLeft: '3px solid var(--color-primary)',
                borderRadius: '8px'
              }}>
                <p style={{ 
                  fontSize: '0.875rem',
                  color: 'var(--color-text)',
                  margin: 0
                }}>
                  <strong>Diversificação:</strong> {getOrigemStats().length} canais diferentes sendo utilizados
                </p>
              </div>
              
              <div style={{
                padding: '12px',
                background: 'rgba(245, 158, 11, 0.1)',
                borderLeft: '3px solid var(--color-warning)',
                borderRadius: '8px'
              }}>
                <p style={{ 
                  fontSize: '0.875rem',
                  color: 'var(--color-text)',
                  margin: 0
                }}>
                  <strong>Recomendação:</strong> {getOrigemStats()[0] && getOrigemStats()[0][1].count / participantes.length > 0.5 ? 'Diversificar investimento em outros canais' : 'Manter estratégia atual de múltiplos canais'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapasPage;
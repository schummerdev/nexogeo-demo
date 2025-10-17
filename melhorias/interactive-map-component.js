// InteractiveMap.jsx - Componente de Mapa Interativo com Leaflet
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer';
import L from 'leaflet';

// Configuração dos ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícones personalizados para diferentes tipos de marcadores
const createCustomIcon = (color = '#3b82f6', size = 'medium') => {
  const sizes = {
    small: [20, 20],
    medium: [30, 30], 
    large: [40, 40]
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin" style="background-color: ${color}">
        <div class="marker-inner"></div>
      </div>
    `,
    iconSize: sizes[size],
    iconAnchor: [sizes[size][0] / 2, sizes[size][1]],
    popupAnchor: [0, -sizes[size][1]]
  });
};

// Componente para controlar o mapa
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  
  return null;
};

// Componente principal do mapa
export const InteractiveMap = ({
  participantLocations = [],
  center = [-23.5505, -46.6333], // São Paulo como padrão
  zoom = 10,
  height = '400px',
  showHeatmap = true,
  showMarkers = true,
  showControls = true,
  onMarkerClick = null,
  className = ''
}) => {
  const [mapReady, setMapReady] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filterRadius, setFilterRadius] = useState(50); // km
  const [heatmapData, setHeatmapData] = useState([]);
  const mapRef = useRef();

  // Processa dados dos participantes para o heatmap
  useEffect(() => {
    if (participantLocations.length > 0) {
      const heatData = participantLocations
        .filter(location => location.latitude && location.longitude)
        .map(location => ([
          parseFloat(location.latitude),
          parseFloat(location.longitude),
          location.intensity || 1
        ]));
      
      setHeatmapData(heatData);
    }
  }, [participantLocations]);

  // Filtra localizações por raio
  const getFilteredLocations = () => {
    if (!selectedLocation) return participantLocations;
    
    return participantLocations.filter(location => {
      const distance = calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        location.latitude,
        location.longitude
      );
      return distance <= filterRadius;
    });
  };

  // Calcula distância entre dois pontos (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Agrupa participantes por localização próxima
  const getLocationClusters = () => {
    const clusters = [];
    const processed = new Set();
    
    participantLocations.forEach((location, index) => {
      if (processed.has(index)) return;
      
      const cluster = {
        ...location,
        count: 1,
        participants: [location]
      };
      
      // Encontra participantes próximos (dentro de 1km)
      participantLocations.forEach((otherLocation, otherIndex) => {
        if (otherIndex === index || processed.has(otherIndex)) return;
        
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          otherLocation.latitude,
          otherLocation.longitude
        );
        
        if (distance <= 1) { // 1km de raio
          cluster.count++;
          cluster.participants.push(otherLocation);
          processed.add(otherIndex);
        }
      });
      
      processed.add(index);
      clusters.push(cluster);
    });
    
    return clusters;
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    if (onMarkerClick) {
      onMarkerClick(location);
    }
  };

  const filteredLocations = getFilteredLocations();
  const locationClusters = getLocationClusters();

  return (
    <div className={`interactive-map-container ${className}`}>
      {/* Controles do mapa */}
      {showControls && (
        <div className="map-controls glass">
          <div className="map-control-group">
            <label className="control-label">
              Visualização:
            </label>
            <div className="control-buttons">
              <button 
                className={`control-btn ${showHeatmap ? 'active' : ''}`}
                onClick={() => setShowHeatmap(!showHeatmap)}
              >
                🔥 Heatmap
              </button>
              
              <button 
                className={`control-btn ${showMarkers ? 'active' : ''}`}
                onClick={() => setShowMarkers(!showMarkers)}
              >
                📍 Marcadores
              </button>
            </div>
          </div>
          
          {selectedLocation && (
            <div className="map-control-group">
              <label className="control-label">
                Filtro por raio:
              </label>
              <div className="control-slider">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={filterRadius}
                  onChange={(e) => setFilterRadius(parseInt(e.target.value))}
                  className="slider"
                />
                <span className="slider-value">{filterRadius}km</span>
              </div>
            </div>
          )}
          
          <div className="map-stats">
            <div className="stat-item">
              <span className="stat-value">{filteredLocations.length}</span>
              <span className="stat-label">Participantes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{locationClusters.length}</span>
              <span className="stat-label">Localizações</span>
            </div>
          </div>
        </div>
      )}

      {/* Container do mapa */}
      <div className="map-wrapper" style={{ height }}>
        <MapContainer
          ref={mapRef}
          center={center}
          zoom={zoom}
          className="leaflet-map"
          whenCreated={() => setMapReady(true)}
        >
          {/* Camada base do mapa */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Controlador do mapa */}
          <MapController center={center} zoom={zoom} />
          
          {/* Heatmap */}
          {showHeatmap && heatmapData.length > 0 && mapReady && (
            <HeatmapLayer
              points={heatmapData}
              longitudeExtractor={point => point[1]}
              latitudeExtractor={point => point[0]}
              intensityExtractor={point => point[2]}
              radius={20}
              blur={25}
              maxZoom={18}
              gradient={{
                0.1: '#89CDF0',
                0.2: '#00AAFF', 
                0.5: '#0066CC',
                0.8: '#004499',
                1.0: '#002266'
              }}
            />
          )}
          
          {/* Marcadores */}
          {showMarkers && locationClusters.map((cluster, index) => (
            <Marker
              key={index}
              position={[cluster.latitude, cluster.longitude]}
              icon={createCustomIcon(
                cluster.count > 5 ? '#ef4444' : 
                cluster.count > 2 ? '#f59e0b' : '#22c55e',
                cluster.count > 10 ? 'large' : 
                cluster.count > 5 ? 'medium' : 'small'
              )}
              eventHandlers={{
                click: () => handleMarkerClick(cluster)
              }}
            >
              <Popup className="custom-popup">
                <div className="popup-content">
                  <div className="popup-header">
                    <h3 className="popup-title">
                      {cluster.city || 'Localização'} - {cluster.district || 'Centro'}
                    </h3>
                    <span className="popup-count">{cluster.count} participante{cluster.count !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="popup-details">
                    {cluster.participants.slice(0, 3).map((participant, idx) => (
                      <div key={idx} className="participant-item">
                        <span className="participant-name">{participant.name}</span>
                        <span className="participant-phone">{participant.phone}</span>
                      </div>
                    ))}
                    
                    {cluster.count > 3 && (
                      <div className="more-participants">
                        +{cluster.count - 3} participante{cluster.count - 3 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  <div className="popup-actions">
                    <button 
                      className="popup-btn"
                      onClick={() => console.log('Ver detalhes', cluster)}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legenda */}
      <div className="map-legend glass">
        <h4 className="legend-title">Legenda</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: '#22c55e' }}></div>
            <span>1-2 participantes</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>3-5 participantes</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: '#ef4444' }}></div>
            <span>6+ participantes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook para obter localização do usuário
export const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada neste navegador');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  };

  return { location, error, loading, getUserLocation };
};

// Componente de Estatísticas do Mapa
export const MapStatistics = ({ locations = [] }) => {
  const [stats, setStats] = useState({
    totalLocations: 0,
    topCities: [],
    topDistricts: [],
    participationByHour: []
  });

  useEffect(() => {
    if (locations.length === 0) return;

    // Conta participantes por cidade
    const cityCount = {};
    const districtCount = {};
    const hourCount = {};

    locations.forEach(location => {
      // Cidades
      const city = location.city || 'Não informado';
      cityCount[city] = (cityCount[city] || 0) + 1;

      // Bairros
      const district = location.district || 'Não informado';
      districtCount[district] = (districtCount[district] || 0) + 1;

      // Horário (se disponível)
      if (location.participatedAt) {
        const hour = new Date(location.participatedAt).getHours();
        hourCount[hour] = (hourCount[hour] || 0) + 1;
      }
    });

    const topCities = Object.entries(cityCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([city, count]) => ({ name: city, count }));

    const topDistricts = Object.entries(districtCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([district, count]) => ({ name: district, count }));

    const participationByHour = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      count: hourCount[hour] || 0
    }));

    setStats({
      totalLocations: locations.length,
      topCities,
      topDistricts,
      participationByHour
    });
  }, [locations]);

  return (
    <div className="map-statistics glass">
      <h3 className="stats-title">Estatísticas Geográficas</h3>
      
      <div className="stats-grid">
        <div className="stat-section">
          <h4 className="stat-section-title">Principais Cidades</h4>
          <div className="stat-list">
            {stats.topCities.map((city, index) => (
              <div key={index} className="stat-list-item">
                <span className="stat-name">{city.name}</span>
                <span className="stat-value">{city.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="stat-section">
          <h4 className="stat-section-title">Principais Bairros</h4>
          <div className="stat-list">
            {stats.topDistricts.map((district, index) => (
              <div key={index} className="stat-list-item">
                <span className="stat-name">{district.name}</span>
                <span className="stat-value">{district.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="stats-summary">
        <div className="summary-item">
          <span className="summary-value">{stats.totalLocations}</span>
          <span className="summary-label">Total de Participantes</span>
        </div>
      </div>
    </div>
  );
};

// CSS para o componente de mapa
export const mapCSS = `
/* === CONTAINER DO MAPA === */
.interactive-map-container {
  position: relative;
  border-radius: var(--border-radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

/* === CONTROLES DO MAPA === */
.map-controls {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 1000;
  padding: var(--space-4);
  border-radius: var(--border-radius-xl);
  border: 1px solid var(--glass-border);
  min-width: 200px;
}

.map-control-group {
  margin-bottom: var(--space-4);
}

.map-control-group:last-child {
  margin-bottom: 0;
}

.control-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.control-buttons {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.control-btn {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.control-btn:hover {
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur-sm);
  -webkit-backdrop-filter: var(--backdrop-blur-sm);
  transform: translateY(-1px);
}

.control-btn.active {
  background: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
  box-shadow: var(--shadow-md);
}

.control-slider {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.slider {
  flex: 1;
  height: 4px;
  border-radius: var(--border-radius-full);
  background: var(--gray-200);
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-500);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-500);
  cursor: pointer;
  border: none;
  box-shadow: var(--shadow-sm);
}

.slider-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  min-width: 40px;
  text-align: right;
}

.map-stats {
  display: flex;
  gap: var(--space-4);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--primary-500);
  line-height: 1;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  margin-top: var(--space-1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* === WRAPPER DO MAPA === */
.map-wrapper {
  position: relative;
  width: 100%;
  border-radius: var(--border-radius-2xl);
  overflow: hidden;
}

.leaflet-map {
  width: 100%;
  height: 100%;
}

/* === MARCADORES CUSTOMIZADOS === */
.custom-marker {
  background: transparent;
  border: none;
}

.marker-pin {
  width: 100%;
  height: 100%;
  border-radius: 50% 50% 50% 0;
  position: relative;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -50% 0 0 -50%;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-inner {
  width: 60%;
  height: 60%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  transform: rotate(45deg);
}

/* === POPUPS CUSTOMIZADOS === */
.custom-popup .leaflet-popup-content-wrapper {
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur-md);
  -webkit-backdrop-filter: var(--backdrop-blur-md);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-2xl);
  padding: 0;
}

.custom-popup .leaflet-popup-content {
  margin: 0;
  padding: 0;
  color: var(--text-primary);
}

.popup-content {
  padding: var(--space-4);
  min-width: 200px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-3);
}

.popup-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--line-height-tight);
}

.popup-count {
  background: var(--primary-500);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.popup-details {
  margin-bottom: var(--space-3);
}

.participant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-primary);
}

.participant-item:last-child {
  border-bottom: none;
}

.participant-name {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.participant-phone {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.more-participants {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  text-align: center;
  padding: var(--space-2) 0;
  font-style: italic;
}

.popup-actions {
  display: flex;
  gap: var(--space-2);
}

.popup-btn {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.popup-btn:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* === LEGENDA === */
.map-legend {
  position: absolute;
  bottom: var(--space-4);
  right: var(--space-4);
  z-index: 1000;
  padding: var(--space-4);
  border-radius: var(--border-radius-xl);
  border: 1px solid var(--glass-border);
  min-width: 180px;
}

.legend-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-3) 0;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.legend-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* === ESTATÍSTICAS DO MAPA === */
.map-statistics {
  margin-top: var(--space-6);
  padding: var(--space-6);
  border-radius: var(--border-radius-2xl);
  border: 1px solid var(--glass-border);
}

.stats-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-6) 0;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-6);
}

.stat-section {
  text-align: center;
}

.stat-section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--space-4) 0;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.stat-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur-sm);
  -webkit-backdrop-filter: var(--backdrop-blur-sm);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--glass-border);
}

.stat-name {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-align: left;
}

.stat-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--primary-500);
}

.stats-summary {
  display: flex;
  justify-content: center;
  gap: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-primary);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.summary-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-500);
  line-height: 1;
}

.summary-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--space-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* === RESPONSIVIDADE === */
@media (max-width: 768px) {
  .map-controls {
    position: relative;
    top: 0;
    left: 0;
    margin-bottom: var(--space-4);
    width: 100%;
    min-width: auto;
  }
  
  .map-legend {
    position: relative;
    bottom: 0;
    right: 0;
    margin-top: var(--space-4);
    min-width: auto;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-summary {
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .control-buttons {
    flex-direction: column;
  }
  
  .map-stats {
    flex-direction: column;
    gap: var(--space-2);
  }
}

@media (max-width: 480px) {
  .map-controls,
  .map-legend,
  .map-statistics {
    padding: var(--space-3);
  }
  
  .popup-content {
    padding: var(--space-3);
    min-width: 160px;
  }
  
  .interactive-map-container {
    border-radius: var(--border-radius-lg);
  }
}

/* === TEMA ESCURO === */
[data-theme="dark"] .leaflet-popup-content-wrapper {
  background: var(--glass-bg);
  color: var(--text-primary);
}

[data-theme="dark"] .leaflet-control-zoom a {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-primary);
}

[data-theme="dark"] .leaflet-control-attribution {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}
`;
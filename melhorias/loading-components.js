// LoadingComponents.jsx - Sistema de Loading States Modernos
import React from 'react';

// Spinner Principal
export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6', 
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinner = (
    <div className={`spinner spinner-${color} ${sizeClasses[size]} ${className}`}>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-overlay-content">
          {spinner}
          <p className="loading-text">Carregando...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

// Pulse Loading (alternativa moderna)
export const PulseLoader = ({ color = 'primary', size = 'md' }) => (
  <div className={`pulse-loader pulse-loader-${color} pulse-loader-${size}`}>
    <div className="pulse-dot"></div>
    <div className="pulse-dot"></div>
    <div className="pulse-dot"></div>
  </div>
);

// Wave Loading
export const WaveLoader = ({ color = 'primary' }) => (
  <div className={`wave-loader wave-loader-${color}`}>
    <div className="wave-bar"></div>
    <div className="wave-bar"></div>
    <div className="wave-bar"></div>
    <div className="wave-bar"></div>
    <div className="wave-bar"></div>
  </div>
);

// Skeleton Components
export const SkeletonLine = ({ width = '100%', height = '1rem', className = '' }) => (
  <div 
    className={`skeleton skeleton-line ${className}`}
    style={{ width, height }}
  />
);

export const SkeletonCircle = ({ size = '3rem', className = '' }) => (
  <div 
    className={`skeleton skeleton-circle ${className}`}
    style={{ width: size, height: size }}
  />
);

export const SkeletonCard = ({ showImage = true, lines = 3 }) => (
  <div className="skeleton-card">
    {showImage && <div className="skeleton skeleton-image" />}
    <div className="skeleton-card-content">
      <SkeletonLine width="80%" height="1.5rem" className="mb-2" />
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonLine 
          key={i}
          width={i === lines - 1 ? '60%' : '100%'} 
          height="1rem" 
          className="mb-2" 
        />
      ))}
    </div>
  </div>
);

// Skeleton para KPI Cards
export const SkeletonKPI = () => (
  <div className="kpi-card">
    <div className="flex items-center gap-4">
      <SkeletonCircle size="3.5rem" />
      <div className="flex-1">
        <SkeletonLine width="60%" height="2rem" className="mb-2" />
        <SkeletonLine width="80%" height="1rem" />
      </div>
    </div>
  </div>
);

// Skeleton para Tabela
export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="skeleton-table">
    {/* Header */}
    <div className="skeleton-table-header">
      {Array.from({ length: columns }, (_, i) => (
        <SkeletonLine key={i} width="80%" height="1.25rem" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={rowIndex} className="skeleton-table-row">
        {Array.from({ length: columns }, (_, colIndex) => (
          <SkeletonLine 
            key={colIndex} 
            width={colIndex === 0 ? '100%' : '70%'} 
            height="1rem" 
          />
        ))}
      </div>
    ))}
  </div>
);

// Skeleton para Dashboard
export const SkeletonDashboard = () => (
  <div className="skeleton-dashboard">
    {/* KPI Grid */}
    <div className="kpi-grid mb-8">
      {Array.from({ length: 4 }, (_, i) => (
        <SkeletonKPI key={i} />
      ))}
    </div>
    
    {/* Charts */}
    <div className="charts-section">
      <div className="skeleton-chart">
        <SkeletonLine width="40%" height="1.5rem" className="mb-4" />
        <div className="skeleton skeleton-chart-area" />
      </div>
      
      <div className="skeleton-chart">
        <SkeletonLine width="35%" height="1.5rem" className="mb-4" />
        <div className="skeleton skeleton-chart-area" />
      </div>
    </div>
  </div>
);

// Hook para estados de loading
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [loadingText, setLoadingText] = React.useState('Carregando...');

  const startLoading = (text = 'Carregando...') => {
    setLoadingText(text);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading
  };
};

// Wrapper para mostrar loading em qualquer componente
export const WithLoading = ({ 
  isLoading, 
  skeleton = <SkeletonCard />, 
  spinner = false,
  children 
}) => {
  if (isLoading) {
    return spinner ? <LoadingSpinner fullScreen /> : skeleton;
  }
  
  return children;
};

// CSS para os componentes de loading
export const loadingCSS = `
/* === SPINNERS === */
.spinner {
  display: inline-block;
  position: relative;
}

.spinner-ring {
  position: absolute;
  border: 2px solid transparent;
  border-radius: 50%;
  animation: spinner-rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner .spinner-ring:nth-child(1) {
  width: 100%;
  height: 100%;
  border-top-color: currentColor;
  animation-delay: -0.45s;
}

.spinner .spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-top-color: currentColor;
  animation-delay: -0.3s;
  opacity: 0.7;
}

.spinner .spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-top-color: currentColor;
  animation-delay: -0.15s;
  opacity: 0.4;
}

@keyframes spinner-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Cores do spinner */
.spinner-primary {
  color: var(--primary-500);
}

.spinner-success {
  color: var(--success-500);
}

.spinner-error {
  color: var(--error-500);
}

.spinner-warning {
  color: var(--warning-500);
}

/* === PULSE LOADER === */
.pulse-loader {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.pulse-dot {
  border-radius: 50%;
  animation: pulse-scale 1.4s ease-in-out infinite both;
}

.pulse-loader-sm .pulse-dot {
  width: 0.5rem;
  height: 0.5rem;
}

.pulse-loader-md .pulse-dot {
  width: 0.75rem;
  height: 0.75rem;
}

.pulse-loader-lg .pulse-dot {
  width: 1rem;
  height: 1rem;
}

.pulse-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.pulse-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes pulse-scale {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Cores do pulse */
.pulse-loader-primary .pulse-dot {
  background-color: var(--primary-500);
}

.pulse-loader-success .pulse-dot {
  background-color: var(--success-500);
}

/* === WAVE LOADER === */
.wave-loader {
  display: inline-flex;
  align-items: end;
  gap: 2px;
  height: 2rem;
}

.wave-bar {
  width: 4px;
  background-color: currentColor;
  border-radius: 2px;
  animation: wave-bounce 1.4s ease-in-out infinite both;
}

.wave-bar:nth-child(1) { animation-delay: -0.32s; }
.wave-bar:nth-child(2) { animation-delay: -0.16s; }
.wave-bar:nth-child(3) { animation-delay: 0s; }
.wave-bar:nth-child(4) { animation-delay: 0.16s; }
.wave-bar:nth-child(5) { animation-delay: 0.32s; }

@keyframes wave-bounce {
  0%, 80%, 100% {
    height: 0.5rem;
    opacity: 0.5;
  }
  40% {
    height: 2rem;
    opacity: 1;
  }
}

.wave-loader-primary {
  color: var(--primary-500);
}

/* === LOADING OVERLAY === */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: var(--backdrop-blur-sm);
  -webkit-backdrop-filter: var(--backdrop-blur-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  animation: fadeIn 0.2s ease-out;
}

[data-theme="dark"] .loading-overlay {
  background: rgba(0, 0, 0, 0.8);
}

.loading-overlay-content {
  text-align: center;
  background: var(--bg-secondary);
  padding: var(--space-8);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-primary);
}

.loading-text {
  margin-top: var(--space-4);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

/* === SKELETONS === */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-300) 50%,
    var(--gray-200) 75%
  );
  background-size: 200px 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-md);
}

[data-theme="dark"] .skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-700) 25%,
    var(--gray-600) 50%,
    var(--gray-700) 75%
  );
  background-size: 200px 100%;
}

@keyframes skeleton-loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton-line {
  width: 100%;
  height: 1rem;
}

.skeleton-circle {
  border-radius: 50%;
}

/* Skeleton Card */
.skeleton-card {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-xl);
  padding: var(--space-6);
  border: 1px solid var(--border-primary);
}

.skeleton-image {
  width: 100%;
  height: 12rem;
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--space-4);
}

.skeleton-card-content {
  display: flex;
  flex-direction: column;
}

/* Skeleton Table */
.skeleton-table {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-xl);
  border: 1px solid var(--border-primary);
  overflow: hidden;
}

.skeleton-table-header {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-primary);
}

.skeleton-table-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-primary);
}

.skeleton-table-row:last-child {
  border-bottom: none;
}

/* Skeleton Chart */
.skeleton-chart {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-xl);
  padding: var(--space-6);
  border: 1px solid var(--border-primary);
}

.skeleton-chart-area {
  width: 100%;
  height: 200px;
  border-radius: var(--border-radius-lg);
}

.skeleton-dashboard .charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-6);
}

/* Utilitários */
.mb-2 { margin-bottom: var(--space-2); }
.mb-4 { margin-bottom: var(--space-4); }
.mb-8 { margin-bottom: var(--space-8); }

/* Responsividade */
@media (max-width: 480px) {
  .loading-overlay-content {
    padding: var(--space-6);
    margin: var(--space-4);
  }
  
  .skeleton-chart-area {
    height: 150px;
  }
  
  .skeleton-dashboard .charts-section {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .skeleton-table-header,
  .skeleton-table-row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
`;
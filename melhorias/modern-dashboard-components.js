// ModernDashboard.jsx - Dashboard com Design Moderno
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LoadingSpinner, SkeletonKPI, SkeletonDashboard } from './LoadingComponents';

// Componente de KPI Animado
export const AnimatedKPICard = ({ 
  icon, 
  value, 
  label, 
  trend = 0, 
  color = 'primary',
  prefix = '',
  suffix = '',
  isLoading = false
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animação de contagem
  useEffect(() => {
    if (isLoading) return;
    
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (!isVisible || isLoading) return;

    const duration = 2000; // 2 segundos
    const startTime = Date.now();
    const startValue = 0;
    const endValue = typeof value === 'number' ? value : 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (endValue - startValue) * easeOut;
      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isVisible, isLoading]);

  if (isLoading) {
    return <SkeletonKPI />;
  }

  const getTrendIcon = () => {
    if (trend > 0) return { icon: '📈', color: 'text-success-500' };
    if (trend < 0) return { icon: '📉', color: 'text-error-500' };
    return { icon: '➡️', color: 'text-gray-500' };
  };

  const trendInfo = getTrendIcon();

  return (
    <div className={`kpi-card-modern kpi-card-${color} glass hover-lift transition-all fade-in-up`}>
      <div className="kpi-header-modern">
        <div className="kpi-icon-modern">
          {icon}
        </div>
        {trend !== 0 && (
          <div className={`kpi-trend ${trendInfo.color}`}>
            <span className="trend-icon">{trendInfo.icon}</span>
            <span className="trend-value">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="kpi-content-modern">
        <div className="kpi-value-animated">
          {prefix}{displayValue.toLocaleString('pt-BR')}{suffix}
        </div>
        <p className="kpi-label-modern">{label}</p>
      </div>
      
      {/* Efeito de brilho */}
      <div className="kpi-shine"></div>
    </div>
  );
};

// Gráfico Moderno com Glassmorphism
export const ModernChart = ({ 
  title, 
  data, 
  type = 'line',
  isLoading = false,
  height = 300 
}) => {
  if (isLoading) {
    return (
      <div className="chart-card-modern glass">
        <div className="chart-header">
          <div className="skeleton" style={{ width: '40%', height: '1.5rem' }}></div>
        </div>
        <div className="skeleton" style={{ width: '100%', height: `${height}px` }}></div>
      </div>
    );
  }

  const renderChart = () => {
    if (type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--text-tertiary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--text-tertiary)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--glass-bg)',
                backdropFilter: 'var(--backdrop-blur-md)',
                WebkitBackdropFilter: 'var(--backdrop-blur-md)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-2xl)',
                color: 'var(--text-primary)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="var(--primary-500)"
              strokeWidth={3}
              dot={{ fill: 'var(--primary-500)', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: 'var(--primary-500)', strokeWidth: 2, fill: 'var(--bg-secondary)' }}
              fill="url(#lineGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (type === 'pie') {
      const COLORS = ['var(--primary-500)', 'var(--success-500)', 'var(--warning-500)', 'var(--error-500)'];
      
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--glass-bg)',
                backdropFilter: 'var(--backdrop-blur-md)',
                WebkitBackdropFilter: 'var(--backdrop-blur-md)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--border-radius-lg)',
                color: 'var(--text-primary)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="chart-card-modern glass hover-lift transition-all fade-in-up">
      <div className="chart-header">
        <h3 className="chart-title-modern">{title}</h3>
      </div>
      <div className="chart-container-modern">
        {renderChart()}
      </div>
    </div>
  );
};

// Botão de Ação Rápida Moderno
export const QuickActionButton = ({ 
  icon, 
  title, 
  description, 
  onClick,
  color = 'primary',
  disabled = false 
}) => (
  <button 
    className={`quick-action-modern quick-action-${color} glass hover-lift transition-all ${disabled ? 'disabled' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    <div className="quick-action-icon">{icon}</div>
    <div className="quick-action-content">
      <h4 className="quick-action-title">{title}</h4>
      <p className="quick-action-description">{description}</p>
    </div>
    <div className="quick-action-arrow">→</div>
  </button>
);

// Widget de Estatística em Tempo Real
export const LiveStatsWidget = ({ 
  title, 
  stats, 
  updateInterval = 30000,
  isLive = true 
}) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, isLive]);

  return (
    <div className="live-stats-widget glass fade-in-up">
      <div className="live-stats-header">
        <h3 className="live-stats-title">{title}</h3>
        <div className="live-indicator">
          <div className={`live-dot ${isLive ? 'active' : ''}`}></div>
          <span className="live-text">
            {isLive ? 'Ao vivo' : 'Offline'}
          </span>
        </div>
      </div>
      
      <div className="live-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="live-stat-item">
            <span className="live-stat-icon">{stat.icon}</span>
            <div className="live-stat-content">
              <div className="live-stat-value">{stat.value}</div>
              <div className="live-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="live-stats-footer">
        <span className="last-update">
          Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
        </span>
      </div>
    </div>
  );
};

// Componente de Progresso Circular
export const CircularProgress = ({ 
  percentage, 
  color = 'primary', 
  size = 120,
  strokeWidth = 8,
  label,
  showPercentage = true 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    primary: 'var(--primary-500)',
    success: 'var(--success-500)',
    warning: 'var(--warning-500)',
    error: 'var(--error-500)'
  };

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="circular-progress-svg">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorMap[color]} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colorMap[color]} stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border-primary)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${color})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="progress-circle"
          style={{
            transition: 'stroke-dashoffset 0.8s ease-in-out',
            transform: 'rotate(-90deg)',
            transformOrigin: `${size / 2}px ${size / 2}px`
          }}
        />
      </svg>
      
      <div className="circular-progress-content">
        {showPercentage && (
          <span className="circular-progress-percentage">{percentage}%</span>
        )}
        {label && (
          <span className="circular-progress-label">{label}</span>
        )}
      </div>
    </div>
  );
};

// Dashboard Principal Moderno
export const ModernDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [kpiData, setKpiData] = useState({
    totalPromocoes: 0,
    totalParticipantes: 0,
    promocoesAtivas: 0,
    participacoesHoje: 0
  });

  // Dados de exemplo para gráficos
  const chartData = [
    { name: '00:00', value: 12 },
    { name: '04:00', value: 8 },
    { name: '08:00', value: 45 },
    { name: '12:00', value: 78 },
    { name: '16:00', value: 95 },
    { name: '20:00', value: 67 },
    { name: '24:00', value: 23 }
  ];

  const pieData = [
    { name: 'QR Code TV', value: 45 },
    { name: 'Facebook', value: 30 },
    { name: 'Instagram', value: 20 },
    { name: 'Direto', value: 5 }
  ];

  const liveStats = [
    { icon: '👥', value: '1,234', label: 'Online Agora' },
    { icon: '📊', value: '89%', label: 'Taxa Conversão' },
    { icon: '⚡', value: '2.3s', label: 'Tempo Resposta' }
  ];

  useEffect(() => {
    // Simula carregamento de dados
    setTimeout(() => {
      setKpiData({
        totalPromocoes: 25,
        totalParticipantes: 1847,
        promocoesAtivas: 8,
        participacoesHoje: 156
      });
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  return (
    <div className="modern-dashboard">
      {/* KPI Grid */}
      <div className="kpi-grid-modern">
        <AnimatedKPICard
          icon="🎯"
          value={kpiData.totalPromocoes}
          label="Total de Promoções"
          trend={12}
          color="primary"
          isLoading={isLoading}
        />
        
        <AnimatedKPICard
          icon="👥"
          value={kpiData.totalParticipantes}
          label="Total de Participantes"
          trend={8}
          color="success"
          isLoading={isLoading}
        />
        
        <AnimatedKPICard
          icon="📈"
          value={kpiData.promocoesAtivas}
          label="Promoções Ativas"
          trend={-3}
          color="warning"
          isLoading={isLoading}
        />
        
        <AnimatedKPICard
          icon="⚡"
          value={kpiData.participacoesHoje}
          label="Participações Hoje"
          trend={25}
          color="info"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid-modern">
        <ModernChart
          title="Participações por Hora (Últimas 24h)"
          data={chartData}
          type="line"
          isLoading={false}
          height={300}
        />
        
        <ModernChart
          title="Origem dos Cadastros"
          data={pieData}
          type="pie"
          isLoading={false}
          height={300}
        />
      </div>

      {/* Stats e Progress Section */}
      <div className="stats-grid-modern">
        <LiveStatsWidget
          title="Estatísticas em Tempo Real"
          stats={liveStats}
          isLive={true}
        />
        
        <div className="progress-widget glass">
          <h3 className="widget-title">Meta do Mês</h3>
          <div className="progress-container">
            <CircularProgress
              percentage={73}
              color="success"
              size={140}
              label="Participantes"
            />
            <div className="progress-details">
              <div className="progress-item">
                <span className="progress-current">1,847</span>
                <span className="progress-target">/ 2,500</span>
              </div>
              <div className="progress-remaining">
                653 para a meta
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-modern">
        <h3 className="section-title-modern">Ações Rápidas</h3>
        <div className="quick-actions-grid">
          <QuickActionButton
            icon="➕"
            title="Nova Promoção"
            description="Criar uma nova campanha"
            onClick={() => console.log('Nova promoção')}
            color="primary"
          />
          
          <QuickActionButton
            icon="🔗"
            title="Gerar Link"
            description="Criar link personalizado"
            onClick={() => console.log('Gerar link')}
            color="success"
          />
          
          <QuickActionButton
            icon="📊"
            title="Relatórios"
            description="Ver análises detalhadas"
            onClick={() => console.log('Relatórios')}
            color="info"
          />
          
          <QuickActionButton
            icon="🎲"
            title="Sorteio"
            description="Realizar sorteio ao vivo"
            onClick={() => console.log('Sorteio')}
            color="warning"
          />
        </div>
      </div>
    </div>
  );
};

// CSS para os componentes modernos
export const modernDashboardCSS = `
/* === KPI CARDS MODERNOS === */
.kpi-card-modern {
  position: relative;
  padding: var(--space-6);
  border-radius: var(--border-radius-2xl);
  border: 1px solid var(--glass-border);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.kpi-card-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.kpi-card-modern:hover::before {
  opacity: 1;
}

.kpi-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.kpi-icon-modern {
  width: 48px;
  height: 48px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  box-shadow: var(--shadow-lg);
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-full);
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur-sm);
  -webkit-backdrop-filter: var(--backdrop-blur-sm);
}

.trend-icon {
  font-size: 0.875rem;
}

.kpi-content-modern {
  position: relative;
}

.kpi-value-animated {
  font-size: clamp(1.875rem, 4vw, 2.5rem);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-2);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.kpi-label-modern {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.kpi-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.8s ease-in-out;
}

.kpi-card-modern:hover .kpi-shine {
  left: 100%;
}

/* Variações de cores */
.kpi-card-primary .kpi-icon-modern {
  background: var(--gradient-primary);
}

.kpi-card-success .kpi-icon-modern {
  background: var(--gradient-forest);
}

.kpi-card-warning .kpi-icon-modern {
  background: var(--gradient-sunset);
}

.kpi-card-info .kpi-icon-modern {
  background: var(--gradient-ocean);
}

/* === CHARTS MODERNOS === */
.chart-card-modern {
  padding: var(--space-6);
  border-radius: var(--border-radius-2xl);
  border: 1px solid var(--glass-border);
  transition: all var(--transition-normal);
}

.chart-header {
  margin-bottom: var(--space-6);
}

.chart-title-modern {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.chart-container-modern {
  position: relative;
}

/* === AÇÕES RÁPIDAS MODERNAS === */
.quick-actions-modern {
  margin-top: var(--space-8);
}

.section-title-modern {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.quick-action-modern {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-xl);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-align: left;
  width: 100%;
}

.quick-action-modern:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.quick-action-icon {
  width: 48px;
  height: 48px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
}

.quick-action-content {
  flex: 1;
  min-width: 0;
}

.quick-action-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--space-1) 0;
  color: var(--text-primary);
}

.quick-action-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.quick-action-arrow {
  font-size: 1.25rem;
  color: var(--text-tertiary);
  transition: transform var(--transition-normal);
}

.quick-action-modern:hover .quick-action-arrow {
  transform: translateX(4px);
}

.quick-action-modern.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* === STATS AO VIVO === */
.live-stats-widget {
  padding: var(--space-6);
  border-radius: var(--border-radius-2xl);
  border: 1px solid var(--glass-border);
}

.live-stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.live-stats-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gray-400);
  position: relative;
}

.live-dot.active {
  background: var(--success-500);
}

.live-dot.active::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid var(--success-500);
  border-radius: 50%;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.live-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.live-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-4);
}

.live-stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur-sm);
  -webkit-backdrop-filter: var(--backdrop-blur-sm);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--glass-border);
}

.live-stat-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.live-stat-content {
  flex: 1;
  min-width: 0;
}

.live-stat-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
}

.live-stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.live-stats-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-primary);
}

.last-update {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  font-style: italic;
}

/* === PROGRESSO CIRCULAR === */
.circular-progress {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.circular-progress-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.circular-progress-percentage {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1;
}

.circular-progress-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--space-1);
}

/* === WIDGET DE PROGRESSO === */
.progress-widget {
  padding: var(--space-6);
  border-radius: var(--border-radius-2xl);
  border: 1px solid var(--glass-border);
}

.widget-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-6) 0;
  text-align: center;
}

.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.progress-details {
  text-align: center;
}

.progress-item {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
}

.progress-current {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--success-500);
}

.progress-target {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
}

.progress-remaining {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

/* === GRIDS === */
.kpi-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.charts-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.stats-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

/* === RESPONSIVIDADE === */
@media (max-width: 768px) {
  .kpi-grid-modern,
  .charts-grid-modern,
  .stats-grid-modern {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
  
  .live-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-container {
    flex-direction: row;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .kpi-card-modern,
  .chart-card-modern,
  .live-stats-widget,
  .progress-widget {
    padding: var(--space-4);
  }
  
  .kpi-value-animated {
    font-size: 2rem;
  }
  
  .quick-action-modern {
    padding: var(--space-4);
  }
  
  .quick-action-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}
`;
          
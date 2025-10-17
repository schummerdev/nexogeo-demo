// ModernDashboard.jsx - Componentes do Dashboard Moderno
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LoadingSpinner, SkeletonKPI } from './LoadingComponents';

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

    const duration = 2000;
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

  const getTrendColor = () => {
    if (trend > 0) return 'var(--success-500)';
    if (trend < 0) return 'var(--error-500)';
    return 'var(--gray-500)';
  };

  const getTrendIcon = () => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  const getGradient = () => {
    const gradients = {
      primary: 'var(--gradient-primary)',
      success: 'var(--gradient-forest)',
      warning: 'var(--gradient-sunset)',
      info: 'var(--gradient-ocean)'
    };
    return gradients[color] || gradients.primary;
  };

  const cardStyles = {
    position: 'relative',
    padding: 'var(--space-6)',
    borderRadius: 'var(--border-radius-2xl)',
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--backdrop-blur-sm)',
    WebkitBackdropFilter: 'var(--backdrop-blur-sm)',
    border: '1px solid var(--glass-border)',
    overflow: 'hidden',
    transition: 'all var(--transition-normal)',
    boxShadow: 'var(--shadow-lg)',
    cursor: 'pointer'
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--space-4)'
  };

  const iconStyles = {
    width: '48px',
    height: '48px',
    background: getGradient(),
    borderRadius: 'var(--border-radius-xl)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: 'white',
    boxShadow: 'var(--shadow-lg)'
  };

  const trendStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-1)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    padding: 'var(--space-1) var(--space-2)',
    borderRadius: 'var(--border-radius-full)',
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--backdrop-blur-sm)',
    WebkitBackdropFilter: 'var(--backdrop-blur-sm)',
    color: getTrendColor()
  };

  const valueStyles = {
    fontSize: 'clamp(1.875rem, 4vw, 2.5rem)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--text-primary)',
    lineHeight: 'var(--line-height-tight)',
    marginBottom: 'var(--space-2)',
    background: getGradient(),
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const labelStyles = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--text-secondary)',
    fontWeight: 'var(--font-weight-medium)',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  return (
    <div 
      style={cardStyles}
      className="kpi-card-modern hover-lift transition-all fade-in-up"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
    >
      <div style={headerStyles}>
        <div style={iconStyles}>
          {icon}
        </div>
        {trend !== 0 && (
          <div style={trendStyles}>
            <span>{getTrendIcon()}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <div style={valueStyles}>
          {prefix}{displayValue.toLocaleString('pt-BR')}{suffix}
        </div>
        <p style={labelStyles}>{label}</p>
      </div>
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
      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--backdrop-blur-sm)',
        WebkitBackdropFilter: 'var(--backdrop-blur-sm)',
        borderRadius: 'var(--border-radius-2xl)',
        border: '1px solid var(--glass-border)',
        padding: 'var(--space-6)'
      }}>
        <div style={{
          width: '40%',
          height: '1.5rem',
          background: 'var(--skeleton)',
          borderRadius: 'var(--border-radius-md)',
          marginBottom: 'var(--space-4)'
        }}></div>
        <div style={{
          width: '100%',
          height: `${height}px`,
          background: 'var(--skeleton)',
          borderRadius: 'var(--border-radius-lg)'
        }}></div>
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
    <div style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--backdrop-blur-sm)',
      WebkitBackdropFilter: 'var(--backdrop-blur-sm)',
      borderRadius: 'var(--border-radius-2xl)',
      border: '1px solid var(--glass-border)',
      padding: 'var(--space-6)',
      transition: 'all var(--transition-normal)',
      boxShadow: 'var(--shadow-lg)'
    }} className="chart-card-modern hover-lift fade-in-up">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h3 style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--text-primary)',
          margin: 0
        }}>{title}</h3>
      </div>
      <div>
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
}) => {
  const getGradient = () => {
    const gradients = {
      primary: 'var(--gradient-primary)',
      success: 'var(--gradient-forest)',
      warning: 'var(--gradient-sunset)',
      info: 'var(--gradient-ocean)'
    };
    return gradients[color] || gradients.primary;
  };

  const buttonStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-4)',
    padding: 'var(--space-5)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-xl)',
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--backdrop-blur-sm)',
    WebkitBackdropFilter: 'var(--backdrop-blur-sm)',
    color: 'var(--text-primary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-normal)',
    textAlign: 'left',
    width: '100%',
    opacity: disabled ? 0.5 : 1
  };

  const iconStyles = {
    width: '48px',
    height: '48px',
    background: getGradient(),
    borderRadius: 'var(--border-radius-xl)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    color: 'white',
    flexShrink: 0
  };

  const titleStyles = {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-semibold)',
    margin: '0 0 4px 0',
    color: 'var(--text-primary)'
  };

  const descriptionStyles = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--text-secondary)',
    margin: 0
  };

  return (
    <button 
      style={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      className="quick-action-modern hover-lift transition-all fade-in-up"
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
    >
      <div style={iconStyles}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={titleStyles}>{title}</h4>
        <p style={descriptionStyles}>{description}</p>
      </div>
      <div style={{
        fontSize: '1.25rem',
        color: 'var(--text-tertiary)',
        transition: 'transform var(--transition-normal)'
      }}>
        →
      </div>
    </button>
  );
};

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
    <div style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--backdrop-blur-sm)',
      WebkitBackdropFilter: 'var(--backdrop-blur-sm)',
      borderRadius: 'var(--border-radius-2xl)',
      border: '1px solid var(--glass-border)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-lg)'
    }} className="live-stats-widget fade-in-up">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 'var(--space-4)'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3)',
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--backdrop-blur-sm)',
            WebkitBackdropFilter: 'var(--backdrop-blur-sm)',
            borderRadius: 'var(--border-radius-lg)',
            border: '1px solid var(--glass-border)'
          }}>
            <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>
              {stat.icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--text-primary)',
                lineHeight: 'var(--line-height-tight)'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: '2px'
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: 'var(--space-4)',
        paddingTop: 'var(--space-4)',
        borderTop: '1px solid var(--border-primary)'
      }}>
        <span style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--text-tertiary)',
          fontStyle: 'italic'
        }}>
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

  // Adicionar estilos de animação
  React.useEffect(() => {
    const styleId = 'circular-progress-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
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
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size
    }}>
      <svg width={size} height={size} style={{
        transform: 'rotate(-90deg)'
      }}>
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
          style={{
            transition: 'stroke-dashoffset 0.8s ease-in-out'
          }}
        />
      </svg>
      
      <div style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        {showPercentage && (
          <span style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            lineHeight: 1
          }}>
            {percentage}%
          </span>
        )}
        {label && (
          <span style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            marginTop: 'var(--space-1)'
          }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
};: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-6)'
      }}>
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--text-primary)',
          margin: 0
        }}>{title}</h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isLive ? 'var(--success-500)' : 'var(--gray-400)',
            position: 'relative'
          }}>
            {isLive && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                right: '-4px',
                bottom: '-4px',
                border: '2px solid var(--success-500)',
                borderRadius: '50%',
                animation: 'pulse-ring 2s infinite'
              }}></div>
            )}
          </div>
          <span style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            {isLive ? 'Ao vivo' : 'Offline'}
          </span>
        </div>
      </div>
      
      <div style={{
        display
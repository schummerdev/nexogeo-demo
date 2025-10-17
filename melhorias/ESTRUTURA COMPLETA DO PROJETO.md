# 📦 NexoGeo-Modern-Complete.zip

## 📁 ESTRUTURA COMPLETA DO PROJETO

```
client/
├── src/
│   ├── styles/                      🆕 CRIAR PASTA
│   │   └── design-tokens.css        🆕 CRIAR ARQUIVO
│   ├── components/
│   │   ├── ThemeProvider.jsx        🆕 CRIAR ARQUIVO
│   │   ├── ToastProvider.jsx        🆕 CRIAR ARQUIVO  
│   │   ├── LoadingComponents.jsx    🆕 CRIAR ARQUIVO
│   │   ├── ModernDashboard.jsx      🆕 CRIAR ARQUIVO
│   │   ├── DashboardLayout/         ✅ MANTER EXISTENTE
│   │   ├── CapturaForm/             ✅ MANTER EXISTENTE
│   │   └── LoginForm/               ✅ MANTER EXISTENTE
│   ├── pages/
│   │   ├── ModernDashboardPage.jsx  🆕 CRIAR ARQUIVO
│   │   ├── PromocoesPage.jsx        ✅ MANTER EXISTENTE
│   │   └── DashboardPages.css       ✅ MANTER EXISTENTE
│   ├── App.jsx                      🔄 SUBSTITUIR
│   └── index.css                    🔄 SUBSTITUIR
├── public/
│   └── index.html                   🔄 SUBSTITUIR
└── package.json                     🔄 SUBSTITUIR
```

---

## 🆕 **ARQUIVOS PARA CRIAR:**

### **📄 client/src/styles/design-tokens.css**
```css
/* design-tokens.css - Sistema de Design Moderno para NexoGeo */

:root {
  /* === CORES PRINCIPAIS === */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* === CORES NEUTRAS === */
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;

  /* === CORES DE ESTADO === */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --success-700: #15803d;

  --warning-50: #fefce8;
  --warning-500: #eab308;
  --warning-600: #ca8a04;

  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  --error-700: #b91c1c;

  /* === GRADIENTES MODERNOS === */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-cosmic: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  --gradient-ocean: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
  --gradient-forest: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
  --gradient-sunset: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
  --gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);

  /* === SOMBRAS === */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3);

  /* === TRANSIÇÕES === */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* === ESPAÇAMENTOS === */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  /* === TIPOGRAFIA === */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* === BORDAS === */
  --border-radius-sm: 0.375rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;
  --border-radius-xl: 1rem;
  --border-radius-2xl: 1.5rem;
  --border-radius-full: 9999px;

  /* === BACKDROP FILTER === */
  --backdrop-blur-xs: blur(2px);
  --backdrop-blur-sm: blur(4px);
  --backdrop-blur-md: blur(8px);
  --backdrop-blur-lg: blur(16px);
}

/* === TEMAS === */
[data-theme="light"] {
  --bg-primary: var(--gray-50);
  --bg-secondary: #ffffff;
  --bg-tertiary: var(--gray-100);
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-600);
  --text-tertiary: var(--gray-500);
  --border-primary: var(--gray-200);
  --border-secondary: var(--gray-300);
  --glass-bg: rgba(255, 255, 255, 0.25);
  --glass-border: rgba(255, 255, 255, 0.18);
}

[data-theme="dark"] {
  --bg-primary: var(--gray-900);
  --bg-secondary: var(--gray-800);
  --bg-tertiary: var(--gray-700);
  --text-primary: var(--gray-100);
  --text-secondary: var(--gray-300);
  --text-tertiary: var(--gray-400);
  --border-primary: var(--gray-700);
  --border-secondary: var(--gray-600);
  --glass-bg: rgba(0, 0, 0, 0.25);
  --glass-border: rgba(255, 255, 255, 0.1);
}

/* === CLASSES UTILITÁRIAS === */
.glass {
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur-sm);
  -webkit-backdrop-filter: var(--backdrop-blur-sm);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.transition-all {
  transition: all var(--transition-normal);
}

/* === ANIMAÇÕES === */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 30px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes skeleton-loading {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.fade-in-up {
  animation: fadeInUp 0.6s var(--transition-normal) both;
}

.skeleton {
  background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-300) 50%, var(--gray-200) 75%);
  background-size: 200px 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--border-radius-md);
}

[data-theme="dark"] .skeleton {
  background: linear-gradient(90deg, var(--gray-700) 25%, var(--gray-600) 50%, var(--gray-700) 75%);
  background-size: 200px 100%;
}

/* === TRANSIÇÕES SUAVES === */
* {
  transition: background-color var(--transition-normal), 
              color var(--transition-normal), 
              border-color var(--transition-normal),
              box-shadow var(--transition-normal);
}
```

### **📄 client/src/components/ThemeProvider.jsx**
```javascript
// ThemeProvider.jsx - Sistema de Modo Escuro Automático
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('nexogeo-theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexogeo-theme', theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const userHasPreference = localStorage.getItem('nexogeo-user-preference');
      if (!userHasPreference) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('nexogeo-user-preference', 'true');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      style={{
        position: 'relative',
        width: '48px',
        height: '48px',
        borderRadius: 'var(--border-radius-xl)',
        border: '1px solid var(--border-primary)',
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all var(--transition-normal)',
        boxShadow: 'var(--shadow-sm)',
        fontSize: '1.25rem'
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
```

### **📄 client/src/components/ToastProvider.jsx**
```javascript
// ToastProvider.jsx - Sistema de Notificações Toast
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type: 'info', duration: 4000, closable: true, ...toast };
    setToasts(prev => [...prev, newToast]);
    if (newToast.duration > 0) {
      setTimeout(() => removeToast(id), newToast.duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', title: 'Sucesso!', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', title: 'Erro!', message, duration: 6000, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', title: 'Atenção!', message, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', title: 'Informação', message, ...options });
  }, [addToast]);

  React.useEffect(() => {
    const styleId = 'toast-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .toast-container {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
          width: 100%;
          pointer-events: none;
        }
        .toast {
          pointer-events: auto;
          background: var(--glass-bg);
          backdrop-filter: var(--backdrop-blur-md);
          -webkit-backdrop-filter: var(--backdrop-blur-md);
          border-radius: var(--border-radius-xl);
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-2xl);
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: flex-start;
          padding: 16px;
          gap: 12px;
          animation: slideInToast 0.3s ease-out;
        }
        @keyframes slideInToast {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .toast-success { border-left: 4px solid var(--success-500); }
        .toast-error { border-left: 4px solid var(--error-500); }
        .toast-warning { border-left: 4px solid var(--warning-500); }
        .toast-info { border-left: 4px solid var(--primary-500); }
        .toast-icon { font-size: 1.25rem; flex-shrink: 0; margin-top: 2px; }
        .toast-success .toast-icon { color: var(--success-500); }
        .toast-error .toast-icon { color: var(--error-500); }
        .toast-warning .toast-icon { color: var(--warning-500); }
        .toast-info .toast-icon { color: var(--primary-500); }
        .toast-body { flex: 1; min-width: 0; }
        .toast-title { font-weight: 600; font-size: 0.875rem; color: var(--text-primary); margin: 0 0 4px 0; }
        .toast-message { font-size: 0.875rem; color: var(--text-secondary); margin: 0; }
        .toast-close {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.15s;
        }
        .toast-close:hover {
          background: rgba(0, 0, 0, 0.1);
          color: var(--text-primary);
        }
        @media (max-width: 480px) {
          .toast-container { top: 16px; right: 16px; left: 16px; max-width: none; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📄';
    }
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-icon">{getIcon(toast.type)}</div>
          <div className="toast-body">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            <div className="toast-message">{toast.message}</div>
          </div>
          {toast.closable && (
            <button className="toast-close" onClick={() => onRemove(toast.id)}>×</button>
          )}
        </div>
      ))}
    </div>
  );
};

export const useNotifications = () => {
  const { success, error, warning, info } = useToast();
  return { success, error, warning, info };
};
```

### **📄 client/src/components/LoadingComponents.jsx**
```javascript
// LoadingComponents.jsx - Sistema de Loading States Modernos
import React from 'react';

export const LoadingSpinner = ({ size = 'md', color = 'primary', fullScreen = false }) => {
  const sizeMap = { xs: '16px', sm: '24px', md: '32px', lg: '48px', xl: '64px' };
  const colorMap = {
    primary: 'var(--primary-500)', success: 'var(--success-500)', 
    error: 'var(--error-500)', warning: 'var(--warning-500)'
  };

  const spinner = (
    <div style={{
      display: 'inline-block', position: 'relative', 
      width: sizeMap[size], height: sizeMap[size], color: colorMap[color]
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: 'absolute', border: '2px solid transparent', borderRadius: '50%',
          borderTopColor: 'currentColor', animation: `spin-${i} 1.2s infinite`,
          width: i === 0 ? '100%' : i === 1 ? '80%' : '60%',
          height: i === 0 ? '100%' : i === 1 ? '80%' : '60%',
          top: i === 0 ? 0 : i === 1 ? '10%' : '20%',
          left: i === 0 ? 0 : i === 1 ? '10%' : '20%',
          opacity: i === 0 ? 1 : i === 1 ? 0.7 : 0.4
        }} />
      ))}
    </div>
  );

  React.useEffect(() => {
    if (!document.getElementById('spinner-animations')) {
      const style = document.createElement('style');
      style.id = 'spinner-animations';
      style.textContent = `
        @keyframes spin-0 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes spin-1 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes spin-2 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998
      }}>
        <div style={{
          textAlign: 'center', background: 'var(--bg-secondary)', padding: '32px',
          borderRadius: '24px', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-primary)'
        }}>
          {spinner}
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Carregando...
          </p>
        </div>
      </div>
    );
  }
  return spinner;
};

export const SkeletonLine = ({ width = '100%', height = '1rem' }) => (
  <div style={{ 
    width, height, borderRadius: '8px',
    background: 'linear-gradient(90deg, var(--gray-200) 25%, var(--gray-300) 50%, var(--gray-200) 75%)',
    backgroundSize: '200px 100%', animation: 'skeleton-loading 1.5s infinite'
  }} />
);

export const SkeletonCircle = ({ size = '3rem' }) => (
  <div style={{ 
    width: size, height: size, borderRadius: '50%',
    background: 'linear-gradient(90deg, var(--gray-200) 25%, var(--gray-300) 50%, var(--gray-200) 75%)',
    backgroundSize: '200px 100%', animation: 'skeleton-loading 1.5s infinite'
  }} />
);

export const SkeletonKPI = () => (
  <div style={{
    background: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px',
    border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: '16px'
  }}>
    <SkeletonCircle size="3.5rem" />
    <div style={{ flex: 1 }}>
      <SkeletonLine width="60%" height="2rem" />
      <div style={{ marginBottom: '8px' }} />
      <SkeletonLine width="80%" height="1rem" />
    </div>
  </div>
);

export const SkeletonDashboard = () => (
  <div className="fade-in-up" style={{ marginTop: '32px' }}>
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px', marginBottom: '32px'
    }}>
      {Array.from({ length: 4 }, (_, i) => <SkeletonKPI key={i} />)}
    </div>
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px'
    }}>
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} style={{
          background: 'var(--bg-secondary)', borderRadius: '24px', 
          padding: '24px', border: '1px solid var(--border-primary)'
        }}>
          <SkeletonLine width="40%" height="1.5rem" />
          <div style={{ marginBottom: '16px' }} />
          <div style={{
            width: '100%', height: '200px', borderRadius: '12px',
            background: 'linear-gradient(90deg, var(--gray-200) 25%, var(--gray-300) 50%, var(--gray-200) 75%)',
            backgroundSize: '200px 100%', animation: 'skeleton-loading 1.5s infinite'
          }} />
        </div>
      ))}
    </div>
  </div>
);
```

### **📄 client/src/components/ModernDashboard.jsx**
```javascript
// ModernDashboard.jsx - Componentes do Dashboard Moderno  
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LoadingSpinner, SkeletonKPI } from './LoadingComponents';

export const AnimatedKPICard = ({ 
  icon, value, label, trend = 0, color = 'primary', prefix = '', suffix = '', isLoading = false 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (!isVisible || isLoading) return;
    const duration = 2000;
    const startTime = Date.now();
    const endValue = typeof value === 'number' ? value : 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = endValue * easeOut;
      setDisplayValue(Math.round(currentValue));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, isVisible, isLoading]);

  if (isLoading) return <SkeletonKPI />;

  const gradients = {
    primary: 'var(--gradient-primary)', success: 'var(--gradient-forest)',
    warning: 'var(--gradient-sunset)', info: 'var(--gradient-ocean)'
  };

  return (
    <div style={{
      position: 'relative', padding: '24px', borderRadius: '24px',
      background: 'var(--glass-bg)', backdropFilter: 'var(--backdrop-blur-sm)',
      WebkitBackdropFilter: 'var(--backdrop-blur-
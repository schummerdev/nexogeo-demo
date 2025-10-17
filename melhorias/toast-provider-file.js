// ToastProvider.jsx - Sistema de Notificações Toast Elegante
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
    const newToast = {
      id,
      type: 'info',
      duration: 4000,
      closable: true,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove se tiver duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Métodos de conveniência
  const success = useCallback((message, options = {}) => {
    return addToast({
      type: 'success',
      title: 'Sucesso!',
      message,
      ...options
    });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({
      type: 'error',
      title: 'Erro!',
      message,
      duration: 6000, // Erro fica mais tempo
      ...options
    });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({
      type: 'warning',
      title: 'Atenção!',
      message,
      ...options
    });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({
      type: 'info',
      title: 'Informação',
      message,
      ...options
    });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      removeAllToasts,
      success,
      error,
      warning,
      info
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// ToastContainer.jsx - Container dos Toasts
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  const containerStyles = {
    position: 'fixed',
    top: 'var(--space-6)',
    right: 'var(--space-6)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
    maxWidth: '400px',
    width: '100%',
    pointerEvents: 'none'
  };

  return (
    <div style={containerStyles}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

// Toast.jsx - Componente individual de Toast
const Toast = ({
  id,
  type,
  title,
  message,
  icon,
  closable,
  onRemove,
  action
}) => {
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📄';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'var(--success-500)';
      case 'error': return 'var(--error-500)';
      case 'warning': return 'var(--warning-500)';
      case 'info': return 'var(--primary-500)';
      default: return 'var(--primary-500)';
    }
  };

  const toastStyles = {
    position: 'relative',
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--backdrop-blur-md)',
    WebkitBackdropFilter: 'var(--backdrop-blur-md)',
    borderRadius: 'var(--border-radius-xl)',
    border: '1px solid var(--glass-border)',
    borderLeft: `4px solid ${getBorderColor()}`,
    pointerEvents: 'auto',
    overflow: 'hidden',
    minHeight: '64px',
    transform: 'translateX(100%)',
    animation: 'slideInToast 0.3s var(--transition-normal) forwards',
    boxShadow: 'var(--shadow-2xl)'
  };

  const contentStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    padding: 'var(--space-4)',
    gap: 'var(--space-3)',
    position: 'relative'
  };

  const iconStyles = {
    fontSize: '1.25rem',
    flexShrink: 0,
    marginTop: '2px',
    color: getBorderColor()
  };

  const bodyStyles = {
    flex: 1,
    minWidth: 0
  };

  const titleStyles = {
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-1)',
    lineHeight: 'var(--line-height-tight)',
    margin: '0 0 4px 0'
  };

  const messageStyles = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--text-secondary)',
    lineHeight: 'var(--line-height-normal)',
    wordWrap: 'break-word',
    margin: 0
  };

  const closeStyles = {
    position: 'absolute',
    top: 'var(--space-2)',
    right: 'var(--space-2)',
    width: '24px',
    height: '24px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    borderRadius: 'var(--border-radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    lineHeight: 1,
    transition: 'all var(--transition-fast)'
  };

  const progressStyles = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    width: '100%',
    borderRadius: '0 0 var(--border-radius-xl) var(--border-radius-xl)',
    background: getBorderColor(),
    animation: 'toastProgress 4s linear forwards'
  };

  // Adicionar estilos CSS necessários ao head se não existirem
  React.useEffect(() => {
    const styleId = 'toast-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes slideInToast {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @media (max-width: 480px) {
          .toast-container-responsive {
            top: var(--space-4) !important;
            right: var(--space-4) !important;
            left: var(--space-4) !important;
            max-width: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={toastStyles} className="toast fade-in-up">
      <div style={contentStyles}>
        <div style={iconStyles}>
          {getIcon()}
        </div>
        
        <div style={bodyStyles}>
          {title && <div style={titleStyles}>{title}</div>}
          <div style={messageStyles}>{message}</div>
        </div>
        
        {action && (
          <div style={{ flexShrink: 0 }}>
            <button
              style={{
                background: 'transparent',
                border: `1px solid ${getBorderColor()}`,
                color: getBorderColor(),
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--border-radius-md)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onClick={action.onClick}
              onMouseOver={(e) => {
                e.target.style.background = getBorderColor();
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = getBorderColor();
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {action.label}
            </button>
          </div>
        )}
        
        {closable && (
          <button
            style={closeStyles}
            onClick={onRemove}
            aria-label="Fechar notificação"
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.1)';
              e.target.style.color = 'var(--text-primary)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--text-tertiary)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>
        )}
      </div>
      
      <div style={progressStyles}></div>
    </div>
  );
};

// Hook para facilitar o uso
export const useNotifications = () => {
  const { success, error, warning, info, removeAllToasts } = useToast();
  
  const notify = {
    success: (message, options) => success(message, options),
    error: (message, options) => error(message, options),
    warning: (message, options) => warning(message, options),
    info: (message, options) => info(message, options),
    clearAll: () => removeAllToasts()
  };

  return notify;
};
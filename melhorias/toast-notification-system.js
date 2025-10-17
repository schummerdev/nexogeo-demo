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

  return (
    <div className="toast-container">
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
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📄';
    }
  };

  return (
    <div className={`toast toast-${type} fade-in-up`}>
      <div className="toast-content">
        <div className="toast-icon">
          {getIcon()}
        </div>
        
        <div className="toast-body">
          {title && <div className="toast-title">{title}</div>}
          <div className="toast-message">{message}</div>
        </div>
        
        {action && (
          <div className="toast-action">
            <button
              className="toast-action-button"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          </div>
        )}
        
        {closable && (
          <button
            className="toast-close"
            onClick={onRemove}
            aria-label="Fechar notificação"
          >
            ×
          </button>
        )}
      </div>
      
      <div className={`toast-progress toast-progress-${type}`}></div>
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

// Estilos CSS para o sistema de Toast
export const toastCSS = `
/* Container dos Toasts */
.toast-container {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 400px;
  width: 100%;
  pointer-events: none;
}

/* Toast individual */
.toast {
  position: relative;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-primary);
  pointer-events: auto;
  overflow: hidden;
  min-height: 64px;
  transform: translateX(100%);
  animation: slideInToast 0.3s var(--transition-normal) forwards;
}

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

/* Glassmorphism effect */
.toast {
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur-md);
  -webkit-backdrop-filter: var(--backdrop-blur-md);
  border: 1px solid var(--glass-border);
}

/* Conteúdo do Toast */
.toast-content {
  display: flex;
  align-items: flex-start;
  padding: var(--space-4);
  gap: var(--space-3);
  position: relative;
}

.toast-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-body {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
  line-height: var(--line-height-tight);
}

.toast-message {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-normal);
  word-wrap: break-word;
}

/* Botão de ação */
.toast-action {
  flex-shrink: 0;
}

.toast-action-button {
  background: transparent;
  border: 1px solid var(--primary-500);
  color: var(--primary-500);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.toast-action-button:hover {
  background: var(--primary-500);
  color:
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
    // Verifica se já existe tema salvo
    const savedTheme = localStorage.getItem('nexogeo-theme');
    if (savedTheme) return savedTheme;
    
    // Se não, usa a preferência do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Aplica o tema ao documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexogeo-theme', theme);
  }, [theme]);

  // Escuta mudanças na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Só muda automaticamente se o usuário não definiu preferência manual
      const savedTheme = localStorage.getItem('nexogeo-theme');
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
    // Marca que o usuário tem preferência manual
    localStorage.setItem('nexogeo-user-preference', 'true');
  };

  const setThemeManual = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('nexogeo-user-preference', 'true');
  };

  const resetToSystem = () => {
    localStorage.removeItem('nexogeo-user-preference');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(systemTheme);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      setTheme: setThemeManual,
      resetToSystem,
      isSystemTheme: !localStorage.getItem('nexogeo-user-preference')
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ThemeToggle.jsx - Botão para alternar tema
export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      title={`Tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <div className="theme-toggle-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </div>
    </button>
  );
};

// Estilos CSS para o ThemeToggle
const themeToggleCSS = `
.theme-toggle {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  border: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.theme-toggle:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  background: var(--glass-bg);
  backdrop-filter: var(--backdrop-blur-sm);
  -webkit-backdrop-filter: var(--backdrop-blur-sm);
}

.theme-toggle:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.theme-toggle-icon {
  font-size: 1.25rem;
  transition: all var(--transition-normal);
}

.theme-toggle:hover .theme-toggle-icon {
  transform: scale(1.1) rotate(10deg);
}

/* Animação suave na mudança de tema */
* {
  transition: background-color var(--transition-normal), 
              color var(--transition-normal), 
              border-color var(--transition-normal),
              box-shadow var(--transition-normal);
}

/* Versão compacta para sidebar */
.theme-toggle-compact {
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius-lg);
  font-size: 1rem;
}

/* Versão com texto */
.theme-toggle-with-text {
  width: auto;
  padding: var(--space-2) var(--space-4);
  gap: var(--space-2);
  border-radius: var(--border-radius-lg);
}

.theme-toggle-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

/* Estados de tema */
[data-theme="light"] .theme-toggle {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .theme-toggle {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.1);
}
`;

// Hook personalizado para preferências do tema
export const useThemePreference = () => {
  const { theme, setTheme, resetToSystem, isSystemTheme } = useTheme();
  const [systemTheme, setSystemTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemTheme(e.matches ? 'dark' : 'light');
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    theme,
    systemTheme,
    isSystemTheme,
    setTheme,
    resetToSystem,
    availableThemes: ['light', 'dark', 'system']
  };
};

export { themeToggleCSS };
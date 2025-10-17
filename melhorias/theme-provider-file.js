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
        e.target.style.background = 'var(--glass-bg)';
        e.target.style.backdropFilter = 'var(--backdrop-blur-sm)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'var(--shadow-sm)';
        e.target.style.background = 'var(--bg-secondary)';
        e.target.style.backdropFilter = 'none';
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
// LoadingComponents.jsx - Sistema de Loading States Modernos
import React from 'react';

// Spinner Principal
export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  fullScreen = false 
}) => {
  const sizeMap = {
    xs: '16px',
    sm: '24px', 
    md: '32px',
    lg: '48px',
    xl: '64px'
  };

  const colorMap = {
    primary: 'var(--primary-500)',
    success: 'var(--success-500)',
    error: 'var(--error-500)',
    warning: 'var(--warning-500)'
  };

  const spinnerStyles = {
    display: 'inline-block',
    position: 'relative',
    width: sizeMap[size],
    height: sizeMap[size],
    color: colorMap[color]
  };

  const ringStyles = {
    position: 'absolute',
    border: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spinner-rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
  };

  const spinner = (
    <div style={spinnerStyles} className={`spinner ${className}`}>
      <div style={{
        ...ringStyles,
        width: '100%',
        height: '100%',
        borderTopColor: 'currentColor',
        animationDelay: '-0.45s'
      }}></div>
      <div style={{
        ...ringStyles,
        width: '80%',
        height: '80%',
        top: '10%',
        left: '10%',
        borderTopColor: 'currentColor',
        animationDelay: '-0.3s',
        opacity: 0.7
      }}></div>
      <div style={{
        ...ringStyles,
        width: '60%',
        height: '60%',
        top: '20%',
        left: '20%',
        borderTopColor: 'currentColor',
        animationDelay: '-0.15s',
        opacity: 0.4
      }}></div>
    </div>
  );

  // Adicionar estilos de animação se não existir
  React.useEffect(() => {
    const styleId = 'loading-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes spinner-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
        
        @keyframes wave-bounce {
          0%, 80%, 100%
// App.jsx - Aplicação Principal Integrada com Melhorias Modernas
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importar novos sistemas
import { ThemeProvider } from './components/ThemeProvider';
import { ToastProvider } from './components/ToastProvider';

// Importar páginas e componentes
import CapturaForm from './components/CapturaForm/CapturaForm';
import LoginForm from './components/LoginForm/LoginForm';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import { ModernDashboardPage } from './pages/ModernDashboardPage';
import PromocoesPage from './pages/PromocoesPage';

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Componente principal da aplicação
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/participar" element={<CapturaForm />} />
              <Route path="/login" element={<LoginForm />} />

              {/* Rotas Privadas (dentro do Layout do Dashboard) */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                {/* Dashboard Principal Moderno */}
                <Route index element={<ModernDashboardPage />} /> 
                
                {/* Páginas do Sistema */}
                <Route path="promocoes" element={<PromocoesPage />} />
                
                {/* Adicione outras rotas do dashboard aqui conforme implementar */}
                {/* <Route path="participantes" element={<ParticipantesPage />} /> */}
                {/* <Route path="gerador-links" element={<GeradorLinksPage />} /> */}
                {/* <Route path="sorteio" element={<SorteioPage />} /> */}
                {/* <Route path="configuracoes" element={<ConfiguracoesPage />} /> */}
              </Route>

              {/* Rota padrão para redirecionar para o dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
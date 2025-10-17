import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importar estilos globais responsivos
import './index.css';

// Importe suas páginas e componentes
import CapturaForm from './components/CapturaForm/CapturaForm';
import LoginForm from './components/LoginForm/LoginForm';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import DashboardHomePage from './pages/DashboardHomePage';
import PromocoesPage from './pages/PromocoesPage';

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
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
          {/* A rota "index" é a padrão para /dashboard */}
          <Route index element={<DashboardHomePage />} /> 
          <Route path="promocoes" element={<PromocoesPage />} />
          
          {/* Adicione outras rotas do dashboard aqui no futuro */}
          {/* <Route path="participantes" element={<ParticipantesPage />} /> */}
          {/* <Route path="gerador-links" element={<GeradorLinksPage />} /> */}
          {/* <Route path="sorteio" element={<SorteioPage />} /> */}
          {/* <Route path="configuracoes" element={<ConfiguracoesPage />} /> */}
        </Route>

        {/* Rota padrão para redirecionar para o login ou dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 
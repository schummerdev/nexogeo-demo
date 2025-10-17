import React from 'react';
import { useCaixaMisteriosa } from '../hooks/useCaixaMisteriosa';

// Importa os componentes de UI que criaremos a seguir
import AdminDashboard from '../components/caixa-misteriosa/AdminDashboard';
import ParticipantView from '../components/caixa-misteriosa/ParticipantView';
import WinnerDisplay from '../components/caixa-misteriosa/WinnerDisplay';
import LoadingSpinner from '../components/caixa-misteriosa/shared/LoadingSpinner';
import ErrorDisplay from '../components/caixa-misteriosa/shared/ErrorDisplay';
import WaitingScreen from '../components/caixa-misteriosa/WaitingScreen';

// Simula a obtenção do usuário logado. No app real, isso viria de um Contexto de Autenticação.
const useAuth = () => ({
    // Alterne entre 'admin' e 'participant' para ver as diferentes visões
    user: { role: 'admin' } 
});

const CaixaMisteriosaPage = () => {
    const { liveGame, loading, error, actions } = useCaixaMisteriosa();
    const { user } = useAuth();

    // Exibe um spinner de carregamento durante as requisições
    if (loading && !liveGame) {
        return <LoadingSpinner message="Carregando jogo..." />;
    }

    // Exibe uma mensagem de erro se algo falhar
    if (error) {
        return <ErrorDisplay message={error} />;
    }

    // Se o jogo terminou, mostra o vencedor
    if (liveGame?.status === 'finished') {
        return <WinnerDisplay winner={liveGame.winner} productName={liveGame.giveaway.productName} />;
    }

    // Visão do Administrador
    if (user.role === 'admin') {
        // Se não há jogo ativo, o admin vê o painel de setup.
        // Se há um jogo ativo, ele vê o dashboard de controle.
        return <AdminDashboard liveGame={liveGame} actions={actions} loading={loading} />;
    }

    // Visão do Participante
    if (liveGame && (liveGame.status === 'accepting' || liveGame.status === 'closed')) {
        return <ParticipantView liveGame={liveGame} actions={actions} loading={loading} />;
    }

    // Se nenhuma das condições acima for atendida, o participante vê uma tela de espera.
    return <WaitingScreen />;
};

export default CaixaMisteriosaPage;

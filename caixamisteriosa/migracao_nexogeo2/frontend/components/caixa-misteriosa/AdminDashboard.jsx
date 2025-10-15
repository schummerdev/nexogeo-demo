import React from 'react';

// Importa os sub-componentes que serão criados a seguir
import SetupView from './admin/SetupView';
import LiveControlView from './admin/LiveControlView';

// Painel de Controle do Administrador
// Este componente atua como um roteador, exibindo a visão correta
// com base no estado do jogo (se está ativo ou não).
const AdminDashboard = ({ liveGame, actions, loading }) => {

    const styles = {
        main: {
            padding: '2rem',
            backgroundColor: '#111827',
            color: 'white',
            minHeight: '100vh'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #374151',
            paddingBottom: '1rem',
            marginBottom: '2rem'
        },
        title: {
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#A78BFA'
        }
    };

    return (
        <main style={styles.main}>
            <header style={styles.header}>
                <h1 style={styles.title}>Painel do Administrador</h1>
                {/* Aqui você poderia adicionar um botão de logout ou de ver como participante */}
            </header>

            {
                // Se não há um jogo ativo (ou ele está pendente), mostra a tela de configuração.
                !liveGame || liveGame.status === 'pending' ? (
                    <SetupView actions={actions} loading={loading} />
                ) : (
                // Se há um jogo ativo (aceitando, fechado), mostra a tela de controle ao vivo.
                    <LiveControlView liveGame={liveGame} actions={actions} loading={loading} />
                )
            }
        </main>
    );
};

export default AdminDashboard;

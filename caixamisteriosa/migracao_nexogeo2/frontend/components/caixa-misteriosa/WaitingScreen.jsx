import React from 'react';

// Tela para participantes quando não há um jogo ativo.
const WaitingScreen = () => {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100vh',
        padding: '1rem',
        background: 'linear-gradient(to bottom, #111827, #4B0082)', // De cinza escuro para anil
        color: 'white',
    };

    return (
        <main style={containerStyle}>
            <div style={{ fontSize: '4rem', animation: 'pulse 2s infinite' }}>⏳</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '1rem' }}>Aguardando o Sorteio</h1>
            <p style={{ fontSize: '1.2rem', color: '#D1D5DB', marginTop: '0.5rem' }}>
                Nenhum sorteio ativo no momento. Por favor, aguarde o início.
            </p>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.1); }
                }
            `}</style>
        </main>
    );
};

export default WaitingScreen;

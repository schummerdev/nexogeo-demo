import React from 'react';

// Visão de Controle do Jogo Ao Vivo
const LiveControlView = ({ liveGame, actions, loading }) => {

    const { giveaway, revealedCluesCount, status, submissions } = liveGame;

    return (
        <div style={styles.grid}>
            {/* Coluna de Controles */}
            <div style={styles.column}>
                <div style={styles.card}>
                    <h3 style={styles.h3}>Controles do Jogo</h3>
                    <p>Sorteio atual: <strong>{giveaway.productName}</strong></p>
                    <p>Status: <span style={styles.status(status)}>{status}</span></p>
                    <div style={styles.buttonGroup}>
                        <button 
                            style={styles.button.primary}
                            onClick={actions.revealClue}
                            disabled={loading || revealedCluesCount >= 5 || status !== 'accepting'}
                        >
                            {revealedCluesCount >= 5 ? 'Todas as dicas reveladas' : `Revelar Dica (${revealedCluesCount + 1}/5)`}
                        </button>
                        {status === 'accepting' && (
                            <button 
                                style={styles.button.warning}
                                onClick={actions.endSubmissions}
                                disabled={loading}
                            >
                                Encerrar Palpites
                            </button>
                        )}
                        {status === 'closed' && (
                            <button 
                                style={styles.button.success}
                                onClick={actions.drawWinner}
                                disabled={loading || submissions.length === 0}
                            >
                                Sortear Ganhador
                            </button>
                        )}
                    </div>
                    <button 
                        style={{...styles.button.danger, marginTop: '1rem'}}
                        onClick={() => window.confirm('Tem certeza?') && actions.resetGame()}
                        disabled={loading}
                    >
                        Resetar Jogo (Emergência)
                    </button>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.h3}>Dicas</h3>
                    <ul style={{listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        {giveaway.clues.map((clue, i) => (
                            <li key={i} style={styles.clue(i < revealedCluesCount)}>
                                <strong>Dica {i + 1}:</strong> {clue}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Coluna de Palpites */}
            <div style={styles.column}>
                <div style={styles.card}>
                    <h3 style={styles.h3}>Palpites Recebidos ({submissions.length})</h3>
                    <div style={styles.feedContainer}>
                        {submissions.length > 0 ? (
                            [...submissions].reverse().map((sub, index) => (
                                <div key={index} style={styles.submissionItem}>
                                    <strong style={{color: '#A78BFA'}}>{sub.user_name}:</strong> {sub.guess}
                                </div>
                            ))
                        ) : (
                            <p style={{textAlign: 'center', color: '#9CA3AF'}}>Aguardando o primeiro palpite...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Estilos
const styles = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' },
    column: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    card: { background: '#1F2937', padding: '1.5rem', borderRadius: '0.75rem' },
    h3: { fontSize: '1.25rem', fontWeight: '600', color: '#D1D5DB', marginBottom: '1rem' },
    status: (status) => ({
        fontWeight: 'bold',
        color: status === 'accepting' ? '#34D399' : (status === 'closed' ? '#FBBF24' : '#9CA3AF')
    }),
    buttonGroup: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' },
    button: {
        primary: { background: '#6D28D9', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer' },
        warning: { background: '#F59E0B', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer' },
        success: { background: '#10B981', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer' },
        danger: { background: '#EF4444', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer' },
    },
    clue: (isRevealed) => ({
        padding: '0.75rem', borderRadius: '0.5rem',
        background: isRevealed ? '#374151' : '#111827',
        color: isRevealed ? 'white' : '#4B5563',
        transition: 'all 0.3s'
    }),
    feedContainer: { height: '400px', overflowY: 'auto', background: '#111827', padding: '1rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    submissionItem: { background: '#374151', padding: '0.5rem 1rem', borderRadius: '0.5rem' }
};

export default LiveControlView;

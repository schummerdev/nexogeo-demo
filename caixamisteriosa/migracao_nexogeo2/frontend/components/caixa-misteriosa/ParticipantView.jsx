import React, { useState } from 'react';

// Visão do Participante durante o jogo
const ParticipantView = ({ liveGame, actions, loading }) => {
    const [formData, setFormData] = useState({
        userName: '',
        userPhone: '',
        userNeighborhood: '',
        userCity: '',
        guess: '',
    });

    // (Simulação) Verifica se o usuário já enviou um palpite para este jogo
    // Num app real, isso poderia ser um estado local ou verificado no backend
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!liveGame || loading) return;

        const submissionData = {
            game_id: liveGame.id, // O ID do jogo viria do objeto liveGame
            ...formData,
        };

        const result = await actions.submitGuess(submissionData);
        if (result) {
            setHasSubmitted(true);
            // Opcional: mostrar uma mensagem de sucesso
            alert('Palpite enviado com sucesso! Boa sorte!');
        }
    };

    const revealedClues = liveGame.giveaway.clues.slice(0, liveGame.revealedCluesCount);

    // Estilos para manter a aparência do projeto original
    const styles = {
        main: {
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            padding: '2rem', minHeight: '100vh', 
            background: 'linear-gradient(to bottom, #1F2937, #374151)', color: 'white'
        },
        card: {
            width: '100%', maxWidth: '600px', background: '#111827', 
            padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        },
        input: {
            width: '100%', background: '#374151', border: '1px solid #4B5563', 
            borderRadius: '0.5rem', padding: '0.75rem', color: 'white', marginTop: '0.25rem'
        },
        button: {
            width: '100%', background: '#6D28D9', border: 'none', 
            borderRadius: '0.5rem', padding: '1rem', color: 'white', 
            fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '1rem'
        }
    };

    return (
        <main style={styles.main}>
            <div style={styles.card}>
                <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Um oferecimento de:</p>
                <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#A78BFA' }}>
                    {liveGame.giveaway.sponsorName}
                </h2>

                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', textAlign: 'center' }}>Dicas Reveladas:</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {revealedClues.map((clue, index) => (
                            <li key={index} style={{ background: '#1F2937', padding: '1rem', borderRadius: '0.5rem' }}>
                                <strong>Dica {index + 1}:</strong> {clue}
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    {liveGame.status === 'closed' && <div style={{textAlign: 'center', color: '#FCA5A5'}}>Inscrições Encerradas!</div>}
                    {hasSubmitted && <div style={{textAlign: 'center', color: '#86EFAC'}}>Seu palpite foi enviado! Boa sorte!</div>}

                    {!hasSubmitted && liveGame.status === 'accepting' && (
                        <form onSubmit={handleSubmit}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', textAlign: 'center', marginBottom: '1rem' }}>Faça seu Palpite!</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input style={styles.input} type="text" name="userName" placeholder="Nome" onChange={handleInputChange} required />
                                <input style={styles.input} type="tel" name="userPhone" placeholder="Telefone" onChange={handleInputChange} required />
                                <input style={styles.input} type="text" name="userNeighborhood" placeholder="Bairro" onChange={handleInputChange} required />
                                <input style={styles.input} type="text" name="userCity" placeholder="Cidade" onChange={handleInputChange} required />
                            </div>
                            <input style={{...styles.input, marginTop: '1rem'}} type="text" name="guess" placeholder="Qual é o prêmio?" onChange={handleInputChange} required />
                            <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Enviando...' : 'Enviar Palpite'}</button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ParticipantView;

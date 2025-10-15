import { useState, useEffect, useCallback } from 'react';

// Hook customizado para gerenciar todo o estado e lógica do Caixa Misteriosa

const API_BASE_URL = '/api/caixa-misteriosa'; // Base para todas as chamadas da nossa API

export function useCaixaMisteriosa() {
    const [liveGame, setLiveGame] = useState(null); // Armazena o estado do jogo vivo
    const [sponsors, setSponsors] = useState([]); // Armazena a lista de patrocinadores
    const [products, setProducts] = useState([]); // Armazena a lista de produtos de um patrocinador
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado de erro

    // Função genérica para fazer chamadas fetch e tratar erros
    const apiFetch = useCallback(async (url, options = {}) => {
        setLoading(true);
        setError(null);
        try {
            // Adiciona o header de autorização (exemplo)
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers,
                // 'Authorization': `Bearer ${your_auth_token}`
            };

            const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ocorreu um erro na requisição.');
            }
            
            // Retorna o JSON apenas se a resposta não for "No Content"
            if (response.status === 204) {
                return null;
            }
            return await response.json();

        } catch (e) {
            setError(e.message);
            console.error('API Fetch Error:', e);
            return null; // Retorna nulo em caso de erro
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Funções de Carregamento de Dados ---

    const fetchLiveGame = useCallback(async () => {
        const gameData = await apiFetch('/game/live');
        setLiveGame(gameData);
    }, [apiFetch]);

    const fetchSponsors = useCallback(async () => {
        const sponsorData = await apiFetch('/sponsors');
        setSponsors(sponsorData || []);
    }, [apiFetch]);

    const fetchProductsBySponsor = useCallback(async (sponsorId) => {
        if (!sponsorId) return;
        const productData = await apiFetch(`/sponsors/${sponsorId}/products`);
        setProducts(productData || []);
    }, [apiFetch]);

    // Efeito para carregar o jogo ao vivo inicialmente
    useEffect(() => {
        fetchLiveGame();
    }, [fetchLiveGame]);

    // --- Funções de Ação (Chamadas pela UI) ---

    const submitGuess = async (guessData) => {
        return await apiFetch('/game/submit', { method: 'POST', body: JSON.stringify(guessData) });
    };

    const startGame = async (productId) => {
        const result = await apiFetch('/game/start', { method: 'POST', body: JSON.stringify({ productId }) });
        if (result) fetchLiveGame(); // Recarrega o estado do jogo após a ação
        return result;
    };

    const revealClue = async () => {
        const result = await apiFetch('/game/reveal-clue', { method: 'POST' });
        if (result) fetchLiveGame();
        return result;
    };
    
    const endSubmissions = async () => {
        const result = await apiFetch('/game/end-submissions', { method: 'POST' });
        if (result) fetchLiveGame();
        return result;
    };

    const drawWinner = async () => {
        const result = await apiFetch('/game/draw-winner', { method: 'POST' });
        if (result) fetchLiveGame();
        return result;
    };

    const resetGame = async () => {
        const result = await apiFetch('/game/reset', { method: 'POST' });
        if (result) setLiveGame(null); // Limpa o jogo localmente
        return result;
    };

    const generateClues = async (productName) => {
        return await apiFetch('/products/generate-clues', { method: 'POST', body: JSON.stringify({ productName }) });
    };

    // Retorna o estado e as funções para serem usadas pelos componentes
    return {
        liveGame,
        sponsors,
        products,
        loading,
        error,
        actions: {
            fetchLiveGame,
            fetchSponsors,
            fetchProductsBySponsor,
            submitGuess,
            startGame,
            revealClue,
            endSubmissions,
            drawWinner,
            resetGame,
            generateClues,
        }
    };
}

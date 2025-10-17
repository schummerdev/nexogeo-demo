// Controlador para a lógica principal do Jogo Caixa Misteriosa

// Importaria o pool de conexão do PostgreSQL aqui
// const pool = require('../config/database');

// --- Funções para Participantes ---

exports.getLiveGame = async (req, res) => {
    try {
        // 1. Buscar no DB por um jogo com status 'accepting' ou 'closed'.
        //    SELECT * FROM games WHERE status IN ('accepting', 'closed', 'finished') ORDER BY created_at DESC LIMIT 1;
        // 2. Se encontrar, buscar os detalhes do produto e patrocinador associado.
        //    JOIN products ON games.product_id = products.id
        //    JOIN sponsors ON products.sponsor_id = sponsors.id
        // 3. Buscar todos os palpites (submissions) para esse jogo.
        //    SELECT user_name, guess FROM submissions WHERE game_id = [game_id];
        // 4. Se o jogo estiver 'finished', buscar os detalhes do vencedor.
        // 5. Montar o objeto de estado do jogo e retornar.

        // Exemplo de retorno mockado:
        const liveGame = {
            status: 'accepting',
            giveaway: {
                sponsorName: 'Patrocinador Exemplo',
                productName: 'Produto Exemplo',
                clues: ['Dica 1', 'Dica 2', 'Dica 3', 'Dica 4', 'Dica 5'],
            },
            revealedCluesCount: 1,
            submissions: [{ userName: 'João', guess: 'Teste' }],
            winner: null,
        };

        res.status(200).json(liveGame);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar jogo ao vivo.', error: error.message });
    }
};

exports.submitGuess = async (req, res) => {
    const { game_id, userName, userPhone, userNeighborhood, userCity, guess } = req.body;
    try {
        // 1. Verificar se o jogo com 'game_id' ainda está com status 'accepting'.
        //    SELECT status FROM games WHERE id = [game_id];
        // 2. Se estiver, inserir o novo palpite no DB.
        //    INSERT INTO submissions (game_id, user_name, user_phone, ...) VALUES (...);
        // 3. (Opcional) Verificar se o palpite está correto e preencher o campo 'is_correct'.

        console.log('Novo palpite recebido:', req.body);
        res.status(201).json({ message: 'Palpite enviado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar palpite.', error: error.message });
    }
};

// --- Funções para Administradores ---

exports.startGame = async (req, res) => {
    const { productId } = req.body;
    try {
        // 1. Verificar se já não existe um jogo com status 'accepting' ou 'closed'.
        // 2. Criar uma nova entrada na tabela 'games'.
        //    INSERT INTO games (product_id, status, revealed_clues_count) VALUES ([productId], 'accepting', 1);
        
        console.log(`Iniciando novo jogo com o produto ID: ${productId}`);
        res.status(201).json({ message: 'Jogo iniciado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao iniciar o jogo.', error: error.message });
    }
};

exports.revealClue = async (req, res) => {
    try {
        // 1. Encontrar o jogo ativo (status 'accepting').
        // 2. Incrementar o campo 'revealed_clues_count'.
        //    UPDATE games SET revealed_clues_count = revealed_clues_count + 1 WHERE id = [game_id];
        
        console.log('Revelando próxima dica.');
        res.status(200).json({ message: 'Dica revelada com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao revelar dica.', error: error.message });
    }
};

exports.endSubmissions = async (req, res) => {
    try {
        // 1. Encontrar o jogo ativo (status 'accepting').
        // 2. Mudar o status para 'closed'.
        //    UPDATE games SET status = 'closed' WHERE id = [game_id];

        console.log('Encerrando recebimento de palpites.');
        res.status(200).json({ message: 'Palpites encerrados.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao encerrar palpites.', error: error.message });
    }
};

exports.drawWinner = async (req, res) => {
    try {
        // 1. Encontrar o jogo ativo (status 'closed').
        // 2. Buscar o nome do produto correto.
        // 3. Buscar todos os palpites em 'submissions' que acertaram o nome do produto.
        //    SELECT * FROM submissions WHERE game_id = [game_id] AND guess ILIKE [product_name];
        // 4. Se houver palpites corretos, sortear um aleatoriamente.
        // 5. Atualizar a tabela 'games' com o ID do vencedor e mudar o status para 'finished'.
        //    UPDATE games SET winner_submission_id = [winner_id], status = 'finished' WHERE id = [game_id];

        console.log('Sorteando um vencedor.');
        // Exemplo de retorno com um vencedor mockado
        const winner = { id: 10, user_name: 'Vencedor Sorteudo', guess: 'Produto Exemplo' };
        res.status(200).json({ message: 'Vencedor sorteado com sucesso!', winner });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao sortear vencedor.', error: error.message });
    }
};

exports.resetGame = async (req, res) => {
    try {
        // Este endpoint pode ter lógicas diferentes:
        // Opção A: Apenas marcar o jogo como 'finished' sem um vencedor.
        // Opção B: Deletar o jogo e todos os palpites associados (cuidado!).
        // Vamos com a Opção A por segurança.
        // UPDATE games SET status = 'finished', ended_at = CURRENT_TIMESTAMP WHERE status = 'accepting' OR status = 'closed';

        console.log('Resetando o jogo.');
        res.status(200).json({ message: 'Jogo resetado com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao resetar o jogo.', error: error.message });
    }
};

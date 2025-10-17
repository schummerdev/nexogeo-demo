const express = require('express');
const router = express.Router();

// Importa os middlewares de autenticação (simulados por enquanto)
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Importa os controladores que conterão a lógica
const gameController = require('../controllers/gameController');
const sponsorController = require('../controllers/sponsorController');
const productController = require('../controllers/productController');

// --- Rotas Públicas (para Participantes) ---

// Retorna o estado atual do jogo ativo (se houver)
router.get('/game/live', gameController.getLiveGame);

// Submete um novo palpite para o jogo ativo
router.post('/game/submit', gameController.submitGuess);


// --- Rotas de Administração (protegidas) ---

// Inicia um novo jogo com um produto específico
router.post('/game/start', isAuthenticated, isAdmin, gameController.startGame);

// Revela a próxima dica do jogo ativo
router.post('/game/reveal-clue', isAuthenticated, isAdmin, gameController.revealClue);

// Encerra a aceitação de novos palpites
router.post('/game/end-submissions', isAuthenticated, isAdmin, gameController.endSubmissions);

// Sorteia um vencedor entre os palpites corretos
router.post('/game/draw-winner', isAuthenticated, isAdmin, gameController.drawWinner);

// Reseta o jogo completamente, finalizando-o
router.post('/game/reset', isAuthenticated, isAdmin, gameController.resetGame);

// --- Rotas para Gerenciamento de Patrocinadores ---

// Listar todos os patrocinadores
router.get('/sponsors', isAuthenticated, isAdmin, sponsorController.getAllSponsors);

// Criar um novo patrocinador
router.post('/sponsors', isAuthenticated, isAdmin, sponsorController.createSponsor);

// Atualizar um patrocinador
router.put('/sponsors/:id', isAuthenticated, isAdmin, sponsorController.updateSponsor);

// Deletar um patrocinador
router.delete('/sponsors/:id', isAuthenticated, isAdmin, sponsorController.deleteSponsor);

// --- Rotas para Gerenciamento de Produtos ---

// Listar todos os produtos de um patrocinador
router.get('/sponsors/:sponsorId/products', isAuthenticated, isAdmin, productController.getProductsBySponsor);

// Criar um novo produto
router.post('/products', isAuthenticated, isAdmin, productController.createProduct);

// Atualizar um produto
router.put('/products/:id', isAuthenticated, isAdmin, productController.updateProduct);

// Deletar um produto
router.delete('/products/:id', isAuthenticated, isAdmin, productController.deleteProduct);

// --- Rota para Interação com IA ---

// Gera dicas de IA para um nome de produto fornecido
router.post('/products/generate-clues', isAuthenticated, isAdmin, productController.generateCluesWithAI);


module.exports = router;

-- Esquema do Banco de Dados para a funcionalidade Caixa Misteriosa
-- Compatível com PostgreSQL

-- Tabela para armazenar os patrocinadores
CREATE TABLE sponsors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar os produtos que podem ser sorteados
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sponsor_id INTEGER NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    -- As dicas serão armazenadas em um array de texto
    clues TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para gerenciar o estado de um jogo/sorteio ao vivo
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, accepting, closed, finished
    revealed_clues_count INTEGER NOT NULL DEFAULT 0,
    winner_submission_id INTEGER, -- Pode ser nulo até que um vencedor seja sorteado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Tabela para armazenar os palpites (submissions) dos participantes
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50) NOT NULL,
    user_neighborhood VARCHAR(255) NOT NULL,
    user_city VARCHAR(255) NOT NULL,
    guess VARCHAR(255) NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adiciona uma chave estrangeira na tabela de jogos para referenciar a submissão vencedora
ALTER TABLE games
ADD CONSTRAINT fk_winner_submission
FOREIGN KEY (winner_submission_id)
REFERENCES submissions(id)
ON DELETE SET NULL;

-- Índices para otimizar as consultas mais comuns
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_submissions_game_id ON submissions(game_id);
CREATE INDEX idx_products_sponsor_id ON products(sponsor_id);


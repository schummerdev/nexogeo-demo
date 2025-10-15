// Controlador para a lógica de Produtos

// const pool = require('../config/database');
const { GoogleGenAI, Type } = require('@google/genai');

// --- Funções CRUD para Produtos ---

exports.getProductsBySponsor = async (req, res) => {
    const { sponsorId } = req.params;
    try {
        // Lógica do DB: SELECT * FROM products WHERE sponsor_id = $1 ORDER BY name;
        const products = [
            { id: 101, sponsor_id: sponsorId, name: 'Produto A', clues: ['dica1', 'dica2'] },
            { id: 102, sponsor_id: sponsorId, name: 'Produto B', clues: ['dica1', 'dica2'] },
        ];
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produtos.', error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    const { sponsor_id, name, clues } = req.body;
    try {
        // Lógica do DB: INSERT INTO products (sponsor_id, name, clues) VALUES ($1, $2, $3) RETURNING *;
        // O array de clues precisa ser formatado corretamente para o PostgreSQL: '{ "dica1", "dica2" }'
        console.log(`Criando produto: ${name}`);
        const newProduct = { id: Date.now(), sponsor_id, name, clues };
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar produto.', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, clues } = req.body;
    try {
        // Lógica do DB: UPDATE products SET name = $1, clues = $2 WHERE id = $3 RETURNING *;
        console.log(`Atualizando produto ${id}`);
        const updatedProduct = { id: parseInt(id), name, clues };
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar produto.', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // Lógica do DB: DELETE FROM products WHERE id = $1;
        console.log(`Deletando produto ${id}`);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar produto.', error: error.message });
    }
};

// --- Função de Interação com IA ---

exports.generateCluesWithAI = async (req, res) => {
    const { productName } = req.body;

    if (!productName) {
        return res.status(400).json({ message: 'O nome do produto é obrigatório.' });
    }

    try {
        // A chave da API deve ser lida das variáveis de ambiente do servidor
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('A chave da API do Gemini não foi configurada no servidor.');
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Gere 5 dicas para o produto "${productName}". Use palavras comuns e populares, fáceis de entender por um público geral. As dicas devem ser curtas, objetivas, e ordenadas da mais difícil para a mais fácil. É crucial que as dicas NÃO contenham o nome do produto "${productName}" ou variações diretas dele. A resposta do produto deve ser uma única palavra. Retorne apenas um array JSON de strings. Exemplo de retorno: ["dica 1", "dica 2", "dica 3", "dica 4", "dica 5"]`,
            config: {
                systemInstruction: "Você é um assistente criativo para um jogo de adivinhação. Todas as suas respostas devem ser estritamente em português do Brasil.",
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
            },
        });

        const jsonText = response.text.trim();
        const clues = JSON.parse(jsonText);

        if (Array.isArray(clues) && clues.length === 5) {
            res.status(200).json({ clues });
        } else {
            throw new Error('A resposta da IA não retornou um array de 5 strings.');
        }

    } catch (error) {
        console.error("Erro ao gerar dicas com IA:", error);
        res.status(500).json({ message: 'Não foi possível gerar as dicas.', error: error.message });
    }
};

// Controlador para a lógica de Patrocinadores (Sponsors)

// const pool = require('../config/database');

exports.getAllSponsors = async (req, res) => {
    try {
        // Lógica do DB: SELECT * FROM sponsors ORDER BY name;
        const sponsors = [
            { id: 1, name: 'Patrocinador 1' },
            { id: 2, name: 'Patrocinador 2' },
        ];
        res.status(200).json(sponsors);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar patrocinadores.', error: error.message });
    }
};

exports.createSponsor = async (req, res) => {
    const { name } = req.body;
    try {
        // Lógica do DB: INSERT INTO sponsors (name) VALUES ($1) RETURNING *;
        console.log(`Criando patrocinador: ${name}`);
        const newSponsor = { id: Date.now(), name };
        res.status(201).json(newSponsor);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar patrocinador.', error: error.message });
    }
};

exports.updateSponsor = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        // Lógica do DB: UPDATE sponsors SET name = $1 WHERE id = $2 RETURNING *;
        console.log(`Atualizando patrocinador ${id} para: ${name}`);
        const updatedSponsor = { id: parseInt(id), name };
        res.status(200).json(updatedSponsor);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar patrocinador.', error: error.message });
    }
};

exports.deleteSponsor = async (req, res) => {
    const { id } = req.params;
    try {
        // Lógica do DB: DELETE FROM sponsors WHERE id = $1;
        // Cuidado com o ON DELETE CASCADE que deletará produtos associados.
        console.log(`Deletando patrocinador ${id}`);
        res.status(204).send(); // 204 No Content é uma resposta padrão para delete bem-sucedido
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar patrocinador.', error: error.message });
    }
};

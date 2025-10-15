const { getSecureHeaders, checkRateLimit } = require('./_lib/security');
const databasePool = require('./_lib/database');

module.exports = async (req, res) => {
  // Configurar CORS seguro
  const secureHeaders = getSecureHeaders(req.headers.origin);
  Object.entries(secureHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Rate limiting para participantes (crítico para evitar spam)
  const clientId = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
  const rateLimit = checkRateLimit(clientId, 30, 60000); // 30 requests per minute (mais restritivo)
  
  if (!rateLimit.allowed) {
    res.status(429).json({ 
      message: 'Muitas tentativas de participação. Aguarde antes de tentar novamente.',
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
    });
    return;
  }

  try {
    databasePool;

    if (req.method === 'GET') {
      const result = await databasePool.query(`
        SELECT p.*, pr.nome as promocao_nome,
               COALESCE(p.participou_em, CURRENT_TIMESTAMP) as data_participacao
        FROM participantes p 
        LEFT JOIN promocoes pr ON p.promocao_id = pr.id 
        ORDER BY COALESCE(p.participou_em, CURRENT_TIMESTAMP) DESC
      `);
      
            res.status(200).json({ success: true, data: result.rows });
      
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', async () => {
        try {
          const { nome, telefone, email, bairro, cidade, latitude, longitude, promocao_id, origem_source, origem_medium } = JSON.parse(body);
          
          if (!nome || !telefone) {
                        res.status(400).json({ message: 'Nome e telefone são obrigatórios' });
            return;
          }

          const result = await databasePool.query(`
            INSERT INTO participantes (nome, telefone, email, bairro, cidade, latitude, longitude, promocao_id, origem_source, origem_medium) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *
          `, [nome, telefone, email, bairro, cidade, latitude, longitude, promocao_id, origem_source, origem_medium]);
          
                    res.status(201).json({ success: true, data: result.rows[0] });
          
        } catch (parseError) {
                    console.error('Erro ao processar participante:', parseError);
          
          // Tratar erro de constraint única
          if (parseError.message.includes('duplicate key value violates unique constraint')) {
            if (parseError.message.includes('idx_participante_unico_por_promocao')) {
              return res.status(409).json({ 
                message: 'Você já participou desta promoção com este telefone!',
                error: 'DUPLICATE_PARTICIPATION',
                details: 'Cada telefone pode participar apenas uma vez por promoção.'
              });
            }
          }
          
          res.status(400).json({ 
            message: 'Dados inválidos', 
            error: parseError.message,
            received_body: body 
          });
        }
      });
      
    } else if (req.method === 'PUT') {
      const url = new URL(req.url, 'http://localhost');
      const id = url.searchParams.get('id');
      
      console.log('PUT request - ID:', id, 'URL:', req.url);
      
      if (!id || id === 'undefined' || id === 'null') {
                console.error('PUT request sem ID válido:', { id, url: req.url });
        res.status(400).json({ 
          message: 'ID é obrigatório para atualização',
          received_id: id,
          url: req.url 
        });
        return;
      }

      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', async () => {
        try {
          console.log('PUT body recebido:', body);
          const data = JSON.parse(body);
          console.log('PUT data parseado:', data);
          
          // Validar campos obrigatórios
          if (!data.nome || !data.telefone) {
                        console.error('Campos obrigatórios ausentes:', { nome: data.nome, telefone: data.telefone });
            res.status(400).json({ 
              message: 'Nome e telefone são obrigatórios',
              received_data: data 
            });
            return;
          }
          
          // Extract data
          const { nome, telefone, email, bairro, cidade, latitude, longitude, promocao_id, promocao } = data;
          
          // Handle promocao field mapping to promocao_id
          const finalPromocaoId = promocao_id || promocao || null;
          
          console.log('Executando UPDATE com:', {
            nome, telefone, email, bairro, cidade, latitude, longitude, finalPromocaoId, id
          });
          
          const result = await databasePool.query(`
            UPDATE participantes 
            SET nome = $1, telefone = $2, email = $3, bairro = $4, cidade = $5, latitude = $6, longitude = $7, promocao_id = $8
            WHERE id = $9 
            RETURNING *
          `, [nome, telefone, email, bairro, cidade, latitude, longitude, finalPromocaoId, id]);
          
          console.log('UPDATE result rows:', result.rows.length);
          
                    if (result.rows.length === 0) {
            res.status(404).json({ message: `Participante com ID ${id} não encontrado` });
          } else {
            res.status(200).json({ success: true, data: result.rows[0] });
          }
          
        } catch (parseError) {
          console.error('Erro completo no PUT:', parseError);
                    
          // Tratar erro de constraint única específico para updates
          if (parseError.code === '23505' && parseError.message.includes('idx_participante_unico_por_promocao')) {
            return res.status(409).json({ 
              message: 'Este telefone já está sendo usado por outro participante nesta promoção!',
              error: 'DUPLICATE_PHONE_IN_PROMOTION',
              details: 'Cada telefone pode participar apenas uma vez por promoção.'
            });
          }
          
          res.status(400).json({ 
            message: 'Erro interno: ' + parseError.message,
            received_body: body,
            error_type: parseError.name,
            error_code: parseError.code,
            stack: parseError.stack
          });
        }
      });
      
    } else if (req.method === 'DELETE') {
      const url = new URL(req.url, 'http://localhost');
      const id = url.searchParams.get('id');
      
      if (!id) {
                res.status(400).json({ message: 'ID é obrigatório para exclusão' });
        return;
      }

      try {
        // Verificar se o participante é ganhador ativo (não cancelado)
        const ganhadorAtivo = await databasePool.query(`
          SELECT id FROM ganhadores 
          WHERE participante_id = $1 AND (cancelado = false OR cancelado IS NULL)
        `, [id]);
        
        if (ganhadorAtivo.rows.length > 0) {
                    res.status(400).json({ 
            success: false,
            message: 'Este participante não pode ser excluído pois foi sorteado como ganhador. Cancele o sorteio primeiro.' 
          });
          return;
        }
        
        // Se chegou aqui, pode excluir (ou é ganhador cancelado)
        // Primeiro remover registros de ganhadores cancelados
        await databasePool.query(`
          DELETE FROM ganhadores 
          WHERE participante_id = $1 AND cancelado = true
        `, [id]);
        
        // Agora excluir o participante
        const result = await databasePool.query('DELETE FROM participantes WHERE id = $1 RETURNING *', [id]);
        
                if (result.rows.length === 0) {
          res.status(404).json({ message: 'Participante não encontrado' });
        } else {
          res.status(200).json({ success: true, message: 'Participante excluído com sucesso' });
        }

      } catch (deleteError) {
                console.error('Erro ao excluir participante:', deleteError);
        
        res.status(500).json({ 
          success: false,
          message: 'Erro interno ao excluir participante: ' + deleteError.message
        });
      }
      
    } else {
            res.status(405).json({ message: 'Método não permitido' });
    }
    
  } catch (error) {
    console.error('Erro na API participantes:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
// Teste simples da API local
const { query, testConnection } = require('./lib/db.js');

async function testAPI() {
  console.log('🔍 Testando conexão com banco de dados...');

  try {
    // Testar conexão
    const connTest = await testConnection();
    console.log('✅ Conexão:', connTest);

    // Testar query simples
    const countPromo = await query('SELECT COUNT(*) as total FROM promocoes');
    console.log('📊 Promoções no banco:', countPromo.rows[0]);

    // Testar query de participantes
    const countPart = await query('SELECT COUNT(*) as total FROM participantes');
    console.log('👥 Participantes no banco:', countPart.rows[0]);

    console.log('✅ API funcionando corretamente!');
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);

    // Verificar se é problema de variáveis de ambiente
    if (error.message.includes('DATABASE_URL')) {
      console.log('🔧 Verificando arquivo .env...');
      const fs = require('fs');
      if (fs.existsSync('.env')) {
        console.log('✅ Arquivo .env existe');
      } else {
        console.log('❌ Arquivo .env não encontrado!');
      }
    }
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
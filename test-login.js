// Script para testar login do admin
require('dotenv').config();
const { query } = require('./lib/db');
const bcrypt = require('bcrypt');

async function testLogin() {
  console.log('🔍 Testando login do admin...\n');

  const username = 'admin';
  const password = '42d884f7b7e37fe8';

  try {
    // Buscar usuário
    const result = await query('SELECT * FROM usuarios WHERE usuario = $1', [username]);

    if (result.rows.length === 0) {
      console.log('❌ Usuário não encontrado!');
      return;
    }

    const user = result.rows[0];
    console.log('✅ Usuário encontrado:');
    console.log('   ID:', user.id);
    console.log('   Usuário:', user.usuario);
    console.log('   Role:', user.role);
    console.log('   Hash armazenado:', user.senha_hash.substring(0, 20) + '...');
    console.log('');

    // Testar senha
    console.log('🔐 Testando senha...');
    const isValid = await bcrypt.compare(password, user.senha_hash);

    if (isValid) {
      console.log('✅ Senha CORRETA! Login funcionaria.');
      console.log('\n📝 Credenciais para testar:');
      console.log('   Usuário: admin');
      console.log('   Senha: 42d884f7b7e37fe8');
    } else {
      console.log('❌ Senha INCORRETA! Há um problema com o hash.');

      // Gerar novo hash e atualizar
      console.log('\n🔄 Gerando novo hash...');
      const newHash = await bcrypt.hash(password, 10);
      await query('UPDATE usuarios SET senha_hash = $1 WHERE usuario = $2', [newHash, username]);
      console.log('✅ Hash atualizado! Tente fazer login novamente.');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }

  process.exit(0);
}

testLogin();

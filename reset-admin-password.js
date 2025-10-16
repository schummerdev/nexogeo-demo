#!/usr/bin/env node

/**
 * Script para resetar senha do usuário admin
 * Uso: node reset-admin-password.js [nova-senha]
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { query } = require('./lib/db');

async function resetAdminPassword() {
  console.log('\n' + '='.repeat(70));
  console.log('🔐 RESET DE SENHA DO ADMINISTRADOR');
  console.log('='.repeat(70));

  try {
    // Verificar se admin existe
    const adminCheck = await query('SELECT id, usuario FROM usuarios WHERE usuario = $1', ['admin']);

    if (adminCheck.rows.length === 0) {
      console.log('\n❌ ERRO: Usuário admin não encontrado!');
      process.exit(1);
    }

    console.log('\n✅ Usuário admin encontrado (ID: ' + adminCheck.rows[0].id + ')');

    // Gerar ou usar senha fornecida
    const newPassword = process.argv[2] || crypto.randomBytes(8).toString('hex');

    console.log('\n🔑 Gerando nova senha...');

    // Hash da senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await query(
      'UPDATE usuarios SET senha_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE usuario = $2',
      [hashedPassword, 'admin']
    );

    console.log('\n' + '='.repeat(70));
    console.log('✅ SENHA RESETADA COM SUCESSO!');
    console.log('='.repeat(70));
    console.log('\n📋 NOVAS CREDENCIAIS:');
    console.log('   Usuário: admin');
    console.log('   Senha:   ' + newPassword);
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   - Anote esta senha em local seguro');
    console.log('   - Mude a senha após o primeiro login');
    console.log('   - Não compartilhe esta senha');
    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error(error);
    process.exit(1);
  }

  process.exit(0);
}

resetAdminPassword();

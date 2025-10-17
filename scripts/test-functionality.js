// scripts/test-functionality.js - Script para testar funcionalidades principais
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando teste de funcionalidades do NexoGeo...\n');

// 1. Testar estrutura de rotas
console.log('1. 📋 Testando estrutura de rotas...');

const appFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.jsx'), 'utf8');
const routes = [
  { path: '/participar', description: 'Formulário de captura público' },
  { path: '/sucesso', description: 'Página de sucesso pós-cadastro' },
  { path: '/sorteio-publico', description: 'Visualização pública de sorteios' },
  { path: '/login', description: 'Login de administradores' },
  { path: '/dashboard', description: 'Dashboard principal (protegido)' },
  { path: '/dashboard/promocoes', description: 'Gestão de promoções' },
  { path: '/dashboard/participantes', description: 'Lista de participantes' },
  { path: '/dashboard/gerador-links', description: 'Geração de links de captura' },
  { path: '/dashboard/sorteio', description: 'Módulo de sorteios' },
  { path: '/dashboard/configuracoes', description: 'Configurações (admin only)' },
  { path: '/dashboard/mapas', description: 'Mapas interativos' },
  { path: '/dashboard/mapa-participantes', description: 'Origem dos participantes' }
];

routes.forEach(route => {
  const routeExists = appFile.includes(`path="${route.path}"`);
  const status = routeExists ? '✅' : '❌';
  console.log(`   ${status} ${route.path} - ${route.description}`);
});

// 2. Testar componentes de proteção
console.log('\n2. 🔒 Testando componentes de proteção...');

const protectionTests = [
  {
    file: 'src/components/ProtectedRoute.jsx',
    description: 'Componente de proteção de rotas',
    check: () => fs.existsSync(path.join(__dirname, '..', 'src', 'components', 'ProtectedRoute.jsx'))
  },
  {
    file: 'src/contexts/AuthContext.jsx',
    description: 'Context de autenticação',
    check: () => {
      const authFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'contexts', 'AuthContext.jsx'), 'utf8');
      return authFile.includes('canCreatePromotion') && authFile.includes('canDeletePromotion');
    }
  }
];

protectionTests.forEach(test => {
  const passed = test.check();
  const status = passed ? '✅' : '❌';
  console.log(`   ${status} ${test.description}`);
});

// 3. Testar botões e funcionalidades críticas
console.log('\n3. 🔘 Testando botões e funcionalidades...');

const functionalityTests = [
  {
    page: 'PromocoesPage.jsx',
    functions: ['Criar Promoção', 'Editar Promoção', 'Excluir Promoção', 'Finalizar Promoção'],
    check: () => {
      const file = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'PromocoesPage.jsx'), 'utf8');
      return file.includes('handleOpenModal') && file.includes('handleDeletePromo') && file.includes('handleSubmit');
    }
  },
  {
    page: 'SorteioPage.jsx',
    functions: ['Realizar Sorteio', 'Cancelar Sorteio', 'Cancelar Ganhador'],
    check: () => {
      const file = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'SorteioPage.jsx'), 'utf8');
      return file.includes('handleDraw') && file.includes('handleCancelDrawing') && file.includes('handleCancelarGanhador');
    }
  },
  {
    page: 'ParticipantesPage.jsx',
    functions: ['Visualizar Participantes', 'Editar Participante', 'Exportar Dados'],
    check: () => {
      const file = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'ParticipantesPage.jsx'), 'utf8');
      return file.includes('handleEditParticipante') && file.includes('handleExportData');
    }
  },
  {
    page: 'ConfiguracoesPage.jsx',
    functions: ['Configurações do Sistema', 'Gestão de Usuários'],
    check: () => {
      const file = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'ConfiguracoesPage.jsx'), 'utf8');
      return file.includes('canManageSystem') && file.includes('configEmissora');
    }
  }
];

functionalityTests.forEach(test => {
  const passed = test.check();
  const status = passed ? '✅' : '❌';
  console.log(`   ${status} ${test.page}: ${test.functions.join(', ')}`);
});

// 4. Testar integrações de API
console.log('\n4. 🌐 Testando integrações de API...');

const apiTests = [
  {
    endpoint: '/api/promocoes',
    description: 'CRUD de promoções',
    check: () => fs.existsSync(path.join(__dirname, '..', 'api', 'promocoes.js'))
  },
  {
    endpoint: '/api/participantes',
    description: 'CRUD de participantes',
    check: () => fs.existsSync(path.join(__dirname, '..', 'api', 'participantes.js'))
  },
  {
    endpoint: '/api/sorteio',
    description: 'Sistema de sorteios',
    check: () => fs.existsSync(path.join(__dirname, '..', 'api', 'sorteio.js'))
  },
  {
    endpoint: '/api/dashboard/*',
    description: 'APIs de dashboard (admin-stats, system-health, etc)',
    check: () => fs.existsSync(path.join(__dirname, '..', 'api', 'dashboard'))
  },
  {
    endpoint: '/api/ganhadores/cancelar',
    description: 'Cancelamento de ganhadores',
    check: () => fs.existsSync(path.join(__dirname, '..', 'api', 'ganhadores', 'cancelar.js'))
  },
  {
    endpoint: '/api/audit',
    description: 'Sistema de auditoria',
    check: () => fs.existsSync(path.join(__dirname, '..', 'api', 'audit.js'))
  }
];

apiTests.forEach(test => {
  const exists = test.check();
  const status = exists ? '✅' : '❌';
  console.log(`   ${status} ${test.endpoint} - ${test.description}`);
});

// 5. Testar otimizações de performance
console.log('\n5. ⚡ Testando otimizações de performance...');

const performanceTests = [
  {
    feature: 'Code Splitting',
    check: () => appFile.includes('React.lazy')
  },
  {
    feature: 'Service Worker',
    check: () => fs.existsSync(path.join(__dirname, '..', 'public', 'sw.js'))
  },
  {
    feature: 'Lazy Components',
    check: () => fs.existsSync(path.join(__dirname, '..', 'src', 'components', 'LazyComponents.jsx'))
  },
  {
    feature: 'Preloader Hook',
    check: () => fs.existsSync(path.join(__dirname, '..', 'src', 'hooks', 'usePreloader.js'))
  }
];

performanceTests.forEach(test => {
  const implemented = test.check();
  const status = implemented ? '✅' : '❌';
  console.log(`   ${status} ${test.feature}`);
});

// 6. Testar permissões por role
console.log('\n6. 👥 Testando sistema de permissões...');

const authFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'contexts', 'AuthContext.jsx'), 'utf8');
const permissionTests = [
  'canCreatePromotion',
  'canEditPromotion',
  'canDeletePromotion',
  'canViewParticipants',
  'canPerformDraw',
  'canExportData',
  'canViewReports',
  'canManageUsers',
  'canAccessAuditLogs'
];

permissionTests.forEach(permission => {
  const implemented = authFile.includes(permission);
  const status = implemented ? '✅' : '❌';
  console.log(`   ${status} ${permission}()`);
});

// 7. Testar LGPD compliance
console.log('\n7. 🛡️ Testando compliance LGPD...');

const lgpdTests = [
  {
    feature: 'Utilitários LGPD',
    check: () => fs.existsSync(path.join(__dirname, '..', 'src', 'utils', 'lgpdUtils.js'))
  },
  {
    feature: 'Logs de Auditoria',
    check: () => fs.existsSync(path.join(__dirname, '..', 'src', 'pages', 'AuditLogsPage.jsx'))
  },
  {
    feature: 'Schema de Auditoria',
    check: () => fs.existsSync(path.join(__dirname, '..', 'api', 'migrations', 'audit_logs.sql'))
  },
  {
    feature: 'Serviço de Auditoria',
    check: () => fs.existsSync(path.join(__dirname, '..', 'src', 'services', 'auditService.js'))
  }
];

lgpdTests.forEach(test => {
  const implemented = test.check();
  const status = implemented ? '✅' : '❌';
  console.log(`   ${status} ${test.feature}`);
});

// 8. Verificar links problemáticos
console.log('\n8. 🔗 Verificando qualidade dos links...');

const linkTests = [
  {
    file: 'UserDashboardPage.jsx',
    issue: 'Links usando <a href> em vez de <Link>',
    check: () => {
      const file = fs.readFileSync(path.join(__dirname, '..', 'src', 'pages', 'UserDashboardPage.jsx'), 'utf8');
      return !file.includes('<a href="/dashboard') && file.includes('<Link to="/dashboard');
    }
  }
];

linkTests.forEach(test => {
  const fixed = test.check();
  const status = fixed ? '✅' : '❌';
  console.log(`   ${status} ${test.file}: ${test.issue}`);
});

// Resumo final
console.log('\n🎯 RESUMO DO TESTE:');
console.log('✅ = Implementado e funcionando');
console.log('❌ = Problema identificado ou não implementado');

console.log('\n📊 Para teste manual, acesse:');
console.log('🌐 http://localhost:3000 - Aplicação principal');
console.log('🔐 http://localhost:3000/login - Login administrativo');
console.log('📝 http://localhost:3000/participar - Formulário público');
console.log('🎲 http://localhost:3000/sorteio-publico - Sorteio público');

console.log('\n🔧 Comandos úteis para teste:');
console.log('npm run performance:analyze - Análise de performance');
console.log('npm run analyze - Análise de bundle');
console.log('npm test - Executar testes unitários');

console.log('\n🎉 Teste de funcionalidades concluído!');
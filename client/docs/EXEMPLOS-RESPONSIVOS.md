# Exemplos de Uso - Design Responsivo NexoGeo

## Exemplos Práticos de Implementação

### 1. Layout de Grid Responsivo

```jsx
// Dashboard com grid responsivo
<div className="dashboard-content">
  {/* Grid de KPIs que se adapta automaticamente */}
  <div className="kpi-grid">
    <div className="kpi-card">
      <div className="kpi-icon">📊</div>
      <div className="kpi-content">
        <div className="kpi-value">1,234</div>
        <div className="kpi-label">Participantes</div>
      </div>
    </div>
    
    <div className="kpi-card">
      <div className="kpi-icon">🎯</div>
      <div className="kpi-content">
        <div className="kpi-value">56</div>
        <div className="kpi-label">Promoções</div>
      </div>
    </div>
    
    <div className="kpi-card">
      <div className="kpi-icon">💰</div>
      <div className="kpi-content">
        <div className="kpi-value">R$ 45.678</div>
        <div className="kpi-label">Valor Total</div>
      </div>
    </div>
    
    <div className="kpi-card">
      <div className="kpi-icon">📈</div>
      <div className="kpi-content">
        <div className="kpi-value">89%</div>
        <div className="kpi-label">Taxa de Conversão</div>
      </div>
    </div>
  </div>
</div>
```

### 2. Formulário Responsivo

```jsx
// Formulário que se adapta a diferentes dispositivos
<div className="container">
  <div className="card p-6">
    <h2 className="h2 mb-4">Cadastro de Participante</h2>
    
    <form className="grid gap-4">
      <div className="form-group">
        <label className="form-label">Nome Completo</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Digite seu nome completo"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">E-mail</label>
        <input 
          type="email" 
          className="form-input" 
          placeholder="seu@email.com"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Telefone</label>
        <input 
          type="tel" 
          className="form-input" 
          placeholder="(11) 99999-9999"
        />
      </div>
      
      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary flex-1">
          Cadastrar
        </button>
        <button type="button" className="btn btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</div>
```

### 3. Navegação Responsiva

```jsx
// Navegação que se adapta ao dispositivo
<nav className="sidebar">
  <div className="sidebar-header">
    <h1 className="sidebar-title">NexoGeo</h1>
    <p className="sidebar-subtitle">Sistema de Gestão</p>
  </div>
  
  <div className="sidebar-nav">
    <a href="/dashboard" className="nav-item active">
      <span className="nav-icon">🏠</span>
      Dashboard
    </a>
    
    <a href="/promocoes" className="nav-item">
      <span className="nav-icon">🎯</span>
      Promoções
    </a>
    
    <a href="/participantes" className="nav-item">
      <span className="nav-icon">👥</span>
      Participantes
    </a>
    
    <a href="/relatorios" className="nav-item">
      <span className="nav-icon">📊</span>
      Relatórios
    </a>
  </div>
  
  <div className="sidebar-footer">
    <button className="logout-button">
      <span className="logout-icon">🚪</span>
      Sair
    </button>
  </div>
</nav>

{/* Botão de menu para dispositivos móveis */}
<button className="mobile-menu-toggle">
  ☰
</button>

{/* Overlay para fechar sidebar em dispositivos móveis */}
<div className="sidebar-overlay"></div>
```

### 4. Tabela Responsiva

```jsx
// Tabela com scroll horizontal em dispositivos pequenos
<div className="table-responsive">
  <table className="table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nome</th>
        <th>E-mail</th>
        <th>Telefone</th>
        <th>Data Cadastro</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>001</td>
        <td>João Silva</td>
        <td>joao@email.com</td>
        <td>(11) 99999-9999</td>
        <td>24/08/2025</td>
        <td>
          <div className="flex gap-2">
            <button className="btn btn-secondary small">Editar</button>
            <button className="btn btn-primary small">Ver</button>
          </div>
        </td>
      </tr>
      {/* Mais linhas... */}
    </tbody>
  </table>
</div>
```

### 5. Cards de Ação Responsivos

```jsx
// Cards que se reorganizam automaticamente
<div className="actions-grid">
  <button className="action-button">
    <span className="action-icon">➕</span>
    Nova Promoção
  </button>
  
  <button className="action-button">
    <span className="action-icon">👥</span>
    Adicionar Participante
  </button>
  
  <button className="action-button">
    <span className="action-icon">📊</span>
    Gerar Relatório
  </button>
  
  <button className="action-button">
    <span className="action-icon">🎲</span>
    Realizar Sorteio
  </button>
</div>
```

### 6. Layout de Página Responsivo

```jsx
// Página que se adapta a diferentes tamanhos de tela
<div className="main-content">
  <div className="header">
    <div className="header-content">
      <div className="header-titles">
        <h1 className="header-title">Dashboard</h1>
        <p className="header-subtitle">Visão geral do sistema</p>
      </div>
      
      <div className="header-user-info">
        <div className="user-avatar">
          <span className="user-initial">A</span>
        </div>
        <div className="user-details">
          <div className="user-greeting">Olá, Admin</div>
          <div className="user-role">Administrador</div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Conteúdo da página */}
  <div className="dashboard-content">
    {/* Grids e componentes responsivos aqui */}
  </div>
</div>
```

### 7. Classes Utilitárias Responsivas

```jsx
// Exemplos de uso das classes utilitárias
<div className="container">
  {/* Grid responsivo */}
  <div className="grid grid-1 md:grid-2 lg:grid-3 xl:grid-4 gap-4">
    <div className="card p-4">Item 1</div>
    <div className="card p-4">Item 2</div>
    <div className="card p-4">Item 3</div>
    <div className="card p-4">Item 4</div>
  </div>
  
  {/* Flexbox responsivo */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
    <div className="text-center md:text-left">
      <h3 className="h3">Título</h3>
      <p className="text">Descrição</p>
    </div>
    
    <div className="flex gap-2">
      <button className="btn btn-primary">Ação 1</button>
      <button className="btn btn-secondary">Ação 2</button>
    </div>
  </div>
  
  {/* Elementos que se escondem em dispositivos específicos */}
  <div className="hidden md:block">
    Conteúdo visível apenas em tablets e desktops
  </div>
  
  <div className="block md:hidden">
    Conteúdo visível apenas em dispositivos móveis
  </div>
</div>
```

### 8. Media Queries Customizadas

```css
/* Estilos específicos para dispositivos muito pequenos */
@media (max-width: 360px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .card {
    padding: 1rem;
  }
  
  .btn {
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
  }
}

/* Estilos para dispositivos de alta resolução */
@media (min-resolution: 2dppx) {
  .card {
    box-shadow: 0 0.5px 1.5px rgba(0, 0, 0, 0.1);
  }
  
  .btn {
    border-width: 0.5px;
  }
}

/* Estilos para dispositivos com tela grande */
@media (min-width: 1920px) {
  .container {
    max-width: 1600px;
  }
  
  .sidebar {
    width: 360px;
  }
  
  .main-content {
    margin-left: 360px;
  }
}
```

## Dicas de Implementação

### 1. Sempre Use Mobile First
```css
/* ❌ Evite isso */
@media (max-width: 768px) {
  .elemento { /* estilos para mobile */ }
}

/* ✅ Use isso */
.elemento { /* estilos base para mobile */ }

@media (min-width: 769px) {
  .elemento { /* estilos para desktop */ }
}
```

### 2. Use Clamp para Valores Responsivos
```css
/* ✅ Tipografia fluida */
.titulo {
  font-size: clamp(1.25rem, 3vw, 2rem);
}

/* ✅ Espaçamentos responsivos */
.card {
  padding: clamp(1rem, 3vw, 2rem);
}
```

### 3. Teste em Diferentes Dispositivos
- Use as ferramentas de desenvolvedor do navegador
- Teste em dispositivos físicos
- Verifique diferentes orientações
- Teste com zoom do usuário

### 4. Mantenha a Performance
- Minimize o uso de JavaScript para responsividade
- Use CSS Grid e Flexbox quando possível
- Otimize imagens para diferentes densidades
- Considere lazy loading para conteúdo pesado 
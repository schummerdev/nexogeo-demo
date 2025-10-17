# 📊 Plano de Integração: public_participants nos Mapas Interativos

**Data:** 13/10/2025
**Objetivo:** Integrar dados da tabela `public_participants` (Caixa Misteriosa) na visualização de Mapas Interativos

---

## 🔍 Análise da Situação Atual

### Fonte de Dados Atual (MapasPage.jsx)
**Tabela primária:** `participantes`
- Busca via: `fetchParticipantes()` → `src/services/participanteService.js`
- Endpoint: `GET /api/participantes`
- Handler: `api/participantes.js`

**Campos utilizados nos mapas:**
```javascript
{
  id, nome, telefone, bairro, cidade,
  latitude, longitude,           // Coordenadas geográficas
  promocao_id,                   // FK para promoções
  origem_source, origem_medium   // Tracking de origem (Facebook, Instagram, etc)
}
```

### Tabela public_participants (Caixa Misteriosa)
**Estrutura atual:**
```sql
CREATE TABLE public_participants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  neighborhood VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  referral_code VARCHAR(50),           -- Código que usou
  referred_by_id INTEGER,              -- Quem indicou
  own_referral_code VARCHAR(50) UNIQUE,-- Código próprio
  extra_guesses INTEGER DEFAULT 0,     -- Palpites extras
  latitude DECIMAL(10, 8),             -- ✅ JÁ EXISTE! (Migration aplicada)
  longitude DECIMAL(11, 8),            -- ✅ JÁ EXISTE! (Migration aplicada)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Conexão com submissions (palpites):**
```sql
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL REFERENCES games(id),
  user_name VARCHAR(255) NOT NULL,
  user_phone VARCHAR(50) NOT NULL,
  user_neighborhood VARCHAR(255) NOT NULL,
  user_city VARCHAR(255) NOT NULL,
  guess VARCHAR(255) NOT NULL,
  public_participant_id INTEGER REFERENCES public_participants(id), -- ✅ FK existe
  submission_number INTEGER DEFAULT 1,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎯 Objetivo da Integração

### O que queremos visualizar:
1. **Participantes da Caixa Misteriosa** no mapa junto com participantes regulares
2. **Diferenciação visual** entre tipos de participantes:
   - 🎁 Participantes regulares (promoções)
   - 📦 Participantes da Caixa Misteriosa
3. **Filtros específicos**:
   - Por jogo/sorteio da Caixa Misteriosa
   - Por status (acertou/errou)
   - Por origem (referência)
4. **Estatísticas adicionais**:
   - Heatmap de participação por bairro
   - Taxa de conversão de referências
   - Distribuição geográfica de acertos

---

## 📋 Plano de Implementação

### **FASE 1: Backend - Unificação de Dados** ✅ PRIORIDADE ALTA

#### 1.1. Criar Endpoint Unificado
**Arquivo:** `api/participantes.js`

**Nova função:** `getAllParticipantsUnified()`

```javascript
// GET /api/participantes?unified=true
async function getAllParticipantsUnified(req, res) {
  try {
    const { includePublic = true } = req.query;

    let participantes = [];

    // 1. Buscar participantes regulares (tabela participantes)
    const regularQuery = `
      SELECT
        id,
        nome as name,
        telefone as phone,
        bairro as neighborhood,
        cidade as city,
        latitude,
        longitude,
        promocao_id,
        origem_source,
        origem_medium,
        data_cadastro as created_at,
        'regular' as participant_type,
        NULL as referral_code,
        NULL as extra_guesses
      FROM participantes
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    `;

    const regularResult = await query(regularQuery);
    participantes = regularResult.rows;

    // 2. Buscar participantes públicos (tabela public_participants)
    if (includePublic) {
      const publicQuery = `
        SELECT
          pp.id,
          pp.name,
          pp.phone,
          pp.neighborhood,
          pp.city,
          pp.latitude,
          pp.longitude,
          NULL as promocao_id,
          'caixa-misteriosa' as origem_source,
          'game' as origem_medium,
          pp.created_at,
          'public' as participant_type,
          pp.referral_code,
          pp.extra_guesses,
          COUNT(s.id) as total_submissions,
          SUM(CASE WHEN s.is_correct THEN 1 ELSE 0 END) as correct_guesses
        FROM public_participants pp
        LEFT JOIN submissions s ON pp.id = s.public_participant_id
        WHERE pp.latitude IS NOT NULL AND pp.longitude IS NOT NULL
        GROUP BY pp.id
      `;

      const publicResult = await query(publicQuery);
      participantes = [...participantes, ...publicResult.rows];
    }

    return res.json({
      success: true,
      data: participantes,
      stats: {
        total: participantes.length,
        regular: participantes.filter(p => p.participant_type === 'regular').length,
        public: participantes.filter(p => p.participant_type === 'public').length
      }
    });

  } catch (error) {
    console.error('Erro ao buscar participantes unificados:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar participantes'
    });
  }
}
```

#### 1.2. Criar Endpoint de Estatísticas da Caixa Misteriosa
**Arquivo:** `api/caixa-misteriosa.js`

**Nova função:** `getGameParticipantsStats()`

```javascript
// GET /api/caixa-misteriosa/games/:gameId/participants/stats
async function getGameParticipantsStats(req, res) {
  try {
    const { gameId } = req.params;

    const statsQuery = `
      SELECT
        COUNT(DISTINCT pp.id) as total_participants,
        COUNT(DISTINCT pp.city) as cities_count,
        COUNT(DISTINCT pp.neighborhood) as neighborhoods_count,
        COUNT(s.id) as total_submissions,
        SUM(CASE WHEN s.is_correct THEN 1 ELSE 0 END) as correct_submissions,
        AVG(pp.latitude) as center_lat,
        AVG(pp.longitude) as center_lng
      FROM public_participants pp
      INNER JOIN submissions s ON pp.id = s.public_participant_id
      WHERE s.game_id = $1
        AND pp.latitude IS NOT NULL
        AND pp.longitude IS NOT NULL
    `;

    const result = await query(statsQuery, [gameId]);

    return res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas do jogo:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas'
    });
  }
}
```

#### 1.3. Adicionar Rota no index.js
**Arquivo:** `api/index.js`

```javascript
// Dentro do switch (route):
case 'participantes':
  if (endpoint === 'unified') {
    return getAllParticipantsUnified(req, res);
  }
  // ... resto do código
  break;
```

---

### **FASE 2: Frontend - Service Layer** ✅ PRIORIDADE ALTA

#### 2.1. Atualizar participanteService.js
**Arquivo:** `src/services/participanteService.js`

```javascript
// Nova função para buscar participantes unificados
export const fetchParticipantesUnificados = async (includePublic = true) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/participantes?unified=true&includePublic=${includePublic}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar participantes unificados');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Erro ao buscar participantes unificados:', error);
    throw error;
  }
};

// Nova função para buscar estatísticas de um jogo
export const fetchGameParticipantsStats = async (gameId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/caixa-misteriosa/games/${gameId}/participants/stats`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas do jogo');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};
```

---

### **FASE 3: Frontend - Componente de Mapas** ✅ PRIORIDADE MÉDIA

#### 3.1. Atualizar MapasPage.jsx

**Mudanças principais:**

1. **Adicionar toggle para incluir participantes públicos**
```jsx
const [includePublicParticipants, setIncludePublicParticipants] = useState(true);
const [selectedGame, setSelectedGame] = useState('all');
```

2. **Modificar useEffect de carregamento de dados**
```jsx
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);

      // Usar novo endpoint unificado
      const { data: participantesData, stats } = await fetchParticipantesUnificados(
        includePublicParticipants
      );

      const [promocoesData, gamesData] = await Promise.all([
        fetchPromocoes(),
        fetchGames() // Nova função para buscar jogos da Caixa Misteriosa
      ]);

      // Processar dados...
      const participantesComCoords = (participantesData || [])
        .map(p => ({
          ...p,
          lat: parseFloat(p.latitude),
          lng: parseFloat(p.longitude),
          intensity: p.participant_type === 'public' ? 100 : 75,
          district: p.neighborhood || 'Não informado',
          city: p.city || 'Não informado',
          name: p.name || p.nome || 'Participante',
          // Coloração diferenciada por tipo
          origem_color: p.participant_type === 'public'
            ? '#8B5CF6' // Roxo para Caixa Misteriosa
            : getOrigemColor(p.origem_source || 'direto'),
          origem_label: p.participant_type === 'public'
            ? '📦 Caixa Misteriosa'
            : getOrigemLabel(p.origem_source || 'direto', p.origem_medium),
          // Dados específicos da Caixa Misteriosa
          total_submissions: p.total_submissions || 0,
          correct_guesses: p.correct_guesses || 0,
          extra_guesses: p.extra_guesses || 0
        }));

      setParticipantes(participantesComCoords);
      setPromocoes(promocoesData || []);
      setGames(gamesData || []);
      setStats(stats);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setParticipantes([]);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [includePublicParticipants]); // Recarregar quando toggle mudar
```

3. **Adicionar filtros específicos para Caixa Misteriosa**
```jsx
<div className="card-modern" style={{
  padding: '20px',
  marginBottom: '24px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px'
}}>
  {/* Toggle para incluir participantes públicos */}
  <div>
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '600',
      color: 'var(--color-text)',
      fontSize: '0.875rem',
      cursor: 'pointer'
    }}>
      <input
        type="checkbox"
        checked={includePublicParticipants}
        onChange={(e) => setIncludePublicParticipants(e.target.checked)}
        style={{ cursor: 'pointer' }}
      />
      📦 Incluir Caixa Misteriosa
    </label>
  </div>

  {/* Filtro por jogo (se incluir públicos) */}
  {includePublicParticipants && (
    <div>
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: 'var(--color-text)',
        fontSize: '0.875rem'
      }}>
        Filtrar por Jogo
      </label>
      <select
        value={selectedGame}
        onChange={(e) => setSelectedGame(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid var(--color-border)',
          borderRadius: '6px',
          background: 'var(--color-background)',
          color: 'var(--color-text)'
        }}
      >
        <option value="all">Todos os jogos</option>
        {games.map(game => (
          <option key={game.id} value={game.id}>
            Jogo #{game.id} - {game.product_name}
          </option>
        ))}
      </select>
    </div>
  )}

  {/* Filtros existentes... */}
</div>
```

4. **Atualizar função de filtro**
```jsx
const getFilteredParticipantes = () => {
  return participantes.filter(p => {
    // Filtro por tipo
    if (!includePublicParticipants && p.participant_type === 'public') {
      return false;
    }

    // Filtro por jogo (apenas para participantes públicos)
    if (p.participant_type === 'public' && selectedGame !== 'all') {
      // Buscar submissions deste participante neste jogo
      // (requer adicionar game_id ao retorno do backend)
      if (p.game_id != selectedGame) return false;
    }

    // Filtros existentes
    if (selectedPromotion !== 'all' && p.promocao_id != selectedPromotion) return false;
    if (selectedCity !== 'all' && p.city !== selectedCity) return false;
    if (selectedOrigem !== 'all' && (p.origem_source || 'direto') !== selectedOrigem) return false;

    return true;
  });
};
```

5. **Adicionar estatísticas específicas da Caixa Misteriosa**
```jsx
{includePublicParticipants && stats && (
  <div className="card-modern" style={{ padding: '20px', marginTop: '24px' }}>
    <h4 style={{
      marginBottom: '16px',
      color: 'var(--color-text)',
      fontSize: '1.125rem'
    }}>
      📦 Estatísticas da Caixa Misteriosa
    </h4>

    <div className="grid grid-4" style={{ gap: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 4px 0' }}>
          {stats.public}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Participantes Únicos
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 4px 0' }}>
          {participantes
            .filter(p => p.participant_type === 'public')
            .reduce((sum, p) => sum + p.total_submissions, 0)}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Total de Palpites
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 4px 0' }}>
          {participantes
            .filter(p => p.participant_type === 'public')
            .reduce((sum, p) => sum + p.correct_guesses, 0)}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Palpites Corretos
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎁</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 4px 0' }}>
          {participantes
            .filter(p => p.participant_type === 'public')
            .reduce((sum, p) => sum + p.extra_guesses, 0)}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Palpites Extras
        </p>
      </div>
    </div>
  </div>
)}
```

---

### **FASE 4: Melhorias no Mapa** ✅ PRIORIDADE BAIXA

#### 4.1. Atualizar InteractiveMap.jsx

**Mudanças:**

1. **Markers diferenciados por tipo**
```jsx
// Criar ícones customizados
const regularIcon = L.icon({
  iconUrl: '/markers/regular-marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const publicIcon = L.icon({
  iconUrl: '/markers/caixa-misteriosa-marker.png',
  iconSize: [30, 46],
  iconAnchor: [15, 46]
});

// Aplicar ícone baseado no tipo
const markerIcon = participant.participant_type === 'public'
  ? publicIcon
  : regularIcon;
```

2. **Popup customizado para participantes públicos**
```jsx
const getPopupContent = (participant) => {
  if (participant.participant_type === 'public') {
    return `
      <div class="map-popup">
        <h4>📦 ${participant.name}</h4>
        <p><strong>Bairro:</strong> ${participant.district}</p>
        <p><strong>Cidade:</strong> ${participant.city}</p>
        <p><strong>Total de Palpites:</strong> ${participant.total_submissions}</p>
        <p><strong>Acertos:</strong> ${participant.correct_guesses}</p>
        <p><strong>Palpites Extras:</strong> ${participant.extra_guesses}</p>
        ${participant.referral_code ? `<p><strong>Código Usado:</strong> ${participant.referral_code}</p>` : ''}
      </div>
    `;
  } else {
    return `
      <div class="map-popup">
        <h4>🎁 ${participant.name}</h4>
        <p><strong>Bairro:</strong> ${participant.district}</p>
        <p><strong>Cidade:</strong> ${participant.city}</p>
        <p><strong>Origem:</strong> ${participant.origem_label}</p>
      </div>
    `;
  }
};
```

3. **Heatmap com peso diferenciado**
```jsx
// Participantes da Caixa Misteriosa têm peso maior no heatmap
const heatmapData = participants.map(p => [
  p.lat,
  p.lng,
  p.participant_type === 'public' ? p.intensity * 1.2 : p.intensity
]);
```

---

## 🗂️ Estrutura de Arquivos Modificados

```
nexogeo/
├── api/
│   ├── index.js                  # ✏️ Modificar: adicionar rota unified
│   ├── participantes.js          # ✏️ Modificar: adicionar getAllParticipantsUnified()
│   └── caixa-misteriosa.js       # ✏️ Modificar: adicionar getGameParticipantsStats()
├── src/
│   ├── services/
│   │   └── participanteService.js # ✏️ Modificar: adicionar fetchParticipantesUnificados()
│   ├── components/
│   │   └── Maps/
│   │       └── InteractiveMap.jsx # ✏️ Modificar: markers e popups diferenciados
│   └── pages/
│       └── MapasPage.jsx          # ✏️ Modificar: adicionar filtros e estatísticas
└── public/
    └── markers/                   # 📁 Criar: ícones de marcadores
        ├── regular-marker.png
        └── caixa-misteriosa-marker.png
```

---

## ✅ Checklist de Implementação

### Backend
- [ ] Criar função `getAllParticipantsUnified()` em `api/participantes.js`
- [ ] Criar função `getGameParticipantsStats()` em `api/caixa-misteriosa.js`
- [ ] Adicionar rota `?unified=true` em `api/index.js`
- [ ] Testar endpoint com Postman/curl
- [ ] Verificar performance com muitos registros (>1000)
- [ ] Adicionar índices no banco se necessário

### Frontend - Service
- [ ] Criar `fetchParticipantesUnificados()` em `participanteService.js`
- [ ] Criar `fetchGameParticipantsStats()` em `participanteService.js`
- [ ] Criar `fetchGames()` para listar jogos ativos
- [ ] Testar funções no console do navegador

### Frontend - UI
- [ ] Adicionar toggle "Incluir Caixa Misteriosa"
- [ ] Adicionar filtro por jogo
- [ ] Atualizar função `getFilteredParticipantes()`
- [ ] Adicionar estatísticas da Caixa Misteriosa
- [ ] Modificar `getOrigemStats()` para incluir tipo público
- [ ] Atualizar visualização por bairros

### Mapa
- [ ] Criar ícones de marcadores (PNG 25x41 e 30x46)
- [ ] Implementar ícones diferenciados no InteractiveMap
- [ ] Criar popup customizado para participantes públicos
- [ ] Ajustar peso do heatmap por tipo
- [ ] Testar responsividade em mobile

### Testes
- [ ] Testar com 0 participantes públicos
- [ ] Testar com mix de participantes (regulares + públicos)
- [ ] Testar filtros combinados
- [ ] Testar performance com >500 markers
- [ ] Testar em navegadores diferentes (Chrome, Firefox, Safari)
- [ ] Testar em dispositivos móveis

---

## 📊 Métricas de Sucesso

### Performance
- ⏱️ Tempo de carregamento < 2s para 1000 participantes
- 🚀 Renderização do mapa < 1s
- 💾 Uso de memória < 100MB no navegador

### UX
- ✅ Diferenciação visual clara entre tipos
- ✅ Filtros intuitivos e responsivos
- ✅ Popups informativos e legíveis
- ✅ Mobile-friendly

### Dados
- ✅ 100% dos participantes com coordenadas aparecem no mapa
- ✅ Estatísticas precisas e atualizadas
- ✅ Filtros funcionando corretamente

---

## 🚀 Próximos Passos (Após Implementação)

1. **Analytics Avançado:**
   - Heatmap temporal (participação ao longo do tempo)
   - Análise de clusters geográficos
   - Correlação entre localização e acertos

2. **Exportação de Dados:**
   - Exportar mapa como imagem
   - Exportar lista de participantes por área
   - Relatórios em PDF

3. **Integração com Dashboard:**
   - Widget de mapa no dashboard principal
   - Alertas de novos participantes em tempo real
   - Notificações de áreas com alta participação

---

**Prioridade:** ALTA
**Estimativa:** 8-12 horas de desenvolvimento
**Responsável:** Equipe de desenvolvimento
**Prazo sugerido:** 7 dias

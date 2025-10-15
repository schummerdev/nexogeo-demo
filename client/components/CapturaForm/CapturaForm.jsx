// src/components/CapturaForm/CapturaForm.jsx

import React, 'useState', 'useEffect' from 'react';
import './CapturaForm.css';

// Componente principal do formulário de captura
const CapturaForm = () => {
  // --- ESTADO DO COMPONENTE ---
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    bairro: '',
    cidade: '',
  });

  const [promocao, setPromocao] = useState({
    id: null,
    nome: 'Carregando promoção...',
    descricao: '',
  });

  const [geolocalizacao, setGeolocalizacao] = useState(null);
  const [origem, setOrigem] = useState({ source: '', medium: '' });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // --- EFEITOS (LÓGICA QUE RODA QUANDO O COMPONENTE CARREGA) ---

  // Efeito para buscar dados da promoção e parâmetros da URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const promocaoId = params.get('id'); // Supondo que a URL seja ?id=123
    
    setOrigem({
      source: params.get('utm_source') || 'direto',
      medium: params.get('utm_medium') || 'link',
    });

    if (promocaoId) {
      // SIMULAÇÃO: No projeto real, você faria uma chamada à sua API aqui
      // Ex: fetch(`https://sua-api.com/promocoes/${promocaoId}` )
      console.log(`Buscando dados da promoção ID: ${promocaoId}`);
      setPromocao({
        id: promocaoId,
        nome: `Promoção Super Prêmio!`,
        descricao: 'Participe e concorra a um carro 0km. O sorteio será ao vivo na sexta-feira.',
      });
    } else {
        setPromocao({ nome: 'Promoção não encontrada', descricao: 'Verifique o link de participação.' });
    }
  }, []); // O array vazio [] faz este efeito rodar apenas uma vez

  // Efeito para solicitar a geolocalização
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGeolocalizacao({ latitude, longitude });
          console.log('Geolocalização obtida:', { latitude, longitude });
        },
        (error) => {
          console.warn('Usuário não permitiu a geolocalização.', error.message);
          setGeolocalizacao(null); // Garante que o valor seja nulo se houver erro
        }
      );
    }
  }, []);

  // --- FUNÇÕES DE MANIPULAÇÃO ---

  // Atualiza o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o recarregamento da página
    
    if (!formData.nome || !formData.telefone) {
        setErrorMessage('Nome e WhatsApp são obrigatórios!');
        return;
    }

    setStatus('loading');
    setErrorMessage('');

    const dadosCompletos = {
      ...formData,
      promocaoId: promocao.id,
      geolocalizacao,
      origem,
    };

    console.log('Enviando para a API:', dadosCompletos);

    // SIMULAÇÃO DE CHAMADA À API
    try {
      // No projeto real, substitua isso por:
      // const response = await fetch('https://sua-api.com/participantes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(dadosCompletos ),
      // });
      // if (!response.ok) throw new Error('Falha no servidor');
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula a demora da rede
      
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage('Não foi possível registrar sua participação. Tente novamente mais tarde.');
    }
  };

  // --- RENDERIZAÇÃO DO COMPONENTE ---

  if (status === 'success') {
    return (
      <div className="container-captura">
        <div className="card-sucesso">
          <div className="icone-sucesso">✓</div>
          <h1>Participação Confirmada!</h1>
          <p>Boa sorte! Fique ligado na nossa programação.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-captura">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-header">
          {/* <img src="/logo-emissora.png" alt="Logo da Emissora" className="logo" /> */}
          <h1>{promocao.nome}</h1>
          <p>{promocao.descricao}</p>
        </div>
        
        <div className="form-body">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="telefone">WhatsApp</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              placeholder="(99) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bairro">Bairro</label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cidade">Cidade</label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-footer">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Enviando...' : 'QUERO PARTICIPAR!'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CapturaForm;

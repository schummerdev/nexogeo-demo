// API de teste simplificada para auth
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // CORS seguro - apenas origens permitidas
  const allowedOrigins = [
    'https://tvsurui.com.br',
    'https://nexogeo2.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Auth API funcionando!',
      timestamp: new Date().toISOString()
    });
  }

  // Handle POST (login)
  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      message: 'Login simulado funcionou!',
      token: 'fake-token-for-test',
      user: { id: 1, email: 'test@example.com', role: 'admin' }
    });
  }

  res.status(405).json({ error: 'Método não permitido' });
};
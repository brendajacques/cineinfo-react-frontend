export default async function handler(req, res) {
  // Configurações de CORS para segurança e flexibilidade
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'O parâmetro "url" é obrigatório.' });
  }

  // Variáveis secretas do servidor (Vercel Environment Variables)
  const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
  const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || process.env.VITE_TMDB_ACCESS_TOKEN;
  const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;

  if (!TMDB_ACCESS_TOKEN && !TMDB_API_KEY) {
    return res.status(500).json({ 
      error: 'Servidor mal configurado: TMDB_ACCESS_TOKEN ou TMDB_API_KEY não encontrados nas variáveis de ambiente da Vercel.' 
    });
  }

  try {
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    const hasQuery = cleanUrl.includes('?');
    
    let targetUrl = `${TMDB_BASE_URL}${cleanUrl}`;
    if (TMDB_API_KEY && !TMDB_ACCESS_TOKEN) {
      targetUrl += `${hasQuery ? '&' : '?'}api_key=${TMDB_API_KEY}`;
    }

    const headers = { accept: 'application/json' };
    if (TMDB_ACCESS_TOKEN) {
      headers.Authorization = `Bearer ${TMDB_ACCESS_TOKEN}`;
    }

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Erro no proxy TMDB da Vercel:', error);
    return res.status(500).json({ error: 'Erro interno ao consultar a API do TMDB.' });
  }
}

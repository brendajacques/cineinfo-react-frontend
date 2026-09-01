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

  if (!TMDB_ACCESS_TOKEN) {
    return res.status(500).json({ 
      error: 'Servidor mal configurado: TMDB_ACCESS_TOKEN não encontrado nas variáveis de ambiente da Vercel.' 
    });
  }

  try {
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    const targetUrl = `${TMDB_BASE_URL}${cleanUrl}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Erro no proxy TMDB da Vercel:', error);
    return res.status(500).json({ error: 'Erro interno ao consultar a API do TMDB.' });
  }
}

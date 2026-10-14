import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Plugin local para emular o Backend Proxy da Vercel durante o desenvolvimento com "npm run dev"
function tmdbDevProxyPlugin(env) {
  return {
    name: 'tmdb-dev-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/tmdb')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost');
            const targetPath = urlObj.searchParams.get('url');

            if (!targetPath) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'O parâmetro "url" é obrigatório.' }));
              return;
            }

            const token = env.TMDB_ACCESS_TOKEN || env.VITE_TMDB_ACCESS_TOKEN;
            const apiKey = env.TMDB_API_KEY || env.VITE_TMDB_API_KEY;
            const baseUrl = env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

            if (!token && !apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'TMDB_ACCESS_TOKEN ou TMDB_API_KEY não encontrados no arquivo .env.' }));
              return;
            }

            const cleanUrl = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
            
            // Check if there is already a query string in the cleanUrl
            const hasQuery = cleanUrl.includes('?');
            
            let targetUrl = `${baseUrl}${cleanUrl}`;
            if (apiKey && !token) {
              targetUrl += `${hasQuery ? '&' : '?'}api_key=${apiKey}`;
            }

            const headers = { accept: 'application/json' };
            if (token) {
              headers.Authorization = `Bearer ${token}`;
            }

            const apiRes = await fetch(targetUrl, {
              method: 'GET',
              headers
            });

            const data = await apiRes.json();
            res.statusCode = apiRes.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: e.message || 'Erro no proxy local' }));
          }
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      tmdbDevProxyPlugin(env)
    ],
  };
})

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
            const baseUrl = env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

            if (!token) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'TMDB_ACCESS_TOKEN não encontrado no arquivo .env.' }));
              return;
            }

            const cleanUrl = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
            const targetUrl = `${baseUrl}${cleanUrl}`;

            const apiRes = await fetch(targetUrl, {
              method: 'GET',
              headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`
              }
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

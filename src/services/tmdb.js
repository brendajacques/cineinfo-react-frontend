/**
 * Helper centralizado para consultar a API do TMDB através do nosso Backend Proxy seguro (/api/tmdb).
 * - Em produção na Vercel: a rota /api/tmdb é processada pela Serverless Function em api/tmdb.js.
 * - Em desenvolvimento local: a rota /api/tmdb é processada pelo middleware no vite.config.js.
 *
 * @param {string} endpoint - Ex: '/movie/439079?language=pt-BR' ou '/search/movie?query=batman'
 * @returns {Promise<any>}
 */
export async function fetchTmdb(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const proxyUrl = `/api/tmdb?url=${encodeURIComponent(cleanEndpoint)}`;

  const response = await fetch(proxyUrl, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  });

  if (!response.ok) {
    let errorDetail = `Erro HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson?.error) {
        errorDetail = errJson.error;
      } else if (errJson?.status_message) {
        errorDetail = errJson.status_message;
      }
    } catch (_) {
      // Ignora se não for JSON
    }
    throw new Error(errorDetail);
  }

  return await response.json();
}

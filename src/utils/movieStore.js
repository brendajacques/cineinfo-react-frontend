/**
 * Utilitário de Gerenciamento de Sobresposição de Filmes (Merge & Override Pattern)
 * 
 * Permite que edições realizadas no painel administrativo persistam no localStorage
 * e sobrescrevam de forma transparente os dados da API pública do TMDB em todas as telas.
 */

/**
 * Obtém as edições salvas localmente para um filme específico.
 * @param {number|string} id - ID do filme
 * @returns {object|null} Dados sobrescritos ou null
 */
export function getMovieOverride(id) {
  if (!id) return null;
  try {
    const saved = localStorage.getItem(`cineinfo_edited_movie_${id}`);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error(`Erro ao ler sobresposição do filme ${id}:`, e);
    return null;
  }
}

/**
 * Aplica as edições salvas sobre o objeto de filme vindo da API do TMDB.
 * @param {object} apiMovie - Objeto do filme retornado pela API TMDB
 * @returns {object} Objeto do filme fundido com as edições locais
 */
export function applyMovieOverrides(apiMovie) {
  if (!apiMovie || !apiMovie.id) return apiMovie;

  const overrides = getMovieOverride(apiMovie.id);
  if (!overrides) return apiMovie;

  return {
    ...apiMovie,
    ...overrides, // Sobrescreve title, overview, release_date, vote_average, adminReview, etc.
  };
}

/**
 * Aplica as edições salvas sobre uma lista/array de filmes.
 * @param {Array} moviesList - Lista de filmes da API
 * @returns {Array} Lista de filmes com edições locais aplicadas
 */
export function applyMoviesListOverrides(moviesList) {
  if (!Array.isArray(moviesList)) return [];
  return moviesList.map(movie => applyMovieOverrides(movie));
}

/**
 * Salva as alterações de um filme no localStorage e notifica a aplicação.
 * @param {number|string} id - ID do filme
 * @param {object} updatedData - Novos dados do filme
 */
export function saveMovieOverride(id, updatedData) {
  if (!id) return;
  try {
    const payload = {
      ...updatedData,
      id: Number(id),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(`cineinfo_edited_movie_${id}`, JSON.stringify(payload));
    
    // Dispara evento customizado para reatividade global se necessário
    window.dispatchEvent(new CustomEvent('cineinfo_movie_updated', { detail: { id, data: payload } }));
  } catch (e) {
    console.error(`Erro ao salvar sobresposição do filme ${id}:`, e);
  }
}

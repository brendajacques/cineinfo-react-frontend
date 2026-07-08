import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext.jsx';
import Layout from '../components/Layout.jsx';
import MovieCard from '../components/MovieCard.jsx';
import { Heart, Film, ArrowLeft } from 'lucide-react';

function Favorites() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      if (favorites.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_TMDB_BASE_URL;
        const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

        if (!baseUrl || !token) {
          throw new Error('As variáveis de ambiente do TMDB não foram configuradas corretamente.');
        }

        // Busca detalhes de todos os filmes favoritos em paralelo
        const moviePromises = favorites.map(async (id) => {
          const url = `${baseUrl}/movie/${id}?language=pt-BR`;
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          });

          if (!response.ok) {
            // Se um filme individual falhar (ex: deletado), retorna null para ignorá-lo silenciosamente
            return null;
          }

          return response.json();
        });

        const results = await Promise.all(moviePromises);
        // Filtra nulos
        setMovies(results.filter((m) => m !== null));
      } catch (err) {
        console.error('Erro ao buscar favoritos:', err);
        setError(err.message || 'Ocorreu um erro ao carregar seus favoritos.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [favorites]);

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn">
        {/* Header da Página */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-cinema-charcoal pb-6">
          <div>
            <div className="flex items-center gap-2 text-cinema-gold mb-1">
              <Heart className="h-5 w-5 fill-cinema-gold animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">Sua Coleção</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-cinema-popcorn sm:text-4xl">
              Meus <span className="text-cinema-red">Favoritos</span>
            </h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 self-start rounded-full bg-cinema-charcoal/40 hover:bg-cinema-charcoal/80 px-5 py-2 text-sm font-bold text-cinema-popcorn border border-cinema-charcoal hover:border-cinema-gray/60 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Filmes</span>
          </button>
        </div>

        {/* Conteúdo Principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinema-gold"></div>
            <p className="text-cinema-popcorn/60 text-sm animate-pulse">Carregando seus favoritos...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-12 space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cinema-red/10 border border-cinema-red/30 text-cinema-red">
              <Film className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-cinema-popcorn">Erro ao carregar favoritos</h3>
            <p className="text-sm text-cinema-popcorn/60">{error}</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cinema-charcoal/50 text-cinema-gray border border-cinema-charcoal">
              <Heart className="h-8 w-8 text-cinema-gray" />
            </div>
            <h3 className="text-xl font-bold text-cinema-popcorn">Sua lista está vazia</h3>
            <p className="text-sm text-cinema-popcorn/60">
              Você ainda não adicionou nenhum filme aos seus favoritos. Explore nossa seleção e clique no ícone de coração nos cards de filme!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-cinema-gold px-6 py-2.5 text-sm font-bold text-cinema-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(245,197,24,0.3)] transition-all duration-300"
            >
              Explorar Filmes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favorites.includes(movie.id)}
                onFavoriteToggle={toggleFavorite}
                onDetailsClick={(id) => navigate(`/filme/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Favorites;

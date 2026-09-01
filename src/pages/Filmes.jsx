import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { Sparkles, Search, Play } from 'lucide-react';
import MovieCard from '../components/MovieCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { applyMoviesListOverrides } from '../utils/movieStore.js';
import { fetchTmdb } from '../services/tmdb.js';

function Filmes() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || searchParams.get('q') || '';
  const genreParam = searchParams.get('genre');

  const { favorites, toggleFavorite } = useFavorites();

  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [loadingTmdb, setLoadingTmdb] = useState(true);
  const [tmdbError, setTmdbError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [searchCategory, setSearchCategory] = useState('movie'); 

  useEffect(() => {
    const urlQuery = searchParams.get('search') || searchParams.get('q') || '';
    setSearchTerm(urlQuery);
  }, [searchParams]);

  const handleSearchChange = (newTerm) => {
    setSearchTerm(newTerm);
    if (newTerm.trim()) {
      setSearchParams({ search: newTerm });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoadingTmdb(true);
        setTmdbError(null);

        const query = searchTerm.trim();
        let endpoint = '';
        const category = searchCategory || 'movie';

        if (query) {
          endpoint = `/search/multi?query=${encodeURIComponent(query)}&language=pt-BR`;
        } else if (genreParam) {
          endpoint = `/discover/${category}?with_genres=${genreParam}&language=pt-BR`;
        } else {
          endpoint = `/trending/${category}/week?language=pt-BR`;
        }

        const data = await fetchTmdb(endpoint);
        setTmdbMovies(applyMoviesListOverrides(data.results || []));
      } catch (err) {
        console.error('Erro ao buscar do TMDB:', err);
        setTmdbError(err.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setLoadingTmdb(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, searchCategory, genreParam]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 pt-24">
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-cinema-gold animate-spin-slow" />
              <h3 className="text-2xl font-black tracking-wide text-cinema-popcorn">
                {searchTerm.trim()
                  ? `Resultados para "${searchTerm}"`
                  : genreParam
                  ? `Filmes por Gênero`
                  : searchCategory === 'tv'
                  ? 'Séries Populares'
                  : 'Filmes Populares'}
              </h3>
            </div>
            <span className="text-xs text-cinema-neon hover:underline cursor-pointer flex items-center gap-1 font-bold">
              Atualizado em Tempo Real <Play className="h-2 w-2 fill-cinema-neon" />
            </span>
          </div>

          <SearchBar 
            value={searchTerm} 
            onChange={handleSearchChange} 
            category={searchCategory}
            onCategoryChange={setSearchCategory}
          />

          {loadingTmdb ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex flex-col rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/20 h-95 overflow-hidden"
                >
                  <div className="bg-cinema-charcoal/50 aspect-2/3 w-full"></div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-3.5 bg-cinema-charcoal/50 rounded w-1/3"></div>
                      <div className="h-4 bg-cinema-charcoal/50 rounded w-3/4"></div>
                      <div className="space-y-2">
                         <div className="h-2.5 bg-cinema-charcoal/50 rounded w-full"></div>
                         <div className="h-2.5 bg-cinema-charcoal/50 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : tmdbError ? (
            <div className="rounded-xl border border-cinema-red/25 bg-cinema-red/10 p-6 text-center">
              <p className="text-cinema-red font-bold">Falha ao obter filmes da API</p>
              <p className="text-xs text-cinema-popcorn/60 mt-2">{tmdbError}</p>
            </div>
          ) : tmdbMovies.length === 0 ? (
            <div className="rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/10 p-12 text-center max-w-lg mx-auto shadow-lg">
              <Search className="h-12 w-12 text-cinema-gray mx-auto mb-4 animate-pulse" />
              <h4 className="text-xl font-bold text-cinema-popcorn">Nenhum filme encontrado</h4>
              <button
                onClick={() => handleSearchChange('')}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-cinema-charcoal/50 hover:bg-cinema-charcoal px-5 py-2 text-xs font-bold text-cinema-gold border border-cinema-gold/30 hover:border-cinema-gold transition-all duration-300"
              >
                Limpar Busca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {tmdbMovies.map((movie) => (
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
        </section>
      </div>
    </Layout>
  );
}

export default Filmes;

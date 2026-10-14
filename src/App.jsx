import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { Star, Heart, Flame, Sparkles, Play } from 'lucide-react';
import MovieCard from './components/MovieCard.jsx';
import { useFavorites } from './context/FavoritesContext.jsx';
import { applyMovieOverrides, applyMoviesListOverrides } from './utils/movieStore.js';
import { fetchTmdb } from './services/tmdb.js';

function App() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loadingTmdb, setLoadingTmdb] = useState(true);
  const [tmdbError, setTmdbError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoadingTmdb(true);
        setTmdbError(null);

        const endpoint = `/trending/all/week?language=pt-BR`;
        const data = await fetchTmdb(endpoint);
        const moviesList = applyMoviesListOverrides(data.results || []);
        
        setTmdbMovies(moviesList);

        if (moviesList.length > 0) {
          setFeaturedMovie(moviesList[0]);
        }
      } catch (err) {
        console.error('Erro ao buscar do TMDB:', err);
        setTmdbError(err.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setLoadingTmdb(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  const displayMovie = featuredMovie || {
    id: 439079,
    title: "A Freira",
    media_type: "movie",
    release_date: "2018-09-05",
    overview: "Presa em um convento na Romênia, uma freira comete suicídio. Para investigar o caso, o Vaticano envia um padre assombrado e uma noviça prestes a se tornar freira. Juntos, eles descobrem o segredo profano da ordem.",
    backdrop_path: "/fgsHxz21B27hOOqQBiw9L6yWcM7.jpg"
  };

  return (
    <Layout fullWidth={true}>
      {/* Full-width Hero Section */}
      <section className="relative overflow-hidden w-full min-h-[600px] md:min-h-[700px] lg:min-h-[80vh] flex items-center px-4 sm:px-6 lg:px-8 xl:px-20 pt-32 pb-20 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-cinema-black">
        {loadingTmdb ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-cinema-black/75 to-transparent z-0"></div>
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cinema-red/10 blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute -left-10 -bottom-10 h-72 w-72 rounded-full bg-cinema-neon/5 blur-[100px] pointer-events-none z-0"></div>
            
            <div className="relative z-10 max-w-3xl space-y-6 w-full">
              <div className="h-8 w-40 bg-cinema-charcoal/40 rounded-md animate-pulse"></div>
              <div className="h-16 sm:h-20 md:h-24 w-3/4 bg-cinema-charcoal/40 rounded-md animate-pulse"></div>
              <div className="h-5 w-48 bg-cinema-charcoal/40 rounded-md animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-cinema-charcoal/40 rounded-md animate-pulse"></div>
                <div className="h-4 w-5/6 bg-cinema-charcoal/40 rounded-md animate-pulse"></div>
                <div className="h-4 w-4/6 bg-cinema-charcoal/40 rounded-md animate-pulse"></div>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="h-12 w-36 bg-cinema-charcoal/40 rounded-md animate-pulse"></div>
                <div className="h-12 w-56 bg-cinema-charcoal/40 rounded-md animate-pulse"></div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Background Image and Gradient Overlays */}
            <div className="absolute inset-0">
              <img 
                src={displayMovie.backdrop_path 
                  ? `https://image.tmdb.org/t/p/original${displayMovie.backdrop_path}` 
                  : displayMovie.poster_path
                    ? `https://image.tmdb.org/t/p/original${displayMovie.poster_path}`
                    : ''
                } 
                alt={displayMovie.title || displayMovie.name || "Filme em Destaque"} 
                className="h-full w-full object-cover opacity-60 object-center md:object-right-top animate-fade-in"
              />
              {/* Gradients to blend image cleanly with dark background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-cinema-black/75 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-transparent"></div>
            </div>

            {/* Ambient Glows */}
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cinema-red/10 blur-[100px] pointer-events-none"></div>
            <div className="absolute -left-10 -bottom-10 h-72 w-72 rounded-full bg-cinema-neon/5 blur-[100px] pointer-events-none"></div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-md bg-cinema-red/15 border border-cinema-red/30 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-cinema-red">
                <Flame className="h-3.5 w-3.5 animate-pulse" />
                <span>{featuredMovie ? "Top 1 da Semana" : "Destaque de Terror"}</span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
                {displayMovie.title || displayMovie.name}
              </h2>

              {(displayMovie.release_date || displayMovie.first_air_date) && (
                <p className="text-sm font-semibold tracking-wide text-cinema-popcorn/60 uppercase">
                  {displayMovie.media_type === 'tv' ? 'Série' : 'Filme'} • {new Date(displayMovie.release_date || displayMovie.first_air_date).getFullYear()}
                </p>
              )}

              <p className="text-sm md:text-base leading-relaxed text-cinema-popcorn/80 font-normal max-w-2xl line-clamp-3 md:line-clamp-4">
                {displayMovie.overview}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button 
                  onClick={() => {
                    navigate(displayMovie.media_type === 'tv' ? `/serie/${displayMovie.id}` : `/filme/${displayMovie.id}`);
                  }}
                  className="flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold text-black hover:bg-neutral-200 transition-all duration-300"
                >
                  <Play className="h-4 w-4 fill-black text-black" />
                  <span>Ver Detalhes</span>
                </button>
                <button 
                  onClick={() => toggleFavorite(displayMovie.id)}
                  className={`flex items-center gap-2 rounded-md border px-6 py-3 text-sm font-bold transition-all duration-300 ${
                    favorites.includes(displayMovie.id) 
                      ? 'border-cinema-red bg-cinema-red/15 text-cinema-red shadow-[0_0_15px_rgba(229,9,20,0.25)]' 
                      : 'border-white/15 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(displayMovie.id) ? 'fill-cinema-red text-cinema-red' : 'text-white'}`} />
                  <span>{favorites.includes(displayMovie.id) ? 'Favoritado' : 'Adicionar aos Favoritos'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Standard Container for the rest of the elements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-cinema-gold animate-spin-slow" />
              <h3 className="text-2xl font-black tracking-wide text-cinema-popcorn">
                Destaques da Semana
              </h3>
            </div>
            <button
              onClick={() => navigate('/filmes')}
              className="text-xs font-bold text-cinema-gold hover:text-yellow-400 transition-colors uppercase tracking-wider flex items-center gap-1 border border-cinema-gold/30 hover:border-cinema-gold px-4 py-2 rounded-full"
            >
              Ver Tudo <Play className="h-3 w-3" />
            </button>
          </div>

          {loadingTmdb ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex flex-col rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/20 h-[380px] overflow-hidden"
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
                    <div className="h-8 bg-cinema-charcoal/50 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : tmdbError ? (
            <div className="rounded-xl border border-cinema-red/25 bg-cinema-red/10 p-6 text-center">
              <p className="text-cinema-red font-bold">Falha ao obter filmes da API</p>
              <p className="text-xs text-cinema-popcorn/60 mt-2">{tmdbError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {tmdbMovies.slice(0, 4).map((movie) => {
                const isFav = favorites.includes(movie.id);
                return (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={isFav}
                    onFavoriteToggle={toggleFavorite}
                    onDetailsClick={(id) => navigate(`/filme/${id}`)}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default App;

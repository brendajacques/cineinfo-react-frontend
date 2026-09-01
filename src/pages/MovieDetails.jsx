import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext.jsx';
import Layout from '../components/Layout.jsx';
import { Star, Heart, ArrowLeft, Clock, Calendar, Film, Sparkles, DollarSign, Globe, Clapperboard, MessageSquare, Tv } from 'lucide-react';
import { applyMovieOverrides } from '../utils/movieStore.js';
import { fetchTmdb } from '../services/tmdb.js';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites, toggleFavorite } = useFavorites();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const isSeriePath = location.pathname.startsWith('/serie');
        const primaryEndpoint = isSeriePath
          ? `/tv/${id}?language=pt-BR&append_to_response=credits,aggregate_credits`
          : `/movie/${id}?language=pt-BR&append_to_response=credits`;

        let data;
        try {
          data = await fetchTmdb(primaryEndpoint);
        } catch (err) {
          // Se falhar no endpoint primário, tenta no endpoint alternativo (Filme <-> Série)
          const fallbackEndpoint = isSeriePath
            ? `/movie/${id}?language=pt-BR&append_to_response=credits`
            : `/tv/${id}?language=pt-BR&append_to_response=credits,aggregate_credits`;

          data = await fetchTmdb(fallbackEndpoint);
        }

        // Normalização dos campos para unificar Filmes e Séries em uma única estrutura
        const isTv = !data.title && (!!data.name || !!data.first_air_date);
        const normalizedData = {
          ...data,
          id: Number(id),
          title: data.title || data.name || 'Sem Título',
          original_title: data.original_title || data.original_name || data.name || '',
          release_date: data.release_date || data.first_air_date || '',
          runtime: data.runtime || (data.episode_run_time && data.episode_run_time[0]) || null,
          number_of_seasons: data.number_of_seasons || null,
          number_of_episodes: data.number_of_episodes || null,
          isTv: isTv,
          credits: {
            cast: data.credits?.cast || data.aggregate_credits?.cast || []
          }
        };

        setMovie(applyMovieOverrides(normalizedData));
      } catch (err) {
        console.error('Erro ao buscar detalhes do título:', err);
        setError(err.message || 'Ocorreu um erro ao obter os detalhes do título.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, location.pathname]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinema-gold"></div>
          <p className="text-cinema-popcorn/60 text-sm animate-pulse">Carregando detalhes...</p>
        </div>
      </Layout>
    );
  }

  if (error || !movie) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-16 space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cinema-red/10 border border-cinema-red/30 text-cinema-red">
            <Film className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-cinema-popcorn">Ops! Algo deu errado.</h3>
          <p className="text-sm text-cinema-popcorn/60">{error || 'Título não encontrado.'}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full bg-cinema-charcoal/50 hover:bg-cinema-charcoal px-6 py-2.5 text-sm font-bold text-cinema-gold border border-cinema-gold/30 hover:border-cinema-gold transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para a Home</span>
          </button>
        </div>
      </Layout>
    );
  }

  const isFav = favorites.includes(movie.id);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const formatCurrency = (value) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <Layout>
      <div className="space-y-8">

        <div className="flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cinema-charcoal/40 hover:bg-cinema-charcoal border border-cinema-charcoal/60 hover:border-cinema-gold/50 text-cinema-popcorn/80 hover:text-cinema-gold transition-all duration-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-cinema-charcoal/80 bg-cinema-charcoal/20 shadow-2xl">
          {backdropUrl && (
            <div className="absolute inset-0 -z-10">
              <img
                src={backdropUrl}
                alt=""
                className="h-full w-full object-cover opacity-25 blur-[1px] scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-cinema-black via-cinema-black/85 to-transparent"></div>
              <div className="absolute inset-0 bg-linear-to-r from-cinema-black/90 via-transparent to-transparent"></div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10 items-center">
            <div className="md:col-span-4 lg:col-span-3 mx-auto md:mx-0 w-full max-w-[260px] md:max-w-none">
              <div className="group relative overflow-hidden rounded-2xl border-2 border-cinema-charcoal/80 bg-cinema-black shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-all duration-500 hover:border-cinema-gold/50 hover:shadow-[0_20px_40px_rgba(245,197,24,0.15)]">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex aspect-2/3 w-full flex-col items-center justify-center bg-cinema-charcoal p-4 text-center">
                    <Film className="h-12 w-12 text-cinema-gray mb-3" />
                    <span className="text-sm font-bold text-cinema-popcorn">{movie.title}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-9 space-y-6 text-left">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-cinema-red/15 border border-cinema-red/30 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-cinema-red flex items-center gap-1">
                    {movie.isTv ? <Tv className="h-3 w-3" /> : <Film className="h-3 w-3" />}
                    <span>{movie.isTv ? 'Série' : 'Filme'}</span>
                  </span>
                  {movie.genres?.map(genre => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-cinema-neon/10 border border-cinema-neon/30 px-3 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-cinema-neon hover:bg-cinema-neon/20 transition-colors duration-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-cinema-popcorn drop-shadow-md">
                  {movie.title}
                </h1>

                {movie.tagline && (
                  <p className="text-sm sm:text-base md:text-lg italic text-cinema-gold/90 font-medium tracking-wide">
                    "{movie.tagline}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl border border-cinema-charcoal/60 bg-cinema-black/60 backdrop-blur-sm">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/50 flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-cinema-gold fill-cinema-gold" /> Avaliação
                  </span>
                  <p className="text-base sm:text-lg font-extrabold text-cinema-gold">
                    {rating} <span className="text-xs text-cinema-popcorn/50 font-normal">/ 10</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/50 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cinema-neon" /> {movie.isTv ? 'Temporadas' : 'Duração'}
                  </span>
                  <p className="text-base sm:text-lg font-extrabold text-cinema-popcorn">
                    {movie.isTv
                      ? `${movie.number_of_seasons || 1} Temp.`
                      : movie.runtime ? `${movie.runtime} min` : 'N/A'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/50 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-cinema-popcorn/60" /> Lançamento
                  </span>
                  <p className="text-base sm:text-lg font-extrabold text-cinema-popcorn">
                    {releaseYear}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/50">
                    Origem
                  </span>
                  <p className="text-base sm:text-lg font-extrabold text-cinema-popcorn uppercase">
                    {movie.original_language || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => toggleFavorite(movie.id)}
                  className={`flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold cursor-pointer transition-all duration-300 transform active:scale-95 ${isFav
                      ? 'border-cinema-gold bg-cinema-gold/15 text-cinema-gold shadow-[0_0_15px_rgba(245,197,24,0.35)] hover:bg-cinema-gold/25'
                      : 'border-cinema-gray bg-cinema-charcoal/40 text-cinema-popcorn hover:border-cinema-gold hover:text-cinema-gold hover:bg-cinema-charcoal/70'
                    }`}
                >
                  <Star className={`h-4.5 w-4.5 transition-colors duration-300 ${isFav ? 'fill-cinema-gold text-cinema-gold' : ''}`} />
                  <span>{isFav ? 'Favoritado' : 'Adicionar aos Favoritos'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">

          <div className="lg:col-span-8 space-y-8">

            <section className="rounded-2xl border border-cinema-charcoal/60 bg-cinema-charcoal/15 backdrop-blur-xs p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-cinema-charcoal/60">
                <Sparkles className="h-5 w-5 text-cinema-gold" />
                <h2 className="text-xl font-bold text-cinema-popcorn">Sinopse</h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-cinema-popcorn/85 tracking-wide">
                {movie.overview || 'Nenhuma sinopse disponível em português.'}
              </p>
            </section>

            {movie.adminReview && (
              <section className="rounded-2xl border border-cinema-gold/30 bg-cinema-gold/5 backdrop-blur-xs p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2.5 pb-3 border-b border-cinema-gold/20">
                  <MessageSquare className="h-5 w-5 text-cinema-gold" />
                  <h2 className="text-xl font-bold text-cinema-gold">Resenha Editorial (Administração)</h2>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-cinema-popcorn/90 italic font-light">
                  "{movie.adminReview}"
                </p>
              </section>
            )}

            <section className="rounded-2xl border border-cinema-charcoal/60 bg-cinema-charcoal/15 backdrop-blur-xs p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-cinema-charcoal/60">
                <Clapperboard className="h-5 w-5 text-cinema-neon" />
                <h2 className="text-xl font-bold text-cinema-popcorn">Elenco Principal</h2>
              </div>

              {movie.credits?.cast && movie.credits.cast.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movie.credits.cast.slice(0, 8).map((actor) => (
                    <div
                      key={actor.id}
                      className="group flex flex-col items-center text-center p-3 rounded-xl bg-cinema-charcoal/30 border border-cinema-charcoal/50 hover:border-cinema-gold/30 hover:bg-cinema-charcoal/60 transition-all duration-300"
                    >
                      <div className="h-20 w-20 rounded-full overflow-hidden mb-3 border border-cinema-charcoal/80 shadow-md group-hover:border-cinema-gold/50 transition-colors duration-300">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full bg-cinema-charcoal flex items-center justify-center text-cinema-gold text-lg font-bold">
                            {actor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-cinema-popcorn line-clamp-1 group-hover:text-cinema-gold transition-colors duration-200">{actor.name}</span>
                      <span className="text-[10px] text-cinema-popcorn/50 line-clamp-1 mt-0.5">{actor.character || 'Personagem'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-cinema-popcorn/50 italic">Nenhuma informação de elenco disponível.</p>
              )}
            </section>

          </div>

          <div className="lg:col-span-4 space-y-8">
            <section className="rounded-2xl border border-cinema-charcoal/60 bg-cinema-charcoal/15 backdrop-blur-xs p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-cinema-charcoal/60">
                <Film className="h-5 w-5 text-cinema-gold" />
                <h2 className="text-xl font-bold text-cinema-popcorn">Ficha Técnica</h2>
              </div>

              <div className="space-y-4 divide-y divide-cinema-charcoal/40">
                <div className="pt-0 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/40 block mb-1">Título Original</span>
                  <span className="text-sm font-semibold text-cinema-popcorn">{movie.original_title || movie.title}</span>
                </div>

                {movie.isTv ? (
                  <>
                    <div className="pt-3 pb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/40 block mb-1">
                        Temporadas
                      </span>
                      <span className="text-sm font-semibold text-cinema-popcorn">{movie.number_of_seasons || 'N/A'}</span>
                    </div>
                    <div className="pt-3 pb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/40 block mb-1">
                        Episódios
                      </span>
                      <span className="text-sm font-semibold text-cinema-popcorn">{movie.number_of_episodes || 'N/A'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pt-3 pb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/40 block mb-1 items-center gap-1">
                        <DollarSign className="h-3 w-3 text-cinema-gold" /> Orçamento
                      </span>
                      <span className="text-sm font-semibold text-cinema-popcorn">{formatCurrency(movie.budget)}</span>
                    </div>

                    <div className="pt-3 pb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/40 block mb-1 items-center gap-1">
                        <DollarSign className="h-3 w-3 text-cinema-neon" /> Receita
                      </span>
                      <span className="text-sm font-semibold text-cinema-popcorn">{formatCurrency(movie.revenue)}</span>
                    </div>
                  </>
                )}

                {movie.production_countries && movie.production_countries.length > 0 && (
                  <div className="pt-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/40 block mb-1 items-center gap-1">
                      <Globe className="h-3 w-3 text-cinema-popcorn/60" /> País de Produção
                    </span>
                    <span className="text-sm font-semibold text-cinema-popcorn leading-relaxed block">
                      {movie.production_countries.map(c => c.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default MovieDetails;

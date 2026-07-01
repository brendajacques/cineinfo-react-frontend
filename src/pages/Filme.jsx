import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';
import { Star, Heart, ArrowLeft, Clock, Calendar, Film, Sparkles } from 'lucide-react';


function Filme() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_TMDB_BASE_URL;
        const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

        if (!baseUrl || !token) {
          throw new Error('As variáveis de ambiente do TMDB não foram configuradas corretamente.');
        }

        const url = `${baseUrl}/movie/${id}?language=pt-BR&append_to_response=credits`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Filme não encontrado (status: ${response.status})`);
        }

        const data = await response.json();
        setMovie(data);
      } catch (err) {
        console.error('Erro ao buscar detalhes do filme:', err);
        setError(err.message || 'Ocorreu um erro ao obter os detalhes do filme.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinema-gold"></div>
          <p className="text-cinema-popcorn/60 text-sm animate-pulse">Carregando detalhes do filme...</p>
        </div>
      </Layout>
    );
  }

  if (error || !movie) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-12 space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cinema-red/10 border border-cinema-red/30 text-cinema-red">
            <Film className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-cinema-popcorn">Ops! Algo deu errado.</h3>
          <p className="text-sm text-cinema-popcorn/60">{error || 'Filme não encontrado.'}</p>
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
      <div className="space-y-8 pb-12">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cinema-popcorn/60 hover:text-cinema-gold transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-cinema-charcoal bg-cinema-charcoal/10 shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
          {backdropUrl && (
            <div className="absolute inset-0 -z-10">
              <img
                src={backdropUrl}
                alt=""
                className="h-full w-full object-cover opacity-20 blur-[2px]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-cinema-black via-cinema-black/80 to-transparent"></div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10 items-start">
            <div className="md:col-span-4 lg:col-span-3 mx-auto md:mx-0 w-full max-w-[280px] md:max-w-none">
              <div className="overflow-hidden rounded-2xl border border-cinema-charcoal bg-cinema-black shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                {posterUrl ? (
                  <img src={posterUrl} alt={movie.title} className="w-full h-auto object-cover" />
                ) : (
                  <div className="flex aspect-2/3 w-full flex-col items-center justify-center bg-cinema-charcoal p-4 text-center">
                    <Film className="h-12 w-12 text-cinema-gray mb-3" />
                    <span className="text-sm font-bold text-cinema-popcorn">{movie.title}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-9 space-y-6">
              <div className="space-y-3 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  {movie.genres?.map(genre => (
                    <span key={genre.id} className="rounded-full bg-cinema-charcoal/80 border border-cinema-charcoal px-3 py-1 text-[11px] font-semibold text-cinema-neon">
                      {genre.name}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-cinema-popcorn">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-sm md:text-base italic text-cinema-gold/85 font-medium">
                    "{movie.tagline}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-cinema-charcoal/60 bg-cinema-black/40 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/40 flex items-center gap-1">
                    <Star className="h-3 w-3 text-cinema-gold fill-cinema-gold" /> Avaliação
                  </span>
                  <p className="text-base font-extrabold text-cinema-gold">
                    {rating} <span className="text-xs text-cinema-popcorn/50 font-normal">/ 10</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/40 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-cinema-neon" /> Duração
                  </span>
                  <p className="text-base font-extrabold text-cinema-popcorn">
                    {movie.runtime ? `${movie.runtime} min` : 'N/A'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/40 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-cinema-gray" /> Lançamento
                  </span>
                  <p className="text-base font-extrabold text-cinema-popcorn">
                    {releaseYear}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cinema-popcorn/40">
                    Origem
                  </span>
                  <p className="text-base font-extrabold text-cinema-popcorn uppercase">
                    {movie.original_language || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-left">
                <h3 className="text-lg font-bold text-cinema-popcorn flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-cinema-gold" />
                  Sinopse
                </h3>
                <p className="text-sm leading-relaxed text-cinema-popcorn/80">
                  {movie.overview || 'Nenhuma sinopse disponível em português para este filme.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-cinema-charcoal/40">
                <button
                  onClick={() => toggleFavorite(movie.id)}
                  className={`flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition-all duration-300 ${isFav
                      ? 'border-cinema-red bg-cinema-red/15 text-cinema-red shadow-[0_0_12px_rgba(229,9,20,0.3)]'
                      : 'border-cinema-gray bg-cinema-charcoal/40 text-cinema-popcorn hover:border-cinema-gold hover:text-cinema-gold'
                    }`}
                >
                  <Heart className={`h-4 w-4 ${isFav ? 'fill-cinema-red' : ''}`} />
                  <span>{isFav ? 'Favoritado' : 'Adicionar aos Favoritos'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/20 p-6 space-y-6 text-left">
            <h4 className="text-lg font-bold text-cinema-popcorn pb-3 border-b border-cinema-charcoal/60">Informações Técnicas</h4>
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-cinema-popcorn/40 uppercase font-bold tracking-wider block mb-1">Título Original</span>
                <span className="text-cinema-popcorn font-medium">{movie.original_title || movie.title}</span>
              </div>
              <div>
                <span className="text-cinema-popcorn/40 uppercase font-bold tracking-wider block mb-1">Orçamento</span>
                <span className="text-cinema-popcorn font-medium">{formatCurrency(movie.budget)}</span>
              </div>
              <div>
                <span className="text-cinema-popcorn/40 uppercase font-bold tracking-wider block mb-1">Receita</span>
                <span className="text-cinema-popcorn font-medium">{formatCurrency(movie.revenue)}</span>
              </div>
              {movie.production_countries && movie.production_countries.length > 0 && (
                <div>
                  <span className="text-cinema-popcorn/40 uppercase font-bold tracking-wider block mb-1">País de Produção</span>
                  <span className="text-cinema-popcorn font-medium">
                    {movie.production_countries.map(c => c.name).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/10 p-6 space-y-6 text-left">
            <h4 className="text-lg font-bold text-cinema-popcorn pb-3 border-b border-cinema-charcoal/60">Elenco Principal</h4>
            {movie.credits?.cast && movie.credits.cast.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {movie.credits.cast.slice(0, 8).map((actor) => (
                  <div key={actor.id} className="flex flex-col items-center text-center p-2 rounded-xl bg-cinema-charcoal/10 border border-cinema-charcoal/30">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="h-20 w-20 rounded-full object-cover mb-2 border border-cinema-charcoal"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-cinema-charcoal flex items-center justify-center mb-2 text-cinema-gray text-xs">
                        {actor.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-bold text-cinema-popcorn line-clamp-1">{actor.name}</span>
                    <span className="text-[10px] text-cinema-popcorn/50 line-clamp-1 mt-0.5">{actor.character}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-cinema-popcorn/40">Nenhuma informação de elenco disponível.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Filme;

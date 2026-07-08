import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { Star, Heart, Flame, Sparkles, MessageSquare, Play, CheckCircle2, Search } from 'lucide-react';
import MovieCard from './components/MovieCard.jsx';
import SearchBar from './components/SearchBar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useFavorites } from './context/FavoritesContext.jsx';

function App() {
  const navigate = useNavigate();
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewType, setReviewType] = useState('filme');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewsList, setReviewsList] = useState([
    { id: 1, title: 'Duna: Parte 2', type: 'filme', content: 'Uma obra-prima visual com cinematografia e design de som inacreditáveis.', rating: 5, author: 'PipocaGourmet' },
    { id: 2, title: 'Stranger Things', type: 'série', content: 'A temporada final promete resgatar todo o clima nostálgico dos anos 80.', rating: 4, author: 'GeekMaster' }
  ]);
  const [successMsg, setSuccessMsg] = useState(false);

  const { favorites, toggleFavorite } = useFavorites();

  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loadingTmdb, setLoadingTmdb] = useState(true);
  const [tmdbError, setTmdbError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMovies = tmdbMovies.filter((movie) => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = movie.title?.toLowerCase().includes(searchLower);
    const originalTitleMatch = movie.original_title?.toLowerCase().includes(searchLower);
    const overviewMatch = movie.overview?.toLowerCase().includes(searchLower);
    return titleMatch || originalTitleMatch || overviewMatch;
  });


  useEffect(() => {
    const fetchTmdbMovies = async () => {
      try {
        setLoadingTmdb(true);
        const baseUrl = import.meta.env.VITE_TMDB_BASE_URL;
        const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

        if (!baseUrl || !token) {
          throw new Error('As variáveis de ambiente do TMDB não foram configuradas corretamente.');
        }

        try {
          const featuredUrl = `${baseUrl}/movie/439079?language=pt-BR`;
          const featuredResponse = await fetch(featuredUrl, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          if (featuredResponse.ok) {
            const featuredData = await featuredResponse.json();
            setFeaturedMovie(featuredData);
          }
        } catch (err) {
          console.error('Erro ao buscar filme em destaque:', err);
        }

        const url = `${baseUrl}/trending/movie/week?language=pt-BR`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erro na API TMDB: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setTmdbMovies(data.results || []);
      } catch (err) {
        console.error('Erro ao buscar do TMDB:', err);
        setTmdbError(err.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setLoadingTmdb(false);
      }
    };

    fetchTmdbMovies();
  }, []);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewContent.trim()) return;

    const newReview = {
      id: Date.now(),
      title: reviewTitle,
      type: reviewType,
      content: reviewContent,
      rating: 5,
      author: 'Você'
    };

    setReviewsList([newReview, ...reviewsList]);
    setReviewTitle('');
    setReviewContent('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <Layout>
      <section className="relative overflow-hidden rounded-3xl border border-cinema-charcoal bg-cinema-black p-8 md:p-12 mb-12 shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-0">
          <img 
            src={featuredMovie?.backdrop_path 
              ? `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}` 
              : "https://image.tmdb.org/t/p/original/fgsHxz21B27hOOqQBiw9L6yWcM7.jpg"
            } 
            alt={featuredMovie?.title || "A Freira"} 
            className="h-full w-full object-cover opacity-65 object-top-right animate-fade-in"
          />
          <div className="absolute inset-0 bg-linear-to-r from-cinema-black via-cinema-black/50 to-transparent"></div>
        </div>

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cinema-red/10 blur-[80px] pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-cinema-neon/5 blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cinema-red/30 bg-cinema-red/10 px-3 py-1 text-xs font-bold text-cinema-red">
            <Flame className="h-3 w-3 animate-bounce" />
            <span>Destaque de Terror</span>
          </div>
          <h2 className="text-4xl font-extrabold md:text-5xl lg:text-6xl tracking-tight text-cinema-popcorn">
            {featuredMovie?.title || "A Freira"}
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-cinema-popcorn/70">
            {featuredMovie?.overview || "Presa em um convento na Romênia, uma freira comete suicídio. Para investigar o caso, o Vaticano envia um padre assombrado e uma noviça prestes a se tornar freira. Juntos, eles descobrem o segredo profano da ordem."}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              onClick={() => navigate('/filme/439079')}
              className="flex items-center gap-2 rounded-full bg-cinema-gold px-6 py-3 text-sm font-bold text-cinema-black hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-[0_4px_15px_rgba(245,197,24,0.3)]"
            >
              <Play className="h-4 w-4 fill-cinema-black" />
              <span>Ver Detalhes</span>
            </button>
            <button 
              onClick={() => toggleFavorite(439079)}
              className={`flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition-all duration-300 ${
                favorites.includes(439079) 
                  ? 'border-cinema-red bg-cinema-red/15 text-cinema-red shadow-[0_0_12px_rgba(229,9,20,0.3)]' 
                  : 'border-cinema-gray bg-cinema-charcoal/40 text-cinema-popcorn hover:border-cinema-gold hover:text-cinema-gold'
              }`}
            >
              <Heart className={`h-4 w-4 ${favorites.includes(439079) ? 'fill-cinema-red' : ''}`} />
              <span>{favorites.includes(439079) ? 'Favoritado' : 'Adicionar aos Favoritos'}</span>
            </button>
          </div>
        </div>
      </section>
      <section className="mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-cinema-gold animate-spin-slow" />
            <h3 className="text-2xl font-black tracking-wide text-cinema-popcorn">
              Filmes Populares (TMDB)
            </h3>
          </div>
          <span className="text-xs text-cinema-neon hover:underline cursor-pointer flex items-center gap-1 font-bold">
            Atualizado em Tempo Real <Play className="h-2 w-2 fill-cinema-neon" />
          </span>
        </div>

        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {loadingTmdb ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
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
        ) : filteredMovies.length === 0 ? (
          <div className="rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/10 p-12 text-center max-w-lg mx-auto shadow-lg">
            <Search className="h-12 w-12 text-cinema-gray mx-auto mb-4 animate-pulse" />
            <h4 className="text-xl font-bold text-cinema-popcorn">Nenhum filme encontrado</h4>
            <p className="text-sm text-cinema-popcorn/60 mt-2">
              Não encontramos resultados para "<span className="text-cinema-gold font-semibold">{searchTerm}</span>". 
              Tente digitar um nome diferente.
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-cinema-charcoal/50 hover:bg-cinema-charcoal px-5 py-2 text-xs font-bold text-cinema-gold border border-cinema-gold/30 hover:border-cinema-gold transition-all duration-300"
            >
              Limpar Busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMovies.slice(0, 8).map((movie) => {
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

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        
        <div className="lg:col-span-7 rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-cinema-red" />
            <div>
              <h3 className="text-2xl font-black text-cinema-popcorn">Painel de Sugestões</h3>
              <p className="text-xs text-cinema-popcorn/50 mt-0.5">Ajude nossa redação sugerindo resenhas críticas da cultura pop</p>
            </div>
          </div>

          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/60 mb-2">Título do Filme/Série</label>
              <input
                type="text"
                required
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Ex: Matrix Resurrections, Stranger Things..."
                className="w-full rounded-lg border border-cinema-charcoal bg-cinema-black/40 px-4 py-2.5 text-sm text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-red"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/60 mb-2">Tipo de Mídia</label>
                <select
                  value={reviewType}
                  onChange={(e) => setReviewType(e.target.value)}
                  className="w-full rounded-lg border border-cinema-charcoal bg-cinema-black/40 px-4 py-2.5 text-sm text-cinema-popcorn outline-none focus:border-cinema-red"
                >
                  <option value="filme">Filme</option>
                  <option value="série">Série</option>
                </select>
              </div>
              <div className="flex items-end">
                <span className="text-[11px] text-cinema-popcorn/40 italic pb-2">
                  A sugestão será avaliada pelos moderadores.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/60 mb-2">Por que merece uma resenha? (Resumo)</label>
              <textarea
                required
                rows="4"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Conte-nos os seus pontos de vista..."
                className="w-full rounded-lg border border-cinema-charcoal bg-cinema-black/40 px-4 py-2.5 text-sm text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-red resize-none"
              ></textarea>
            </div>

            {successMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-xs text-green-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Obrigado! Sua sugestão foi adicionada ao painel da comunidade com sucesso.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-cinema-red py-3 text-sm font-bold text-cinema-popcorn shadow-[0_4px_12px_rgba(229,9,20,0.3)] hover:bg-red-700 hover:scale-[1.01] transition-all duration-200"
            >
              Enviar Sugestão de Resenha
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-cinema-popcorn">Sugestões Recentes</h4>
            <span className="rounded-full bg-cinema-charcoal px-2.5 py-0.5 text-xs text-cinema-gold font-bold">
              {reviewsList.length} Ativas
            </span>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {reviewsList.map((rev) => (
              <div 
                key={rev.id} 
                className="rounded-xl border border-cinema-charcoal bg-cinema-charcoal/20 p-4 space-y-2.5 hover:border-cinema-gray transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cinema-neon uppercase tracking-wider">{rev.type}</span>
                  <span className="text-[10px] text-cinema-popcorn/40">Sugerido por: @{rev.author}</span>
                </div>
                <h5 className="font-bold text-cinema-popcorn">{rev.title}</h5>
                <p className="text-xs text-cinema-popcorn/60 leading-relaxed italic">
                  "{rev.content}"
                </p>
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-cinema-charcoal/40 text-[10px] text-cinema-gold">
                  <Star className="h-3 w-3 fill-cinema-gold" />
                  <span>Alta relevância da comunidade</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </Layout>
  );
}

export default App;

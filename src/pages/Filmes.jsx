import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { Sparkles, Search, Play, Film, Tv } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedGenres, setSelectedGenres] = useState(genreParam ? [Number(genreParam)] : []);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reseta a página para 1 sempre que um filtro mudar
  useEffect(() => {
    setPage(1);
  }, [searchTerm, searchCategory, sortBy, selectedGenres]);

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
    const loadGenres = async () => {
      try {
        const data = await fetchTmdb(`/genre/${searchCategory || 'movie'}/list?language=pt-BR`);
        setAvailableGenres(data.genres || []);
        // Limpa os gêneros selecionados se não vieram da URL logo na inicialização
        if (!genreParam) setSelectedGenres([]);
      } catch (e) {
        console.error('Erro ao buscar gêneros:', e);
      }
    };
    loadGenres();
  }, [searchCategory, genreParam]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoadingTmdb(true);
        setTmdbError(null);

        const query = searchTerm.trim();
        let endpoint = '';
        const category = searchCategory || 'movie';

        if (query) {
          endpoint = `/search/multi?query=${encodeURIComponent(query)}&language=pt-BR&page=${page}`;
        } else {
          endpoint = `/discover/${category}?language=pt-BR&sort_by=${sortBy}&page=${page}`;
          if (selectedGenres.length > 0) {
            endpoint += `&with_genres=${selectedGenres.join(',')}`;
          }
        }

        const data = await fetchTmdb(endpoint);
        setTmdbMovies(applyMoviesListOverrides(data.results || []));
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error('Erro ao buscar do TMDB:', err);
        setTmdbError(err.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setLoadingTmdb(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, searchCategory, sortBy, selectedGenres, page]);

  const maxPages = Math.min(totalPages, 500);

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(maxPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Layout fullWidth>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-24 space-y-10">
        
        {/* Modern Search Hero Section */}
        <section className="relative w-full rounded-[2.5rem] bg-cinema-charcoal/20 border border-cinema-charcoal overflow-hidden p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12 shadow-2xl">
          {/* Background effects */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cinema-charcoal/40 to-transparent pointer-events-none"></div>
          
          {/* Left Content */}
          <div className="flex-1 space-y-8 relative z-10 w-full">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight text-balance">
                Explore o melhor do <span className="text-cinema-red">Cinema e TV.</span>
              </h2>
              <p className="text-cinema-popcorn/60 max-w-md text-sm md:text-base leading-relaxed text-balance">
                Descubra novos mundos, personagens inesquecíveis e histórias que marcam época. O que vamos assistir hoje?
              </p>
            </div>
            
            <div className="max-w-md w-full">
              <SearchBar 
                value={searchTerm} 
                onChange={handleSearchChange} 
                category={searchCategory}
                onCategoryChange={setSearchCategory}
                className="w-full"
              />
            </div>
          </div>

          {/* Right Content: Staggered Posters */}
          <div className="hidden lg:flex flex-1 relative h-[380px] w-full items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cinema-red/10 blur-[120px] rounded-full pointer-events-none"></div>
            
            {loadingTmdb ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute right-12 top-10 w-44 h-64 bg-cinema-charcoal/40 rounded-2xl rotate-6 animate-pulse border border-cinema-charcoal/50 shadow-xl"></div>
                <div className="absolute left-10 top-16 w-44 h-64 bg-cinema-charcoal/40 rounded-2xl -rotate-6 animate-pulse border border-cinema-charcoal/50 shadow-xl"></div>
                <div className="absolute z-10 w-48 h-72 bg-cinema-charcoal/50 rounded-2xl animate-pulse border border-cinema-charcoal shadow-2xl"></div>
              </div>
            ) : tmdbMovies.length >= 3 ? (
              <div className="relative w-full h-full flex items-center justify-center group perspective-1000">
                {/* Back Left */}
                <div className="absolute left-6 top-16 w-44 h-64 rounded-2xl overflow-hidden shadow-xl transform -rotate-6 border border-cinema-charcoal/50 transition-all duration-700">
                  <img src={`https://image.tmdb.org/t/p/w500${tmdbMovies[2]?.poster_path}`} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-cinema-black/30"></div>
                </div>
                
                {/* Back Right */}
                <div className="absolute right-6 top-12 w-44 h-64 rounded-2xl overflow-hidden shadow-xl transform rotate-6 border border-cinema-charcoal/50 transition-all duration-700">
                  <img src={`https://image.tmdb.org/t/p/w500${tmdbMovies[1]?.poster_path}`} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-cinema-black/30"></div>
                </div>

                {/* Center Front */}
                <div className="absolute z-10 w-52 h-72 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-cinema-charcoal transition-all duration-700">
                  <img src={`https://image.tmdb.org/t/p/w500${tmdbMovies[0]?.poster_path}`} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* Main Content Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filtros */}
          <aside className="w-full lg:w-[280px] shrink-0 rounded-[2rem] border border-cinema-charcoal bg-cinema-charcoal/10 p-6 sm:p-8 space-y-8 sticky top-28 shadow-2xl backdrop-blur-sm">
            <h4 className="font-black text-xl text-cinema-popcorn border-b border-cinema-charcoal/50 pb-4">
              Filtros
            </h4>
            
            <div className="space-y-4">
              <label className="text-[11px] uppercase font-bold text-cinema-gray tracking-wider">
                Ordenar por
              </label>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-cinema-black border border-cinema-charcoal/80 rounded-xl px-4 py-3 text-sm font-medium text-cinema-popcorn outline-none focus:border-cinema-gold transition-colors appearance-none cursor-pointer"
                >
                  <option value="popularity.desc">Mais Populares</option>
                  <option value="vote_average.desc">Melhor Avaliados</option>
                  <option value="primary_release_date.desc">Lançamentos Recentes</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-cinema-gray">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] uppercase font-bold text-cinema-gray tracking-wider">
                Gêneros ({searchCategory === 'movie' ? 'Filmes' : 'Séries'})
              </label>
              <div className="flex flex-wrap gap-2">
                {availableGenres.map(g => {
                  const isSelected = selectedGenres.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedGenres(prev => prev.filter(id => id !== g.id));
                        } else {
                          setSelectedGenres(prev => [...prev, g.id]);
                        }
                      }}
                      className={`text-[11px] font-bold px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
                        isSelected 
                          ? 'border-cinema-gold bg-cinema-gold/15 text-cinema-gold shadow-[0_0_10px_rgba(245,197,24,0.2)]' 
                          : 'border-cinema-charcoal bg-cinema-charcoal/30 text-cinema-popcorn/60 hover:text-cinema-popcorn hover:border-cinema-gray'
                      }`}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedGenres.length > 0 && (
              <button 
                onClick={() => setSelectedGenres([])}
                className="w-full mt-4 py-2.5 text-xs font-bold text-cinema-red hover:text-white border border-cinema-red/30 hover:border-cinema-red rounded-xl bg-cinema-red/10 hover:bg-cinema-red transition-all duration-300"
              >
                Limpar Gêneros
              </button>
            )}
          </aside>

          {/* Results Section */}
          <div className="flex-1 w-full min-w-0">
            <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-cinema-charcoal/40">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl md:text-2xl font-black tracking-wide text-cinema-popcorn">
                {searchTerm.trim()
                  ? `Resultados para "${searchTerm}"`
                  : `Catálogo de ${searchCategory === 'tv' ? 'Séries' : 'Filmes'}`}
              </h3>
              <span className="flex text-[11px] text-cinema-neon cursor-default items-center gap-1 font-bold uppercase tracking-wider">
                Atualizado em Tempo Real <Play className="h-2 w-2 fill-cinema-neon" />
              </span>
            </div>
            
            {/* Category selector tabs */}
            {!searchTerm.trim() && (
              <div className="flex items-center gap-1 p-1 rounded-full bg-cinema-charcoal/30 border border-cinema-charcoal/60">
                <button
                  type="button"
                  onClick={() => setSearchCategory('movie')}
                  className={`flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-bold transition-all duration-300 ${
                    searchCategory === 'movie'
                      ? 'bg-cinema-red text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                      : 'text-cinema-popcorn/60 hover:text-cinema-popcorn hover:bg-white/5'
                  }`}
                >
                  <Film className="h-3.5 w-3.5" />
                  <span>Filmes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchCategory('tv')}
                  className={`flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-bold transition-all duration-300 ${
                    searchCategory === 'tv'
                      ? 'bg-cinema-red text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                      : 'text-cinema-popcorn/60 hover:text-cinema-popcorn hover:bg-white/5'
                  }`}
                >
                  <Tv className="h-3.5 w-3.5" />
                  <span>Séries</span>
                </button>
              </div>
            )}
          </div>

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

          {/* Pagination Controls */}
          {!loadingTmdb && tmdbMovies.length > 0 && totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-cinema-charcoal/40 pt-8">
              <button
                onClick={() => {
                  setPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                disabled={page === 1}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-cinema-charcoal bg-cinema-charcoal/30 text-xs font-bold text-cinema-popcorn hover:bg-cinema-charcoal/60 hover:text-cinema-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <div className="flex items-center gap-2">
                {getPageNumbers().map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setPage(p);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      page === p 
                        ? 'bg-cinema-red text-white shadow-[0_0_12px_rgba(229,9,20,0.4)] border border-cinema-red' 
                        : 'bg-cinema-charcoal/30 border border-cinema-charcoal text-cinema-popcorn/70 hover:bg-cinema-charcoal/60 hover:text-cinema-popcorn'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => {
                  setPage(p => Math.min(maxPages, p + 1));
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                disabled={page === maxPages}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-cinema-charcoal bg-cinema-charcoal/30 text-xs font-bold text-cinema-popcorn hover:bg-cinema-charcoal/60 hover:text-cinema-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Filmes;

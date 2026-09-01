import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { 
  Shield, 
  Users, 
  FileText, 
  Settings, 
  ArrowLeft, 
  Activity, 
  Film, 
  Edit3, 
  Search, 
  Star, 
  LayoutDashboard, 
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { applyMoviesListOverrides } from '../utils/movieStore.js';
import { fetchTmdb } from '../services/tmdb.js';

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('filmes');

  // Estados da tabela de filmes
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableSearch, setTableSearch] = useState('');

  useEffect(() => {
    const fetchAdminMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchTmdb('/trending/movie/week?language=pt-BR');
        setMovies(applyMoviesListOverrides(data.results || []));
      } catch (err) {
        console.error('Erro ao carregar filmes no admin:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminMovies();
  }, []);

  const filteredMovies = movies.filter(m => 
    m.title?.toLowerCase().includes(tableSearch.toLowerCase()) ||
    m.original_title?.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn">
        {/* Header da Página */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-cinema-charcoal pb-6">
          <div>
            <div className="flex items-center gap-2 text-cinema-red mb-1">
              <Shield className="h-5 w-5 fill-cinema-red/10" />
              <span className="text-xs font-bold uppercase tracking-widest text-cinema-red">Área Restrita</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-cinema-popcorn sm:text-4xl">
              Painel do <span className="text-cinema-red">Administrador</span>
            </h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 self-start rounded-full bg-cinema-charcoal/40 hover:bg-cinema-charcoal/80 px-5 py-2 text-sm font-bold text-cinema-popcorn border border-cinema-charcoal hover:border-cinema-gray/60 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Home</span>
          </button>
        </div>

        {/* Info Card do Admin */}
        <div className="bg-cinema-charcoal/20 border border-cinema-charcoal/80 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <img 
              src={user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=admin"} 
              alt={user?.name || "Admin"} 
              className="w-16 h-16 rounded-full border-2 border-cinema-red bg-cinema-black/60 p-1 shadow-[0_0_15px_rgba(229,9,20,0.3)]"
            />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <span>{user?.name || 'Administrador'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cinema-red/20 text-cinema-red border border-cinema-red/40">
                  {user?.perfil || 'Administrador'}
                </span>
              </h2>
              <p className="text-xs text-cinema-popcorn/60">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-cinema-popcorn/70 bg-cinema-black/40 px-4 py-2.5 rounded-xl border border-cinema-charcoal/60">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>Sessão Autenticada e Segura</span>
          </div>
        </div>

        {/* Layout do Painel com Barra Lateral / Navegação Interna */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Navegação Interna */}
          <aside className="lg:col-span-1 space-y-2">
            <div className="bg-cinema-charcoal/20 border border-cinema-charcoal/80 rounded-2xl p-3 space-y-1.5 backdrop-blur-md sticky top-24">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-cinema-gray">Navegação do Painel</p>
              
              <button
                onClick={() => setActiveTab('filmes')}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                  activeTab === 'filmes'
                    ? 'bg-cinema-red text-white shadow-[0_0_15px_rgba(229,9,20,0.35)]'
                    : 'text-cinema-popcorn/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Film className="h-4 w-4" />
                <span>Gerenciar Filmes</span>
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-cinema-red text-white shadow-[0_0_15px_rgba(229,9,20,0.35)]'
                    : 'text-cinema-popcorn/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Visão Geral</span>
              </button>

              <button
                onClick={() => setActiveTab('resenhas')}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                  activeTab === 'resenhas'
                    ? 'bg-cinema-red text-white shadow-[0_0_15px_rgba(229,9,20,0.35)]'
                    : 'text-cinema-popcorn/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Moderar Resenhas</span>
              </button>

              <button
                onClick={() => setActiveTab('config')}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                  activeTab === 'config'
                    ? 'bg-cinema-red text-white shadow-[0_0_15px_rgba(229,9,20,0.35)]'
                    : 'text-cinema-popcorn/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </button>
            </div>
          </aside>

          {/* Área Principal de Conteúdo */}
          <main className="lg:col-span-3 space-y-6">
            {/* TELA: Gerenciar Filmes (Tabela Robusta) */}
            {activeTab === 'filmes' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cinema-charcoal/20 p-5 rounded-2xl border border-cinema-charcoal/80">
                  <div>
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <Film className="h-5 w-5 text-cinema-red" />
                      <span>Catálogo de Filmes Cadastrados</span>
                    </h3>
                    <p className="text-xs text-cinema-popcorn/60 mt-0.5">Gerencie os títulos exibidos na plataforma CineInfo</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Filtrar tabela..."
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                        className="w-full sm:w-48 rounded-full border border-cinema-charcoal bg-cinema-black/60 px-4 py-2 pl-9 text-xs text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-gold"
                      />
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-cinema-gray" />
                    </div>
                  </div>
                </div>

                {/* Tabela de Filmes */}
                <div className="overflow-hidden rounded-2xl border border-cinema-charcoal/80 bg-cinema-black/40 backdrop-blur-md shadow-xl">
                  {loading ? (
                    <div className="py-16 text-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-cinema-red border-t-transparent mx-auto"></div>
                      <p className="text-xs text-cinema-popcorn/60">Carregando catálogo...</p>
                    </div>
                  ) : filteredMovies.length === 0 ? (
                    <div className="py-16 text-center space-y-2">
                      <Film className="h-8 w-8 text-cinema-gray mx-auto opacity-50" />
                      <p className="text-sm font-bold text-cinema-popcorn">Nenhum filme encontrado.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-cinema-popcorn">
                        <thead className="border-b border-cinema-charcoal/80 bg-cinema-charcoal/40 text-[11px] uppercase tracking-wider text-cinema-gray">
                          <tr>
                            <th className="px-6 py-4">Filme</th>
                            <th className="px-6 py-4">Lançamento</th>
                            <th className="px-6 py-4">Avaliação</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cinema-charcoal/40">
                          {filteredMovies.map((movie) => {
                            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
                            const posterUrl = movie.poster_path
                              ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                              : 'https://via.placeholder.com/92x138?text=Sem+Capa';

                            return (
                              <tr key={movie.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={posterUrl}
                                      alt={movie.title}
                                      className="h-12 w-8 rounded object-cover border border-cinema-charcoal shadow"
                                    />
                                    <div>
                                      <p className="font-bold text-white group-hover:text-cinema-gold transition-colors">{movie.title}</p>
                                      <p className="text-[10px] text-cinema-popcorn/50">{movie.original_title}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-cinema-popcorn/80">
                                  {movie.release_date || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cinema-gold/10 border border-cinema-gold/30 text-cinema-gold font-bold">
                                    <Star className="h-3 w-3 fill-cinema-gold text-cinema-gold" />
                                    <span>{rating}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/30">
                                    Ativo
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => navigate(`/admin/editar/${movie.id}`)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-cinema-red/15 hover:bg-cinema-red text-cinema-red hover:text-white border border-cinema-red/30 px-3 py-1.5 font-bold text-[11px] transition-all duration-200 shadow-sm"
                                  >
                                    <Edit3 className="h-3.5 w-3.5" />
                                    <span>Editar</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TELA: Visão Geral */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-cinema-charcoal/20 border border-cinema-charcoal/50 rounded-2xl p-6 space-y-4 hover:border-cinema-red/30 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-cinema-red/10 border border-cinema-red/25 rounded-xl text-cinema-red">
                        <Users className="h-6 w-6" />
                      </div>
                      <span className="text-xs text-cinema-neon bg-cinema-neon/10 px-2 py-0.5 rounded font-bold">Ativos</span>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">1.254</p>
                      <p className="text-xs text-cinema-popcorn/60 font-medium mt-1">Usuários Cadastrados</p>
                    </div>
                  </div>

                  <div className="bg-cinema-charcoal/20 border border-cinema-charcoal/50 rounded-2xl p-6 space-y-4 hover:border-cinema-red/30 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-cinema-gold/10 border border-cinema-gold/25 rounded-xl text-cinema-gold">
                        <FileText className="h-6 w-6" />
                      </div>
                      <span className="text-xs text-cinema-gold bg-cinema-gold/10 px-2 py-0.5 rounded font-bold">+12 hoje</span>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">482</p>
                      <p className="text-xs text-cinema-popcorn/60 font-medium mt-1">Críticas e Avaliações</p>
                    </div>
                  </div>

                  <div className="bg-cinema-charcoal/20 border border-cinema-charcoal/50 rounded-2xl p-6 space-y-4 hover:border-cinema-red/30 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-cinema-neon/10 border border-cinema-neon/25 rounded-xl text-cinema-neon">
                        <Activity className="h-6 w-6" />
                      </div>
                      <span className="text-xs text-cinema-neon bg-cinema-neon/10 px-2 py-0.5 rounded font-bold">99.9%</span>
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">Saudável</p>
                      <p className="text-xs text-cinema-popcorn/60 font-medium mt-1">Status da API TMDB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TELA: Moderar Resenhas */}
            {activeTab === 'resenhas' && (
              <div className="bg-cinema-charcoal/20 border border-cinema-charcoal/80 rounded-2xl p-6 space-y-4 text-center py-12 animate-fadeIn">
                <MessageSquare className="h-10 w-10 text-cinema-gold mx-auto" />
                <h3 className="text-lg font-bold text-white">Painel de Moderação de Resenhas</h3>
                <p className="text-xs text-cinema-popcorn/60 max-w-md mx-auto">
                  Aprovação e gerenciamento das resenhas enviadas pela comunidade da plataforma CineInfo.
                </p>
              </div>
            )}

            {/* TELA: Configurações */}
            {activeTab === 'config' && (
              <div className="bg-cinema-charcoal/20 border border-cinema-charcoal/80 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-cinema-red" />
                  <span>Configurações do Sistema</span>
                </h3>
                <p className="text-xs text-cinema-popcorn/70">
                  Gerenciamento de credenciais da API do TMDB e parâmetros do sistema.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

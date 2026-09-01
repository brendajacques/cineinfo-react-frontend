import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { 
  Shield, 
  ArrowLeft, 
  Save, 
  Film, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Star, 
  Calendar, 
  FileText 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getMovieOverride, saveMovieOverride } from '../utils/movieStore.js';
import { fetchTmdb } from '../services/tmdb.js';

export default function AdminEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Estados dos campos do formulário
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [voteAverage, setVoteAverage] = useState('');
  const [adminReview, setAdminReview] = useState('');
  const [posterPath, setPosterPath] = useState('');
  const [backdropPath, setBackdropPath] = useState('');

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setErrorMsg('');

        // 1. Verifica se já existem alterações salvas no localStorage para este filme
        const localData = getMovieOverride(id);

        // 2. Busca os dados atualizados da API do TMDB através do proxy seguro
        const apiData = await fetchTmdb(`/movie/${id}?language=pt-BR`);

        // 3. Preenche os estados iniciais (priorizando edições locais salvas, se existirem)
        setTitle(localData?.title || apiData.title || '');
        setOriginalTitle(localData?.original_title || apiData.original_title || '');
        setOverview(localData?.overview || apiData.overview || '');
        setReleaseDate(localData?.release_date || apiData.release_date || '');
        setVoteAverage(localData?.vote_average !== undefined ? localData.vote_average : apiData.vote_average || '');
        setAdminReview(localData?.adminReview || 'Uma obra imperdível com atuação marcante e grande apelo visual!');
        setPosterPath(apiData.poster_path || '');
        setBackdropPath(apiData.backdrop_path || '');
      } catch (err) {
        console.error('Erro ao carregar dados para edição:', err);
        setErrorMsg(err.message || 'Ocorreu um erro ao carregar as informações do filme.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('O título do filme é obrigatório.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    const updatedMovieData = {
      id: Number(id),
      title: title.trim(),
      original_title: originalTitle.trim(),
      overview: overview.trim(),
      release_date: releaseDate,
      vote_average: Number(voteAverage),
      adminReview: adminReview.trim(),
    };

    setTimeout(() => {
      try {
        saveMovieOverride(id, updatedData => updatedMovieData);
        saveMovieOverride(id, updatedMovieData);
        setSaving(false);
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 4000);
      } catch (err) {
        console.error('Erro ao salvar no localStorage:', err);
        setErrorMsg('Falha ao salvar as alterações no localStorage.');
        setSaving(false);
      }
    }, 600);
  };

  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w342${posterPath}`
    : 'https://via.placeholder.com/342x513?text=Sem+Poster';

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
        {/* Header da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cinema-charcoal pb-6">
          <div>
            <div className="flex items-center gap-2 text-cinema-red mb-1">
              <Shield className="h-4 w-4 fill-cinema-red/10" />
              <span className="text-xs font-bold uppercase tracking-widest">Painel Administrativo</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-cinema-popcorn sm:text-4xl">
              Editar <span className="text-cinema-red">Filme</span>
            </h1>
          </div>

          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-2 self-start rounded-full bg-cinema-charcoal/40 hover:bg-cinema-charcoal/80 px-5 py-2 text-sm font-bold text-cinema-popcorn border border-cinema-charcoal hover:border-cinema-gray/60 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Painel Admin</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-cinema-red border-t-transparent"></div>
            <p className="text-cinema-popcorn/60 text-sm animate-pulse">Carregando dados do filme...</p>
          </div>
        ) : errorMsg && !title ? (
          <div className="max-w-md mx-auto text-center py-12 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-cinema-red/10 text-cinema-red border border-cinema-red/30">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Erro ao carregar filme</h3>
            <p className="text-xs text-cinema-popcorn/60">{errorMsg}</p>
            <button
              onClick={() => navigate('/admin')}
              className="px-5 py-2 rounded-full bg-cinema-charcoal text-xs font-bold text-white hover:bg-cinema-charcoal/80"
            >
              Voltar para a Tabela
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna da Esquerda: Poster e Resumo */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-cinema-charcoal/80 bg-cinema-black/40 overflow-hidden shadow-xl p-4 space-y-4 backdrop-blur-md">
                <img 
                  src={posterUrl} 
                  alt={title} 
                  className="w-full h-auto rounded-xl border border-cinema-charcoal shadow-md object-cover"
                />
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">{title}</h3>
                  <p className="text-xs text-cinema-popcorn/50 italic">{originalTitle}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cinema-gold/10 text-cinema-gold border border-cinema-gold/30 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-cinema-gold" />
                      <span>{voteAverage || 'N/A'}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cinema-charcoal/50 text-cinema-popcorn/70 border border-cinema-charcoal">
                      ID: {id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Formulário de Edição */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="rounded-2xl border border-cinema-charcoal/80 bg-cinema-black/40 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
                <div className="border-b border-cinema-charcoal/80 pb-4">
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Film className="h-5 w-5 text-cinema-red" />
                    <span>Formulário de Atualização</span>
                  </h3>
                  <p className="text-xs text-cinema-popcorn/60 mt-0.5">Modifique as informações e resenha oficial da plataforma</p>
                </div>

                {/* Título e Título Original */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/70">
                      Título do Filme
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Duna: Parte 2"
                      className="w-full rounded-xl border border-cinema-charcoal bg-cinema-black/60 px-4 py-2.5 text-xs text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-red focus:ring-1 focus:ring-cinema-red/30 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/70">
                      Título Original
                    </label>
                    <input
                      type="text"
                      value={originalTitle}
                      onChange={(e) => setOriginalTitle(e.target.value)}
                      placeholder="Ex: Dune: Part Two"
                      className="w-full rounded-xl border border-cinema-charcoal bg-cinema-black/60 px-4 py-2.5 text-xs text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-red focus:ring-1 focus:ring-cinema-red/30 transition-all"
                    />
                  </div>
                </div>

                {/* Data e Avaliação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/70">
                      Data de Lançamento
                    </label>
                    <input
                      type="date"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      className="w-full rounded-xl border border-cinema-charcoal bg-cinema-black/60 px-4 py-2.5 text-xs text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-red focus:ring-1 focus:ring-cinema-red/30 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/70">
                      Nota de Avaliação (0 a 10)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={voteAverage}
                      onChange={(e) => setVoteAverage(e.target.value)}
                      className="w-full rounded-xl border border-cinema-charcoal bg-cinema-black/60 px-4 py-2.5 text-xs text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-red focus:ring-1 focus:ring-cinema-red/30 transition-all"
                    />
                  </div>
                </div>

                {/* Sinopse / Overview */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/70">
                    Sinopse Oficial
                  </label>
                  <textarea
                    rows={4}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    placeholder="Descrição completa do filme..."
                    className="w-full rounded-xl border border-cinema-charcoal bg-cinema-black/60 p-4 text-xs text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-red focus:ring-1 focus:ring-cinema-red/30 transition-all leading-relaxed"
                  />
                </div>

                {/* Sugestões de Resenhas do Administrador (Sprint 6 Requirement) */}
                <div className="space-y-2 pt-2 border-t border-cinema-charcoal/60">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-cinema-gold" />
                    <label className="block text-xs font-bold uppercase tracking-wider text-cinema-gold">
                      Sugestões de Resenhas / Crítica Editorial (Administração)
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={adminReview}
                    onChange={(e) => setAdminReview(e.target.value)}
                    placeholder="Adicione ou modifique a sugestão de resenha da equipe editorial..."
                    className="w-full rounded-xl border border-cinema-gold/30 bg-cinema-gold/5 p-4 text-xs text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-gold focus:ring-1 focus:ring-cinema-gold/30 transition-all leading-relaxed"
                  />
                  <p className="text-[10px] text-cinema-popcorn/50">Esta resenha será destacada na área de comunidade e sugestões do portal.</p>
                </div>

                {/* Alerts Feedback */}
                {errorMsg && (
                  <div className="flex items-center gap-2 rounded-xl bg-cinema-red/10 border border-cinema-red/30 p-3.5 text-xs text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/30 p-3.5 text-xs text-green-400 animate-fadeIn">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Alterações salvas com sucesso no localStorage da plataforma!</span>
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-cinema-charcoal/80">
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-cinema-charcoal bg-cinema-charcoal/40 text-xs font-bold text-cinema-popcorn hover:bg-cinema-charcoal transition-colors"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-cinema-red hover:bg-red-700 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(229,9,20,0.35)] transition-all duration-200 disabled:opacity-50"
                  >
                    {saving ? (
                      <span>Salvando...</span>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Salvar Alterações</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

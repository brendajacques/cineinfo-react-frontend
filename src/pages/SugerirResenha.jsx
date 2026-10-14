import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import { MessageSquare, Star, CheckCircle2 } from 'lucide-react';

function SugerirResenha() {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewType, setReviewType] = useState('filme');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewsList, setReviewsList] = useState([
    { id: 1, title: 'Duna: Parte 2', type: 'filme', content: 'Uma obra-prima visual com cinematografia e design de som inacreditáveis.', rating: 5, author: 'PipocaGourmet' },
    { id: 2, title: 'Stranger Things', type: 'série', content: 'A temporada final promete resgatar todo o clima nostálgico dos anos 80.', rating: 4, author: 'GeekMaster' }
  ]);
  const [successMsg, setSuccessMsg] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 pt-24">
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
                className="w-full rounded-lg bg-cinema-red py-3 text-sm font-bold text-cinema-popcorn shadow-[0_4px_12px_rgba(229,9,20,0.3)] hover:bg-red-700 transition-all duration-200"
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
      </div>
    </Layout>
  );
}

export default SugerirResenha;

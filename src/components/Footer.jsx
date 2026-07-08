import { Link } from 'react-router-dom';
import { Film, Mail, ChevronRight } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Inscrição na newsletter realizada! Prepare a pipoca para novidades quentes.");
  };

  return (
    <footer className="w-full border-t border-cinema-charcoal bg-cinema-black text-cinema-popcorn/80">
      {/* Top Banner / Newsletter */}
      <div className="border-b border-cinema-charcoal bg-cinema-charcoal/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div>
              <h3 className="text-lg font-bold text-cinema-popcorn">Inscreva-se na nossa Newsletter</h3>
              <p className="text-sm text-cinema-gray-300 mt-1">Receba as últimas novidades, críticas e curiosidades do cinema direto no seu e-mail.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-center gap-2">
              <div className="relative w-full">
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail"
                  className="w-full rounded-lg border border-cinema-gray bg-cinema-charcoal/40 px-4 py-2.5 pl-10 text-sm text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-gold focus:ring-1 focus:ring-cinema-gold/30"
                />
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-cinema-gray" />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-cinema-red px-5 py-2.5 text-sm font-bold text-cinema-popcorn shadow-[0_0_10px_rgba(229,9,20,0.4)] hover:bg-red-700 hover:shadow-[0_0_15px_rgba(229,9,20,0.6)] transition-all duration-300 shrink-0"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand & Quote Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cinema-red text-cinema-popcorn">
                <Film className="h-4 w-4" />
              </div>
              <span className="text-xl font-black tracking-wider text-cinema-popcorn">
                CINE<span className="text-cinema-red">INFO</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-cinema-popcorn/60">
              O seu portal definitivo para explorar o universo das telas. Busque seus títulos favoritos, marque seus preferidos e compartilhe sua paixão.
            </p>
            <div className="italic text-xs border-l-2 border-cinema-gold pl-3 text-cinema-gold/80 py-1 mt-2">
              "Que a Força esteja com você." — Star Wars
            </div>
          </div>

          {/* Column 1: Navegação */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-cinema-popcorn border-b border-cinema-charcoal pb-2 mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="flex items-center gap-1 hover:text-cinema-gold transition-colors duration-200">
                  <ChevronRight className="h-3 w-3 text-cinema-red" /> Filmes & Séries
                </Link>
              </li>
              <li>
                <Link to="/favoritos" className="flex items-center gap-1 hover:text-cinema-gold transition-colors duration-200">
                  <ChevronRight className="h-3 w-3 text-cinema-red" /> Meus Favoritos
                </Link>
              </li>
              <li>
                <Link to="/sugerir-resenha" className="flex items-center gap-1 hover:text-cinema-gold transition-colors duration-200">
                  <ChevronRight className="h-3 w-3 text-cinema-red" /> Enviar Resenha
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Populares */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-cinema-popcorn border-b border-cinema-charcoal pb-2 mb-4">
              Categorias
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-cinema-gold cursor-pointer transition-colors duration-200 flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-cinema-gray" /> Blockbusters
                </span>
              </li>
              <li>
                <span className="hover:text-cinema-gold cursor-pointer transition-colors duration-200 flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-cinema-gray" /> Cultura Pop & Geek
                </span>
              </li>
              <li>
                <span className="hover:text-cinema-gold cursor-pointer transition-colors duration-200 flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-cinema-gray" /> Animes & Animações
                </span>
              </li>
              <li>
                <span className="hover:text-cinema-gold cursor-pointer transition-colors duration-200 flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-cinema-gray" /> Festivais & Clássicos
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Redes Sociais */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-cinema-popcorn border-b border-cinema-charcoal pb-2 mb-2">
              Comunidade CineInfo
            </h4>
            <p className="text-sm text-cinema-popcorn/60">Siga-nos nas nossas redes para memes diários, trailers novos e discussões!</p>
            <div className="flex items-center gap-3 mt-1">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-cinema-charcoal bg-cinema-charcoal/20 text-cinema-popcorn/80 hover:border-cinema-gold hover:text-cinema-gold hover:scale-105 transition-all duration-300" aria-label="Twitter">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-cinema-charcoal bg-cinema-charcoal/20 text-cinema-popcorn/80 hover:border-cinema-gold hover:text-cinema-gold hover:scale-105 transition-all duration-300" aria-label="Instagram">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-cinema-charcoal bg-cinema-charcoal/20 text-cinema-popcorn/80 hover:border-cinema-gold hover:text-cinema-gold hover:scale-105 transition-all duration-300" aria-label="YouTube">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-cinema-charcoal bg-cinema-charcoal/20 text-cinema-popcorn/80 hover:border-cinema-gold hover:text-cinema-gold hover:scale-105 transition-all duration-300" aria-label="GitHub">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-cinema-charcoal pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-cinema-popcorn/40">
          <p>© {currentYear} CineInfo. Desenvolvido para entusiastas da cultura pop.</p>
          <div className="flex gap-6">
            <span className="hover:text-cinema-gold cursor-pointer transition-colors">Termos de Uso</span>
            <span className="hover:text-cinema-gold cursor-pointer transition-colors">Políticas de Privacidade</span>
            <span className="hover:text-cinema-gold cursor-pointer transition-colors">Contato</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

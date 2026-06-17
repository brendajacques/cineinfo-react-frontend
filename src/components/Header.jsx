import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Film, Heart, MessageSquare, Menu, X, User } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock favorites count for visual feedback
  const favoritesCount = 3;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Buscando por: "${searchQuery}" em Filmes, Séries e Personagens...`);
      // Implementar redirecionamento ou lógica de busca real futuramente
    }
  };

  const navLinks = [
    { to: '/', label: 'Filmes & Séries', icon: Film },
    { to: '/personagens', label: 'Personagens', icon: User },
    { to: '/favoritos', label: 'Favoritos', icon: Heart, badge: favoritesCount },
    { to: '/sugerir-resenha', label: 'Sugerir Resenha', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cinema-charcoal bg-cinema-black/85 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cinema-red text-cinema-popcorn shadow-[0_0_15px_rgba(229,9,20,0.5)] transition-transform duration-300 group-hover:scale-110">
              <Film className="h-5 w-5 animate-pulse" />
            </div>
            <span className="text-2xl font-black tracking-wider text-cinema-popcorn transition-colors group-hover:text-cinema-gold">
              CINE<span className="text-cinema-red">INFO</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex relative max-w-md w-full items-center"
          >
            <input
              type="text"
              placeholder="Buscar filmes, séries, personagens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-cinema-gray bg-cinema-charcoal/60 px-5 py-2 pl-12 text-sm text-cinema-popcorn placeholder-cinema-gray/80 outline-none transition-all duration-300 focus:border-cinema-gold focus:bg-cinema-charcoal focus:ring-1 focus:ring-cinema-gold/30"
            />
            <Search className="absolute left-4 h-4 w-4 text-cinema-gray transition-colors peer-focus:text-cinema-gold" />
            <button 
              type="submit" 
              className="absolute right-2.5 rounded-full bg-cinema-gold px-3 py-1 text-xs font-bold text-cinema-black hover:bg-yellow-400 transition-colors duration-200"
            >
              Buscar
            </button>
          </form>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-cinema-charcoal/50 hover:text-cinema-gold ${
                      isActive ? 'text-cinema-gold bg-cinema-charcoal/30' : 'text-cinema-popcorn/80'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cinema-red px-1 text-[10px] font-extrabold text-cinema-popcorn shadow-[0_0_8px_rgba(229,9,20,0.6)]">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile Menu & Search Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-cinema-charcoal bg-cinema-charcoal/40 text-cinema-popcorn hover:bg-cinema-charcoal hover:text-cinema-gold transition-all duration-200"
              aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Expandable menu) */}
      <div 
        className={`lg:hidden border-t border-cinema-charcoal bg-cinema-black transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100 py-4' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 space-y-4">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <input
              type="text"
              placeholder="Buscar no CineInfo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-cinema-gray bg-cinema-charcoal/60 px-5 py-2.5 pl-12 text-sm text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-gold focus:bg-cinema-charcoal"
            />
            <Search className="absolute left-4 h-4 w-4 text-cinema-gray" />
            <button 
              type="submit" 
              className="absolute right-2 rounded-full bg-cinema-gold px-3.5 py-1.5 text-xs font-bold text-cinema-black hover:bg-yellow-400"
            >
              Buscar
            </button>
          </form>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive 
                        ? 'bg-cinema-charcoal/60 text-cinema-gold border-l-4 border-cinema-gold' 
                        : 'text-cinema-popcorn/80 hover:bg-cinema-charcoal/30 hover:text-cinema-gold'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-cinema-gray group-hover:text-cinema-gold" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cinema-red px-1.5 text-xs font-bold text-cinema-popcorn">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

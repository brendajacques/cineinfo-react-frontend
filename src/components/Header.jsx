import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, Film, Heart, MessageSquare, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  
  const favoritesCount = favorites.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Buscando por: "${searchQuery}" em Filmes e Séries...`);
      // Implementar redirecionamento ou lógica de busca real futuramente
    }
  };

  const navLinks = [
    { to: '/', label: 'Filmes', icon: Film },
    { to: '/favoritos', label: 'Favoritos', icon: Heart, badge: favoritesCount },
    { to: '/sugerir-resenha', label: 'Sugerir Resenha', icon: MessageSquare },
  ];

  return (
    <header className={`${
      isHome 
        ? 'absolute top-0 left-0 right-0 z-50 w-full border-b border-transparent bg-gradient-to-b from-black/80 via-black/40 to-transparent' 
        : 'sticky top-0 z-50 w-full border-b border-cinema-charcoal bg-cinema-black/85 backdrop-blur-md'
    } transition-all duration-300`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
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
              placeholder="Buscar filmes, séries..."
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
            {/* User Account - Desktop */}
            {user ? (
              <div className="flex items-center gap-3 border-l border-cinema-charcoal pl-4 ml-2 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 overflow-hidden rounded-full border border-cinema-gold bg-cinema-charcoal shadow-[0_0_8px_rgba(245,197,24,0.35)]">
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-xs font-bold text-cinema-popcorn">{user.name}</span>
                    <span className="text-[9px] text-cinema-gray">{user.perfil || 'Membro'}</span>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center gap-1 rounded-lg border border-cinema-charcoal bg-cinema-charcoal/20 px-3 py-1.5 text-xs font-bold text-cinema-popcorn hover:border-cinema-red hover:text-cinema-red hover:bg-cinema-red/10 transition-all duration-300"
                  title="Sair da conta"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center border-l border-cinema-charcoal pl-4 ml-2">
                <Link 
                  to="/login"
                  className="flex items-center gap-1.5 rounded-full bg-cinema-red hover:bg-red-700 text-cinema-popcorn px-5 py-2 text-xs font-bold transition-all duration-300 shadow-[0_4px_12px_rgba(229,9,20,0.35)] hover:scale-105"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Entrar</span>
                </Link>
              </div>
            )}
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

          {/* Mobile User Profile Section */}
          <div className="pt-2">
            {user ? (
              <div className="flex items-center justify-between rounded-xl border border-cinema-charcoal bg-cinema-charcoal/30 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-cinema-gold bg-cinema-charcoal">
                    <img src={user.avatar} alt={user.name} className="h-full w-full" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-cinema-popcorn">
                      {user.name} <span className="text-[10px] text-cinema-gold font-normal">({user.perfil || 'Membro'})</span>
                    </h4>
                    <p className="text-[10px] text-cinema-gray">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-cinema-red/30 bg-cinema-red/10 px-3 py-1.5 text-xs font-bold text-cinema-red hover:bg-cinema-red hover:text-cinema-popcorn transition-all duration-200"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cinema-red py-3 text-sm font-bold text-cinema-popcorn shadow-[0_4px_12px_rgba(229,9,20,0.3)] hover:bg-red-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Entrar na Conta</span>
              </Link>
            )}
          </div>

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

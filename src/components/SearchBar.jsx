import { Search, X, Film, Tv } from 'lucide-react';

function SearchBar({ value, onChange, category = 'movie', onCategoryChange }) {
  const categories = [
    { id: 'movie', label: 'Filmes', icon: Film },
    { id: 'tv', label: 'Séries', icon: Tv }
  ];

  return (
    <div className="w-full max-w-xl mx-auto mb-8 space-y-4">
      {/* Input Field */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-cinema-gray pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pesquise por filmes, séries, personagens..."
          className="w-full rounded-full border border-cinema-charcoal bg-cinema-charcoal/20 pl-12 pr-10 py-3.5 text-sm text-cinema-popcorn placeholder-cinema-gray outline-none focus:border-cinema-gold focus:ring-1 focus:ring-cinema-gold/30 transition-all duration-300 shadow-md"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 p-1 rounded-full text-cinema-gray hover:text-cinema-popcorn hover:bg-cinema-charcoal/40 transition-colors duration-200"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category selector tabs - Oculto quando há busca ativa */}
      {onCategoryChange && !value && (
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-full bg-cinema-charcoal/30 border border-cinema-charcoal/60 backdrop-blur-sm max-w-xs mx-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`flex flex-1 items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-cinema-red text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                    : 'text-cinema-popcorn/60 hover:text-cinema-popcorn hover:bg-white/5'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;

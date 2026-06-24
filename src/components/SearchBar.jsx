
import { Search, X } from 'lucide-react';

function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-cinema-gray pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pesquise por filmes..."
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
    </div>
  );
}

export default SearchBar;

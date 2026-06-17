import { Star, Heart, Film, Play } from 'lucide-react';

/**
 * Componente MovieCard - Exibe as informações de um filme do TMDB em formato de card premium.
 * 
 * @param {Object} props
 * @param {Object} props.movie - Objeto do filme contendo os dados do TMDB
 * @param {boolean} props.isFavorite - Indica se o filme está na lista de favoritos
 * @param {Function} props.onFavoriteToggle - Callback disparado ao clicar no botão de favorito
 * @param {Function} [props.onDetailsClick] - Callback opcional para ver detalhes do filme
 */
function MovieCard({ movie, isFavorite, onFavoriteToggle, onDetailsClick }) {
  if (!movie) return null;

  const {
    id,
    title,
    poster_path,
    release_date,
    vote_average,
    overview
  } = movie;

  // Monta a URL completa do pôster usando o tamanho w500 recomendado pelo TMDB
  const imageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}` 
    : null;

  // Extrai o ano de lançamento de forma segura
  const releaseYear = release_date 
    ? new Date(release_date).getFullYear() 
    : 'N/A';

  // Formata a média de votos para uma casa decimal
  const rating = vote_average !== undefined && vote_average !== null
    ? Number(vote_average).toFixed(1)
    : 'N/A';

  // Handler para evitar propagação ao clicar no botão de favoritar
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  return (
    <div 
      onClick={() => onDetailsClick && onDetailsClick(id)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/30 hover:bg-cinema-charcoal/50 hover:border-cinema-gray/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] hover:-translate-y-1 ${
        onDetailsClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Imagem do Pôster e Overlays */}
      <div className="relative aspect-2/3 w-full overflow-hidden bg-cinema-black">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:opacity-90"
          />
        ) : (
          /* Fallback caso não haja pôster */
          <div className="flex h-full w-full flex-col items-center justify-center bg-linear-to-b from-cinema-charcoal to-cinema-black p-4 text-center">
            <Film className="h-12 w-12 text-cinema-gray mb-3 animate-pulse" />
            <span className="text-sm font-bold text-cinema-popcorn/80 line-clamp-3">{title}</span>
            <span className="text-[10px] text-cinema-gray mt-1 uppercase tracking-wider">Sem Cartaz</span>
          </div>
        )}

        {/* Gradiente de Overlay Inferior (Sutil) */}
        <div className="absolute inset-0 bg-linear-to-t from-cinema-black/80 via-transparent to-transparent opacity-60"></div>

        {/* Badge de Nota (Canto Superior Esquerdo) */}
        {rating !== 'N/A' && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-cinema-black/85 border border-cinema-charcoal px-2.5 py-1 text-xs font-bold text-cinema-gold shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            <Star className="h-3 w-3 fill-cinema-gold text-cinema-gold" />
            <span>{rating}</span>
          </div>
        )}

        {/* Botão de Favorito (Canto Superior Direito) */}
        <button 
          onClick={handleFavoriteClick}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${
            isFavorite 
              ? 'border-cinema-red bg-cinema-red/20 text-cinema-red shadow-[0_0_12px_rgba(229,9,20,0.4)] scale-110' 
              : 'border-cinema-charcoal bg-cinema-black/85 text-cinema-popcorn hover:border-cinema-red hover:text-cinema-red hover:scale-110'
          }`}
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={`h-4.5 w-4.5 transition-transform duration-300 active:scale-75 ${isFavorite ? 'fill-cinema-red' : ''}`} />
        </button>

        {/* Efeito Hover: Botão Flutuante Central de "Ver Ficha" */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cinema-black/40 backdrop-blur-[2px]">
          <span className="flex items-center gap-2 rounded-full bg-cinema-gold px-5 py-2.5 text-xs font-bold text-cinema-black shadow-[0_4px_15px_rgba(245,197,24,0.4)] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Play className="h-3.5 w-3.5 fill-cinema-black" />
            Detalhes
          </span>
        </div>
      </div>

      {/* Conteúdo Informativo */}
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div className="space-y-2">
          {/* Linha de Metadados */}
          <div className="flex items-center justify-between text-xs text-cinema-gray">
            <span>Lançamento: {releaseYear}</span>
            <span className="rounded bg-cinema-charcoal px-1.5 py-0.5 text-[10px] text-cinema-neon font-semibold uppercase tracking-wider">
              Filme
            </span>
          </div>

          {/* Título */}
          <h4 className="text-base font-bold text-cinema-popcorn line-clamp-1 group-hover:text-cinema-gold transition-colors duration-200" title={title}>
            {title}
          </h4>

          {/* Sinopse */}
          <p className="text-xs text-cinema-popcorn/60 line-clamp-3 leading-relaxed">
            {overview || 'Nenhuma sinopse disponível em português para este filme.'}
          </p>
        </div>

        {/* Rodapé do Card */}
        <div className="mt-4 pt-3 border-t border-cinema-charcoal flex items-center justify-between text-[11px]">
          <span className="font-medium text-cinema-popcorn/40">TMDB API</span>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDetailsClick && onDetailsClick(id);
            }}
            className="font-bold text-cinema-gold hover:underline flex items-center gap-0.5"
          >
            Ficha Técnica
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;

import { Star, Film, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Componente MovieCard - Exibe as informações de filmes, séries e personagens do TMDB.
 * 
 * @param {Object} props
 * @param {Object} props.movie - Objeto contendo os dados do filme, série ou pessoa do TMDB
 * @param {boolean} props.isFavorite - Indica se o item está na lista de favoritos
 * @param {Function} props.onFavoriteToggle - Callback disparado ao clicar no botão de estrela de favorito
 * @param {Function} [props.onDetailsClick] - Callback opcional para ver detalhes
 */
function MovieCard({ movie, isFavorite, onFavoriteToggle, onDetailsClick }) {
  if (!movie) return null;

  const {
    id,
    title,
    name,
    poster_path,
    profile_path,
    release_date,
    first_air_date,
    vote_average,
    overview,
    known_for_department,
    media_type,
    type
  } = movie;

  const displayTitle = title || name || 'Sem título';
  const rawImagePath = poster_path || profile_path;
  const imageUrl = rawImagePath
    ? `https://image.tmdb.org/t/p/w500${rawImagePath}`
    : null;

  const releaseYear = release_date
    ? new Date(release_date).getFullYear()
    : first_air_date
    ? new Date(first_air_date).getFullYear()
    : known_for_department
    ? known_for_department
    : 'N/A';

  const rating = vote_average !== undefined && vote_average !== null && vote_average > 0
    ? Number(vote_average).toFixed(1)
    : null;

  const mediaLabel = type || (media_type === 'tv' ? 'Série' : 'Filme');

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  const isTvSeries = media_type === 'tv' || !!first_air_date || (!!name && !title);
  const targetRoute = isTvSeries ? `/serie/${id}` : `/filme/${id}`;

  return (
    <Link
      to={targetRoute}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/30 hover:bg-cinema-charcoal/50 hover:border-cinema-gray/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)] hover:-translate-y-1 cursor-pointer"
    >
      {/* Imagem do Pôster e Overlays */}
      <div className="relative aspect-2/3 w-full overflow-hidden bg-cinema-black">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={displayTitle}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-linear-to-b from-cinema-charcoal to-cinema-black p-4 text-center">
            <Film className="h-12 w-12 text-cinema-gray mb-3 animate-pulse" />
            <span className="text-sm font-bold text-cinema-popcorn/80 line-clamp-3">{displayTitle}</span>
            <span className="text-[10px] text-cinema-gray mt-1 uppercase tracking-wider">Sem Imagem</span>
          </div>
        )}

        {/* Gradiente de Overlay Inferior */}
        <div className="absolute inset-0 bg-linear-to-t from-cinema-black/80 via-transparent to-transparent opacity-60"></div>

        {/* Badge de Nota (Canto Superior Esquerdo) */}
        {rating && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-cinema-black/85 border border-cinema-charcoal px-2.5 py-1 text-xs font-bold text-cinema-gold shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            <Star className="h-3 w-3 fill-cinema-gold text-cinema-gold" />
            <span>{rating}</span>
          </div>
        )}

        {/* Botão de Favorito - Ícone de Estrela (Sprint 4 Requirement) */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${
            isFavorite
              ? 'border-cinema-gold bg-cinema-gold/25 text-cinema-gold shadow-[0_0_12px_rgba(245,197,24,0.5)] scale-110'
              : 'border-cinema-charcoal bg-cinema-black/85 text-cinema-popcorn hover:border-cinema-gold hover:text-cinema-gold hover:scale-110'
          }`}
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Star className={`h-4.5 w-4.5 transition-transform duration-300 active:scale-75 ${isFavorite ? 'fill-cinema-gold text-cinema-gold' : ''}`} />
        </button>

        {/* Efeito Hover: Botão Flutuante Central */}
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
            <span>{typeof releaseYear === 'number' ? `Ano: ${releaseYear}` : releaseYear}</span>
            <span className="rounded bg-cinema-charcoal px-1.5 py-0.5 text-[10px] text-cinema-neon font-semibold uppercase tracking-wider">
              {mediaLabel}
            </span>
          </div>

          {/* Título */}
          <h4 className="text-base font-bold text-cinema-popcorn line-clamp-1 group-hover:text-cinema-gold transition-colors duration-200" title={displayTitle}>
            {displayTitle}
          </h4>

          {/* Sinopse */}
          <p className="text-xs text-cinema-popcorn/60 line-clamp-3 leading-relaxed">
            {overview || 'Nenhuma descrição disponível em português.'}
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
    </Link>
  );
}

export default MovieCard;

import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavs = localStorage.getItem('cineinfo_favorites');
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        // Remove os IDs mockados legados (1 e 2) caso existam
        return parsed.filter(id => id !== 1 && id !== 2);
      }
      return [];
    } catch (e) {
      console.error('Erro ao ler cineinfo_favorites do localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cineinfo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const adicionarFavorito = (id) => {
    setFavorites((prevFavs) => {
      if (prevFavs.includes(id)) return prevFavs;
      return [...prevFavs, id];
    });
  };

  const removerFavorito = (id) => {
    setFavorites((prevFavs) => prevFavs.filter((favId) => favId !== id));
  };

  const toggleFavorite = (id) => {
    setFavorites((prevFavs) =>
      prevFavs.includes(id)
        ? prevFavs.filter((favId) => favId !== id)
        : [...prevFavs, id]
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        adicionarFavorito,
        removerFavorito,
        toggleFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser utilizado dentro de um FavoritesProvider');
  }
  return context;
}

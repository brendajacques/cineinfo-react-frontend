import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cineinfo_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Erro ao ler cineinfo_user do localStorage:', e);
      return null;
    }
  });


  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavs = localStorage.getItem('cineinfo_favorites');
      return savedFavs ? JSON.parse(savedFavs) : [1, 2];
    } catch (e) {
      console.error('Erro ao ler cineinfo_favorites do localStorage:', e);
      return [1, 2];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('cineinfo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cineinfo_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cineinfo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  /**
   * @param {string} email - E-mail digitado no login
   * @param {string} password - Senha digitada no login
   * @returns {boolean} - Indica sucesso no login
   */
  const login = (email, password) => {
    if (!email || !password) return false;

    const namePart = email.split('@')[0];
    const username = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const mockUser = {
      name: username,
      email: email,
      perfil: email.toLowerCase().includes('admin') ? 'Administrador' : 'Usuário',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${namePart}`
    };

    setUser(mockUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  /** 
   * @param {number|string} id - Identificador do filme
   */
  const toggleFavorite = (id) => {
    setFavorites((prevFavs) => 
      prevFavs.includes(id) 
        ? prevFavs.filter((favId) => favId !== id) 
        : [...prevFavs, id]
    );
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, favorites, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

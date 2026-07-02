/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

// Criamos o Contexto de Autenticação e Estados Compartilhados
const AuthContext = createContext();

/**
 * Provedor de Autenticação (AuthProvider) que gerencia o estado global de login
 * e sincroniza os favoritos persistindo os dados no localStorage.
 */
export function AuthProvider({ children }) {
  // Carrega o usuário inicial do localStorage se já houver sessão
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cineinfo_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Erro ao ler cineinfo_user do localStorage:', e);
      return null;
    }
  });

  // Carrega a lista de favoritos inicial do localStorage ou usa ids de mock
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavs = localStorage.getItem('cineinfo_favorites');
      return savedFavs ? JSON.parse(savedFavs) : [1, 2];
    } catch (e) {
      console.error('Erro ao ler cineinfo_favorites do localStorage:', e);
      return [1, 2];
    }
  });

  // Sincroniza o usuário com o localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('cineinfo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cineinfo_user');
    }
  }, [user]);

  // Sincroniza a lista de favoritos com o localStorage
  useEffect(() => {
    localStorage.setItem('cineinfo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Realiza o login mockado do usuário.
   * Cria um avatar personalizado baseado no e-mail e salva o estado.
   * 
   * @param {string} email - E-mail digitado no login
   * @param {string} password - Senha digitada no login
   * @returns {boolean} - Indica sucesso no login
   */
  const login = (email, password) => {
    if (!email || !password) return false;

    // Extrai o nome a partir do e-mail para exibição
    const namePart = email.split('@')[0];
    const username = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    // Cria um avatar dinâmico usando um serviço público gratuito
    const mockUser = {
      name: username,
      email: email,
      perfil: email.toLowerCase().includes('admin') ? 'Administrador' : 'Usuário',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${namePart}`
    };

    setUser(mockUser);
    return true;
  };

  /**
   * Finaliza a sessão do usuário limpando o estado de autenticação.
   */
  const logout = () => {
    setUser(null);
  };

  /**
   * Adiciona ou remove um ID da lista global de favoritos.
   * 
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

/**
 * Hook customizado para consumir os dados de autenticação e favoritos.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

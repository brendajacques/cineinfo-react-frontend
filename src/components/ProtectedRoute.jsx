import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Componente wrapper que protege rotas administrativas.
 * Verifica se o usuário está logado e se possui o perfil 'Administrador'.
 * Caso contrário, redireciona para a página inicial (Home).
 */
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user || user.perfil !== 'Administrador') {
    return <Navigate to="/" replace />;
  }

  return children;
}

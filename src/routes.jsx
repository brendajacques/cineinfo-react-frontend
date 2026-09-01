import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Favorites from './pages/Favorites.jsx';
import Admin from './pages/Admin.jsx';
import AdminEdit from './pages/AdminEdit.jsx';
import Filmes from './pages/Filmes.jsx';
import SugerirResenha from './pages/SugerirResenha.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/filme/:id" element={<MovieDetails />} />
            <Route path="/serie/:id" element={<MovieDetails />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/filmes" element={<Filmes />} />
            <Route path="/sugerir-resenha" element={<SugerirResenha />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/editar/:id"
              element={
                <ProtectedRoute>
                  <AdminEdit />
                </ProtectedRoute>
              }
            />
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;


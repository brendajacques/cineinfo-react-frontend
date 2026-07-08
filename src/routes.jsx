import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Favorites from './pages/Favorites.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/filme/:id" element={<MovieDetails />} />
            <Route path="/favoritos" element={<Favorites />} />
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;


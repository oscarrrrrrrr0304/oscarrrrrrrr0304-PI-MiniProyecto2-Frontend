/**
 * Componente principal de la aplicación
 * Configura el enrutamiento de React Router con rutas públicas y protegidas
 * 
 * @module App
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import LikedPage from "./pages/LikedPage";
import AboutUsPage from "./pages/AboutUsPage";
import SiteMapPage from "./pages/SiteMapPage";
import VideoPage from "./pages/VideoPage";

/**
 * Componente raíz de la aplicación
 * Define la estructura de rutas y la navegación de la aplicación
 * 
 * @component
 * @returns {JSX.Element} Aplicación con enrutamiento configurado
 * 
 * @description
 * Rutas públicas (no requieren autenticación):
 * - /login - Página de inicio de sesión
 * - /register - Página de registro
 * - /forgot-password - Solicitar recuperación de contraseña
 * - /reset-password/:token - Resetear contraseña con token
 * 
 * Rutas protegidas (requieren autenticación):
 * - /home - Página principal con carruseles de videos
 * - /video/:videoId - Página de detalle de video con reproductor
 * - /profile - Perfil de usuario
 * - /search - Búsqueda y filtrado de videos
 * - /liked - Videos marcados como favoritos
 * - /about - Acerca de nosotros
 * - /sitemap - Mapa del sitio
 * 
 * La ruta raíz (/) redirige automáticamente a /login
 * 
 * @example
 * ```tsx
 * // Uso en main.tsx
 * ReactDOM.createRoot(document.getElementById("root")!).render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>
 * );
 * ```
 */
const App: React.FC = () => {
  // Zustand con persist maneja automáticamente la restauración del estado desde localStorage
  
  return (
    <BrowserRouter>
      <main className="bg-darkblue min-w-full min-h-screen">
        <Routes>
          {/* Ruta raíz redirige al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas públicas */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password/:token" 
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } 
          />

          {/* Rutas protegidas */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/video/:videoId"
            element={
              <ProtectedRoute>
                <Layout>
                  <VideoPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Layout>
                  <SearchPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/liked"
            element={
              <ProtectedRoute>
                <Layout>
                  <LikedPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <Layout>
                  <AboutUsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sitemap"
            element={
              <ProtectedRoute>
                <Layout>
                  <SiteMapPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;

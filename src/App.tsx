import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import useUserStore from "./stores/useUserStore";
import Layout from "./components/Layout";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import LikedPage from "./pages/LikedPage";

const App: React.FC = () => {
  const { verifyToken } = useUserStore();

  // Verificar token al cargar la aplicación
  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <BrowserRouter>
      <main className="bg-darkblue min-w-full min-h-screen">
        <Routes>
          {/* Ruta raíz redirige al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

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
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;

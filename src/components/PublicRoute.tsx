/**
 * Componente de ruta pública
 * Redirige a usuarios autenticados al home
 * 
 * @module PublicRoute
 */

import { Navigate } from "react-router-dom";
import useUserStore from "../stores/useUserStore";
import type { ReactNode } from "react";

/**
 * Props para el componente PublicRoute
 * @typedef {Object} PublicRouteProps
 * @property {ReactNode} children - Componente o contenido que se renderiza si el usuario NO está autenticado
 */
interface PublicRouteProps {
  children: ReactNode;
}

/**
 * Componente de ruta pública (para páginas de autenticación)
 * Previene que usuarios autenticados accedan a login/register
 * Redirige automáticamente a /home si ya hay sesión activa
 * 
 * @component
 * @param {PublicRouteProps} props - Props del componente
 * @returns {JSX.Element} Contenido público, loading o redirección al home
 * 
 * @description
 * Estados del componente:
 * - isLoading: Muestra pantalla de carga
 * - isAuthenticated: Redirige a /home
 * - !isAuthenticated: Muestra el contenido (login, register, etc.)
 * 
 * Casos de uso:
 * - Páginas de login
 * - Páginas de registro
 * - Recuperación de contraseña
 * - Reset de contraseña
 * 
 * @example
 * ```tsx
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 * ```
 * 
 * @example
 * ```tsx
 * <PublicRoute>
 *   <RegisterPage />
 * </PublicRoute>
 * ```
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserStore();

  // Mientras se verifica el token, muestra un loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-darkblue">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  // Si ya está autenticado, redirige al home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Si no está autenticado, muestra el contenido (login, register, etc.)
  return <>{children}</>;
};

export default PublicRoute;

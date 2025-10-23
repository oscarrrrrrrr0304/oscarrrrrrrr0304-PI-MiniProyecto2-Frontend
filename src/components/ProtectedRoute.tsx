import { Navigate } from "react-router";
import useUserStore from "../stores/useUserStore";
import type { ReactNode } from "react";

/**
 * Props para el componente ProtectedRoute
 * @typedef {Object} ProtectedRouteProps
 * @property {ReactNode} children - Componente o contenido que se renderiza si el usuario está autenticado
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente de ruta protegida que requiere autenticación
 * Verifica el estado de autenticación del usuario y redirige al login si no está autenticado
 * Muestra un loading mientras verifica el token
 * 
 * @component
 * @param {ProtectedRouteProps} props - Props del componente
 * @returns {JSX.Element} Contenido protegido, loading o redirección al login
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <HomePage />
 * </ProtectedRoute>
 * ```
 * 
 * @description
 * Estados del componente:
 * - isLoading: Muestra pantalla de carga
 * - !isAuthenticated: Redirige a /login
 * - isAuthenticated: Muestra el contenido (children)
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserStore();

  // Mientras se verifica el token, muestra un loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-darkblue">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, muestra el contenido
  return <>{children}</>;
};

export default ProtectedRoute;

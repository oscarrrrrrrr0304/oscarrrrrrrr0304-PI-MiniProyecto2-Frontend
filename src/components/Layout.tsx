import type { ReactNode } from "react";
import Navbar from "./Navbar";

/**
 * Props para el componente Layout
 * @typedef {Object} LayoutProps
 * @property {ReactNode} children - Contenido de la página que se renderiza dentro del layout
 */
interface LayoutProps {
  children: ReactNode;
}

/**
 * Componente de layout principal de la aplicación
 * Incluye la barra de navegación (Navbar) y el contenido de la página
 * Se usa como wrapper para todas las rutas protegidas
 * 
 * @component
 * @param {LayoutProps} props - Props del componente
 * @returns {JSX.Element} Layout con navbar y contenido
 * 
 * @example
 * ```tsx
 * <Layout>
 *   <HomePage />
 * </Layout>
 * ```
 * 
 * @description
 * Este componente proporciona la estructura básica de navegación
 * para todas las páginas de la aplicación autenticada
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
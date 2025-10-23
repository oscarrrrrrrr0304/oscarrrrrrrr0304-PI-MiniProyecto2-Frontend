/**
 * Punto de entrada de la aplicación React
 * Renderiza el componente App en el DOM
 * 
 * @module main
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * Crea la raíz de React y renderiza la aplicación en el elemento con id "root"
 * Se usa React.StrictMode para detectar problemas potenciales en la aplicación
 * 
 * @description
 * React.StrictMode activa verificaciones y advertencias adicionales:
 * - Detecta componentes con efectos secundarios inseguros
 * - Advierte sobre APIs deprecadas
 * - Detecta renderizados inesperados
 * 
 * Solo afecta el modo de desarrollo, no tiene impacto en producción
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
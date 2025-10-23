/**
 * Página de inicio de sesión
 * Permite a los usuarios autenticarse en la aplicación
 * 
 * @module LoginPage
 */

import { Link, useNavigate } from "react-router";
import Input from "../components/Input";
import { useState, useRef, type FormEvent } from "react";
import useUserStore from "../stores/useUserStore";

/**
 * Componente de la página de Login
 * Incluye formulario de autenticación con email y contraseña
 * Muestra video de fondo que rota automáticamente
 * 
 * @component
 * @returns {JSX.Element} Página de inicio de sesión
 * 
 * @description
 * Características:
 * - Formulario con validación de email y contraseña
 * - Video de fondo rotativo (4 videos)
 * - Manejo de errores con mensajes visuales
 * - Loading state durante la autenticación
 * - Enlaces a registro y recuperación de contraseña
 * - Responsive design (móvil y desktop)
 * 
 * @example
 * ```tsx
 * // Uso en App.tsx
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 * ```
 */
const LoginPage: React.FC = () => {
  /**
   * Array de rutas de videos para el fondo
   * @constant {string[]}
   */
  const videos = [
    "/videos/auth-video1.mp4",
    "/videos/auth-video2.mp4",
    "/videos/auth-video3.mp4",
    "/videos/auth-video4.mp4",
  ];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Zustand store
  const { login, isLoading, error, clearError } = useUserStore();
  const navigate = useNavigate();

  /**
   * Maneja el evento de finalización del video
   * Cambia al siguiente video en el array de forma circular
   */
  const handleVideoEnd = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
  };

  /**
   * Maneja el envío del formulario de login
   * Intenta autenticar al usuario y redirige a /home si es exitoso
   * 
   * @async
   * @param {FormEvent} e - Evento del formulario
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
      // Si el login es exitoso, redirige al home
      navigate("/home");
    } catch (error) {
      // El error ya está manejado en el store
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="login w-full h-screen flex relative">
      <div className="auth-form w-full md:w-md flex flex-col justify-between items-center h-full text-white bg-darkblue/95 md:bg-darkblue gap-5 p-6 md:p-10 relative z-10">
        <div></div>
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5">
          <h2 className="text-3xl font-semibold">Inicio de sesión</h2>
          <p className="text-base">Conéctate y vive la experiencia completa.</p>
          
          {/* Mostrar error si existe */}
          {error && (
            <div className="w-full bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              type="email"
              id="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1">
              <Input
                type="password"
                id="password"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link
                to="/forgot-password"
                className="text-sm text-lightblue self-end font-semibold"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button
              type="submit"
              className="bg-green text-white py-3 rounded h-12 font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
        <p>
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-lightblue font-semibold">
            Crear una cuenta
          </Link>
        </p>
      </div>
      <div className="auth-image flex-1 absolute md:relative inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={videos[currentVideoIndex]}
          autoPlay
          muted
          onEnded={handleVideoEnd}
        />
      </div>
    </div>
  );
};

export default LoginPage;

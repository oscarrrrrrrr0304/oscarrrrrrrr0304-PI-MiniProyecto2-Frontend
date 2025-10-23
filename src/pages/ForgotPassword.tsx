/**
 * Página de recuperación de contraseña
 * Permite solicitar un correo para resetear la contraseña olvidada
 * 
 * @module ForgotPassword
 */

import { Link } from "react-router";
import Input from "../components/Input";
import { useState, useRef, type FormEvent } from "react";
import useUserStore from "../stores/useUserStore";

/**
 * Componente de la página de recuperación de contraseña
 * Envía un correo electrónico con un link para resetear la contraseña
 * 
 * @component
 * @returns {JSX.Element} Página de recuperación de contraseña
 * 
 * @description
 * Características:
 * - Formulario simple con solo email
 * - Video de fondo rotativo
 * - Mensaje de éxito al enviar correo
 * - Manejo de errores visuales
 * - Loading state durante el envío
 * - Enlace para volver al login
 * - Responsive design
 * 
 * Flujo:
 * 1. Usuario ingresa email
 * 2. Sistema envía correo con token
 * 3. Usuario recibe link para resetear contraseña
 * 4. Redirección a ResetPassword con token
 * 
 * @example
 * ```tsx
 * <PublicRoute>
 *   <ForgotPassword />
 * </PublicRoute>
 * ```
 */
const ForgotPassword: React.FC = () => {
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
  const [success, setSuccess] = useState(false);

  // Zustand store
  const { forgotPassword, isLoading, error, clearError } = useUserStore();

  /**
   * Maneja el evento de finalización del video
   * Cambia al siguiente video en el array de forma circular
   */
  const handleVideoEnd = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
  };

  /**
   * Maneja el envío del formulario de recuperación
   * Envía email con link de reseteo de contraseña
   * 
   * @async
   * @param {FormEvent} e - Evento del formulario
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(false);

    try {
      await forgotPassword({ email });
      setSuccess(true);
      setEmail("");
    } catch (error) {
      console.error("Error al enviar correo:", error);
    }
  };

  return (
    <div className="login w-full h-screen flex relative">
      <div className="auth-form w-full md:w-md flex flex-col justify-between items-center h-full text-white bg-darkblue/95 md:bg-darkblue gap-5 p-6 md:p-10 relative z-10">
        <div></div>
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5">
          <h2 className="text-3xl font-semibold text-center">
            Recuperación de Contraseña
          </h2>
          <p className="text-base text-center">
            No te preocupes, a todos nos pasa. Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          {/* Mostrar mensaje de éxito */}
          {success && (
            <div className="w-full bg-green-500/20 border border-green-500 text-green-200 px-4 py-2 rounded text-sm">
              ¡Correo enviado! Revisa tu bandeja de entrada.
            </div>
          )}

          {/* Mostrar error */}
          {error && (
            <div className="w-full bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
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
            <button
              type="submit"
              className="bg-green text-white py-3 rounded h-12 font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Enlace"}
            </button>
          </form>
        </div>
        <Link to="/login" className="text-lightblue font-semibold">
          Volver al inicio de sesión
        </Link>
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

export default ForgotPassword;

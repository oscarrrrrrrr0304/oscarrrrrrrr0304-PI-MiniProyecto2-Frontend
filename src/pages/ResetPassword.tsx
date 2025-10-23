/**
 * Página de reseteo de contraseña con token
 * Permite establecer una nueva contraseña usando el token recibido por email
 * 
 * @module ResetPassword
 */

import { Link, useParams, useNavigate } from "react-router";
import Input from "../components/Input";
import { useState, useRef, type FormEvent } from "react";
import useUserStore from "../stores/useUserStore";
import { validatePassword } from "../utils/validators";

/**
 * Componente de la página de reseteo de contraseña
 * Usa el token de URL para validar y permitir cambio de contraseña
 * 
 * @component
 * @returns {JSX.Element} Página de reseteo de contraseña
 * 
 * @description
 * Características:
 * - Extrae token de URL params (/reset-password/:token)
 * - Formulario con nueva contraseña y confirmación
 * - Validación de contraseña segura
 * - Mostrar/ocultar contraseña
 * - Video de fondo rotativo
 * - Mensaje de éxito con redirección al login
 * - Manejo de errores (token inválido/expirado)
 * - Loading state
 * 
 * Requisitos de contraseña:
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos un número
 * - Al menos un carácter especial
 * 
 * Flujo:
 * 1. Usuario llega con token en URL
 * 2. Ingresa nueva contraseña y confirma
 * 3. Sistema valida token y actualiza contraseña
 * 4. Redirección automática al login después de 3 segundos
 * 
 * @example
 * ```tsx
 * <PublicRoute>
 *   <ResetPassword />
 * </PublicRoute>
 * ```
 */
const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  // Zustand store
  const { resetPassword, isLoading, error, clearError } = useUserStore();

  /**
   * Maneja el evento de finalización del video
   * Cambia al siguiente video en el array de forma circular
   */
  const handleVideoEnd = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
  };

  /**
   * Maneja el envío del formulario de reseteo
   * Valida contraseñas y actualiza con el token
   * 
   * @async
   * @param {FormEvent} e - Evento del formulario
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(false);

    // Validaciones
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Validar requisitos de contraseña segura
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      alert(passwordValidation.errors.join("\n"));
      return;
    }

    if (!token) {
      alert("Token inválido o no proporcionado");
      return;
    }

    try {
      await resetPassword({ token, newPassword });
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error al resetear contraseña:", error);
    }
  };

  return (
    <div className="login w-full min-h-screen flex relative">
      <div className="auth-form w-full md:w-md flex flex-col justify-between items-center h-full text-white bg-darkblue/95 md:bg-darkblue gap-5 p-6 md:p-10 relative z-10">
        <div></div>
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5">
          <h2 className="text-3xl font-semibold text-center">
            Restablecer Contraseña
          </h2>
          <p className="text-base text-center">
            Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial.
          </p>

          {/* Mostrar mensaje de éxito */}
          {success && (
            <div className="w-full bg-green-500/20 border border-green-500 text-green-200 px-4 py-2 rounded text-sm">
              ¡Contraseña actualizada exitosamente! Redirigiendo al login...
            </div>
          )}

          {/* Mostrar error */}
          {error && (
            <div className="w-full bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                label="Nueva Contraseña"
                placeholder="Ingresa tu nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? "" : ""}
              </button>
            </div>

            <Input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              label="Confirmar Contraseña"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="bg-green text-white py-3 rounded h-12 font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Actualizando..." : "Restablecer Contraseña"}
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

export default ResetPassword;

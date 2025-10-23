/**
 * Página de registro de nuevos usuarios
 * Permite crear una cuenta nueva en la aplicación
 * 
 * @module RegisterPage
 */

import { Link, useNavigate } from "react-router";
import Input from "../components/Input";
import { useState, useRef, type FormEvent } from "react";
import useUserStore from "../stores/useUserStore";
import { validatePassword } from "../utils/validators";

/**
 * Componente de la página de registro
 * Incluye formulario completo con validaciones de contraseña segura
 * 
 * @component
 * @returns {JSX.Element} Página de registro
 * 
 * @description
 * Características:
 * - Formulario con nombre, edad, email, contraseña y confirmación
 * - Validación de contraseñas coincidentes
 * - Validación de contraseña segura (mayúsculas, números, caracteres especiales)
 * - Video de fondo rotativo (4 videos)
 * - Manejo de errores con mensajes visuales
 * - Loading state durante el registro
 * - Mensaje de requisitos de contraseña
 * - Responsive design
 * 
 * Requisitos de contraseña:
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos un número
 * - Al menos un carácter especial
 * 
 * @example
 * ```tsx
 * <PublicRoute>
 *   <RegisterPage />
 * </PublicRoute>
 * ```
 */
const RegisterPage: React.FC = () => {
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
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // Zustand store
  const { register, isLoading, error, clearError } = useUserStore();
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
   * Maneja el envío del formulario de registro
   * Valida contraseñas y crea nueva cuenta
   * 
   * @async
   * @param {FormEvent} e - Evento del formulario
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError("");

    // Validaciones
    if (password !== confirmPassword) {
      setValidationError("Las contraseñas no coinciden");
      return;
    }

    // Validar requisitos de contraseña segura
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setValidationError(passwordValidation.errors.join(". "));
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13) {
      setValidationError("Debes tener al menos 13 años");
      return;
    }

    try {
      await register({
        name: username,
        email,
        password,
        age: ageNum,
      });
      // Si el registro es exitoso, redirige al home
      navigate("/home");
    } catch (error) {
      console.error("Error en registro:", error);
    }
  };

  return (
    <div className="login w-full min-h-screen flex relative">
      <div className="auth-form w-full md:w-md flex flex-col justify-between items-center h-full text-white bg-darkblue/95 md:bg-darkblue gap-5 p-6 md:p-10 relative z-10">
        <div></div>
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5">
          <h2 className="text-3xl font-semibold">Crear una cuenta</h2>
          <p className="text-base">
            Únete y empieza a descubrir lo que te gusta.
          </p>

          {/* Mostrar errores */}
          {(error || validationError) && (
            <div className="w-full bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
              {error || validationError}
            </div>
          )}

          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              type="text"
              id="username"
              label="Nombre Completo"
              placeholder="Ingresa tu nombre completo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="number"
              id="age"
              label="Edad"
              placeholder="Ingresa tu edad"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
            <Input
              type="email"
              id="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="w-full">
              <Input
                type="password"
                id="password"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-white/60 mt-1">
                Mínimo 8 caracteres, una mayúscula, un número y un carácter especial
              </p>
            </div>
            <Input
              type="password"
              id="confirm-password"
              label="Confirmar contraseña"
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green text-white py-3 rounded h-12 font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        </div>
        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-lightblue font-semibold">
            Inicia sesión
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

export default RegisterPage;

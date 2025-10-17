import { Link, useParams, useNavigate } from "react-router";
import Input from "../components/Input";
import { useState, useRef, type FormEvent } from "react";
import useUserStore from "../stores/useUserStore";

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
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

  const handleVideoEnd = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(false);

    // Validaciones
    if (newPassword !== confirmPassword) {
      // Aquí podrías usar un error local o el store
      alert("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
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
    <div className="login w-full h-screen flex relative">
      <div className="auth-form w-full md:w-md flex flex-col justify-between items-center h-full text-white bg-darkblue/95 md:bg-darkblue gap-5 p-6 md:p-10 relative z-10">
        <div></div>
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5">
          <h2 className="text-3xl font-semibold text-center">
            Restablecer Contraseña
          </h2>
          <p className="text-base text-center">
            Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
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

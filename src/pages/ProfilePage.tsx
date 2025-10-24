/**
 * Página de perfil de usuario
 * Permite ver y editar información personal, cambiar contraseña y gestionar cuenta
 * 
 * @module ProfilePage
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Input from "../components/Input";
import useUserStore from "../stores/useUserStore";
import { validatePassword } from "../utils/validators";
import VideoCard from "../components/VideoCard";
import { pexelsService } from "../services/pexels.service";
import type { PexelsVideo } from "../types/pexels.types";

/**
 * Componente de la página de perfil de usuario
 * Gestiona la información personal y configuración de cuenta
 * 
 * @component
 * @returns {JSX.Element} Página de perfil con modales
 * 
 * @description
 * Características principales:
 * - Vista de información del perfil (nombre, email, edad)
 * - Sección de "Me Gusta" recientes (últimos 4 videos)
 * - Modal de edición de perfil
 * - Cambio de contraseña con validación
 * - Confirmación de eliminación de cuenta
 * - Modal de confirmación de logout
 * - Validación de contraseña segura
 * - Manejo de estados de carga
 * 
 * Modales disponibles:
 * - Editar perfil (nombre, email, edad)
 * - Cambiar contraseña (con validaciones)
 * - Eliminar cuenta (requiere confirmación)
 * - Cerrar sesión (con confirmación)
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <Layout>
 *     <ProfilePage />
 *   </Layout>
 * </ProtectedRoute>
 * ```
 */
const ProfilePage: React.FC = () => {
  const { user, updateUser, deleteAccount, logout, changePassword, isLoading } = useUserStore();
  const navigate = useNavigate();

  // Estados para los modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Estados para los videos con "Me Gusta" recientes
  const [recentLikedVideos, setRecentLikedVideos] = useState<PexelsVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  // Estados para el formulario de edición
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || 0,
    bio: "", // Nueva descripción "sobre mi"
  });

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Estados para el modal de eliminar cuenta
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  /**
   * Effect: Actualiza editData cuando el usuario cambia
   * Sincroniza los datos del formulario con el usuario actual
   */
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name,
        email: user.email,
        age: user.age,
        bio: "", // Reset bio cuando el usuario cambie
      });
    }
  }, [user]);

  /**
   * Effect: Carga los 4 "Me Gusta" más recientes del usuario
   * Se ejecuta cuando cambia el array moviesLiked
   */
  useEffect(() => {
    const loadRecentLikedVideos = async () => {
      try {
        setLoadingVideos(true);

        // Verificar si el usuario tiene videos con "Me Gusta"
        if (!user?.moviesLiked || user.moviesLiked.length === 0) {
          setRecentLikedVideos([]);
          setLoadingVideos(false);
          return;
        }

        // Obtener los últimos 4 IDs (los más recientes están al final del array)
        const recentIds = user.moviesLiked.slice(-4).reverse(); // Últimos 4 en orden inverso

        // Cargar cada video por su ID
        const videoPromises = recentIds.map((videoId) =>
          pexelsService.getVideoById(videoId)
        );

        const videos = await Promise.all(videoPromises);
        setRecentLikedVideos(videos);
      } catch (err) {
        console.error("Error al cargar videos recientes con Me Gusta:", err);
        setRecentLikedVideos([]);
      } finally {
        setLoadingVideos(false);
      }
    };

    loadRecentLikedVideos();
  }, [user?.moviesLiked]);

  /**
   * Maneja la actualización del perfil
   * 
   * @async
   * @throws {Error} Si la actualización falla
   */
  const handleUpdateProfile = async () => {
    try {
      // Actualizar perfil
      await updateUser(editData);
      setShowEditModal(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar el perfil. Por favor, intenta de nuevo.");
    }
  };

  /**
   * Maneja el cambio de contraseña de forma independiente
   * 
   * @async
   * @throws {Error} Si el cambio de contraseña falla
   */
  const handleChangePassword = async () => {
    try {
      // Validar que las contraseñas no estén vacías
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
        alert("Por favor, completa todos los campos de contraseña");
        return;
      }

      // Validar que las contraseñas coincidan
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        alert("Las contraseñas nuevas no coinciden");
        return;
      }

      // Validar que la nueva contraseña cumpla los requisitos
      const passwordValidation = validatePassword(passwordData.newPassword);
      if (!passwordValidation.isValid) {
        alert(`La nueva contraseña no cumple los requisitos:\n${passwordValidation.errors.join("\n")}`);
        return;
      }

      // Cambiar contraseña
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      // Limpiar campos de contraseña y cerrar modal
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowPasswordModal(false);
      alert("Contraseña actualizada correctamente");
    } catch (passwordError) {
      console.error("Error al cambiar contraseña:", passwordError);
      const errorMessage = passwordError instanceof Error ? passwordError.message : "Error al cambiar la contraseña";
      alert(errorMessage);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      alert("Error: Usuario no encontrado");
      return;
    }

    try {
      await deleteAccount();
      // Redirigirá automáticamente al login desde el store
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      alert("Error al eliminar la cuenta. Por favor, intenta de nuevo.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      // El usuario será redirigido automáticamente al login por ProtectedRoute
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Por favor, intenta de nuevo.");
    }
  };

  // Validar que los campos de eliminación sean correctos
  const canDelete =
    deletePassword.length > 0 && deleteConfirmText === "ELIMINAR";

  return (
    <div className="flex flex-col md:flex-row px-8 mt-20 gap-8">
      <div className="w-full md:w-1/3 min-h-screen flex flex-col justify-center items-center gap-8">
        <div className="flex flex-col justify-center items-center gap-1">
          <div className="w-28 h-28 bg-[url('/images/user-image.jpg')] bg-cover bg-center rounded-full"></div>
          <h2 className="text-2xl font-semibold mb-2 text-white text-center">
            {user?.name || "Nombre de Usuario"}
          </h2>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-0.5 bg-gray/50 p-3 text-white rounded-lg">
            <h6 className="text-base font-semibold text-white">Nombre</h6>
            <p className="text-base text-white/70">
              {user?.name || "Nombre del usuario"}
            </p>
          </div>
          <div className="flex flex-col gap-0.5 bg-gray/50 p-3 text-white rounded-lg">
            <h6 className="text-base font-semibold text-white">Email</h6>
            <p className="text-base text-white/70">
              {user?.email || "Email del usuario"}
            </p>
          </div>
          <div className="flex flex-col gap-0.5 bg-gray/50 p-3 text-white rounded-lg">
            <h6 className="text-base font-semibold text-white">Edad</h6>
            <p className="text-base text-white/70">
              {user?.age || "Edad del usuario"}
            </p>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="edit-profile-button bg-green text-white py-3 rounded h-12 font-semibold hover:bg-green-600 transition"
          >
            Editar perfil
          </button>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="logout-button bg-red text-white py-3 rounded h-12 font-semibold hover:bg-red-600 transition"
          >
            Cerrar sesion
          </button>
        </div>
        <p className="text-white cursor-pointer">
          ¿Deseas eliminar tu cuenta?
          <span
            className="text-red font-semibold ml-1"
            onClick={() => setShowDeleteModal(true)}
          >
            Hazlo Aqui
          </span>
        </p>
      </div>
      <div className="w-full md:w-2/3 min-h-screen flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-4xl">
          {/* Header de Me Gusta Recientes */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Me Gusta Recientes</h2>
            {user?.moviesLiked && user.moviesLiked.length > 4 && (
              <button
                onClick={() => navigate('/liked')}
                className="text-lightblue hover:text-blue transition font-semibold"
              >
                Ver todos ({user.moviesLiked.length})
              </button>
            )}
          </div>

          {/* Contenido */}
          {loadingVideos ? (
            <div className="flex justify-center items-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-lightblue"></div>
            </div>
          ) : recentLikedVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg
                className="mb-4 text-white/40"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
              </svg>
              <p className="text-white/70 text-lg text-center">
                Aún no tienes videos con "Me Gusta"
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-blue text-white rounded hover:bg-lightblue transition"
              >
                Explorar videos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {recentLikedVideos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="flex flex-col gap-4 mb-6 w-full">
          <h3 className="text-2xl text-white font-semibold text-center mb-4">
            Editar Perfil
          </h3>
          <Input
            type="text"
            id="name"
            label="Nombre de usuario"
            placeholder="Ingresa tu nombre de usuario"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <Input
            type="email"
            id="email"
            label="Email"
            placeholder="Ingresa tu email"
            value={editData.email}
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
          />
          <Input
            type="number"
            id="age"
            label="Edad"
            placeholder="Ingresa tu edad"
            value={editData.age.toString()}
            onChange={(e) =>
              setEditData({ ...editData, age: parseInt(e.target.value) || 0 })
            }
          />
          
          {/* Botón para cambio de contraseña */}
          <div className="w-full mt-4">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="text-white font-semibold hover:text-green transition"
            >
              ¿Deseas cambiar tu contraseña?
            </button>
          </div>
          
          <div className="w-full h-fit flex flex-col gap-1"></div>
        </div>
        <div className="flex gap-4 w-full">
          <button
            onClick={handleUpdateProfile}
            disabled={isLoading}
            className="flex-1 bg-green text-white py-3 rounded font-semibold hover:bg-green-600 transition disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={() => {
              setShowEditModal(false);
            }}
            className="flex-1 bg-gray-600 text-white py-3 rounded font-semibold hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Modal de Cambio de Contraseña */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
        }}
      >
        <div className="flex flex-col gap-4 mb-6 w-full">
          <h3 className="text-2xl text-white font-semibold text-center mb-4">
            Cambiar Contraseña
          </h3>
          
          <Input
            type="password"
            id="currentPassword"
            label="Contraseña actual"
            placeholder="Ingresa tu contraseña actual"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, currentPassword: e.target.value })
            }
          />
          
          <div>
            <Input
              type="password"
              id="newPassword"
              label="Nueva contraseña"
              placeholder="Ingresa tu nueva contraseña"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
            />
            <p className="text-xs text-white/70 mt-1">
              Mínimo 8 caracteres, una mayúscula, un número y un carácter especial
            </p>
          </div>
          
          <Input
            type="password"
            id="confirmNewPassword"
            label="Confirmar nueva contraseña"
            placeholder="Confirma tu nueva contraseña"
            value={passwordData.confirmNewPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
            }
          />
        </div>
        
        <div className="flex gap-4 w-full">
          <button
            onClick={handleChangePassword}
            disabled={isLoading}
            className="flex-1 bg-green text-white py-3 rounded font-semibold hover:bg-green-600 transition disabled:opacity-50"
          >
            {isLoading ? "Cambiando..." : "Cambiar contraseña"}
          </button>
          <button
            onClick={() => {
              setShowPasswordModal(false);
              setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              });
            }}
            className="flex-1 bg-gray-600 text-white py-3 rounded font-semibold hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Modal de Eliminar Cuenta */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletePassword("");
          setDeleteConfirmText("");
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle stroke-red"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 9v4" />
          <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
          <path d="M12 16h.01" />
        </svg>
        <h3 className="text-2xl text-red font-semibold text-center mb-4">
          Eliminando Cuenta
        </h3>
        <p className="text-white mb-4 text-sm">
          Esta acción eliminará permanentemente tu cuenta y todos tus datos. No
          podrás recuperar esta información.
        </p>

        <div className="flex flex-col gap-4 mb-6 w-full">
          <Input
            type="password"
            id="delete-password"
            label="Confirma tu contraseña"
            placeholder="Ingresa tu contraseña"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            required
          />
          <div className="w-full h-fit flex flex-col gap-1">
            <label
              htmlFor="delete-confirm"
              className="text-sm font-semibold text-white"
            >
              Escribe "ELIMINAR" para confirmar
            </label>
            <input
              type="text"
              id="delete-confirm"
              placeholder='Escribe "ELIMINAR" en mayúsculas'
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              required
              className="border-2 text-white bg-transparent rounded-sm h-10 p-2 focus:outline-none focus:border-red-400"
            />
            {deleteConfirmText && deleteConfirmText !== "ELIMINAR" && (
              <span className="text-xs text-red-400">
                Debe coincidir exactamente con "ELIMINAR"
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={handleDeleteAccount}
            disabled={isLoading || !canDelete}
            className="flex-1 bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Eliminando..." : "Eliminar mi cuenta"}
          </button>
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeletePassword("");
              setDeleteConfirmText("");
            }}
            className="flex-1 bg-gray-600 text-white py-3 rounded font-semibold hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Modal de Cerrar Sesión */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <div className="flex flex-col items-center gap-4 w-full">
          <h3 className="text-2xl text-white font-semibold text-center">
            Cerrar Sesión
          </h3>
          <p className="text-white text-center text-base">
            ¿Realmente deseas cerrar sesión?
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex-1 bg-red text-white py-3 rounded font-semibold hover:bg-red-600 transition disabled:opacity-50"
            >
              {isLoading ? "Cerrando sesión..." : "Sí, cerrar sesión"}
            </button>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 bg-gray-600 text-white py-3 rounded font-semibold hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;

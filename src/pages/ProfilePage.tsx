import { useState } from "react";
import Modal from "../components/Modal";
import Input from "../components/Input";
import useUserStore from "../stores/useUserStore";

const ProfilePage: React.FC = () => {
  const { user, updateUser, deleteAccount, isLoading } = useUserStore();
  
  // Estados para los modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estados para el formulario de edición
  const [editData, setEditData] = useState({
    username: user?.name || "",
    email: user?.email || "",
    age: user?.age || 0,
    bio: "", // Nueva descripción "sobre mi"
  });

  // Estados para el modal de eliminar cuenta
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleUpdateProfile = async () => {
    try {
      await updateUser(editData);
      setShowEditModal(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      // Redirigirá automáticamente al login desde el store
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
    }
  };

  // Validar que los campos de eliminación sean correctos
  const canDelete = deletePassword.length > 0 && deleteConfirmText === "ELIMINAR";

  return (
    <div className="flex flex-col md:flex-row px-8 mt-20">
      <div className="w-full md:w-1/3 min-h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="w-28 h-28 bg-[url('./images/user-image.jpg')] bg-cover bg-center rounded-full mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2 text-white text-center">
            {user?.name || "Nombre de Usuario"}
          </h2>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-0.5 bg-gray/50 p-3 text-white rounded-lg">
            <h6 className="text-base font-semibold text-white">Nombre</h6>
            <p className="text-base text-white/70">{user?.name || "Nombre del usuario"}</p>
          </div>
          <div className="flex flex-col gap-0.5 bg-gray/50 p-3 text-white rounded-lg">
            <h6 className="text-base font-semibold text-white">Email</h6>
            <p className="text-base text-white/70">{user?.email || "Email del usuario"}</p>
          </div>
          <div className="flex flex-col gap-0.5 bg-gray/50 p-3 text-white rounded-lg">
            <h6 className="text-base font-semibold text-white">Edad</h6>
            <p className="text-base text-white/70">{user?.age || "Edad del usuario"}</p>
          </div>
          <button 
            onClick={() => setShowEditModal(true)}
            className="edit-profile-button bg-green text-white py-3 rounded h-12 font-semibold hover:bg-green-600 transition"
          >
            Editar perfil
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="delete-account-button bg-red text-white py-3 rounded h-12 font-semibold hover:bg-red-600 transition"
          >
            Eliminar cuenta
          </button>
        </div>
      </div>
      <div className="w-full md:w-2/3 min-h-screen flex flex-col justify-center items-center">
        <p className="text-white">Me gusta recientes</p>
      </div>
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Perfil"
      >
        <div className="flex flex-col gap-4 mb-6">
          <Input
            type="text"
            id="name"
            label="Nombre de usuario"
            placeholder="Ingresa tu nombre de usuario"
            value={editData.username}
            onChange={(e) =>
              setEditData({ ...editData, username: e.target.value })
            }
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
          <div className="w-full h-fit flex flex-col gap-1">
            <label htmlFor="bio" className="text-sm font-semibold text-white">
              Sobre mi
            </label>
            <textarea
              id="bio"
              placeholder="Escribe una breve descripción sobre ti..."
              value={editData.bio}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
              rows={4}
              maxLength={200}
              className="border-2 border-blue text-white bg-transparent rounded-sm p-2 focus:outline-none focus:border-lightblue resize-none"
            />
            <span className="text-xs text-gray-400 self-end">
              {editData.bio.length}/200
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleUpdateProfile}
            disabled={isLoading}
            className="flex-1 bg-green text-white py-3 rounded font-semibold hover:bg-green-600 transition disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={() => setShowEditModal(false)}
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
        title="Eliminar Cuenta"
      >
        <div className="bg-red-500/10 border border-red-500 rounded p-3 mb-4">
          <p className="text-red-300 text-sm font-semibold">
            ADVERTENCIA: Esta acción es irreversible
          </p>
        </div>
        <p className="text-gray-300 mb-4 text-sm">
          Esta acción eliminará permanentemente tu cuenta y todos tus datos. No podrás recuperar esta información.
        </p>
        
        <div className="flex flex-col gap-4 mb-6">
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
            <label htmlFor="delete-confirm" className="text-sm font-semibold text-white">
              Escribe "ELIMINAR" para confirmar
            </label>
            <input
              type="text"
              id="delete-confirm"
              placeholder='Escribe "ELIMINAR" en mayúsculas'
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              required
              className="border-2 border-red-500 text-white bg-transparent rounded-sm h-10 p-2 focus:outline-none focus:border-red-400"
            />
            {deleteConfirmText && deleteConfirmText !== "ELIMINAR" && (
              <span className="text-xs text-red-400">
                Debe coincidir exactamente con "ELIMINAR"
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
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
    </div>
  );
};

export default ProfilePage;

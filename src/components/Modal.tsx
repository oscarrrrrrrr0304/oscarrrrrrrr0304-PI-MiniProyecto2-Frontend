import type { ReactNode } from "react";

/**
 * Props para el componente Modal
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Estado de apertura del modal
 * @property {Function} onClose - Callback que se ejecuta para cerrar el modal
 * @property {ReactNode} children - Contenido del modal
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Componente de modal genérico reutilizable
 * Incluye backdrop oscuro, centrado en pantalla y cierre al hacer click fuera
 * El modal no se renderiza si isOpen es false
 * 
 * @component
 * @param {ModalProps} props - Props del componente
 * @returns {JSX.Element | null} Modal renderizado o null si está cerrado
 * 
 * @example
 * ```tsx
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
 *   <h2>Título del Modal</h2>
 *   <p>Contenido del modal aquí</p>
 *   <button onClick={() => setShowModal(false)}>Cerrar</button>
 * </Modal>
 * ```
 * 
 * @description
 * Características:
 * - Backdrop oscuro (bg-black/80)
 * - Centrado con flexbox
 * - Cierre al hacer click en el backdrop
 * - stopPropagation para prevenir cierre al hacer click en el contenido
 * - z-index alto (2000) para estar sobre otros elementos
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[2000]"
      onClick={onClose}
    >
      <div
        className="flex flex-col justify-center items-center bg-darkblue border rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;

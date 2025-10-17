import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[2000]"
      onClick={onClose}
    >
      <div
        className="bg-darkblue border rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl text-white font-semibold text-center mb-4">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
};

export default Modal;

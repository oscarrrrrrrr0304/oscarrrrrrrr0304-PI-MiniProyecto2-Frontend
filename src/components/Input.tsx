import type { ChangeEvent } from "react";

/**
 * Props para el componente Input
 * @typedef {Object} InputProps
 * @property {string} type - Tipo de input HTML (text, email, password, number, etc.)
 * @property {string} id - ID único del input para asociar con el label
 * @property {string} label - Texto del label que se muestra encima del input
 * @property {string} placeholder - Texto placeholder del input
 * @property {string} [value] - Valor controlado del input
 * @property {Function} [onChange] - Callback que se ejecuta cuando cambia el valor del input
 * @property {boolean} [required] - Si el campo es requerido (default: false)
 */
interface InputProps {
  type: string;
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

/**
 * Componente de input reutilizable con label y estilos personalizados
 * Incluye estilos de borde azul con efecto focus
 * 
 * @component
 * @param {InputProps} props - Props del componente
 * @returns {JSX.Element} Input con label renderizado
 * 
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   id="user-email"
 *   label="Correo Electrónico"
 *   placeholder="tu@email.com"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   required
 * />
 * ```
 */
const Input: React.FC<InputProps> = ({
  type,
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="w-full h-fit flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-white">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="border-2 border-blue text-white bg-transparent rounded-sm h-10 p-2 focus:outline-none focus:border-lightblue"
      />
    </div>
  );
};

export default Input;

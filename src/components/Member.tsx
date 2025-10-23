/**
 * Props para el componente Member
 * @typedef {Object} MemberProps
 * @property {string} name - Nombre completo del miembro del equipo
 * @property {string} role - Rol o puesto en el equipo
 * @property {string} image - Ruta a la imagen de perfil
 */
interface MemberProps {
  name: string;
  role: string;
  image: string;
}

/**
 * Componente de tarjeta de miembro del equipo
 * Muestra foto, nombre y rol con efecto grayscale hover
 * 
 * @component
 * @param {MemberProps} props - Props del componente
 * @returns {JSX.Element} Tarjeta de miembro renderizada
 * 
 * @description
 * Características:
 * - Imagen de fondo con background-image
 * - Efecto grayscale por defecto
 * - Hover remueve grayscale y añade transición suave
 * - Responsive con ancho adaptativo
 * - Texto centrado con jerarquía visual
 * 
 * @example
 * ```tsx
 * <Member
 *   name="Jean Pierre Cardenas"
 *   role="Desarrollador Frontend"
 *   image="./images/team/jean.jpg"
 * />
 * ```
 */
const Member: React.FC<MemberProps> = ({ name, role, image }) => {
  return (
    <div className="member h-fit w-3/4 md:w-1/5 text-white/85 flex flex-col items-center gap-1 grayscale hover:grayscale-0 transition-all duration-300">
      <div
        className="picture w-full h-[320px] bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <h2 className="font-semibold text-xl text-center">{name}</h2>
      <h3 className="text-white/60 text-sm tracking-wider text-center">{role}</h3>
    </div>
  );
};

export default Member;

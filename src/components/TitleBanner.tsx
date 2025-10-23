/**
 * Props para el componente TitleBanner
 * @typedef {Object} TitleBannerProps
 * @property {string} title - Título a mostrar en el banner
 * @property {Function} [onViewMore] - Callback opcional que se ejecuta al hacer click en "Ver más"
 */
interface TitleBannerProps {
  title: string;
  onViewMore?: () => void;
}

/**
 * Banner de título con botón opcional "Ver más"
 * Se usa principalmente como encabezado de carruseles de videos
 * 
 * @component
 * @param {TitleBannerProps} props - Props del componente
 * @returns {JSX.Element} Banner de título renderizado
 * 
 * @example
 * ```tsx
 * // Con botón "Ver más"
 * <TitleBanner 
 *   title="Videos Populares" 
 *   onViewMore={() => navigate('/search?category=popular')}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Sin botón "Ver más"
 * <TitleBanner title="Mis Videos Favoritos" />
 * ```
 */
const TitleBanner: React.FC<TitleBannerProps> = ({ title, onViewMore }) => {
  return (
    <>
      <div className="w-full h-16 flex items-center justify-between bg-white/5 p-5 rounded-lg">
        <h2 className="font-semibold text-white text-xl md:text-3xl">{title}</h2>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="back-button flex text-white cursor-pointer gap-2 hover:text-green transition"
          >
            <p>Ver mas</p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l14 0" />
              <path d="M15 16l4 -4" />
              <path d="M15 8l4 4" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default TitleBanner;

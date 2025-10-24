import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "./VideoCard";
import TitleBanner from "./TitleBanner";
import type { PexelsVideo } from "../types/pexels.types";
import { pexelsService } from "../services/pexels.service";

/**
 * Props para el componente VideosCarousel
 * @typedef {Object} VideosCarouselProps
 * @property {string} title - Título del carrusel que se muestra en el TitleBanner
 * @property {string} [category] - Categoría de videos a buscar (ej: 'entertainment', 'travel')
 * @property {boolean} [isPopular] - Si es true, carga videos populares en lugar de buscar por categoría
 * @property {number} [perPage] - Cantidad de videos a cargar por página (default: 12)
 */
interface VideosCarouselProps {
  title: string;
  category?: string;
  isPopular?: boolean;
  perPage?: number;
}

/**
 * Componente de carrusel horizontal de videos
 * Muestra una lista de videos en formato carrusel con scroll horizontal
 * Incluye un banner de título con botón "Ver más" que navega a la página de búsqueda
 * 
 * @component
 * @param {VideosCarouselProps} props - Props del componente
 * @returns {JSX.Element} Carrusel de videos renderizado
 * 
 * @example
 * ```tsx
 * <VideosCarousel
 *   title="Videos Populares"
 *   isPopular={true}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <VideosCarousel
 *   title="Entretenimiento"
 *   category="entertainment"
 *   perPage={15}
 * />
 * ```
 */
const VideosCarousel: React.FC<VideosCarouselProps> = ({
  title,
  category,
  isPopular = false,
  perPage = 12,
}) => {
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Maneja el click en el botón "Ver más"
   * Navega a la página de búsqueda con la categoría correspondiente
   */
  const handleViewMore = () => {
    // Redirigir a SearchPage con la categoría
    if (category) {
      navigate(`/search?category=${encodeURIComponent(category)}`);
    } else if (isPopular) {
      navigate('/search?category=popular');
    }
  };

  /**
   * Carga los videos desde la API de Pexels
   * Usa getPopularVideos si isPopular es true, o searchVideos con la categoría
   * @async
   * @throws {Error} Si hay un error al cargar los videos
   */
  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (isPopular) {
        response = await pexelsService.getPopularVideos(1, perPage);
      } else if (category) {
        response = await pexelsService.searchVideos(category, 1, perPage);
      } else {
        throw new Error("Se requiere una categoría o marcar como popular");
      }

      setVideos(response.videos);
    } catch (err) {
      console.error(`Error al cargar videos de ${title}:`, err);
      setError("Error al cargar videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, isPopular]);

  return (
    <div className="videos-list w-full h-fit flex flex-col gap-5">
      {/* Title Banner */}
      <TitleBanner title={title} onViewMore={handleViewMore} />

      {/* Videos Container */}
      <div className="videos-container">
        {loading ? (
          <div className="text-white/70 text-lg py-8">
            Cargando videos de {title.toLowerCase()}...
          </div>
        ) : error ? (
          <div className="text-red text-lg py-8">
            <p>{error}</p>
            <button
              onClick={loadVideos}
              className="mt-4 px-4 py-2 bg-blue text-white text-sm rounded hover:bg-lightblue transition"
            >
              Reintentar
            </button>
          </div>
        ) : videos.length > 0 ? (
          <div
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#3b82f6 #1f2937",
            }}
          >
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
              />
            ))}
          </div>
        ) : (
          <div className="text-white/70 text-lg py-8">
            No se encontraron videos en esta categoría.
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosCarousel;

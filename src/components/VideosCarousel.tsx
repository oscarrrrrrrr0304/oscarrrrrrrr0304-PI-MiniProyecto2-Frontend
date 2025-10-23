import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "./VideoCard";
import TitleBanner from "./TitleBanner";
import type { PexelsVideo } from "../types/pexels.types";
import { pexelsService } from "../services/pexels.service";

interface VideosCarouselProps {
  title: string;
  category?: string;
  isPopular?: boolean;
  perPage?: number;
  onVideoClick: (video: PexelsVideo) => void;
}

const VideosCarousel: React.FC<VideosCarouselProps> = ({
  title,
  category,
  isPopular = false,
  perPage = 12,
  onVideoClick,
}) => {
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleViewMore = () => {
    // Redirigir a SearchPage con la categoría
    if (category) {
      navigate(`/search?category=${encodeURIComponent(category)}`);
    } else if (isPopular) {
      navigate('/search?category=popular');
    }
  };

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
                key={video.id}
                video={video}
                onVideoClick={onVideoClick}
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

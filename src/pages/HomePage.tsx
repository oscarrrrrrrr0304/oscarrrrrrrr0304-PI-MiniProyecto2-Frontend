import { useState } from "react";
import { Link } from "react-router-dom";
import VideosCarousel from "../components/VideosCarousel";
import VideoPlayerModal from "../components/VideoPlayerModal";
import type { PexelsVideo } from "../types/pexels.types";

const HomePage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<PexelsVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVideoClick = (video: PexelsVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // Categorías de videos
  const categories = [
    { title: "Videos Populares", isPopular: true },
    { title: "Entretenimiento", category: "entertainment" },
    { title: "Viajes", category: "travel" },
    { title: "Música", category: "music" },
    { title: "Moda", category: "fashion" },
    { title: "Videojuegos", category: "games" },
    { title: "Tecnología", category: "technology" },
    { title: "Deportes", category: "sports" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen mt-20 px-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col justify-center items-center my-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Explora Videos
        </h1>
        <p className="text-white/70 text-lg">
          Descubre contenido de todas las categorías
        </p>
      </div>

      {/* Carruseles de Categorías */}
      <div className="flex flex-col gap-12 mb-8">
        {categories.map((cat, index) => (
          <VideosCarousel
            key={index}
            title={cat.title}
            category={cat.category}
            isPopular={cat.isPopular}
            perPage={12}
            onVideoClick={handleVideoClick}
          />
        ))}
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-8">
            <Link
              to="/about"
              className="text-white hover:text-lightblue transition-colors text-lg"
            >
              Sobre Nosotros
            </Link>
            <span className="text-white/30">|</span>
            <Link
              to="/sitemap"
              className="text-white hover:text-lightblue transition-colors text-lg"
            >
              Mapa del Sitio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

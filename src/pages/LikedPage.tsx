/**
 * Página de videos con "Me Gusta"
 * Muestra los videos a los que el usuario ha dado "Me Gusta"
 * 
 * @module LikedPage
 */

import { useState, useEffect } from "react";
import useUserStore from "../stores/useUserStore";
import VideoCard from "../components/VideoCard";
import { pexelsService } from "../services/pexels.service";
import type { PexelsVideo } from "../types/pexels.types";

/**
 * Componente de la página de videos con "Me Gusta"
 * Muestra todos los videos a los que el usuario ha dado "Me Gusta"
 * 
 * @component
 * @returns {JSX.Element} Página de videos con "Me Gusta"
 * 
 * @description
 * Características:
 * - Carga los IDs de videos desde user.moviesLiked
 * - Obtiene la información completa de cada video del backend
 * - Muestra los videos en un grid responsive
 * - Maneja estados de carga y error
 * - Muestra mensaje si no hay videos con "Me Gusta"
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <Layout>
 *     <LikedPage />
 *   </Layout>
 * </ProtectedRoute>
 * ```
 */
const LikedPage: React.FC = () => {
  const { user } = useUserStore();
  const [likedVideos, setLikedVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga los videos con "Me Gusta" del usuario
   * Obtiene cada video por su ID desde el backend
   */
  useEffect(() => {
    const loadLikedVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar si el usuario tiene videos con "Me Gusta"
        if (!user?.moviesLiked || user.moviesLiked.length === 0) {
          setLikedVideos([]);
          setLoading(false);
          return;
        }

        console.log(`Cargando ${user.moviesLiked.length} videos con "Me Gusta"...`);

        // Cargar cada video por su ID
        const videoPromises = user.moviesLiked.map((videoId) =>
          pexelsService.getVideoById(videoId)
        );

        const videos = await Promise.all(videoPromises);
        setLikedVideos(videos);
        
        console.log(`✓ ${videos.length} videos con "Me Gusta" cargados exitosamente`);
      } catch (err) {
        console.error("Error al cargar videos con Me Gusta:", err);
        setError("No se pudieron cargar los videos");
      } finally {
        setLoading(false);
      }
    };

    loadLikedVideos();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col w-full min-h-screen mt-20 px-4 justify-center items-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-lightblue mb-4"></div>
        <p className="text-white text-xl">Cargando videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full min-h-screen mt-20 px-4 justify-center items-center">
        <svg
          className="mb-4"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 9v4" />
          <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
          <path d="M12 16h.01" />
        </svg>
        <p className="text-red text-xl">{error}</p>
      </div>
    );
  }

  if (likedVideos.length === 0) {
    return (
      <div className="flex flex-col w-full min-h-screen mt-20 px-4 justify-center items-center">
        <svg
          className="mb-4 text-white/40"
          width="96"
          height="96"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
        </svg>
        <h2 className="text-white text-3xl font-bold mb-2">
          Aún no tienes videos con "Me Gusta"
        </h2>
        <p className="text-white/70 text-lg text-center max-w-md">
          Explora videos y dales "Me Gusta" para verlos aquí
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen mt-20 px-4 pb-8">
      {/* Header */}
      <div className="flex flex-col justify-center items-center my-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Mis Me Gusta
        </h1>
        <p className="text-white/70 text-lg">
          {likedVideos.length} {likedVideos.length === 1 ? "video" : "videos"}
        </p>
      </div>

      {/* Grid de Videos */}
      <div className="flex flex-wrap gap-6 justify-center">
        {likedVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default LikedPage;
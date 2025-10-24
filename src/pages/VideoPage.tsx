/**
 * Página de reproducción de video
 * Muestra el reproductor, información del video y videos relacionados
 * 
 * @module VideoPage
 */

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideosCarousel from "../components/VideosCarousel";
import useUserStore from "../stores/useUserStore";
import { pexelsService } from "../services/pexels.service";
import type { PexelsVideo } from "../types/pexels.types";

/**
 * Componente de la página de reproducción de video
 * Layout de 2 columnas con reproductor, info, sistema de likes y videos relacionados
 * 
 * @component
 * @returns {JSX.Element} Página de reproducción de video
 * 
 * @description
 * Estructura del layout:
 * ```
 * ----------------------------
 * | reproductor | info video |
 * |             | estadísticas|
 * |             | botón like  |
 * | comentarios (sprint futuro) |
 * | videos relacionados        |
 * ----------------------------
 * ```
 * 
 * Características:
 * - Reproductor de video HTML5 con controles
 * - Información del video (autor, duración, dimensiones)
 * - Sistema de "Me Gusta" con toggle (agregar/quitar)
 * - Sincronización con estado global de favoritos
 * - Actualización en tiempo real del contador de likes
 * - Carrusel de videos relacionados basado en tags
 * - Layout responsive (columna en móvil, 2 columnas en desktop)
 * - Navegación desde VideoCard usando _id (MongoDB)
 * - Comentarios planeados para futuro sprint
 * 
 * Estados gestionados:
 * - video: Información completa del video actual
 * - loading: Estado de carga del video
 * - error: Mensaje de error si falla la carga
 * - isLiking: Indica si se está procesando un like/unlike
 * - hasLiked: Indica si el usuario ya dio like al video
 * 
 * @example
 * ```tsx
 * // Navegación desde VideoCard
 * navigate(`/video/${video._id}`)
 * 
 * // Uso en App.tsx
 * <ProtectedRoute>
 *   <Layout>
 *     <VideoPage />
 *   </Layout>
 * </ProtectedRoute>
 * ```
 */
const VideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user, updateMoviesLiked } = useUserStore();
  
  const [video, setVideo] = useState<PexelsVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedTag, setRelatedTag] = useState<string>("");
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  /**
   * Effect: Carga el video cuando cambia el videoId
   * Extrae un tag para mostrar videos relacionados
   * Verifica si el usuario ya dio like a este video
   */
  useEffect(() => {
    if (videoId) {
      loadVideo(videoId);
    }
    
    // Scroll al inicio al cargar la página
    window.scrollTo(0, 0);
  }, [videoId]);
  
  /**
   * Effect: Actualiza el estado del like cuando cambia moviesLiked
   * Se ejecuta separadamente para evitar recargar el video
   */
  useEffect(() => {
    if (videoId && user?.moviesLiked) {
      setHasLiked(user.moviesLiked.includes(videoId));
    }
  }, [videoId, user?.moviesLiked]);

  /**
   * Carga el video desde la API de Pexels
   * Extrae el primer tag del video para relacionados
   * 
   * @async
   * @param {number} id - ID del video de Pexels
   */
  const loadVideo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const videoData = await pexelsService.getVideoById(id);
      setVideo(videoData);
      
      // Extraer un tag para videos relacionados
      // Como Pexels no tiene tags directos, usaremos el URL para extraer una palabra clave
      if (videoData.url) {
        const urlParts = videoData.url.split('/').filter(part => part.length > 0);
        const potentialTag = urlParts[urlParts.length - 1] || "popular";
        setRelatedTag(potentialTag);
      } else {
        // Si no hay URL, usar "popular" como tag por defecto
        setRelatedTag("popular");
      }
      
    } catch (err) {
      console.error("Error al cargar video:", err);
      setError("No se pudo cargar el video");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el botón de volver
   * Navega a la página anterior en el historial
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  /**
   * Maneja dar/quitar "me gusta" al video (toggle)
   * El backend maneja automáticamente si agregar o quitar
   * Actualiza el contador de likes en tiempo real
   * Sincroniza el array moviesLiked con el store global
   * 
   * @async
   */
  const handleToggleLike = async () => {
    if (!videoId || isLiking || !user) return;

    try {
      setIsLiking(true);
      
      console.log('Toggle like para video:', videoId, 'Estado actual:', hasLiked ? 'CON like' : 'SIN like');
      
      // El backend hace toggle automáticamente con POST
      const result = await pexelsService.toggleLikeVideo(videoId);
      
      console.log('Respuesta del backend:', result);
      
      // Actualizar estado local del botón inmediatamente
      setHasLiked(result.liked);
      
      // Actualizar el contador de likes en el video
      if (video) {
        setVideo({
          ...video,
          likesCount: result.likesCount
        });
      }
      
      // Actualizar el array moviesLiked en el store global (sin causar re-render del video)
      const updatedMoviesLiked = result.liked
        ? [...(user.moviesLiked || []), videoId] // Agregar
        : (user.moviesLiked || []).filter(id => id !== videoId); // Quitar
      
      updateMoviesLiked(updatedMoviesLiked);
      
      console.log('✓ Like actualizado -', result.liked ? 'AGREGADO' : 'QUITADO');
      console.log('Nuevo total de favoritos:', updatedMoviesLiked.length);
      
    } catch (err) {
      console.error("Error completo al dar/quitar like:", err);
      console.error("Tipo de error:", typeof err);
      console.error("Mensaje de error:", err instanceof Error ? err.message : String(err));
      alert(`Error: ${err instanceof Error ? err.message : 'No se pudo procesar la acción'}`);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Cargando video...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-red text-xl">{error || "Video no encontrado"}</div>
        <button
          onClick={handleGoBack}
          className="px-6 py-2 bg-blue text-white rounded hover:bg-lightblue transition"
        >
          Volver
        </button>
      </div>
    );
  }

  // Debug: Ver qué contiene el video
  console.log('Video completo en VideoPage:', video);
  console.log('video_files:', video.video_files);

  const videoUrl = pexelsService.getVideoHDUrl(video);
  console.log('URL del video obtenida:', videoUrl);

  return (
    <div className="flex flex-col w-full min-h-screen mt-20 px-4 pb-8">
      {/* Layout Principal: Reproductor + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
        {/* Columna Izquierda: Reproductor (2/3 en desktop) */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg overflow-hidden">
            {videoUrl ? (
              <video
                ref={videoRef}
                className="w-full aspect-video"
                controls
                autoPlay
                src={videoUrl}
              >
                Tu navegador no soporta el elemento de video.
              </video>
            ) : (
              <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-800 text-white">
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
                  <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
                  <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                </svg>
                <p className="text-xl mb-2">Video no disponible</p>
                <p className="text-sm text-white/60 max-w-md text-center px-4">
                  El archivo de video no está disponible. El backend necesita incluir los enlaces de video_files.
                </p>
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 px-6 py-2 bg-blue text-white rounded hover:bg-lightblue transition"
                >
                  Ver en Pexels
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Información del Video (1/3 en desktop) */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Información del Video</h2>
            
            {/* Autor */}
            <div className="mb-4">
              <p className="text-white/60 text-sm">Autor</p>
              <a 
                href={video.user.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lightblue hover:underline text-lg"
              >
                {video.user.name}
              </a>
            </div>

            {/* Duración */}
            <div className="mb-4">
              <p className="text-white/60 text-sm">Duración</p>
              <div className="flex items-center gap-2 text-white">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                  <path d="M12 7v5l3 3" />
                </svg>
                <span>{video.duration} segundos</span>
              </div>
            </div>

            {/* Resolución */}
            <div className="mb-4">
              <p className="text-white/60 text-sm">Resolución</p>
              <p className="text-white">{video.width} x {video.height}px</p>
            </div>

            {/* Estadísticas */}
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                    </svg>
                    <span>Rating</span>
                  </div>
                  <span className="text-white font-semibold">4.5/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                    <span>Me gusta</span>
                  </div>
                  <span className="text-white font-semibold">{video.likesCount || 0}</span>
                </div>
              </div>
              
              {/* Botón de Me Gusta (Toggle) */}
              <button
                onClick={handleToggleLike}
                disabled={isLiking}
                className={`w-full mt-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  hasLiked
                    ? 'bg-red hover:bg-red-700 text-white'
                    : 'bg-blue hover:bg-lightblue text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={hasLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
                {isLiking ? 'Procesando...' : hasLiked ? 'Quitar de Me Gusta' : 'Agregar a Me Gusta'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Comentarios (Placeholder para futuro sprint) */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Comentarios</h2>
        <div className="text-white/60 text-center py-8">
          <svg
            className="mx-auto mb-3"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
            <path d="M12 12l0 .01" />
            <path d="M8 12l0 .01" />
            <path d="M16 12l0 .01" />
          </svg>
          <p>Los comentarios aun no están disponibles</p>
        </div>
      </div>

      {/* Sección de Videos Relacionados */}
        <VideosCarousel
          title="Videos similares"
          category={relatedTag}
          perPage={12}
        />
    </div>
  );
};

export default VideoPage;

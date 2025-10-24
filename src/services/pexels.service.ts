/**
 * Servicio para interactuar con la API del backend para obtener videos
 * El backend se encarga de comunicarse con Pexels
 */

import type {
  PexelsVideo,
  PexelsVideoSearchResponse,
  PexelsPopularVideosResponse,
} from "../types/pexels.types";

// URL del backend
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || "https://oscarrrrrrrr0304-pi-miniproyecto2-backend.onrender.com/api";

/**
 * Headers comunes para todas las peticiones al backend
 */
const getBackendHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Servicio de Pexels para videos
 */
export const pexelsService = {
  /**
   * Obtener un video específico por ID desde el backend
   * @param id - ID del video en Pexels
   * @returns Video de Pexels
   */
  async getVideoById(id: string): Promise<PexelsVideo> {
    const response = await fetch(`${BACKEND_API_URL}/videos/${id}`, {
      headers: getBackendHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener video: ${response.statusText}`);
    }

    const data = await response.json();
    // El backend devuelve { video: {...} }
    return data.video;
  },

  /**
   * Buscar videos por query (por ahora usa videos populares del backend)
   * @param query - Término de búsqueda (no se usa por ahora)
   * @param page - Número de página (default: 1)
   * @param perPage - Videos por página (default: 15, max: 80)
   * @returns Respuesta con lista de videos
   */
  async searchVideos(
    query: string,
    page: number = 1,
    perPage: number = 15
  ): Promise<PexelsVideoSearchResponse> {
    // Mantener parámetros para compatibilidad aunque no se usen por ahora
    console.log(`Búsqueda solicitada: "${query}", página: ${page}`);
    
    // Por ahora usamos el endpoint de videos populares
    // TODO: Cuando el backend implemente búsqueda, actualizar este método
    const response = await fetch(
      `${BACKEND_API_URL}/videos/popular?limit=${perPage}`,
      {
        headers: getBackendHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al buscar videos: ${response.statusText}`);
    }

    const data = await response.json();
    
    // El backend podría devolver { videos: [...] } o directamente el array
    if (data.videos && Array.isArray(data.videos)) {
      return {
        page: 1,
        per_page: perPage,
        total_results: data.videos.length,
        url: "",
        videos: data.videos
      };
    }
    
    return data;
  },

  /**
   * Obtener videos populares desde el backend
   * @param page - Número de página (default: 1) - no se usa por ahora
   * @param perPage - Videos por página (default: 15, max: 80)
   * @returns Respuesta con lista de videos populares
   */
  async getPopularVideos(
    page: number = 1,
    perPage: number = 15
  ): Promise<PexelsPopularVideosResponse> {
    // Mantener parámetro page para compatibilidad aunque no se use por ahora
    console.log(`Página solicitada: ${page}`);
    
    const response = await fetch(
      `${BACKEND_API_URL}/videos/popular?limit=${perPage}`,
      {
        headers: getBackendHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener videos populares: ${response.statusText}`);
    }

    const data = await response.json();
    
    // El backend podría devolver { videos: [...] } o directamente el array
    // Ajustamos según la estructura real del backend
    if (data.videos && Array.isArray(data.videos)) {
      return {
        page: 1,
        per_page: perPage,
        total_results: data.videos.length,
        url: "",
        videos: data.videos
      };
    }
    
    // Si ya es el formato esperado, devolverlo tal cual
    return data;
  },

  /**
   * Obtener la URL del video en calidad HD
   * @param video - Video de Pexels
   * @returns URL del video HD o el primero disponible
   */
  getVideoHDUrl(video: PexelsVideo): string {
    // Verificar si existen archivos de video
    if (!video.video_files || video.video_files.length === 0) {
      return "";
    }

    // Buscar video en calidad HD
    const hdVideo = video.video_files.find((file) => file.quality === "hd");
    if (hdVideo) return hdVideo.link;

    // Si no hay HD, retornar el primer video disponible
    return video.video_files[0]?.link || "";
  },

  /**
   * Obtener la URL del video en calidad SD
   * @param video - Video de Pexels
   * @returns URL del video SD o el primero disponible
   */
  getVideoSDUrl(video: PexelsVideo): string {
    // Verificar si existen archivos de video
    if (!video.video_files || video.video_files.length === 0) {
      return "";
    }

    // Buscar video en calidad SD
    const sdVideo = video.video_files.find((file) => file.quality === "sd");
    if (sdVideo) return sdVideo.link;

    // Si no hay SD, retornar el primer video disponible
    return video.video_files[0]?.link || "";
  },

  /**
   * Dar/quitar "me gusta" a un video (toggle)
   * El backend detecta automáticamente si agregar o quitar el like
   * Si el usuario ya dio like, lo quita. Si no, lo agrega.
   * @async
   * @param {string} videoId - ID del video
   * @returns {Promise<{message: string, likesCount: number, liked: boolean}>} Confirmación, conteo y estado del like
   * @throws {Error} Si el usuario no está autenticado o hay error en el servidor
   * @example
   * const result = await pexelsService.toggleLikeVideo('507f1f77bcf86cd799439011');
   * console.log(result.liked); // true o false
   * console.log(result.likesCount); // 42
   */
  async toggleLikeVideo(videoId: string): Promise<{ message: string; likesCount: number; liked: boolean }> {
    const response = await fetch(
      `${BACKEND_API_URL}/videos/${videoId}/like`,
      {
        method: "POST",
        headers: getBackendHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del backend al dar/quitar like:', errorText);
      throw new Error(`Error al procesar like (${response.status}): ${errorText}`);
    }

    return response.json();
  },
};

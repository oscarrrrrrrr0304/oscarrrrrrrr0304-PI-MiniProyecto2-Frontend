/**
 * Servicio para interactuar con la API de Pexels
 * Documentación: https://www.pexels.com/api/documentation/?language=javascript#videos
 */

import type {
  PexelsVideo,
  PexelsVideoSearchResponse,
  PexelsPopularVideosResponse,
} from "../types/pexels.types";

// API Key de Pexels - debe configurarse en .env
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || "";
const PEXELS_API_URL = "https://api.pexels.com";

/**
 * Headers comunes para todas las peticiones a Pexels
 */
const getPexelsHeaders = () => ({
  Authorization: PEXELS_API_KEY,
});

/**
 * Servicio de Pexels para videos
 */
export const pexelsService = {
  /**
   * Obtener un video específico por ID
   * @param id - ID del video en Pexels
   * @returns Video de Pexels
   */
  async getVideoById(id: number): Promise<PexelsVideo> {
    const response = await fetch(`${PEXELS_API_URL}/videos/videos/${id}`, {
      headers: getPexelsHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener video: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Buscar videos por query
   * @param query - Término de búsqueda
   * @param page - Número de página (default: 1)
   * @param perPage - Videos por página (default: 15, max: 80)
   * @returns Respuesta con lista de videos
   */
  async searchVideos(
    query: string,
    page: number = 1,
    perPage: number = 15
  ): Promise<PexelsVideoSearchResponse> {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `${PEXELS_API_URL}/videos/search?${params}`,
      {
        headers: getPexelsHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al buscar videos: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obtener videos populares
   * @param page - Número de página (default: 1)
   * @param perPage - Videos por página (default: 15, max: 80)
   * @returns Respuesta con lista de videos populares
   */
  async getPopularVideos(
    page: number = 1,
    perPage: number = 15
  ): Promise<PexelsPopularVideosResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `${PEXELS_API_URL}/videos/popular?${params}`,
      {
        headers: getPexelsHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener videos populares: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obtener la URL del video en calidad HD
   * @param video - Video de Pexels
   * @returns URL del video HD o el primero disponible
   */
  getVideoHDUrl(video: PexelsVideo): string {
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
    // Buscar video en calidad SD
    const sdVideo = video.video_files.find((file) => file.quality === "sd");
    if (sdVideo) return sdVideo.link;

    // Si no hay SD, retornar el primer video disponible
    return video.video_files[0]?.link || "";
  },
};

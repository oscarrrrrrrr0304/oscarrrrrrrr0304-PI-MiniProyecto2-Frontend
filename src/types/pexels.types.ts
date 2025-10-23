/**
 * Tipos de TypeScript para la API de Pexels
 * Basado en la documentación: https://www.pexels.com/api/documentation/?language=javascript#videos
 */

/**
 * Información del usuario que subió el video
 */
export interface PexelsUser {
  id: number;
  name: string;
  url: string;
}

/**
 * Archivo de video en diferentes calidades
 */
export interface VideoFile {
  id: number;
  quality: "hd" | "sd" | "hls";
  file_type: string;
  width: number | null;
  height: number | null;
  link: string;
}

/**
 * Imágenes de preview del video
 */
export interface VideoPicture {
  id: number;
  picture: string;
  nr: number;
}

/**
 * Estructura completa de un video de Pexels
 */
export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: PexelsUser;
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
}

/**
 * Respuesta de búsqueda de videos
 */
export interface PexelsVideoSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: PexelsVideo[];
}

/**
 * Respuesta de videos populares
 */
export interface PexelsPopularVideosResponse {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: PexelsVideo[];
}

/**
 * Tipos de TypeScript para la API de Pexels
 * Basado en la documentación: https://www.pexels.com/api/documentation/?language=javascript#videos
 */

/**
 * Información del usuario que subió el video
 */
export interface PexelsUser {
  _id: string;
  name: string;
  url: string;
}

/**
 * Archivo de video en diferentes calidades
 */
export interface VideoFile {
  _id: string;
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
  _id: string;
  picture: string;
  nr: number;
}

/**
 * Estructura completa de un video de Pexels
 */
export interface PexelsVideo {
  _id: string;
  pexelsId?: number; // ID original de Pexels
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: PexelsUser;
  video_files?: VideoFile[]; // Opcional porque el backend podría no enviarlo
  video_pictures?: VideoPicture[]; // Opcional porque el backend podría no enviarlo
  likesCount?: number; // Contador de likes del backend
  createdAt?: string; // Fecha de creación en el backend
  updatedAt?: string; // Fecha de actualización en el backend
  __v?: number; // Versión de MongoDB
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

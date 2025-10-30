/**
 * TypeScript types for Pexels API
 * Based on documentation: https://www.pexels.com/api/documentation/?language=javascript#videos
 */

/**
 * Information about the user who uploaded the video
 */
export interface PexelsUser {
  _id: string;
  name: string;
  url: string;
}

/**
 * Video file in different qualities
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
 * Video preview images
 */
export interface VideoPicture {
  _id: string;
  picture: string;
  nr: number;
}

/**
 * Complete structure of a Pexels video
 */
export interface PexelsVideo {
  _id: string;
  pexelsId?: number; // Original Pexels ID
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: PexelsUser;
  video_files?: VideoFile[]; // Optional because backend might not send it
  video_pictures?: VideoPicture[]; // Optional because backend might not send it
  likesCount?: number; // Backend likes counter
  averageRating?: number; // Average rating (1-5)
  totalRatings?: number; // Total number of ratings
  createdAt?: string; // Creation date in backend
  updatedAt?: string; // Update date in backend
  __v?: number; // MongoDB version
}

/**
 * Video search response
 */
export interface PexelsVideoSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: PexelsVideo[];
}

/**
 * Popular videos response
 */
export interface PexelsPopularVideosResponse {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: PexelsVideo[];
}

/**
 * Comment user information
 */
export interface CommentUser {
  _id: string;
  name: string;
  email: string;
}

/**
 * Video comment structure
 */
export interface Comment {
  _id: string;
  userId: string; // ObjectId of the user who posted
  userName: string; // Name of the user
  text: string;
  createdAt: string;
  updatedAt?: string;
  // Optional: for backward compatibility if backend adds user object
  user?: CommentUser;
}

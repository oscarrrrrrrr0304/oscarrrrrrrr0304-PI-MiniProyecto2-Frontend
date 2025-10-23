import { useEffect, useRef } from "react";
import type { PexelsVideo } from "../types/pexels.types";
import { pexelsService } from "../services/pexels.service";

interface VideoPlayerModalProps {
  video: PexelsVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  isOpen,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Prevenir scroll del body cuando el modal está abierto
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    // Pausar el video cuando se cierra el modal
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen || !video) return null;

  const videoUrl = pexelsService.getVideoHDUrl(video);

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Video de Relajación
            </h2>
            <p className="text-sm text-gray-400">
              Por {video.user.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-red transition"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Player */}
        <div className="p-4">
          <video
            ref={videoRef}
            className="w-full rounded-lg"
            controls
            autoPlay
            src={videoUrl}
          >
            Tu navegador no soporta el elemento de video.
          </video>
        </div>

        {/* Info */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-4 text-white/70">
            <div className="flex items-center gap-2">
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
              <span>{video.duration}s</span>
            </div>
            <div className="flex items-center gap-2">
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
                <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
                <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
              </svg>
              <span>
                {video.width} x {video.height}
              </span>
            </div>
          </div>

          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-lightblue hover:text-blue transition"
          >
            Ver en Pexels →
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;

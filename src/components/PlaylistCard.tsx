import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  ExternalLink,
  Edit,
  Trash,
  X,
  AlertCircle,
} from "lucide-react";
import { PlaylistProps } from "../types";
import { useTheaterMode } from "../hooks/useTheaterMode";
import { useMediaLoader } from "../hooks/useMediaLoader";

export const PlaylistCard = ({
  id,
  title,
  language,
  category,
  onEdit,
  onDelete,
}: PlaylistProps & { onEdit?: () => void; onDelete?: () => void }) => {
  // استخدام الخطافات المشتركة
  const {
    isTheaterMode,
    enableTheaterMode,
    disableTheaterMode,
    theaterVariants,
  } = useTheaterMode();
  const { loadError, handleLoadError } = useMediaLoader(id);

  const playlistEmbedUrl = `https://www.youtube.com/embed/videoseries?list=${id}`;
  const playlistUrl = `https://www.youtube.com/playlist?list=${id}`;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -10,
      boxShadow:
        "0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08)",
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <>
      <motion.div
        className="playlist-card rounded-xl overflow-hidden bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl h-full flex flex-col"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        layout
      >
        <div className="relative pb-[56.25%] h-0 rounded-t-lg overflow-hidden">
          {loadError ? (
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
              <p className="text-red-500 font-medium">
                فشل تحميل قائمة التشغيل
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                قد تكون قائمة التشغيل غير متاحة أو تم حذفها
              </p>
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-blue-500 hover:underline text-sm"
              >
                حاول فتحها على يوتيوب مباشرة
              </a>
            </div>
          ) : (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={playlistEmbedUrl}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
              loading="lazy"
              onError={handleLoadError}
            />
          )}
        </div>

        {/* Card Footer */}
        <div className="px-4 pb-4 pt-2 flex flex-col flex-grow">
          <h2 className="text-lg font-bold line-clamp-1 mb-1 text-gray-900 dark:text-white">
            {title}
          </h2>

          {category && (
            <div className="mb-2">
              <span className="text-xs font-medium px-2 py-0.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full text-gray-700 dark:text-gray-300">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              {language && (
                <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full text-gray-700 dark:text-gray-300">
                  {language}
                </span>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-auto">
            <div className="flex space-x-2">
              <motion.button
                onClick={enableTheaterMode}
                className="flex items-center justify-center gap-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-2 rounded-md text-sm font-medium transition-colors"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label="Theater mode"
                title="Theater mode"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Theater</span>
              </motion.button>
              <motion.a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 bg-gradient-to-r from-button-start to-button-end hover:opacity-90 text-white py-1 px-2 rounded-md text-sm font-medium"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Watch</span>
              </motion.a>
            </div>

            <div className="flex items-center space-x-2">
              {onEdit && (
                <motion.button
                  onClick={onEdit}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Edit playlist"
                  title="Edit playlist"
                >
                  <Edit className="w-5 h-5" />
                </motion.button>
              )}
              {onDelete && (
                <motion.button
                  onClick={onDelete}
                  className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Delete playlist"
                  title="Delete playlist"
                >
                  <Trash className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Theater Mode Overlay */}
      <AnimatePresence>
        {isTheaterMode && (
          <motion.div
            className="fixed inset-0 bg-black z-[9999] flex flex-col"
            variants={theaterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="w-full h-full flex flex-col">
              {/* Top bar similar to YouTube */}
              <div className="flex justify-between items-center bg-[#0f0f0f] py-3 px-4 md:px-6 border-b border-[#272727]">
                <h2 className="text-white font-bold truncate max-w-[70%] text-base">
                  {title}
                </h2>
                <button
                  onClick={disableTheaterMode}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  aria-label="Close theater mode"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Playlist container with YouTube-like aspect ratio */}
              <div className="flex-grow bg-black relative w-full flex items-center justify-center overflow-hidden">
                <div className="w-full h-full max-h-[min(calc(100vh-140px),calc(100vw*9/16))] relative">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`${playlistEmbedUrl}&autoplay=1`}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    loading="eager"
                    onError={handleLoadError}
                  />
                </div>
              </div>

              {/* Bottom controls */}
              <div className="bg-[#0f0f0f] p-4 md:px-6 md:py-4 border-t border-[#272727]">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {title}
                    </h3>
                    <motion.button
                      onClick={disableTheaterMode}
                      className="flex items-center justify-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-white py-2 px-4 rounded-lg font-medium transition-colors"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Minimize2 className="w-5 h-5" />
                      <span className="hidden md:inline">
                        Exit Theater Mode
                      </span>
                      <span className="inline md:hidden">Exit</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

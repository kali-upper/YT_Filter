/// <reference path="../types/youtube.d.ts" />

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoCardProps } from "../types";
import { Maximize2, Minimize2, PlayCircle, AlertCircle } from "lucide-react";
import { useTheaterMode } from "../hooks/useTheaterMode";
import { useMediaLoader } from "../hooks/useMediaLoader";
import { useYouTubeApi } from "../contexts/YouTubeApiContext";

export const VideoCard = ({
  id,
  title,
  language,
  category,
  listId,
  listType,
  onEdit,
  onDelete,
}: VideoCardProps & { onEdit?: () => void; onDelete?: () => void }) => {
  // console.log("[VideoCard] Props received:", { id, title, listId, listType });

  const { isYouTubeApiReady } = useYouTubeApi();

  const playerRef = useRef<YT.Player | null>(null);
  const playbackTimeRef = useRef<number>(0);
  const playerStateRef = useRef<number | null>(null);
  const playlistIdRef = useRef<string | null | undefined>(listId);
  const playlistTypeRef = useRef<string | null | undefined>(listType);
  const playlistIndexRef = useRef<number>(0);
  const playerContainerId = `youtube-player-${id}`;
  const theaterPlayerContainerId = `youtube-player-theater-${id}`;

  // استخدام الخطافات المشتركة
  const {
    isTheaterMode,
    enableTheaterMode,
    disableTheaterMode,
    theaterVariants,
  } = useTheaterMode();
  const { loadError, handleLoadError } = useMediaLoader(id);

  const videoUrl = `https://www.youtube.com/watch?v=${id}`;

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

  // useEffect to initialize and manage the YouTube player
  useEffect(() => {
    // Guard: Only run if API is ready AND there is no current loadError for this video.
    if (!isYouTubeApiReady || loadError) {
      // If there's a load error, ensure we clean up any existing player if one was somehow there.
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
        console.log(
          "[VideoCard] Player destroyed due to loadError or API not ready."
        );
      }
      return;
    }

    console.log(
      "[VideoCard] YouTube API is ready and no load error. id:",
      id,
      "isTheaterMode:",
      isTheaterMode,
      "playerContainerId:",
      playerContainerId
    ); // EXPANDED LOG

    const createPlayer = (containerId: string) => {
      console.log(
        `[VideoCard] createPlayer called for container: ${containerId}`
      );
      const targetElement = document.getElementById(containerId);
      console.log(
        `[VideoCard] Target element for player (${containerId}):`,
        targetElement
      ); // Log: Target div presence
      if (!targetElement) {
        console.error(
          `[VideoCard] Target element ${containerId} not found in DOM!`
        );
        return;
      }

      // Destroy existing player if it's on a different container or if it's the theater player
      if (
        playerRef.current &&
        (playerRef.current.getIframe().id !== containerId ||
          containerId === theaterPlayerContainerId)
      ) {
        // Before destroying, if it's the main player, save its state for theater mode
        if (playerRef.current.getIframe().id === playerContainerId) {
          playbackTimeRef.current = playerRef.current.getCurrentTime();
          playerStateRef.current = playerRef.current.getPlayerState();
        }
        playerRef.current.destroy();
        playerRef.current = null;
      }

      // Only create a new player if one doesn't exist or if the target container has changed
      if (
        !playerRef.current ||
        playerRef.current.getIframe().id !== containerId
      ) {
        const currentPlayerVars: YT.PlayerVars = {
          autoplay:
            playerStateRef.current === YT.PlayerState.PLAYING ||
            (containerId === theaterPlayerContainerId &&
              playbackTimeRef.current > 0)
              ? 1
              : 0,
          controls: 1,
          start: Math.floor(playbackTimeRef.current),
          fs: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
        };

        if (playlistIdRef.current) {
          currentPlayerVars.listType = playlistTypeRef.current || "playlist";
          currentPlayerVars.list = playlistIdRef.current;
          // If we have a specific video ID (current card's ID) and playlist,
          // YT API usually handles playing that video in context.
          // Setting index explicitly can also be done if needed for more control,
          // especially if playlistIndexRef.current is reliably updated.
          if (playlistIndexRef.current >= 0) {
            currentPlayerVars.index = playlistIndexRef.current;
          }
        }

        playerRef.current = new YT.Player(containerId, {
          videoId: id,
          playerVars: currentPlayerVars,
          events: {
            onReady: (event) => {
              console.log(
                "[VideoCard] YT.Player onReady event fired for target:",
                event.target.getIframe().id
              ); // Log: Player onReady
              if (playbackTimeRef.current > 0) {
                event.target.seekTo(playbackTimeRef.current, true);
                if (playerStateRef.current === YT.PlayerState.PLAYING) {
                  event.target.playVideo();
                } else if (playerStateRef.current === YT.PlayerState.PAUSED) {
                  event.target.pauseVideo();
                }
              }
              // If this is the theater player, and it's just been created ensure it plays if main was playing
              if (
                containerId === theaterPlayerContainerId &&
                playerStateRef.current === YT.PlayerState.PLAYING
              ) {
                event.target.playVideo();
              }
            },
            // Add other event handlers if needed, e.g., onStateChange
            onError: (event) => {
              console.error(
                "[VideoCard] YT.Player onError event fired:",
                event.data,
                "for target:",
                event.target.getIframe().id
              ); // Log: Player onError
              if (
                event.data === 2 || // Invalid parameter
                event.data === 5 || // HTML5 player error
                event.data === 100 || // Video not found
                event.data === 101 || // Video not allowed to be embedded
                event.data === 150 // Same as 101
              ) {
                handleLoadError();
              }
            },
          },
        });
        console.log(
          `[VideoCard] YT.Player instance created for ${containerId}:`,
          playerRef.current
        );
      }
    };

    if (isTheaterMode) {
      createPlayer(theaterPlayerContainerId);
    } else {
      // When exiting theater mode, re-initialize the main player.
      // The playback time should be the one from the theater player or last known main player time.
      createPlayer(playerContainerId);
    }

    // Cleanup function for when the component unmounts or dependencies change
    return () => {
      if (playerRef.current) {
        // console.log("Destroying player on unmount/cleanup:", playerRef.current.getIframe().id);
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [
    isYouTubeApiReady,
    id,
    listId,
    listType,
    isTheaterMode,
    handleLoadError,
    loadError,
    playerContainerId,
    theaterPlayerContainerId,
  ]);

  // Effect to update playlist refs if props change
  useEffect(() => {
    // If the listId prop has changed from what the ref currently holds (or from undefined),
    // it implies a new playlist context, so reset the index.
    if (listId !== playlistIdRef.current) {
      playlistIndexRef.current = 0;
    }
    playlistIdRef.current = listId;
    playlistTypeRef.current = listType;
  }, [listId, listType]);

  const localEnableTheaterMode = () => {
    if (playerRef.current && playerRef.current.getCurrentTime) {
      playbackTimeRef.current = playerRef.current.getCurrentTime();
      playerStateRef.current = playerRef.current.getPlayerState();

      const currentPlaylistId = playerRef.current.getPlaylistId();
      if (currentPlaylistId) {
        playlistIdRef.current = currentPlaylistId;
        playlistIndexRef.current = playerRef.current.getPlaylistIndex();
        // playlistTypeRef is usually set from props, but if API provides it, could update here.
      } else {
        // If not in a playlist, clear refs or ensure they reflect the prop (which might be undefined)
        playlistIdRef.current = listId; // Re-evaluate based on incoming prop
        playlistTypeRef.current = listType;
        playlistIndexRef.current = 0;
      }

      if (playerRef.current.getIframe().id === playerContainerId) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    }
    enableTheaterMode(); // Call hook's function
  };

  const localDisableTheaterMode = () => {
    if (playerRef.current && playerRef.current.getCurrentTime) {
      playbackTimeRef.current = playerRef.current.getCurrentTime();
      playerStateRef.current = playerRef.current.getPlayerState();

      const currentPlaylistId = playerRef.current.getPlaylistId();
      if (currentPlaylistId) {
        playlistIdRef.current = currentPlaylistId;
        playlistIndexRef.current = playerRef.current.getPlaylistIndex();
      } else {
        playlistIdRef.current = listId;
        playlistTypeRef.current = listType;
        playlistIndexRef.current = 0;
      }

      if (playerRef.current.getIframe().id === theaterPlayerContainerId) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    }
    disableTheaterMode(); // Call hook's function
  };

  return (
    <>
      <motion.div
        className="video-card rounded-xl overflow-hidden bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl h-full flex flex-col"
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
              <p className="text-red-500 font-medium">فشل تحميل الفيديو</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                قد يكون الفيديو غير متاح أو تم حذفه
              </p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-blue-500 hover:underline text-sm"
              >
                حاول فتحه على يوتيوب مباشرة
              </a>
            </div>
          ) : (
            <div
              id={playerContainerId}
              className="absolute top-0 left-0 w-full h-full"
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
                onClick={localEnableTheaterMode}
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
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 bg-gradient-to-r from-button-start to-button-end hover:opacity-90 text-white py-1 px-2 rounded-md text-sm font-medium"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <PlayCircle className="w-4 h-4" />
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
                  aria-label="Edit video"
                  title="Edit video"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </motion.button>
              )}
              {onDelete && (
                <motion.button
                  onClick={onDelete}
                  className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Delete video"
                  title="Delete video"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
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
              {/* Top bar similar to YouTube (original) */}
              <div className="flex justify-between items-center bg-[#0f0f0f] py-3 px-4 md:px-6 border-b border-[#272727]">
                <h2 className="text-white font-bold truncate max-w-[70%] text-base">
                  {title}
                </h2>
                <button
                  onClick={localDisableTheaterMode}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  aria-label="Close theater mode"
                >
                  <Minimize2 size={20} />
                </button>
              </div>

              {/* Video container with YouTube-like aspect ratio (original) */}
              <div className="flex-grow bg-black relative w-full flex items-center justify-center overflow-hidden">
                <div className="w-full h-full max-h-[min(calc(100vh-140px),calc(100vw*9/16))] relative">
                  <div
                    id={theaterPlayerContainerId}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Bottom controls (original) */}
              <div className="bg-[#0f0f0f] p-4 md:px-6 md:py-4 border-t border-[#272727]">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {title}
                    </h3>
                    <motion.button
                      onClick={localDisableTheaterMode}
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

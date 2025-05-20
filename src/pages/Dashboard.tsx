import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Plus,
  Save,
  YoutubeIcon,
  List,
  Trash,
  Check,
  Edit,
  Film,
  BookOpen,
  Heart,
  Code,
  Home,
  Eye,
} from "lucide-react";
import { Video } from "../types";
import { VideoCard } from "../components/VideoCard";
import { PlaylistCard } from "../components/PlaylistCard";

interface Playlist {
  id: string;
  title: string;
  language: "EN" | "AR";
  category?: "entertainment" | "education" | "religious" | "programming";
}

// Category options
const categories = [
  { value: "entertainment", label: "ترفيه", icon: Film },
  { value: "education", label: "تعليم", icon: BookOpen },
  { value: "religious", label: "دينية", icon: Heart },
  { value: "programming", label: "برمجة", icon: Code },
];

// Function to check if localStorage is available and working
const isLocalStorageAvailable = () => {
  const test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Function to initialize localStorage with empty arrays if they don't exist
const initializeLocalStorage = () => {
  if (localStorage.getItem("userVideos") === null) {
    // console.log("Initializing userVideos in localStorage");
    localStorage.setItem("userVideos", JSON.stringify([]));
  }

  if (localStorage.getItem("userPlaylists") === null) {
    // console.log("Initializing userPlaylists in localStorage");
    localStorage.setItem("userPlaylists", JSON.stringify([]));
  }
};

export const Dashboard = () => {
  // State to track if localStorage is available
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);

  // Check localStorage availability on mount and initialize if needed
  useEffect(() => {
    const available = isLocalStorageAvailable();
    setIsStorageAvailable(available);

    if (available) {
      // Initialize localStorage with empty arrays if they don't exist
      try {
        initializeLocalStorage();
      } catch (error) {
        console.error("Error initializing localStorage:", error);
      }
    } else {
      setSaveStatus({
        message:
          "Warning: Local storage is not available. Your data won't be saved between sessions.",
        type: "error",
      });
    }
  }, []);

  // State for form input values
  const [videoId, setVideoId] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoLanguage, setVideoLanguage] = useState<"EN" | "AR">("EN");
  const [videoCategory, setVideoCategory] = useState<
    "entertainment" | "education" | "religious" | "programming" | undefined
  >("entertainment");

  const [playlistId, setPlaylistId] = useState("");
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistLanguage, setPlaylistLanguage] = useState<"EN" | "AR">("EN");
  const [playlistCategory, setPlaylistCategory] = useState<
    "entertainment" | "education" | "religious" | "programming" | undefined
  >("entertainment");

  // State for stored items
  const [videos, setVideos] = useState<Video[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeTab, setActiveTab] = useState<"videos" | "playlists">("videos");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [saveStatus, setSaveStatus] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  // Load data from localStorage on component mount
  useEffect(() => {
    if (!isStorageAvailable) return;

    try {
      // Reset videos and playlists arrays before loading
      setVideos([]);
      setPlaylists([]);

      // Attempt to load data from localStorage
      const storedVideos = localStorage.getItem("userVideos");
      const storedPlaylists = localStorage.getItem("userPlaylists");

      // console.log("Attempting to load from localStorage:", {
      //   storedVideos,
      //   storedPlaylists,
      //   videosExists: storedVideos !== null,
      //   playlistsExists: storedPlaylists !== null,
      // });

      if (storedVideos && storedVideos !== "undefined") {
        try {
          const parsedVideos = JSON.parse(storedVideos);
          // console.log("Successfully parsed videos:", parsedVideos);
          setVideos(parsedVideos);
        } catch (parseError) {
          console.error("Error parsing stored videos:", parseError);
          // Initialize with empty array if parsing fails
          localStorage.setItem("userVideos", JSON.stringify([]));
        }
      } else {
        // console.log(
        //   "No videos found in localStorage, initializing with empty array"
        // );
        localStorage.setItem("userVideos", JSON.stringify([]));
      }

      if (storedPlaylists && storedPlaylists !== "undefined") {
        try {
          const parsedPlaylists = JSON.parse(storedPlaylists);
          // console.log("Successfully parsed playlists:", parsedPlaylists);
          setPlaylists(parsedPlaylists);
        } catch (parseError) {
          console.error("Error parsing stored playlists:", parseError);
          // Initialize with empty array if parsing fails
          localStorage.setItem("userPlaylists", JSON.stringify([]));
        }
      } else {
        // console.log(
        //   "No playlists found in localStorage, initializing with empty array"
        // );
        localStorage.setItem("userPlaylists", JSON.stringify([]));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setSaveStatus({
        message: "Failed to load your saved data. Resetting storage.",
        type: "error",
      });

      // Reset localStorage if there was an error
      try {
        localStorage.setItem("userVideos", JSON.stringify([]));
        localStorage.setItem("userPlaylists", JSON.stringify([]));
      } catch (resetError) {
        console.error("Error resetting localStorage:", resetError);
      }
    }
  }, [isStorageAvailable]);

  // Manual function to force save data to localStorage
  const forceSaveToLocalStorage = () => {
    if (!isStorageAvailable) return;

    try {
      // console.log("Force saving to localStorage:", { videos, playlists });
      localStorage.setItem("userVideos", JSON.stringify(videos));
      localStorage.setItem("userPlaylists", JSON.stringify(playlists));

      // Verify the data was actually saved
      const savedVideos = localStorage.getItem("userVideos");
      const savedPlaylists = localStorage.getItem("userPlaylists");

      // console.log("Verification of saved data:", {
      //   videosMatch: savedVideos === JSON.stringify(videos),
      //   playlistsMatch: savedPlaylists === JSON.stringify(playlists),
      // });

      return true;
    } catch (error) {
      console.error("Error during force save to localStorage:", error);
      setSaveStatus({
        message: "Failed to save your data",
        type: "error",
      });
      return false;
    }
  };

  // Enhanced save data effect
  useEffect(() => {
    if (!isStorageAvailable) return;

    // Use a timeout to batch localStorage updates
    const saveTimeout = setTimeout(() => {
      forceSaveToLocalStorage();
    }, 300);

    return () => clearTimeout(saveTimeout);
  }, [videos, playlists, isStorageAvailable]);

  // Start editing an item
  const startEditing = (id: string, type: "video" | "playlist") => {
    setEditingId(id);

    if (type === "video") {
      const video = videos.find((v) => v.id === id);
      if (video) {
        setVideoId(video.id);
        setVideoTitle(video.title);
        setVideoLanguage(video.language);
        setVideoCategory(video.category);
        setActiveTab("videos");
      }
    } else {
      const playlist = playlists.find((p) => p.id === id);
      if (playlist) {
        setPlaylistId(playlist.id);
        setPlaylistTitle(playlist.title);
        setPlaylistLanguage(playlist.language);
        setPlaylistCategory(playlist.category);
        setActiveTab("playlists");
      }
    }

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);

    // Reset form fields
    if (activeTab === "videos") {
      setVideoId("");
      setVideoTitle("");
      setVideoLanguage("EN");
      setVideoCategory("entertainment");
    } else {
      setPlaylistId("");
      setPlaylistTitle("");
      setPlaylistLanguage("EN");
      setPlaylistCategory("entertainment");
    }
  };

  // Enhanced handler for adding/updating videos
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId.trim() || !videoTitle.trim()) {
      setSaveStatus({
        message: "Video ID and Title are required.",
        type: "error",
      });
      return;
    }

    const newVideo: Video = {
      id: videoId.trim(),
      title: videoTitle.trim(),
      language: videoLanguage,
      category: videoCategory,
    };

    // console.log("Adding new video:", newVideo);

    let updatedVideos: Video[];
    if (editingId) {
      updatedVideos = videos.map((video) =>
        video.id === editingId ? { ...newVideo, id: editingId } : video
      );
      setEditingId(null); // Clear editing state
    } else {
      updatedVideos = [...videos, newVideo];
    }

    // console.log("Updated videos array:", updatedVideos);
    setVideos(updatedVideos);
    // console.log("New videos array:", updatedVideos); // Log after setting state (async)

    setVideoId("");
    setVideoTitle("");
    setVideoCategory("entertainment");

    // Force immediate save to localStorage with verification
    const saveSuccess = forceSaveToLocalStorage();

    setSaveStatus({
      message: saveSuccess
        ? "Video updated successfully!"
        : "Updated video in memory but couldn't save to localStorage",
      type: saveSuccess ? "success" : "error",
    });

    // Clear status message after 3 seconds
    setTimeout(() => {
      setSaveStatus({ message: "", type: null });
    }, 3000);
  };

  // Handler for adding/updating playlists
  const handleAddPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistId.trim() || !playlistTitle.trim()) {
      setSaveStatus({
        message: "Playlist ID and Title are required.",
        type: "error",
      });
      return;
    }

    const newPlaylist: Playlist = {
      id: playlistId.trim(),
      title: playlistTitle.trim(),
      language: playlistLanguage,
      category: playlistCategory,
    };
    // console.log("Adding new playlist:", newPlaylist);

    let updatedPlaylists: Playlist[];
    if (editingId) {
      updatedPlaylists = playlists.map((playlist) =>
        playlist.id === editingId ? { ...newPlaylist, id: editingId } : playlist
      );
      setEditingId(null); // Clear editing state
    } else {
      updatedPlaylists = [...playlists, newPlaylist];
    }
    // console.log("Updated playlists array:", updatedPlaylists);
    setPlaylists(updatedPlaylists);
    // console.log("New playlists array:", updatedPlaylists); // Log after setting state (async)

    setPlaylistId("");
    setPlaylistTitle("");
    setPlaylistCategory("entertainment");

    // Force immediate save to localStorage with verification
    const saveSuccess = forceSaveToLocalStorage();

    setSaveStatus({
      message: saveSuccess
        ? "Playlist updated successfully!"
        : "Updated playlist in memory but couldn't save to localStorage",
      type: saveSuccess ? "success" : "error",
    });

    // Clear status message after 3 seconds
    setTimeout(() => {
      setSaveStatus({ message: "", type: null });
    }, 3000);
  };

  // Handler for removing a video
  const handleRemoveVideo = (id: string) => {
    const updatedVideos = videos.filter((video) => video.id !== id);
    setVideos(updatedVideos);
    // console.log("After removal, videos array:", updatedVideos);
    setSaveStatus({ message: "Video removed!", type: "success" });
  };

  // Handler for removing a playlist
  const handleRemovePlaylist = (id: string) => {
    const updatedPlaylists = playlists.filter((playlist) => playlist.id !== id);
    setPlaylists(updatedPlaylists);
    // console.log("After removal, playlists array:", updatedPlaylists);
    setSaveStatus({ message: "Playlist removed!", type: "success" });
  };

  // Get category icon and label
  const getCategoryInfo = (categoryValue?: string) => {
    const category = categories.find((c) => c.value === categoryValue);
    return category || { value: "", label: "غير مصنف", icon: Film };
  };

  const checkLocalStorageContent = () => {
    const currentVideos = localStorage.getItem("userVideos");
    const currentPlaylists = localStorage.getItem("userPlaylists");
    // console.log("Current localStorage:", {
    //   videos: currentVideos ? JSON.parse(currentVideos) : [],
    //   playlists: currentPlaylists ? JSON.parse(currentPlaylists) : [],
    // });
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1
          className="text-3xl font-bold dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          إدارة المحتوى
        </motion.h1>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-button-start to-button-end text-white rounded-lg hover:opacity-90 transition-all transform hover:scale-105 hover:shadow-xl"
          >
            <Home size={18} />
            <span>العودة للرئيسية</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 flex shadow-lg">
          <button
            className={`px-5 py-2 rounded-lg font-medium ${
              activeTab === "videos"
                ? "bg-gradient-to-r from-button-start to-button-end text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            <div className="flex items-center gap-2">
              <YoutubeIcon size={18} />
              <span>Videos</span>
            </div>
          </button>
          <button
            className={`px-5 py-2 rounded-lg font-medium ${
              activeTab === "playlists"
                ? "bg-gradient-to-r from-button-start to-button-end text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("playlists")}
          >
            <div className="flex items-center gap-2">
              <List size={18} />
              <span>Playlists</span>
            </div>
          </button>
        </div>
      </div>

      {/* Success/Error Message */}
      {saveStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-3 rounded-lg text-center ${
            saveStatus.type === "success"
              ? "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-400"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {saveStatus.type === "success" ? (
              <Check size={18} />
            ) : (
              <Trash size={18} />
            )}
            {saveStatus.message}
          </div>
        </motion.div>
      )}

      {/* Videos Form */}
      {activeTab === "videos" && (
        <motion.div
          className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold mb-6 dark:text-white">
            {editingId ? "تعديل الفيديو" : "إضافة فيديو جديد"}
          </h2>
          <form onSubmit={handleAddVideo}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="videoId"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  YouTube Video ID / URL
                </label>
                <input
                  type="text"
                  id="videoId"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  placeholder="e.g., dQw4w9WgXcQ or full YouTube URL"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-button-start focus:border-transparent outline-none"
                  disabled={!!editingId}
                />
              </div>
              <div>
                <label
                  htmlFor="videoTitle"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Video Title
                </label>
                <input
                  type="text"
                  id="videoTitle"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-button-start focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="videoLanguage"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Language
                </label>
                <select
                  id="videoLanguage"
                  value={videoLanguage}
                  onChange={(e) =>
                    setVideoLanguage(e.target.value as "EN" | "AR")
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-button-start focus:border-transparent outline-none"
                >
                  <option value="EN">English</option>
                  <option value="AR">Arabic</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="videoCategory"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Category
                </label>
                <select
                  id="videoCategory"
                  value={videoCategory}
                  onChange={(e) =>
                    setVideoCategory(
                      e.target.value as
                        | "entertainment"
                        | "education"
                        | "religious"
                        | "programming"
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-button-start focus:border-transparent outline-none"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-button-start to-button-end text-white rounded-lg hover:opacity-90 transition-all transform hover:scale-105 hover:shadow-xl"
              >
                {editingId ? <Save size={18} /> : <Plus size={18} />}
                {editingId ? "Update Video" : "Add Video"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>
      )}

      {/* Playlists Form */}
      {activeTab === "playlists" && (
        <motion.div
          className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold mb-6 dark:text-white">
            {editingId ? "تعديل قائمة التشغيل" : "إضافة قائمة تشغيل جديدة"}
          </h2>
          <form onSubmit={handleAddPlaylist}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="playlistId"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  YouTube Playlist ID / URL
                </label>
                <input
                  type="text"
                  id="playlistId"
                  value={playlistId}
                  onChange={(e) => setPlaylistId(e.target.value)}
                  placeholder="e.g., PLyCLoPd4VxBvPHOpzoEk5onAEbq40g2-k or full URL"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-button-start focus:border-transparent outline-none"
                  disabled={!!editingId}
                />
              </div>
              <div>
                <label
                  htmlFor="playlistTitle"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Playlist Title
                </label>
                <input
                  type="text"
                  id="playlistTitle"
                  value={playlistTitle}
                  onChange={(e) => setPlaylistTitle(e.target.value)}
                  placeholder="Enter playlist title"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-button-start focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="playlistLanguage"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Language
                </label>
                <select
                  id="playlistLanguage"
                  value={playlistLanguage}
                  onChange={(e) =>
                    setPlaylistLanguage(e.target.value as "EN" | "AR")
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-button-start focus:border-transparent outline-none"
                >
                  <option value="EN">English</option>
                  <option value="AR">Arabic</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="playlistCategory"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Category
                </label>
                <select
                  id="playlistCategory"
                  value={playlistCategory}
                  onChange={(e) =>
                    setPlaylistCategory(
                      e.target.value as
                        | "entertainment"
                        | "education"
                        | "religious"
                        | "programming"
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-button-start focus:border-transparent outline-none"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-button-start to-button-end text-white rounded-lg hover:opacity-90 transition-all transform hover:scale-105 hover:shadow-xl"
              >
                {editingId ? <Save size={18} /> : <Plus size={18} />}
                {editingId ? "Update Playlist" : "Add Playlist"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>
      )}

      {/* Listing added content */}
      <motion.div
        className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white">
            {activeTab === "videos" ? "فيديوهات مضافة" : "قوائم تشغيل مضافة"}
          </h2>

          {((activeTab === "videos" && videos.length > 0) ||
            (activeTab === "playlists" && playlists.length > 0)) && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-button-start to-button-end text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
                title="عرض القائمة"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-button-start to-button-end text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
                title="عرض شبكي"
              >
                <Eye size={18} />
              </button>
            </div>
          )}
        </div>

        {activeTab === "videos" && (
          <div>
            {videos.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 my-4">
                لا توجد فيديوهات مضافة بعد.
              </p>
            ) : viewMode === "list" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                        Title
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                        Category
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                        Language
                      </th>
                      <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {videos.map((video) => {
                      const categoryInfo = getCategoryInfo(video.category);
                      const CategoryIcon = categoryInfo.icon;

                      return (
                        <tr key={video.id}>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                            {video.title}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="w-4 h-4" />
                              <span>{categoryInfo.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                            {video.language}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => startEditing(video.id, "video")}
                                className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleRemoveVideo(video.id)}
                                className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    language={video.language}
                    category={video.category}
                    onEdit={() => startEditing(video.id, "video")}
                    onDelete={() => handleRemoveVideo(video.id)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        )}

        {activeTab === "playlists" && (
          <div>
            {playlists.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 my-4">
                لا توجد قوائم تشغيل مضافة بعد.
              </p>
            ) : viewMode === "list" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                        Title
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                        Category
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                        Language
                      </th>
                      <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {playlists.map((playlist) => {
                      const categoryInfo = getCategoryInfo(playlist.category);
                      const CategoryIcon = categoryInfo.icon;

                      return (
                        <tr key={playlist.id}>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                            {playlist.title}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="w-4 h-4" />
                              <span>{categoryInfo.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                            {playlist.language}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  startEditing(playlist.id, "playlist")
                                }
                                className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  handleRemovePlaylist(playlist.id)
                                }
                                className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {playlists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    id={playlist.id}
                    title={playlist.title}
                    language={playlist.language}
                    category={playlist.category}
                    onEdit={() => startEditing(playlist.id, "playlist")}
                    onDelete={() => handleRemovePlaylist(playlist.id)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        )}

        <motion.div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Items are automatically saved to your browser's local storage.
          </p>
          {isStorageAvailable ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  try {
                    // Test writing to localStorage
                    localStorage.setItem("storageTest", "test-" + Date.now());
                    const testValue = localStorage.getItem("storageTest");
                    localStorage.removeItem("storageTest");

                    // Force a fresh save of current data
                    const saveSuccess = forceSaveToLocalStorage();

                    setSaveStatus({
                      message: saveSuccess
                        ? `Storage test passed! Test value: ${testValue}`
                        : "Storage test failed - couldn't verify save",
                      type: saveSuccess ? "success" : "error",
                    });

                    // Show current storage contents in console
                    checkLocalStorageContent();
                  } catch (error) {
                    console.error("Storage test error:", error);
                    setSaveStatus({
                      message: "Storage test failed with error",
                      type: "error",
                    });
                    setIsStorageAvailable(false);
                  }
                }}
                className="text-sm text-blue-500 dark:text-blue-400 hover:underline"
              >
                اختبار التخزين المحلي
              </button>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "هل أنت متأكد أنك تريد مسح جميع البيانات المحفوظة؟"
                    )
                  ) {
                    localStorage.removeItem("userVideos");
                    localStorage.removeItem("userPlaylists");
                    setVideos([]);
                    setPlaylists([]);
                    setSaveStatus({
                      message: "تم مسح جميع البيانات بنجاح",
                      type: "success",
                    });
                  }
                }}
                className="text-sm text-red-500 dark:text-red-400 hover:underline"
              >
                مسح جميع البيانات المحفوظة
              </button>
            </div>
          ) : (
            <p className="text-sm text-red-500 dark:text-red-400">
              تنبيه: التخزين المحلي غير متاح في متصفحك. لن يتم حفظ بياناتك بين
              الجلسات.
            </p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

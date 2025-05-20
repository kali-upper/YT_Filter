import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { VideoCard } from "../components/VideoCard";
import { PlaylistCard } from "../components/PlaylistCard";
import { Code, BookOpen, Globe, Flag } from "lucide-react";
import { useEffect } from "react";
import { Video, Playlist } from "../types";
import { WhatsAppButton } from "../components/WhatsAppButton";

// تعريف الأقسام الثلاثة بنفس أسلوب الصفحة الرئيسية
const categories = [
  { id: "english", name: "English Videos", icon: Globe },
  { id: "arabic", name: "Arabic Videos", icon: Flag },
  { id: "playlists", name: "Featured Playlists", icon: BookOpen },
];

export const Programming = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // فيديوهات باللغة الإنجليزية
  const englishVideos: Video[] = [
    {
      id: "8mAITcNt710",
      title: "Harvard CS50 – Full Computer Science University Course",
      language: "EN",
    },
    {
      id: "XKHEtdqhLK8",
      title: "Python Full Course for free 🐍",
      language: "EN",
    },
    {
      id: "dqlO6_5rZSQ",
      title: "I tried 50 Programming Courses. Here are Top 5.",
      language: "EN",
    },
  ];

  // فيديوهات باللغة العربية
  const arabicVideos: Video[] = [
    {
      id: "6-IBA6CSvZE",
      title: "كيف تختار المجال المناسب في البرمجة ؟",
      language: "AR",
    },
    {
      id: "6QAELgiQYFk",
      title: "معلومات خطيرة عن مجال البرمجة",
      language: "AR",
    },
  ];

  // قوائم التشغيل
  const playlists: Playlist[] = [
    {
      id: "PLLEaOX05IZa5foMNxdIdXlv0FRMXD-_-K",
      title: "JavaScript Course",
      language: "EN",
    },
    {
      id: "PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji",
      title: "HTML كورس",
      language: "AR",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* العنوان الرئيسي */}
      <motion.h1
        className="text-3xl font-bold text-center mb-8 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        فيديوهات برمجة
      </motion.h1>

      {/* أقسام الصفحة بنفس تصميم الصفحة الرئيسية */}
      <motion.nav
        className="grid grid-cols-3 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map(({ id, name, icon: Icon }) => (
          <motion.div key={id} variants={itemVariants}>
            <a
              href={`#${id}`}
              className="block text-center py-4 px-6 bg-gradient-to-r from-button-start to-button-end text-neutral rounded-lg font-bold hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <Icon className="w-6 h-6 mx-auto mb-2" />
              {name}
            </a>
          </motion.div>
        ))}
      </motion.nav>

      {/* قسم الفيديوهات الإنجليزية */}
      <motion.section
        id="english"
        className="mb-12"
        variants={itemVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold dark:text-white">English Videos</h2>
          <span className="px-3 py-1 bg-gradient-to-r from-button-start to-button-end text-white rounded-full text-sm font-semibold">
            EN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {englishVideos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              language={video.language}
            />
          ))}
        </div>
      </motion.section>

      {/* قسم الفيديوهات العربية */}
      <motion.section
        id="arabic"
        className="mb-12"
        variants={itemVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Arabic Videos</h2>
          <span className="px-3 py-1 bg-gradient-to-r from-button-start to-button-end text-white rounded-full text-sm font-semibold">
            AR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {arabicVideos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              language={video.language}
            />
          ))}
        </div>
      </motion.section>

      {/* قسم قوائم التشغيل */}
      <motion.section
        id="playlists"
        className="mb-12"
        variants={itemVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 dark:text-white">
          Featured Playlists
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              language={playlist.language}
            />
          ))}
        </div>
      </motion.section>

      {/* قسم الاقتراحات */}
      <motion.div
        className="mt-12 text-center bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <h3 className="text-xl font-bold mb-4 dark:text-white">
          سيتم إضافة المزيد من الفيديوهات قريباً
        </h3>
        <p
          className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2 flex-wrap"
          dir="rtl"
        >
          <span>يمكنك إقتراح فيديوهات أو الإبلاغ عن مشاكل عن طريق</span>
          <WhatsAppButton />
        </p>
      </motion.div>
    </motion.div>
  );
};

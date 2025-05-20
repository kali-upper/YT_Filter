import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Upload, Film, BookOpen, Heart, Code, Settings } from "lucide-react";
import { useEffect } from "react";

const categories = [
  { path: "/entertainment", name: "ترفيه", icon: Film },
  { path: "/education", name: "تعليم", icon: BookOpen },
  { path: "/religious", name: "دينية", icon: Heart },
  { path: "/programming", name: "برمجة", icon: Code },
];

export const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.nav
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map(({ path, name, icon: Icon }) => (
          <motion.div key={path} variants={itemVariants}>
            <Link
              to={path}
              className="block text-center py-4 px-6 bg-gradient-to-r from-button-start to-button-end text-neutral rounded-lg font-bold hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <Icon className="w-6 h-6 mx-auto mb-2" />
              {name}
            </Link>
          </motion.div>
        ))}
      </motion.nav>

      <motion.div
        className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 shadow-xl"
        variants={itemVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-button-start to-button-end text-transparent bg-clip-text">
          مرحبًا بكم
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          لقد أصبحت منصات التواصل الإجتماعي مكانًا غير آمن للجميع
        </p>
        <p className="text-center text-gray-600 dark:text-gray-300">
          لذلك هذا الموقع هو عبارة عن مكتبة أولية لتصفية محتوى اليوتيوب من كل ما
          يخالف ديننا وأخلاقنا
        </p>
      </motion.div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex flex-wrap gap-4 justify-center">
          <motion.label
            htmlFor="upload-video"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-button-start to-button-end text-white rounded-lg cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className="h-5 w-5" />
            Upload Files
          </motion.label>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <Settings className="h-5 w-5" />
            إدارة المحتوى
          </Link>
        </div>
        <input
          type="file"
          id="upload-video"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // console.log("File selected:", file);
            }
          }}
        />
      </motion.div>
    </motion.div>
  );
};

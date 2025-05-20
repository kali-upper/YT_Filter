import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Moon, Sun, ArrowUp, Settings } from "lucide-react";
import { Toast } from "./Toast";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-neutral dark:bg-base transition-colors duration-500">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary transform origin-left z-50"
        style={{ scaleX }}
      />

      <header className="sticky top-0 z-40 bg-primary text-neutral shadow-lg backdrop-blur-sm bg-opacity-90">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <motion.h1
              className="text-3xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {isHome ? (
                "Youtube Filter"
              ) : (
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  Back to Home
                </Link>
              )}
            </motion.h1>
            <div className="flex items-center gap-4">
              <motion.div
                className="relative w-14 h-7 flex items-center justify-center rounded-full overflow-hidden cursor-pointer"
                onClick={() => {
                  const newIsDark = !isDark;
                  setIsDark(newIsDark);
                  if (newIsDark) {
                    setToast({ message: "Dark mode enabled", type: "success" });
                  } else {
                    setToast({
                      message: "Light mode enabled",
                      type: "success",
                    });
                  }
                }}
                role="switch"
                aria-checked={isDark}
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
                whileHover={{
                  scale: 1.05,
                  boxShadow: isDark
                    ? "0 0 12px 2px rgba(75, 85, 99, 0.6)"
                    : "0 0 12px 2px rgba(147, 197, 253, 0.6)",
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Track Background */}
                <div
                  className={`absolute inset-0 transition-colors duration-300 ${
                    isDark ? "bg-gray-800" : "bg-blue-100"
                  }`}
                />

                {/* Icons */}
                <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
                  <Sun className="h-3.5 w-3.5 text-yellow-500" />
                  <Moon className="h-3.5 w-3.5 text-gray-100" />
                </div>

                {/* Thumb */}
                <motion.div
                  className="absolute h-5 w-5 rounded-full bg-white shadow-md z-10"
                  initial={false}
                  animate={{
                    left: isDark ? "calc(100% - 5px - 20px)" : "5px",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              </motion.div>

              {!isDashboard && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/dashboard"
                    className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-2 hover:bg-white/30 transition-all duration-300"
                  >
                    <Settings className="h-5 w-5" />
                    Dashboard
                  </Link>
                </motion.div>
              )}

              {!isHome && (
                <motion.div
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/"
                    className="block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-300"
                  >
                    Back to Home
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">{children}</div>

      <motion.button
        className="fixed bottom-8 right-8 p-4 bg-accent-500 text-neutral rounded-full shadow-lg hover:bg-accent-600 transition-all duration-300"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 25px rgba(100, 116, 139, 0.5)",
        }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

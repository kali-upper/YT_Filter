import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export const Toast = ({ message, type = "info", onClose }: ToastProps) => {
  const colors = {
    success: "from-button-start to-button-end",
    error: "from-accent-700 to-accent-900",
    info: "from-primary to-secondary",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: "20%" }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.15 }}
      className={`fixed bottom-4 right-4 p-4 rounded-lg bg-gradient-to-r ${colors[type]} text-white shadow-lg max-w-md z-50`}
    >
      <div className="flex items-center justify-between gap-4">
        <p>{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

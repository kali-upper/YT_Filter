import { motion } from "framer-motion";

export const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/+201207688761"
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#25d366] text-white rounded-full shadow-lg transition-all duration-300"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{
        scale: 1.1,
        boxShadow: "0 0 25px rgba(37, 211, 102, 0.7)",
      }}
      whileTap={{ scale: 0.95 }}
    >
      <bdi>واتساب</bdi>
    </motion.a>
  );
};

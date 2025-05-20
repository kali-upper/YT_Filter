import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === "pointer");
    };

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return (
    <motion.div
      className="custom-cursor"
      animate={{
        x: position.x,
        y: position.y,
        scale: isPointer ? 1.5 : 1,
        borderColor: isPointer ? "#ec4899" : "#f43f5e",
      }}
      transition={{
        type: "spring",
        damping: 30,
        mass: 0.5,
        stiffness: 400,
      }}
    >
      <motion.div
        className="w-full h-full rounded-full border-2 border-current"
        animate={{
          scale: isPointer ? 0.5 : 1,
          backgroundColor: isPointer ? "#ec489922" : "rgba(0,0,0,0)",
          opacity: isPointer ? 0.3 : 1,
        }}
      />
    </motion.div>
  );
};

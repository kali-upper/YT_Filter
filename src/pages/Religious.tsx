import { motion } from "framer-motion";
import { VideoCard } from "../components/VideoCard";
import { WhatsAppButton } from "../components/WhatsAppButton";

export const Religious = () => {
  const videos = [
    {
      id: "Nf032tXh3J0",
      title: "هل في وسائل ترفيه حلال ؟؟ مع أمثلة",
    },
    {
      id: "IsoBhxF-wVo",
      title: "إياك والحزن والإحباط - الشيخ خالد الراشد",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.h1
        className="text-3xl font-bold text-center mb-8 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        فيديوهات دينية
      </motion.h1>

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
            language="AR"
          />
        ))}
      </motion.div>

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
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
    </div>
  );
};

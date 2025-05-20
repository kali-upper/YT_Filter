import { useState, useEffect } from 'react';

// خطاف لإدارة وضع المسرح
export const useTheaterMode = () => {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  
  // إدارة تثبيت التمرير عند تفعيل وضع المسرح
  useEffect(() => {
    if (isTheaterMode) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    // تنظيف عند إلغاء التثبيت
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isTheaterMode]);
  
  // تفعيل وضع المسرح
  const enableTheaterMode = () => setIsTheaterMode(true);
  
  // تعطيل وضع المسرح
  const disableTheaterMode = () => setIsTheaterMode(false);
  
  // متغيرات الحركة
  const theaterVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };
  
  return {
    isTheaterMode,
    enableTheaterMode,
    disableTheaterMode,
    theaterVariants
  };
}; 
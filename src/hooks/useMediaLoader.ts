import { useState, useEffect } from 'react';

// خطاف لإدارة تحميل الوسائط
export const useMediaLoader = (mediaId: string) => {
  const [loadError, setLoadError] = useState(false);
  
  // إعادة تعيين الخطأ عند تغيير المعرف
  useEffect(() => {
    setLoadError(false);
  }, [mediaId]);
  
  // معالج أخطاء التحميل
  const handleLoadError = () => {
    setLoadError(true);
  };
  
  return {
    loadError,
    handleLoadError
  };
}; 
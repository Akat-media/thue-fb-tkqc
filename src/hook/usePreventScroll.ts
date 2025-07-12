import { useEffect } from 'react';

export const usePreventScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      // Lưu lại scroll position hiện tại
      const scrollY = window.scrollY;
      
      // Thêm style để ngăn scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Cleanup function để khôi phục scroll khi modal đóng
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Khôi phục scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
}; 
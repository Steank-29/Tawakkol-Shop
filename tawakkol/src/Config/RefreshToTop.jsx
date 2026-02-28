import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RefreshToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'smooth' if you want smooth scrolling to top
    });
  }, [pathname]);

  return null;
};

export default RefreshToTop;
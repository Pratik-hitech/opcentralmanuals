// src/components/NavigationProgress.js
import { useState, useEffect } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';

export default function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === 'loading') {
      setIsNavigating(true);
    } else {
      const timer = setTimeout(() => setIsNavigating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  return isNavigating ? (
    <LinearProgress 
      color="secondary" 
      sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: 3,
        zIndex: 9999 
      }}
    />
  ) : null;
}
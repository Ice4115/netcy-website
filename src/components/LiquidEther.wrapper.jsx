'use client';

import { useState, useEffect } from 'react';
import LiquidEtherDesktop from './LiquidEther.desktop';
import LiquidEtherMobile from './LiquidEther_mobile_complete';

export default function LiquidEther(props) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth <= 1024;
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isClient) {
    return (
      <div 
        className={`liquid-ether-container ${props.className || ''}`} 
        style={props.style}
      />
    );
  }

  return isMobile ? <LiquidEtherMobile {...props} /> : <LiquidEtherDesktop {...props} />;
}

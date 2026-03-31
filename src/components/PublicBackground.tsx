'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

const LiquidEther = dynamic(() => import('./LiquidEther'), { ssr: false });

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 1024;
  return ua || isSmallScreen;
};

export default function PublicBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const bg = useMemo(() => (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      <LiquidEther
        colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
        mouseForce={isMobile ? 80 : 20}
        cursorSize={isMobile ? 250 : 100}
        autoDemo={!isMobile}
        autoSpeed={0.5}
        autoIntensity={2.2}
        autoResumeDelay={1000}
        resolution={isMobile ? 0.35 : 0.5}
      />
    </div>
  ), [isMobile]);

  return bg;
}

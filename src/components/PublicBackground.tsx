'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

const LiquidEther = dynamic(() => import('./LiquidEther'), { ssr: false });

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return ua || window.innerWidth <= 1024;
};

export default function PublicBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const bg = useMemo(() => (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none" style={{ opacity: isMobile ? 0.28 : 0.22 }}>
      <LiquidEther
        colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
        mouseForce={isMobile ? 90 : 38}
        cursorSize={isMobile ? 320 : 170}
        autoDemo={!isMobile}
        autoSpeed={0.35}
        autoIntensity={1.2}
        autoResumeDelay={1200}
        resolution={isMobile ? 0.22 : 0.38}
        iterationsPoisson={isMobile ? 16 : 24}
        iterationsViscous={isMobile ? 16 : 24}
        dt={0.016}
        BFECC={!isMobile}
      />
    </div>
  ), [isMobile]);

  return bg;
}

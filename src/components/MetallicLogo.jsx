'use client';

import { useEffect, useState } from 'react';
import MetallicPaint, { parseLogoImage } from './MetallicPaint';

export default function MetallicLogo({ logoPath = '/images/logo_tab.png', className = '' }) {
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLogo() {
      try {
        const response = await fetch(logoPath);
        const blob = await response.blob();
        const fileType = logoPath.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
        const fileName = logoPath.split('/').pop() || 'logo';
        const file = new File([blob], fileName, { type: fileType });
        const result = await parseLogoImage(file);
        setImageData(result.imageData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading logo:', error);
        setIsLoading(false);
      }
    }

    loadLogo();
  }, [logoPath]);

  if (isLoading || !imageData) {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse text-white/50">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden flex items-center justify-center`}>
      <div className="w-full h-full">
        <MetallicPaint 
          imageData={imageData}
          params={{
            patternScale: 2,
            refraction: 0.015,
            edge: 0,
            patternBlur: 0.005,
            liquid: 0.07,
            speed: 0.3
          }}
        />
      </div>
    </div>
  );
}

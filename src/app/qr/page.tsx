'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LiquidEther from "@/components/LiquidEther";
import TextType from "@/components/TextType";
import GradientText from "@/components/GradientText";
import MetallicLogo from "@/components/MetallicLogo";
import StarBorder from "@/components/StarBorder";
import LoadingScreen from "@/components/LoadingScreen";
import Link from 'next/link';

const LiquidEtherMobile = dynamic(() => import("@/components/LiquidEtherMobile"), {
  ssr: false,
});

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 1024;
  return ua || isSmallScreen;
};

export default function QRLandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    const criticalImages = [
      '/images/logo_tab.png'
    ];

    const preloadImages = () => {
      const promises = criticalImages.map(src => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      return Promise.all(promises);
    };

    const handleLoad = async () => {
      await preloadImages();
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className="w-full text-white overflow-x-hidden relative">
      <div className="fixed inset-0 w-full h-full z-0">
        {isMobile ? (
          <LiquidEtherMobile 
            colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
            mouseForce={80}
            cursorSize={250}
            resolution={0.35}
          />
        ) : (
          <LiquidEther 
            colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            autoResumeDelay={1000}
            resolution={0.5}
          />
        )}
      </div>
      
      <div className="relative z-10">
        <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center z-10 px-4">
            <MetallicLogo 
              logoPath="/images/logo_tab.png"
              className="w-32 h-32 md:w-48 md:h-48 mb-6"
            />
            
            <TextType 
              text="NETCY"
              className="text-4xl md:text-6xl font-bold mb-8"
              typingSpeed={500}
              cursorCharacter="_"
            />
            
            <div className="text-2xl md:text-3xl mb-8 max-w-2xl">
              <GradientText>Création de Sites Internet Sécurisé</GradientText>
            </div>
            
            <p className="text-gray-200 text-xl md:text-2xl max-w-xl mb-12 leading-relaxed font-medium">
              Un projet web ? Discutons-en.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Link 
                href="/#contact" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] hover:from-[#7A4FFF] hover:to-[#8A9FFF] rounded-lg font-semibold transition shadow-lg shadow-violet-500/30"
                style={{ width: '85px', height: '35px', padding: '10px 15px', boxSizing: 'content-box', fontSize: '17px' }}
              >
                Contact
              </Link>
              <Link href="/">
                <StarBorder
                  as="span"
                  color="white"
                  speed="3s"
                  thickness={3}
                >
                  Voir le site
                </StarBorder>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}

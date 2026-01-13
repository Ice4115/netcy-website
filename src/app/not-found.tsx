'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import LiquidEther from "@/components/LiquidEther";
import GradientText from "@/components/GradientText";
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

export default function NotFound() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/');
    }
  }, [countdown, router]);

  const liquidEtherBackground = useMemo(() => (
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
  ), [isMobile]);

  return (
    <div className="w-full text-white overflow-x-hidden relative">
      {liquidEtherBackground}
      
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center px-4 max-w-2xl">
          <h1 className="text-9xl md:text-[12rem] font-bold mb-4">
            <GradientText>404</GradientText>
          </h1>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Page introuvable
          </h2>
          
          <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <p className="text-gray-400 text-sm md:text-base mb-8">
            Redirection automatique dans <span className="text-[#7A8FFF] font-bold text-xl">{countdown}</span> secondes...
          </p>
          
          <Link 
            href="/" 
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] hover:from-[#7A4FFF] hover:to-[#8A9FFF] rounded-lg font-semibold transition shadow-lg shadow-violet-500/30"
            style={{ width: '180px', height: '50px', padding: '12px 24px', boxSizing: 'content-box', fontSize: '17px' }}
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LiquidEtherMobile = dynamic(() => import("@/components/LiquidEtherMobile"), {
  ssr: false,
});

const LiquidEther = dynamic(() => import("@/components/LiquidEther"), {
  ssr: false,
});

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 1024;
  return ua || isSmallScreen;
};

export default function CGUPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.opacity = '0';
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = 'opacity 0.8s ease-in';
          contentRef.current.style.opacity = '1';
        }
      }, 100);
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#110F1B' }}>
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

      <div ref={contentRef} className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour
        </Link>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            Conditions Générales d&apos;Utilisation
          </h1>

          <div className="space-y-8 text-white/90">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Acceptation des conditions
              </h2>
              <p className="leading-relaxed">
                En accédant et utilisant ce site, vous acceptez sans réserve les présentes conditions d&apos;utilisation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Contenu du site
              </h2>
              <p className="leading-relaxed">
                Tout le contenu du site (textes, images, logos, vidéos) est la propriété de NETCY ou de ses partenaires. Toute reproduction, modification, diffusion ou exploitation sans autorisation écrite est interdite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Utilisation du site
              </h2>
              <p className="leading-relaxed mb-3">
                Le site est fourni « tel quel ». NETCY n&apos;est pas responsable :
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>des erreurs, omissions ou interruptions du site,</li>
                <li>des dommages directs ou indirects liés à l&apos;utilisation du site,</li>
                <li>des contenus accessibles via des liens externes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Liens externes
              </h2>
              <p className="leading-relaxed">
                Le site peut contenir des liens vers des sites tiers. NETCY n&apos;assume aucune responsabilité pour leur contenu, services ou politiques de confidentialité.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Modifications
              </h2>
              <p className="leading-relaxed">
                NETCY se réserve le droit de modifier le site, ses contenus et les présentes conditions à tout moment. La version en ligne prévaut.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">
              Dernière mise à jour : Janvier 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

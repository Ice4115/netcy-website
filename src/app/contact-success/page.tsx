'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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

export default function ContactSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(20);
  const [fadeOut, setFadeOut] = useState(false);
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
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 3) {
      setFadeOut(true);
    }
    if (countdown === 0) {
      router.push('/');
    }
  }, [countdown, router]);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100 animate-fadeIn'}`} style={{ backgroundColor: '#110F1B' }}>
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
      <div className="relative z-10 max-w-2xl w-full bg-gradient-to-br from-[#1a0f3a]/80 to-[#0f0a20]/80 border border-[#6F3FFF]/40 rounded-2xl p-12 shadow-2xl shadow-violet-500/20 backdrop-blur-md text-center">
        <div className="flex justify-center mb-6 animate-scaleIn">
          <div className="bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] rounded-full p-6 animate-pulse">
            <Image src="/images/icons/email.svg" alt="Email envoyé" width={80} height={80} className="brightness-200 contrast-100" style={{ filter: 'invert(1) brightness(2)' }} />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-12 pb-2 bg-gradient-to-r from-[#8FA5FF] to-[#6F3FFF] bg-clip-text text-transparent animate-slideDown">
          Message Envoyé !
        </h1>

        <p className="text-xl text-gray-300 mb-4 animate-slideUp">
          Merci pour votre demande de contact
        </p>

        <p className="text-lg text-gray-400 mb-8 animate-slideUp animation-delay-100">
          Votre demande a bien été enregistrée. Je vous répondrai dans les plus brefs délais, généralement sous 24h.
        </p>

        <div className="bg-[#0f0a20]/50 rounded-lg p-6 mb-6 border border-[#6F3FFF]/20 animate-slideUp animation-delay-200">
          <p className="text-[#8FA5FF] font-semibold mb-2">
            ✉️ Email de confirmation envoyé
          </p>
          <p className="text-gray-300 text-base">
            Un email de confirmation vous a été envoyé avec le récapitulatif de votre demande.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Pensez à vérifier vos spams si vous ne le recevez pas.
          </p>
        </div>

        <div className="bg-[#0f0a20]/50 rounded-lg p-6 mb-8 border border-[#6F3FFF]/20 animate-slideUp animation-delay-200">
          <p className="text-[#8FA5FF] font-semibold mb-2">
            📧 Nous contacter
          </p>
          <p className="text-white text-lg">
            contact@netcy.fr
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 animate-slideUp animation-delay-300">
          <p className="text-gray-400">
            Redirection vers l&apos;accueil dans <span className="text-[#6F3FFF] font-bold text-2xl">{countdown}</span> secondes
          </p>
          
          <button
            onClick={() => {
              setFadeOut(true);
              setTimeout(() => {
                router.push('/');
              }, 1000);
            }}
            className="px-8 py-3 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] hover:from-[#7A4FFF] hover:to-[#8A9FFF] rounded-lg font-semibold transition shadow-lg shadow-violet-500/30 text-white hover:scale-105 transform"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}

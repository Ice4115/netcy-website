'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Send } from '@/components/animate-ui/icons/send';

const LiquidEther = dynamic(() => import('@/components/LiquidEther'), {
  ssr: false,
});

export default function ContactSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(20);
  const [fadeOut, setFadeOut] = useState(false);

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
    <div className="relative min-h-screen">
      <div className="absolute inset-0 w-full h-full">
        <LiquidEther
          colors={['#3F12F3', '#4670D2', '#5670A4', '#2A0F7F']}
          mouseForce={20}
          cursorSize={100}
          autoDemo={true}
        />
      </div>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <Send 
                  size={32} 
                  className="text-green-400" 
                  strokeWidth={1.5}
                  animate={true}
                  animation="default"
                  loop={true}
                  loopDelay={2000}
                />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Message envoyé !</h1>
              <p className="text-gray-300">Merci pour votre demande de contact</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-gray-300 text-sm text-center">
                  Votre demande a bien été enregistrée. Je vous répondrai dans les plus brefs délais, généralement sous 24h.
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-300 text-sm text-center mb-2">
                  Un email de confirmation vous a été envoyé avec le récapitulatif de votre demande.
                </p>
                <p className="text-gray-400 text-xs text-center">
                  Pensez à vérifier vos spams si vous ne le recevez pas.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-xs text-center mb-1">
                  Nous contacter
                </p>
                <p className="text-white text-base text-center font-medium">
                  contact@netcy.fr
                </p>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <p className="text-gray-400 text-xs text-center mb-3">
                  Redirection vers l&apos;accueil dans <span className="text-purple-400 font-bold">{countdown}</span> secondes
                </p>
                <button
                  onClick={() => {
                    setFadeOut(true);
                    setTimeout(() => {
                      router.push('/');
                    }, 1000);
                  }}
                  className="w-full px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-semibold transition-all shadow-lg text-white"
                >
                  Retour à l&apos;accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

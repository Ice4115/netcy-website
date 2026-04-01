'use client';

import { useState, useEffect, useMemo } from 'react';
import LiquidEther from "@/components/LiquidEther";
import GradientText from "@/components/GradientText";

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 1024;
  return ua || isSmallScreen;
};

const stackTrace = [
  'Error: UNEXPECTED_MELTDOWN at line 42',
  '  at Server.handleRequest (server.ts:42:9)',
  '  at processTicksAndRejections (internal/process:95)',
  '  at async dropEverythingAndPanic (ops.ts:1337:3)',
  '  at async CoffeeMachine.refill (kitchen.ts:0:0)',
  '> Caused by: Someone forgot to catch the exception (again)',
  '> Note: sudo fix-everything — commande introuvable',
];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    if (visibleLines >= stackTrace.length) return;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 300);
    return () => clearTimeout(t);
  }, [visibleLines]);

  const bg = useMemo(() => (
    <div className="fixed inset-0 w-full h-full z-0">
      <LiquidEther
        colors={['#FF3F3F', '#FF7A3F', '#FF5050', '#CC2200']}
        mouseForce={isMobile ? 80 : 20}
        cursorSize={isMobile ? 250 : 100}
        autoDemo={!isMobile}
        autoSpeed={0.4}
        autoIntensity={2.0}
        autoResumeDelay={1000}
        resolution={isMobile ? 0.35 : 0.5}
      />
    </div>
  ), [isMobile]);

  return (
    <div className="w-full text-white overflow-x-hidden relative">
      {bg}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center max-w-2xl w-full gap-6">

          <h1 className="text-9xl md:text-[12rem] font-bold leading-none">
            <GradientText colors={['#FF3F3F', '#FF9A5F', '#FF3F3F', '#FF7A3F', '#FF3F3F']}>
              500
            </GradientText>
          </h1>

          <h2 className="text-2xl md:text-4xl font-bold">
            Le serveur a renversé son café ☕
          </h2>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-lg">
            Quelqu'un a dû faire{' '}
            <code className="bg-white/10 rounded px-1.5 py-0.5 text-orange-300 font-mono text-sm">
              rm -rf /
            </code>{' '}
            quelque part. Nos développeurs sont sur le coup, armés de caféine et de Stack Overflow.
            Ce n'est pas votre faute... probablement.
          </p>

          {/* Fake stack trace */}
          <div className="w-full max-w-lg bg-black/50 border border-white/10 rounded-xl overflow-hidden text-left font-mono text-xs md:text-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-gray-500 text-xs">netcy — stack trace</span>
            </div>
            <div className="p-4 space-y-1 min-h-[120px]">
              {stackTrace.slice(0, visibleLines).map((line, i) => (
                <p
                  key={i}
                  className={
                    line.startsWith('>')
                      ? 'text-yellow-400 pl-2'
                      : line.startsWith('Error')
                      ? 'text-red-400 font-bold'
                      : 'text-gray-400'
                  }
                >
                  {line}
                </p>
              ))}
              {visibleLines < stackTrace.length && (
                <span className="inline-block w-2 h-4 bg-white/70 animate-pulse align-middle" />
              )}
            </div>
          </div>

          {error.digest && (
            <p className="text-gray-500 text-xs font-mono">
              Digest : <span className="text-orange-400">{error.digest}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#FF3F3F] to-[#FF7A3F] hover:from-[#FF5050] hover:to-[#FF8A50] rounded-lg font-semibold transition shadow-lg shadow-red-500/30"
              style={{ width: '200px', height: '50px', fontSize: '16px' }}
            >
              ↺ Réessayer (avec espoir)
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold transition"
              style={{ width: '200px', height: '50px', fontSize: '16px' }}
            >
              ← Fuir vers l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

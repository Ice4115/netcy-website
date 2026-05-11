'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import LiquidEther from "@/components/LiquidEther";
import GradientText from "@/components/GradientText";
import Link from 'next/link';

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 1024;
  return ua || isSmallScreen;
};

const fakeLines = [
  '$ nmap -sV netcy.fr/cette-page',
  '> Scanning... 0 hosts up',
  '$ curl https://netcy.fr/cette-page',
  '> curl: (404) Page introuvable',
  '$ grep -r "cette-page" /var/www/',
  '> grep: no matches found',
  '$ sudo find / -name "cette-page"',
  '> find: Permission denied (et introuvable quand même)',
];

export default function NotFound() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [visibleLines, setVisibleLines] = useState(0);

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
    if (countdown <= 0) router.push('/');
  }, [countdown, router]);

  useEffect(() => {
    if (visibleLines >= fakeLines.length) return;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), 350);
    return () => clearTimeout(t);
  }, [visibleLines]);

  const bg = useMemo(() => (
    <div className="fixed inset-0 w-full h-full z-0">
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

  return (
    <div className="w-full text-white overflow-x-hidden relative">
      {bg}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center max-w-2xl w-full gap-6">

          <h1 className="text-7xl sm:text-9xl md:text-[12rem] font-bold leading-none">
            <GradientText colors={['#6F3FFF', '#8FA5FF', '#6F3FFF', '#7A8FFF', '#6F3FFF']}>
              404
            </GradientText>
          </h1>

          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold leading-snug">
            Cette page a fait un{' '}
            <code className="bg-white/10 rounded px-2 py-0.5 text-[#8FA5FF] font-mono text-base sm:text-xl md:text-2xl break-all">
              git push --delete
            </code>
          </h2>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-lg">
            On a lancé <span className="text-[#7A8FFF] font-semibold">Nmap</span>, sorti{' '}
            <span className="text-[#7A8FFF] font-semibold">Wireshark</span>, même fouillé le{' '}
            <span className="text-[#7A8FFF] font-semibold">dark web</span>...{' '}
            Cette page n'existe tout simplement pas. Ou elle s'est volatilisée dans le cyberespace.
          </p>

          {/* Fake terminal */}
          <div className="w-full max-w-lg bg-black/50 border border-white/10 rounded-xl overflow-hidden text-left font-mono text-xs md:text-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-gray-500 text-xs">netcy — bash</span>
            </div>
            <div className="p-4 space-y-1 min-h-[120px] overflow-x-auto">
              {fakeLines.slice(0, visibleLines).map((line, i) => (
                <p
                  key={i}
                  className={`break-all ${line.startsWith('>') ? 'text-red-400 pl-2' : 'text-[#8FA5FF]'}`}
                >
                  {line}
                </p>
              ))}
              {visibleLines < fakeLines.length && (
                <span className="inline-block w-2 h-4 bg-white/70 animate-pulse align-middle" />
              )}
            </div>
          </div>

          <p className="text-gray-400 text-sm">
            Redirection auto dans{' '}
            <span className="text-[#7A8FFF] font-bold text-xl">{countdown}</span>s...{' '}
            <span className="text-gray-500">(ou restez perdus, on ne juge pas)</span>
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base w-full sm:w-auto max-w-xs bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] hover:from-[#7A4FFF] hover:to-[#8A9FFF] rounded-lg font-semibold transition shadow-lg shadow-violet-500/30"
          >
            ← Retour à la réalité
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, useReducedMotion, useSpring } from 'motion/react';
import CodeWindow from './CodeWindow';

const LiquidEther = dynamic(() => import('@/components/LiquidEther'), { ssr: false });

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return ua || window.innerWidth <= 1024;
};

export default function ImmersiveHero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const y = useSpring(rawY, { stiffness: 60, damping: 32, mass: 0.6 });
  const opacity = useSpring(rawOpacity, { stiffness: 90, damping: 30 });

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden flex items-center"
      aria-label="Hero"
    >
      {/* Liquid fluid background — scoped to hero only */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: isMobile ? 0.28 : 0.22 }}
      >
        <LiquidEther
          colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
          mouseForce={isMobile ? 90 : 38}
          cursorSize={isMobile ? 320 : 170}
          autoDemo={!isMobile}
          autoSpeed={0.35}
          autoIntensity={1.2}
          autoResumeDelay={1200}
          resolution={isMobile ? 0.16 : 0.28}
          iterationsPoisson={isMobile ? 10 : 14}
          iterationsViscous={isMobile ? 10 : 14}
          dt={0.016}
          BFECC={false}
        />
      </div>

      {/* Grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(120,120,140,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,120,140,0.12) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
        }}
      />

      {/* Floating glyphs */}
      {!reduce && (
        <>
          <motion.span
            aria-hidden
            className="absolute left-[8%] top-[22%] text-5xl font-mono text-[#0052FF]/30 select-none hidden md:block"
            animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >{'</>'}</motion.span>
          <motion.span
            aria-hidden
            className="absolute right-[10%] top-[18%] text-4xl font-mono text-[#6F3FFF]/30 select-none hidden md:block"
            animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >{'{ }'}</motion.span>
          <motion.span
            aria-hidden
            className="absolute left-[12%] bottom-[18%] text-3xl font-mono text-[#F97316]/30 select-none hidden md:block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >const</motion.span>
          <motion.span
            aria-hidden
            className="absolute right-[14%] bottom-[22%] text-4xl font-mono text-[#0052FF]/25 select-none hidden md:block"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          >=&gt;</motion.span>
        </>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-28 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left — headline */}
          <motion.div
            className="lg:col-span-5 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0052FF]/10 text-[#0052FF] dark:bg-[#d0bcff]/10 dark:text-[#d0bcff] text-[11px] font-semibold tracking-wider uppercase ring-1 ring-[#0052FF]/20 dark:ring-[#d0bcff]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0052FF] dark:bg-[#d0bcff] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0052FF] dark:bg-[#d0bcff]" />
              </span>
              Web Agency 2.0
            </span>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02] tracking-tight text-on-surface">
              Des sites{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#0052FF] via-[#6F3FFF] to-[#F97316] bg-clip-text text-transparent">
                  immersifs
                </span>
                <span className="absolute inset-x-0 bottom-1 h-2 bg-gradient-to-r from-[#0052FF]/20 via-[#6F3FFF]/20 to-[#F97316]/20 blur-md -z-0" />
              </span>
              <br />
              conçus pour <em className="italic">marquer</em>.
            </h1>

            <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
              NETCY transforme vos idées en expériences web fluides, sécurisées et esthétiquement irréprochables — livrées au millimètre.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
              <a
                href="#contact"
                className="group relative overflow-hidden px-7 py-3.5 rounded-full font-semibold text-white shadow-lg shadow-[#0052FF]/30 transition-all hover:shadow-xl hover:shadow-[#F97316]/40 hover:-translate-y-0.5 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #0052FF 0%, #6F3FFF 60%, #F97316 100%)' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Démarrer un projet
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </a>
              <a
                href="#services"
                className="px-7 py-3.5 rounded-full font-semibold text-on-surface border-[1.5px] border-outline-variant hover:border-[#0052FF] hover:text-[#0052FF] dark:hover:border-[#d0bcff] dark:hover:text-[#d0bcff] transition-all cursor-pointer"
              >
                Voir nos services
              </a>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-5 justify-center lg:justify-start pt-4 text-xs text-outline">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>HTTPS obligatoire</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#0052FF] dark:text-[#d0bcff]" viewBox="0 0 20 20" fill="currentColor"><path d="M13 7H7v6h6V7z" /><path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" /></svg>
                <span>Next.js 16</span>
              </div>
            </div>
          </motion.div>

          {/* Right — Code Window */}
          <motion.div
            className="lg:col-span-7 relative"
            style={{ y, opacity, willChange: 'transform, opacity' }}
          >
            <CodeWindow />

            {/* Floating badges */}
            {!reduce && (
              <>
                <motion.div
                  className="absolute -left-4 sm:-left-8 top-10 px-3 py-2 rounded-xl bg-white/90 dark:bg-[#1c1b1c]/90 backdrop-blur-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 flex items-center gap-2 text-xs font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-on-surface">Lighthouse 98</span>
                </motion.div>

                <motion.div
                  className="absolute -right-4 sm:-right-6 -bottom-2 px-3 py-2 rounded-xl bg-white/90 dark:bg-[#1c1b1c]/90 backdrop-blur-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10 flex items-center gap-2 text-xs font-semibold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                >
                  <svg className="w-3.5 h-3.5 text-[#F97316]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                  <span className="text-on-surface">Core Web Vitals</span>
                </motion.div>

                <motion.div
                  className="absolute right-8 -top-4 px-3 py-2 rounded-xl bg-gradient-to-br from-[#0052FF] to-[#6F3FFF] text-white shadow-lg flex items-center gap-2 text-xs font-semibold"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" /></svg>
                  <span>Sécurisé par design</span>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        {!reduce && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 text-outline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
            <motion.div
              className="w-5 h-8 rounded-full border-2 border-current flex items-start justify-center p-1"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.span
                className="w-1 h-1.5 rounded-full bg-current"
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

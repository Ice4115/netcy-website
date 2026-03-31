'use client';

import Link from 'next/link';
import { LogoNetcy } from '@/components/LogoNetcy';
import Image from 'next/image';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function QRLandingPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Logo top center */}
      <header className="pt-8 flex justify-center">
        <Link href="/" className="flex items-center">
          <LogoNetcy className="h-[44px] w-auto" />
        </Link>
      </header>

      {/* Center content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Decorative dots grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #191C1D 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="relative z-10 space-y-8 max-w-lg animate-fade-up">
          <span className="chip inline-block">DIGITAL ARCHITECTURE</span>

          <div className="space-y-3">
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-on-surface leading-[1.05] tracking-tight">
              L'avenir se construit{' '}
              <span className="text-[#0052FF]">maintenant.</span>
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Concevoir des expériences numériques à la pointe de l'innovation.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="btn-primary px-8 py-4 text-base flex items-center gap-2"
            >
              Accéder au site <ArrowRight size={16} />
            </Link>
            <a
              href="/#contact"
              className="btn-ghost px-8 py-4 text-base flex items-center gap-2"
            >
              <MessageCircle size={16} strokeWidth={1.5} />
              Nous contacter
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 text-center">
        <p className="text-xs text-outline-variant uppercase tracking-widest">
          © {new Date().getFullYear()} NETCY DIGITAL ARCHITECTURE
        </p>
      </footer>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavLink from '@/components/NavLink';
import { ArrowRight, RotateCcw, Asterisk, Terminal } from 'lucide-react';

export default function ContactSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); router.push('/'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Logo */}
      <header className="pt-6 sm:pt-8 px-4 sm:px-8">
        <Link href="/" className="font-display font-bold text-xl text-on-surface">NETCY</Link>
      </header>

      {/* Center */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="space-y-8 max-w-md animate-fade-up">
          {/* Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="w-24 h-24 bg-surface-container-lowest rounded-full shadow-sm flex items-center justify-center">
              <svg className="w-10 h-10 text-[#0052FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0052FF] rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-3">
            <span className="chip text-[#0052FF] bg-[#EEF2FF] dark:bg-[#1a1f3d]">VÉRIFICATION ENVOYÉE</span>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-on-surface">Email envoyé</h1>
            <p className="text-on-surface-variant leading-relaxed">
              Nous avons envoyé un lien de confirmation sécurisé à votre adresse email. Veuillez vérifier votre boîte de réception pour activer votre compte et commencer avec NETCY.
            </p>
          </div>

          {/* Countdown */}
          <p className="text-sm text-outline">
            Redirection vers l'accueil dans <span className="text-[#0052FF] font-semibold">{countdown}s</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="btn-primary px-7 py-3.5 text-base flex items-center gap-2">
              Retour à l'accueil <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="btn-ghost px-7 py-3.5 text-base flex items-center gap-2"
            >
              <RotateCcw size={16} strokeWidth={1.5} />
              Renvoyer l'email
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-6 sm:pb-8 px-4 text-center space-y-3">
        <p className="text-xs font-semibold text-outline uppercase tracking-widest">SUPPORT DIGITAL ARCHITECTURE</p>
        <div className="flex items-center justify-center gap-3 text-xs text-outline-variant">
          <NavLink href="/politique-confidentialite" className="hover:text-outline transition-colors">Protocole de confidentialité</NavLink>
          <span>·</span>
          <NavLink href="/cgu" className="hover:text-outline transition-colors">Conditions de sécurité</NavLink>
        </div>
        <p className="text-xs text-outline-variant uppercase tracking-widest">
          © {new Date().getFullYear()} NETCY DIGITAL ARCHITECTURE. TOUS DROITS RÉSERVÉS.
        </p>
        <div className="flex items-center justify-end px-8 gap-4 text-outline-variant">
          <Asterisk size={14} strokeWidth={1.5} />
          <Terminal size={14} strokeWidth={1.5} />
        </div>
      </footer>
    </div>
  );
}

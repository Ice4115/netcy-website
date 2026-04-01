"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogoNetcy } from '@/components/LogoNetcy';
import { Mail, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { signIn, getCurrentUser, signInWithGoogle } from '@/lib/supabase';

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  useEffect(() => {
    checkIfLoggedIn();
    const stored = localStorage.getItem('loginAttempts');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.lockoutUntil && Date.now() < data.lockoutUntil) {
        setLockoutUntil(data.lockoutUntil);
        setAttempts(data.attempts);
      }
    }
  }, []);

  const checkIfLoggedIn = async () => {
    const user = await getCurrentUser();
    if (user) router.push('/client');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(`Trop de tentatives. Réessayez dans ${remaining} secondes.`);
      return;
    }
    if (attempts >= 5) {
      const lockTime = Date.now() + 15 * 60 * 1000;
      setLockoutUntil(lockTime);
      localStorage.setItem('loginAttempts', JSON.stringify({ attempts, lockoutUntil: lockTime }));
      setError('Trop de tentatives échouées. Compte bloqué pendant 15 minutes.');
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Format d\'email invalide');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data, error: signInError } = await signIn(email, password, false);
      if (signInError) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('loginAttempts', JSON.stringify({ attempts: newAttempts, lockoutUntil: null }));
        setError(signInError.message.includes('Invalid') ? 'Email ou mot de passe incorrect' : 'Erreur de connexion. Veuillez réessayer.');
        setLoading(false);
        return;
      }
      if (data.user) {
        localStorage.removeItem('loginAttempts');
        router.push('/client');
      }
    } catch {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        setError('Erreur lors de la connexion avec Google');
        setLoading(false);
      }
    } catch {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  const isLocked = !!(lockoutUntil && Date.now() < lockoutUntil);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-container flex-col justify-between p-12 relative overflow-hidden flex-shrink-0">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0052FF]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#0052FF]/5 rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="relative z-10">
          <LogoNetcy className="h-20 w-auto" />
        </Link>

        <div className="space-y-8 relative z-10">
          <span className="chip text-[#0052FF] bg-surface-container-lowest/60">DIGITAL CORE ARCHITECTURE</span>
          <div>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-on-surface leading-tight mb-4">
              Precision in{' '}
              <span className="text-[#0052FF]">Digital</span>
              <br />Infrastructure.
            </h2>
            <p className="text-on-surface-variant leading-relaxed max-w-sm">
              Accédez à votre tableau de bord NETCY pour gérer vos projets et suivre vos indicateurs techniques.
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-lowest/70 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-[#0052FF]" strokeWidth={1.5} />
                <span className="font-display font-bold text-lg text-on-surface">99.9%</span>
              </div>
              <p className="text-xs text-outline">Uptime Core Stability</p>
            </div>
            <div className="bg-surface-container-lowest/70 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-[#0052FF]" strokeWidth={1.5} />
                <span className="font-display font-bold text-lg text-on-surface">Chiffré</span>
              </div>
              <p className="text-xs text-outline">Protocole AES-256</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-outline relative z-10">© {new Date().getFullYear()} NETCY DIGITAL</p>
      </div>

      {/* ── Right panel – form ── */}
      <div className="flex-1 flex flex-col justify-between p-6 lg:p-10 bg-surface-container-lowest dark:bg-[#0E0E0F] overflow-y-auto min-h-screen lg:min-h-0">
        <div className="flex justify-between items-center">
          <Link href="/" className="lg:hidden font-display font-bold text-xl text-on-surface">NETCY</Link>
          <div className="hidden lg:block" />
          <Link href="/inscription" className="text-sm font-semibold text-[#0052FF] hover:underline">
            S'inscrire
          </Link>
        </div>

        <div className="max-w-md mx-auto w-full space-y-5">
          <div>
            <h1 className="font-display font-bold text-3xl text-on-surface mb-2">
              Bienvenue
            </h1>
            <p className="text-outline text-sm">Veuillez entrer vos identifiants pour continuer.</p>
          </div>

          {error && (
            <div className="bg-[#FEE2E2] dark:bg-[#450A0A] rounded-xl px-4 py-3">
              <p className="text-[#BF3003] dark:text-[#FCA5A5] text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Adresse email
              </label>
              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#0052FF]/30 transition-all">
                <Mail size={16} className="text-outline-variant" strokeWidth={1.5} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLocked}
                  placeholder="architecte@netcy.com"
                  className="flex-1 bg-transparent text-on-surface text-sm placeholder:text-outline-variant focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Mot de passe
                </label>
                <Link href="/mot-de-passe-oublie" className="text-xs text-[#0052FF] hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#0052FF]/30 transition-all">
                <Lock size={16} className="text-outline-variant" strokeWidth={1.5} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLocked}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-on-surface text-sm placeholder:text-outline-variant focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : isLocked ? 'Compte bloqué' : 'Accéder au Core'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-surface-container" />
            <span className="text-xs text-outline-variant uppercase tracking-widest">ou connexion sécurisée via</span>
            <div className="flex-1 h-px bg-surface-container" />
          </div>

          {/* Google only */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading || isLocked}
            type="button"
            className="btn-ghost w-full py-3.5 flex items-center justify-center gap-3 text-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
        </div>

        {/* Footer links */}
        <div className="max-w-md mx-auto w-full">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-outline-variant pt-2">
            <Link href="/politique-confidentialite" className="hover:text-outline transition-colors">Politique de Confidentialité</Link>
            <span>·</span>
            <Link href="/cgu" className="hover:text-outline transition-colors">Conditions d'utilisation</Link>
            <span>·</span>
            <Link href="/cgu" className="hover:text-outline transition-colors">Cookies</Link>
          </div>
          <p className="text-center text-xs text-outline-variant mt-2">© {new Date().getFullYear()} NETCY DIGITAL</p>
        </div>
      </div>

      {/* System status badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-surface-container-highest rounded-full px-4 py-2 shadow-md text-xs font-medium text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Système : <span className="text-green-600 dark:text-green-400 font-semibold">Opérationnel</span>
        </div>
      </div>
    </div>
  );
}

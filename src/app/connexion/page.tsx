"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Fingerprint } from '@/components/animate-ui/icons/fingerprint';
import { Checkbox } from '@/components/animate-ui/components/base/checkbox';
import { signIn, getCurrentUser, signInWithGoogle } from '@/lib/supabase';

const LiquidEther = dynamic(() => import('@/components/LiquidEther'), {
  ssr: false,
});

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

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
    if (user) {
      router.push('/client');
    }
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
      const { data, error: signInError } = await signIn(email, password, rememberMe);
      
      if (signInError) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('loginAttempts', JSON.stringify({ attempts: newAttempts, lockoutUntil: null }));
        
        if (signInError.message.includes('Invalid')) {
          setError('Email ou mot de passe incorrect');
        } else {
          setError('Erreur de connexion. Veuillez réessayer.');
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        localStorage.removeItem('loginAttempts');
        router.push('/client');
      }
    } catch (err: any) {
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
    } catch (err) {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  const isLocked = !!(lockoutUntil && Date.now() < lockoutUntil);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 w-full h-full">
        <LiquidEther
          colors={['#3F12F3', '#4670D2', '#5670A4', '#2A0F7F']}
          mouseForce={20}
          cursorSize={100}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          autoResumeDelay={1000}
          resolution={0.5}
        />
      </div>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                <Fingerprint 
                  size={32} 
                  className="text-purple-400" 
                  strokeWidth={1.5}
                  animate={true}
                  animation="default"
                  loop={true}
                  loopDelay={5000}
                />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
              <p className="text-gray-300">Accédez à votre espace personnel</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLocked}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLocked}
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="bg-white/10 border-white/20 focus-visible:ring-purple-500 [&[data-checked]]:bg-purple-500 [&[data-checked]]:text-white"
                  />
                  <span className="ml-2 text-sm text-gray-300">Se souvenir de moi</span>
                </label>
                <Link href="/mot-de-passe-oublie" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Mot de passe oublié?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || isLocked}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Connexion...' : isLocked ? 'Compte bloqué' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-gray-300 text-sm">OU</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loading || isLocked}
                type="button"
                className="mt-4 w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuer avec Google
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                Pas encore de compte?{' '}
                <Link href="/inscription" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  S&apos;inscrire
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

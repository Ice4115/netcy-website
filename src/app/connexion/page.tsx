"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Fingerprint } from '@/components/animate-ui/icons/fingerprint';
import { Checkbox } from '@/components/animate-ui/components/base/checkbox';
import { signIn, getCurrentUser } from '@/lib/supabase';

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
      router.push('/espace-client');
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
      const { data, error: signInError } = await signIn(email, password);
      
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
        router.push('/espace-client');
      }
    } catch (err: any) {
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
                  loopDelay={2000}
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
                <label className="flex items-center opacity-50 cursor-not-allowed">
                  <Checkbox
                    disabled
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

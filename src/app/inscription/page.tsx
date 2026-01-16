"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { signUp, getCurrentUser, supabase } from '@/lib/supabase';

const LiquidEther = dynamic(() => import('@/components/LiquidEther'), {
  ssr: false,
});

export default function InscriptionPage() {
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [type, setType] = useState<'particulier' | 'entreprise' | 'association'>('particulier');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    const user = await getCurrentUser();
    if (user) {
      router.push('/espace-client');
    }
  };

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (pass.length >= 12) strength += 25;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 20;
    if (/\d/.test(pass)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pass)) strength += 15;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const validateForm = () => {
    if (nom.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères');
      return false;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Format d\'email invalide');
      return false;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Le mot de passe doit contenir au moins une majuscule');
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setError('Le mot de passe doit contenir au moins une minuscule');
      return false;
    }

    if (!/\d/.test(password)) {
      setError('Le mot de passe doit contenir au moins un chiffre');
      return false;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      setError('Le mot de passe doit contenir au moins un caractère spécial');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp(email, password);
      
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Cet email est déjà utilisé');
        } else {
          setError('Erreur lors de l\'inscription. Veuillez réessayer.');
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('clients')
          .insert({
            id: data.user.id,
            nom: nom.trim(),
            email: email,
            type: type,
            role: 'client'
          });

        if (profileError) {
          console.error('Erreur création profil:', profileError);
        }

        setSuccess(true);
        setTimeout(() => {
          router.push('/connexion');
        }, 3000);
      }
    } catch (err: any) {
      setError('Une erreur est survenue lors de l\'inscription');
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength >= 80) return 'bg-green-500';
    if (passwordStrength >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStrengthText = () => {
    if (passwordStrength >= 80) return 'Fort';
    if (passwordStrength >= 50) return 'Moyen';
    return 'Faible';
  };

  if (success) {
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
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <span className="text-4xl">✓</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Inscription réussie !</h1>
              <p className="text-gray-300 mb-6">
                Un email de confirmation a été envoyé à <strong>{email}</strong>.
                <br /><br />
                Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation.
              </p>
              <p className="text-gray-400 text-sm">
                Redirection automatique dans 3 secondes...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Inscription</h1>
              <p className="text-gray-300">Créez votre compte NETCY</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-200 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  minLength={2}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-200 mb-2">
                  Type de compte *
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="particulier" className="bg-gray-800">Particulier</option>
                  <option value="entreprise" className="bg-gray-800">Entreprise</option>
                  <option value="association" className="bg-gray-800">Association</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Force du mot de passe</span>
                      <span className={`text-xs font-semibold ${passwordStrength >= 80 ? 'text-green-400' : passwordStrength >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                Déjà un compte?{' '}
                <Link href="/connexion" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Se connecter
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

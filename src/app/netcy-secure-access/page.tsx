'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/supabase';
import Image from 'next/image';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError('Identifiants incorrects');
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push('/netcy-secure-access/dashboard');
      }
    } catch (err: any) {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0A061E]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6F3FFF]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#43209E]/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md p-6 relative z-10">
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
          {/* Subtle border glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6F3FFF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="relative">
            {/* Logo/Icon placeholder */}
            <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-6 overflow-hidden shadow-lg shadow-[#6F3FFF]/30">
              <Image src="/images/logo_tab.png" alt="Netcy Logo" width={64} height={64} className="object-contain" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Espace Admin</h1>
            <p className="text-gray-400 text-center mb-10 text-sm">Gestion sécurisée de la plateforme</p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                <p className="text-red-400 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
                  Email Administrateur
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:border-[#6F3FFF] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#6F3FFF] transition-all duration-300"
                    placeholder="admin@netcy.fr"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.1] rounded-xl text-white placeholder-gray-500 focus:border-[#6F3FFF] focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-[#6F3FFF] transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group/btn mt-8 overflow-hidden rounded-xl bg-gradient-to-r from-[#6F3FFF] to-[#43209E] p-[1px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(111,63,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <div className="relative flex items-center justify-center gap-2 rounded-xl bg-[#0A061E]/50 px-4 py-3 transition-all duration-300 group-hover/btn:bg-transparent">
                  <span className="font-semibold text-white tracking-wide">
                    {loading ? 'Authentification...' : 'Accéder au panel'}
                  </span>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

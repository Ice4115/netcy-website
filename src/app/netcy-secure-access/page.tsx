'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signOut, supabase } from '@/lib/supabase';
import NavLink from '@/components/NavLink';

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('reason') === 'unauthorized') {
      setError('ACCÈS REFUSÉ — Session invalide ou expirée');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1 — Authenticate with Supabase
      const { data, error: authError } = await signIn(email, password);
      if (authError || !data.user) {
        setError('ACCÈS REFUSÉ — Identifiants invalides');
        setLoading(false);
        return;
      }

      // Step 2 — Get the access token from the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        await signOut();
        setError('ERREUR SYSTÈME — Session introuvable');
        setLoading(false);
        return;
      }

      // Step 3 — Verify admin role server-side (sets secure HTTP-only cookie)
      const verifyRes = await fetch('/api/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: session.access_token }),
      });

      if (!verifyRes.ok) {
        // Not admin — sign out immediately and deny access
        await signOut();
        setError('ACCÈS REFUSÉ — Droits administrateur requis');
        setLoading(false);
        return;
      }

      // Step 4 — Cookie set, proceed to dashboard
      router.push('/netcy-secure-access/dashboard');

    } catch {
      await signOut();
      setError('ERREUR SYSTÈME — Réessayer');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0E0F12] relative overflow-hidden font-mono">

      {/* Background diagonal lines — top-right */}
      <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none opacity-20"
        style={{
          background: 'repeating-linear-gradient(135deg, transparent, transparent 18px, #1CF0C1 18px, #1CF0C1 19px)',
        }}
      />
      {/* Background diagonal lines — bottom-left */}
      <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none opacity-20"
        style={{
          background: 'repeating-linear-gradient(135deg, transparent, transparent 18px, #1CF0C1 18px, #1CF0C1 19px)',
        }}
      />

      {/* Top header */}
      <div className="text-center pt-10 pb-6 relative z-10">
        <p className="text-white font-extrabold text-2xl tracking-[0.25em] uppercase">NETCY</p>
        <p className="text-[#1CF0C1] text-[10px] tracking-[0.4em] uppercase mt-1">COMMAND CENTER</p>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-start justify-center px-4 relative z-10 pt-8">
        <div className="w-full max-w-md bg-[#16181D] rounded-2xl overflow-hidden">

          {/* Card inner */}
          <div className="p-8 sm:p-10">
            {/* Status */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1CF0C1] animate-pulse" />
              <span className="text-[#1CF0C1] text-[10px] tracking-[0.3em] uppercase font-semibold">System Online</span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight" style={{ fontFamily: 'var(--font-manrope)' }}>
              Authorize Access
            </h1>
            <p className="text-[#5A5D6B] text-sm mb-8">Secure Entry Protocol Required</p>

            {error && (
              <div className="border border-red-500/40 bg-red-500/10 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <p className="text-red-400 text-xs tracking-wider">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-[0.25em] text-[#5A5D6B] uppercase">
                  Administrator Protocol ID
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="CR-098-ALPHA"
                  className="w-full bg-[#1E2028] border border-[#2A2D38] rounded-xl px-4 py-3.5 text-white text-sm placeholder-[#3A3D4A] focus:outline-none focus:border-[#1CF0C1]/40 focus:bg-[#20222A] transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-[0.25em] text-[#5A5D6B] uppercase">
                  Neural Security Key
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#1E2028] border border-[#2A2D38] rounded-xl px-4 py-3.5 text-white text-sm placeholder-[#3A3D4A] focus:outline-none focus:border-[#1CF0C1]/40 focus:bg-[#20222A] transition-all"
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #C084FC 0%, #F9A8D4 50%, #FCA5A5 100%)',
                    padding: '1px',
                  }}
                >
                  <div
                    className="rounded-xl px-4 py-3.5 flex items-center justify-center transition-all"
                    style={{
                      background: loading
                        ? 'transparent'
                        : 'linear-gradient(135deg, #C084FC 0%, #F9A8D4 50%, #FCA5A5 100%)',
                    }}
                  >
                    <span className="text-[#1A0A2E] font-bold text-sm tracking-[0.2em] uppercase">
                      {loading ? 'Authentification...' : 'Authorize Access'}
                    </span>
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* Card footer */}
          <div className="border-t border-[#1E2028] px-8 sm:px-10 py-4 flex items-center justify-between">
            <div>
              <p className="text-[9px] tracking-[0.2em] text-[#3A3D4A] uppercase">Encryption</p>
              <p className="text-[10px] text-[#5A5D6B] font-semibold tracking-wider">AES-256-XTS</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] tracking-[0.2em] text-[#3A3D4A] uppercase">Node ID</p>
              <p className="text-[10px] text-[#5A5D6B] font-semibold tracking-wider">NV-77-CMD-01</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-8 py-6 gap-3">
        <p className="text-[9px] tracking-[0.2em] text-[#3A3D4A] uppercase">
          © {new Date().getFullYear()} NETCY Architect. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-[9px] tracking-[0.15em] text-[#3A3D4A] uppercase">
          <NavLink href="/politique-confidentialite" className="hover:text-[#5A5D6B] transition-colors">Security Protocol</NavLink>
          <span>·</span>
          <NavLink href="/cgu" className="hover:text-[#5A5D6B] transition-colors">Encryption Standards</NavLink>
          <span>·</span>
          <a href="#" className="hover:text-[#5A5D6B] transition-colors">System Status</a>
        </div>
      </footer>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense>
      <AdminLoginInner />
    </Suspense>
  );
}

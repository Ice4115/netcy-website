'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function VerificationInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [status, setStatus] = useState<'waiting' | 'verified' | 'resent'>('waiting');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0); // cooldown avant de renvoyer
  const [dots, setDots] = useState('');

  /* ── animation des points ── */
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 500);
    return () => clearInterval(t);
  }, []);

  /* ── polling : vérification de l'email toutes les 3s ── */
  const checkVerified = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email_confirmed_at) {
      setStatus('verified');
      setTimeout(() => router.push('/client'), 2000);
      return true;
    }
    // Tente aussi via refreshSession pour forcer la mise à jour
    const { data: refreshData } = await supabase.auth.refreshSession();
    if (refreshData?.user?.email_confirmed_at) {
      setStatus('verified');
      setTimeout(() => router.push('/client'), 2000);
      return true;
    }
    return false;
  }, [router]);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;

    const poll = async () => {
      const done = await checkVerified();
      if (!done) id = setTimeout(poll, 3000);
    };

    poll();
    return () => clearTimeout(id);
  }, [checkVerified]);

  /* ── countdown renvoyer ── */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  /* ── renvoyer l'email de confirmation ── */
  const resend = async () => {
    if (!email || countdown > 0) return;
    setResending(true);
    await supabase.auth.resend({ type: 'signup', email });
    setResending(false);
    setStatus('resent');
    setCountdown(60);
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A1C1E] flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0052FF]/20 rounded-full blur-3xl pointer-events-none" />

        <Link href="/" className="relative z-10">
          <img src="/images/logo_netcy_t.svg" alt="NETCY" className="h-30 w-auto brightness-0 invert" />
        </Link>

        <div className="space-y-8 relative z-10">
          <span className="inline-block chip bg-surface-container-lowest/10 text-white/70">VÉRIFICATION</span>
          <div>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-white leading-tight mb-4">
              Plus qu'une{' '}
              <span className="text-[#0052FF] italic">étape</span>
              <br />pour accéder à votre espace.
            </h2>
            <p className="text-white/60 leading-relaxed max-w-sm">
              Un e-mail de confirmation vous a été envoyé. Vérifiez votre boîte de réception et cliquez sur le lien pour activer votre compte.
            </p>
          </div>
        </div>

        <p className="text-xs text-white/30 relative z-10">© {new Date().getFullYear()} NETCY DIGITAL</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-16 bg-surface-container-lowest">
        <div className="flex justify-between items-center">
          <Link href="/" className="lg:hidden">
            <img src="/images/logo_netcy_t.svg" alt="NETCY" className="h-12 w-auto" />
          </Link>
          <div className="hidden lg:block" />
          <Link href="/connexion" className="text-sm font-medium text-on-surface-variant">
            Déjà vérifié ?{' '}
            <span className="text-[#0052FF] font-semibold hover:underline">Se connecter</span>
          </Link>
        </div>

        <div className="max-w-md mx-auto w-full space-y-8">
          {status === 'verified' ? (
            /* ── État vérifié ── */
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center animate-pulse">
                  <CheckCircle2 size={40} className="text-green-500" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-on-surface mb-2">
                  Email vérifié avec succès !
                </h1>
                <p className="text-sm text-outline">
                  Votre compte est activé. Redirection vers votre espace client en cours
                  <span className="inline-block w-6 text-left">{dots}</span>
                </p>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1 overflow-hidden">
                <div className="h-full bg-[#0052FF] rounded-full animate-[progress_2s_linear_forwards]" />
              </div>
            </div>
          ) : (
            /* ── État en attente ── */
            <div className="space-y-8">
              {/* Icône animée */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#0052FF]/10 flex items-center justify-center">
                    <Mail size={36} className="text-[#0052FF]" strokeWidth={1.5} />
                  </div>
                  {/* Cercles pulsants */}
                  <div className="absolute inset-0 rounded-full bg-[#0052FF]/10 animate-ping" />
                </div>
              </div>

              <div className="text-center space-y-3">
                <h1 className="font-display font-bold text-2xl text-on-surface">
                  Vérifiez votre boîte mail
                </h1>
                <p className="text-sm text-outline leading-relaxed">
                  Un e-mail de confirmation a été envoyé à
                  {email && (
                    <>
                      {' '}
                      <span className="font-semibold text-on-surface">{email}</span>
                    </>
                  )}
                  .<br />
                  Cliquez sur le lien dans le mail pour vérifier que c'est bien vous.
                </p>
              </div>

              {/* Info box */}
              <div className="bg-surface-container-low rounded-2xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0052FF] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-sm text-on-surface-variant">Ouvrez votre boîte mail</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0052FF] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-sm text-on-surface-variant">Cherchez un mail de <span className="font-medium">NETCY</span> (vérifiez les spams)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0052FF] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-sm text-on-surface-variant">Cliquez sur le lien de confirmation → vous serez redirigé automatiquement</p>
                </div>
              </div>

              {/* Indicateur de polling */}
              <div className="flex items-center justify-center gap-2 text-xs text-outline">
                <RefreshCw size={12} className="animate-spin" />
                <span>En attente de confirmation{dots}</span>
              </div>

              {/* Résultat du renvoi */}
              {status === 'resent' && (
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-center">
                  <p className="text-sm text-green-700 font-medium">
                    ✓ Mail renvoyé avec succès
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={resend}
                  disabled={resending || countdown > 0}
                  className="btn-ghost py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                  {countdown > 0
                    ? `Renvoyer le mail (${countdown}s)`
                    : resending
                    ? 'Envoi en cours...'
                    : 'Renvoyer le mail de confirmation'}
                </button>

                <Link
                  href="/inscription"
                  className="flex items-center justify-center gap-2 text-sm text-outline hover:text-on-surface transition-colors"
                >
                  <ArrowLeft size={14} />
                  Recommencer l'inscription
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="max-w-md mx-auto w-full">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-outline-variant pt-6 pr-14">
            <Link href="/#contact" className="hover:text-outline transition-colors underline underline-offset-2">Centre d'aide</Link>
            <span>·</span>
            <Link href="/politique-confidentialite" className="hover:text-outline transition-colors underline underline-offset-2">Confidentialité</Link>
            <span>·</span>
            <span className="flex items-center gap-1">🌐 FR (FR)</span>
          </div>
        </div>
      </div>

      {/* System status badge */}
      <div className="hidden sm:block fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-[#1A1C1E] rounded-full px-4 py-2 text-xs font-medium text-white">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          SYSTÈME : OPÉRATIONNEL
        </div>
      </div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-2 border-[#0052FF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerificationInner />
    </Suspense>
  );
}

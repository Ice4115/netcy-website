'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, BarChart2, Target, X, ChevronDown } from 'lucide-react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_NAME = 'netcy_cookie_consent';
const COOKIE_EXPIRY_DAYS = 180;

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out
        ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
        ${checked ? 'bg-[#0052FF]' : 'bg-white/20 border border-white/30'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ease-in-out shadow-sm
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      setShowBanner(true);
    } else {
      setPreferences(consent);
      applyConsent(consent);
    }

    const handleReopenSettings = () => {
      const currentConsent = getCookieConsent();
      if (currentConsent) setPreferences(currentConsent);
      setShowBanner(true);
      setShowSettings(true);
    };

    window.addEventListener('openCookieSettings', handleReopenSettings);
    return () => window.removeEventListener('openCookieSettings', handleReopenSettings);
  }, []);

  const getCookieConsent = (): CookiePreferences | null => {
    if (typeof window === 'undefined') return null;
    const consent = localStorage.getItem(COOKIE_CONSENT_NAME);
    return consent ? JSON.parse(consent) : null;
  };

  const saveConsent = (prefs: CookiePreferences) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
    localStorage.setItem(COOKIE_CONSENT_NAME, JSON.stringify(prefs));
    localStorage.setItem(`${COOKIE_CONSENT_NAME}_expiry`, expiryDate.toISOString());
    setPreferences(prefs);
    applyConsent(prefs);
    setIsAnimating(true);
    setTimeout(() => {
      setShowBanner(false);
      setShowSettings(false);
      setIsAnimating(false);
    }, 400);
  };

  const applyConsent = (prefs: CookiePreferences) => {
    if (typeof window === 'undefined') return;
    if (prefs.analytics) console.log('Analytics cookies enabled');
    else console.log('Analytics cookies disabled');
    if (prefs.marketing) console.log('Marketing cookies enabled');
    else console.log('Marketing cookies disabled');
  };

  const acceptAll = () => saveConsent({ necessary: true, analytics: true, marketing: true });
  const rejectAll = () => saveConsent({ necessary: true, analytics: false, marketing: false });
  const saveCustom = () => saveConsent(preferences);

  const openSettings = () => {
    const currentConsent = getCookieConsent();
    if (currentConsent) setPreferences(currentConsent);
    setIsAnimating(true);
    setTimeout(() => { setShowSettings(true); setIsAnimating(false); }, 200);
  };

  const closeSettings = () => {
    setIsAnimating(true);
    setTimeout(() => { setShowSettings(false); setIsAnimating(false); }, 200);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center pointer-events-none transition-opacity duration-400 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`pointer-events-auto w-full max-w-4xl mx-4 mb-4 transition-all duration-400 ${
          isAnimating ? 'translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {!showSettings ? (
          /* ── Banner simple ── */
          <div className="bg-[#1A1C1E] border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              {/* Icon + texte */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-[#0052FF]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie size={18} className="text-[#0052FF]" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-display font-semibold text-sm mb-1">
                    Gestion des cookies
                  </p>
                  <p className="text-white/55 text-xs leading-relaxed">
                    Nous utilisons des cookies pour le bon fonctionnement du site et la mesure d&apos;audience.{' '}
                    <Link href="/cookies" className="text-[#0052FF] hover:text-[#3D7BFF] underline underline-offset-2 transition-colors">
                      Gérer mes préférences
                    </Link>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto flex-shrink-0">
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-white/70 hover:text-white text-xs font-medium rounded-xl border border-white/15 hover:border-white/30 transition-all"
                >
                  Refuser
                </button>
                <button
                  onClick={openSettings}
                  className="px-4 py-2 text-white/70 hover:text-white text-xs font-medium rounded-xl border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-1.5"
                >
                  Personnaliser <ChevronDown size={12} />
                </button>
                <button
                  onClick={acceptAll}
                  className="px-5 py-2 bg-[#0052FF] hover:bg-[#003EC7] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#0052FF]/25"
                >
                  Tout accepter
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── Panneau personnalisation ── */
          <div className="bg-[#1A1C1E] border border-white/10 rounded-2xl p-5 md:p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#0052FF]/15 rounded-lg flex items-center justify-center">
                  <Cookie size={15} className="text-[#0052FF]" />
                </div>
                <h3 className="text-white font-display font-bold text-base">Préférences des cookies</h3>
              </div>
              <button
                onClick={closeSettings}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Cookie rows */}
            <div className="space-y-2.5 mb-5">
              {/* Nécessaires */}
              <div className="bg-white/5 rounded-xl px-4 py-3.5 border border-white/8">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <ShieldCheck size={15} className="text-[#0052FF] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold">Nécessaires</p>
                      <p className="text-white/45 text-xs leading-relaxed hidden sm:block">
                        Fonctionnement du site, mémorisation du consentement. Toujours actifs.
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch checked disabled onChange={() => {}} />
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-white/5 rounded-xl px-4 py-3.5 border border-white/8 hover:bg-white/8 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <BarChart2 size={15} className="text-[#0052FF] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold">Performance & Analytics</p>
                      <p className="text-white/45 text-xs leading-relaxed hidden sm:block">
                        Mesure d&apos;audience via Google Analytics. IP anonymisées.
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={preferences.analytics}
                    onChange={(v) => setPreferences({ ...preferences, analytics: v })}
                  />
                </div>
              </div>

              {/* Marketing */}
              <div className="bg-white/5 rounded-xl px-4 py-3.5 border border-white/8 hover:bg-white/8 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Target size={15} className="text-[#0052FF] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold">Targeting & Marketing</p>
                      <p className="text-white/45 text-xs leading-relaxed hidden sm:block">
                        Contenus personnalisés et mesure de campagnes publicitaires.
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={preferences.marketing}
                    onChange={(v) => setPreferences({ ...preferences, marketing: v })}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={rejectAll}
                className="flex-1 px-4 py-2.5 text-white/70 hover:text-white text-xs font-medium rounded-xl border border-white/15 hover:border-white/30 transition-all"
              >
                Tout refuser
              </button>
              <button
                onClick={saveCustom}
                className="flex-1 px-4 py-2.5 bg-[#0052FF] hover:bg-[#003EC7] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#0052FF]/25"
              >
                Enregistrer mes choix
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 px-4 py-2.5 bg-white text-[#191C1D] text-xs font-semibold rounded-xl hover:bg-[#F3F4F5] transition-all"
              >
                Tout accepter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function openCookieSettings() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('openCookieSettings'));
  }
}

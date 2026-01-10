'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
        relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ease-in-out
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${checked 
          ? 'bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] shadow-lg shadow-violet-500/30' 
          : 'bg-white/20 border border-white/30'
        }
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 ease-in-out
          shadow-md
          ${checked ? 'translate-x-8' : 'translate-x-1'}
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
      if (currentConsent) {
        setPreferences(currentConsent);
      }
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
    }, 500);
  };

  const applyConsent = (prefs: CookiePreferences) => {
    if (typeof window === 'undefined') return;

    if (prefs.analytics) {
      console.log('Analytics cookies enabled');
    } else {
      console.log('Analytics cookies disabled');
    }

    if (prefs.marketing) {
      console.log('Marketing cookies enabled');
    } else {
      console.log('Marketing cookies disabled');
    }
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  const openSettings = () => {
    const currentConsent = getCookieConsent();
    if (currentConsent) {
      setPreferences(currentConsent);
    }
    setIsAnimating(true);
    setTimeout(() => {
      setShowSettings(true);
      setIsAnimating(false);
    }, 300);
  };

  const closeSettings = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowSettings(false);
      setIsAnimating(false);
    }, 300);
  };

  if (!showBanner) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center pointer-events-none transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`pointer-events-auto w-full max-w-5xl mx-4 mb-4 transition-all duration-500 ${isAnimating ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
        {!showSettings ? (
          <div className="bg-gradient-to-br from-[#0f0a20]/95 to-[#1a0f3a]/95 backdrop-blur-xl border border-[#6F3FFF]/40 rounded-2xl p-6 md:p-8 shadow-2xl shadow-violet-500/20">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  🍪 Gestion des Cookies
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Nous utilisons des cookies pour assurer le bon fonctionnement du site et mesurer l&apos;audience. 
                  Vous pouvez accepter, refuser ou personnaliser vos choix à tout moment.{' '}
                  <Link href="/politique-confidentialite" className="text-[#7A8FFF] hover:text-[#8FA5FF] underline">
                    En savoir plus
                  </Link>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={rejectAll}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20 hover:scale-105 active:scale-95"
                >
                  Refuser tout
                </button>
                <button
                  onClick={openSettings}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20 hover:scale-105 active:scale-95"
                >
                  Personnaliser
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] hover:from-[#7A4FFF] hover:to-[#8A9FFF] text-white rounded-lg font-medium transition-all shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 hover:shadow-violet-500/50"
                >
                  Accepter tout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#0f0a20]/95 to-[#1a0f3a]/95 backdrop-blur-xl border border-[#6F3FFF]/40 rounded-2xl p-6 md:p-8 shadow-2xl shadow-violet-500/20">
            <h3 className="text-2xl font-bold text-white mb-6 animate-in fade-in slide-in-from-top-2 duration-300">Préférences des Cookies</h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 animate-in fade-in slide-in-from-left-2 duration-300 delay-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
                      <span className="text-lg">🔒</span>
                      Cookies Nécessaires
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Ces cookies sont essentiels au fonctionnement du site. Ils ne peuvent pas être désactivés.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <ToggleSwitch
                      checked={true}
                      onChange={() => {}}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 animate-in fade-in slide-in-from-left-2 duration-300 delay-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
                      <span className="text-lg">📊</span>
                      Cookies Statistiques
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Ces cookies nous aident à comprendre comment les visiteurs interagissent avec le site (Analytics).
                    </p>
                  </div>
                  <div className="flex items-center">
                    <ToggleSwitch
                      checked={preferences.analytics}
                      onChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 animate-in fade-in slide-in-from-left-2 duration-300 delay-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
                      <span className="text-lg">📢</span>
                      Cookies Marketing
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Ces cookies sont utilisés pour afficher des publicités pertinentes et mesurer l&apos;efficacité des campagnes.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <ToggleSwitch
                      checked={preferences.marketing}
                      onChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-400">
              <button
                onClick={closeSettings}
                className="flex-1 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20 hover:scale-105"
              >
                Retour
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20 hover:scale-105 active:scale-95"
              >
                Refuser tout
              </button>
              <button
                onClick={saveCustom}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] hover:from-[#7A4FFF] hover:to-[#8A9FFF] text-white rounded-lg font-medium transition-all shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 hover:shadow-violet-500/50"
              >
                Enregistrer mes choix
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

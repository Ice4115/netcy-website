'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogoNetcy } from '@/components/LogoNetcy';
import { usePathname } from 'next/navigation';
import { Download, ShieldCheck, BarChart2, Target, Save, Fingerprint } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function LegalNav() {
  const pathname = usePathname();
  const links = [
    { label: 'CGU', href: '/cgu' },
    { label: 'CGV', href: '/cgv' },
    { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
    { label: 'Cookies', href: '/cookies' },
  ];
  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-surface-container print-hide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16">
        <Link href="/">
          <LogoNetcy className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.label} href={l.href}
              className={`text-sm font-medium transition-colors relative pb-0.5 ${pathname === l.href ? 'legal-nav-active' : 'text-on-surface-variant hover:text-[#0052FF]'}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/#contact" className="btn-primary px-5 py-2.5 text-sm hidden md:inline-flex">Démarrer un projet</Link>
        <Link href="/" className="md:hidden text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors">← Accueil</Link>
      </div>
      {/* Mobile legal links */}
      <div className="md:hidden overflow-x-auto border-t border-surface-container">
        <div className="flex gap-1 px-3 py-2">
          {links.map((l) => (
            <Link key={l.label} href={l.href}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                ${pathname === l.href ? 'bg-[#EEF2FF] dark:bg-[#1a1f3d] text-[#0052FF]' : 'text-outline hover:text-on-surface hover:bg-surface-container-low'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

function LegalFooter() {
  return (
    <footer className="bg-surface-container-low dark:bg-[#1c1b1c] py-10 px-6 lg:px-12 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <LogoNetcy className="h-7 w-auto" />
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-outline">
          <Link href="/cgu" className="hover:text-on-surface transition-colors">CGU</Link>
          <Link href="/cgv" className="hover:text-on-surface transition-colors">CGV</Link>
          <Link href="/politique-confidentialite" className="hover:text-on-surface transition-colors">Privacy Policy</Link>
          <Link href="/cookies" className="text-[#0052FF] font-semibold">Cookie Settings</Link>
        </div>
        <p className="text-xs text-outline-variant">© {new Date().getFullYear()} NETCY Digital Architecture. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function CookiesPage() {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('netcy_cookie_consent', JSON.stringify({
        necessary: true,
        analytics,
        marketing,
        date: new Date().toISOString(),
      }));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen">
      <LegalNav />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 pb-12">
        <span className="chip mb-6 inline-flex items-center gap-2">
          <Fingerprint size={13} />
          PRIVACY FRAMEWORK
        </span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-on-surface leading-tight max-w-3xl mb-4">
          Cookie{' '}
          <span className="text-[#0052FF]">Preferences.</span>
        </h1>
        <p className="text-on-surface-variant leading-relaxed max-w-xl mb-6">
          Gérez vos préférences de cookies. Nous respectons votre vie privée et ne déposons
          que ce qui est strictement nécessaire par défaut.{' '}
          <span className="text-on-surface font-medium">Dernière mise à jour : Janvier 2026.</span>
        </p>
        <button onClick={() => window.print()} className="btn-ghost px-6 py-2.5 text-sm flex items-center gap-2 print-hide">
          <Download size={15} /> Télécharger en PDF
        </button>
      </div>

      {/* Cookie cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-16">
        <div className="space-y-4 max-w-3xl">

          {/* Strictly necessary — always on */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#EEF2FF] dark:bg-[#1a1f3d] rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={18} className="text-[#0052FF]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Label className="font-display font-semibold text-on-surface text-base cursor-default">
                        Strictement Nécessaires
                      </Label>
                      <Badge variant="secondary" className="text-xs bg-[#EEF2FF] dark:bg-[#1a1f3d] text-[#0052FF] dark:text-[#d0bcff] border-0">
                        Toujours actif
                      </Badge>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Ces cookies sont indispensables au fonctionnement du site. Ils mémorisent
                      vos choix de consentement (<code className="text-xs bg-surface-container-low px-1 rounded">netcy_cookie_consent</code>),
                      assurent la sécurité des sessions et permettent la navigation. Durée : 6 mois.
                    </p>
                  </div>
                </div>
                <Switch checked disabled className="flex-shrink-0 mt-1 opacity-50 cursor-not-allowed" />
              </div>
            </CardContent>
          </Card>

          {/* Performance & Analytics */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#EEF2FF] dark:bg-[#1a1f3d] rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart2 size={18} className="text-[#0052FF]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Label
                        htmlFor="analytics-switch"
                        className="font-display font-semibold text-on-surface text-base cursor-pointer"
                      >
                        Performance & Analytics
                      </Label>
                      <Badge variant="secondary" className="text-xs bg-surface-container-low text-outline border-0">
                        Optionnel
                      </Badge>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Google Analytics (<code className="text-xs bg-surface-container-low px-1 rounded">_ga</code>,{' '}
                      <code className="text-xs bg-surface-container-low px-1 rounded">_gid</code>,{' '}
                      <code className="text-xs bg-surface-container-low px-1 rounded">_ga_*</code>) pour mesurer
                      l&apos;audience et améliorer l&apos;expérience. Les adresses IP sont anonymisées.
                      Durée : jusqu&apos;à 14 mois. Fournisseur : Google LLC.
                    </p>
                  </div>
                </div>
                <Switch
                  id="analytics-switch"
                  checked={analytics}
                  onCheckedChange={setAnalytics}
                  className="flex-shrink-0 mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Targeting & Marketing */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#EEF2FF] dark:bg-[#1a1f3d] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target size={18} className="text-[#0052FF]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Label
                        htmlFor="marketing-switch"
                        className="font-display font-semibold text-on-surface text-base cursor-pointer"
                      >
                        Targeting & Marketing
                      </Label>
                      <Badge variant="secondary" className="text-xs bg-surface-container-low text-outline border-0">
                        Optionnel
                      </Badge>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Cookies publicitaires permettant d&apos;afficher des contenus pertinents en fonction
                      de votre profil de navigation. Ces cookies peuvent être déposés par des partenaires
                      tiers. Vous pouvez retirer votre consentement à tout moment.
                    </p>
                  </div>
                </div>
                <Switch
                  id="marketing-switch"
                  checked={marketing}
                  onCheckedChange={setMarketing}
                  className="flex-shrink-0 mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save button */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleSave}
              className="btn-primary px-7 py-3.5 text-base flex items-center gap-2"
            >
              <Save size={16} />
              {saved ? 'Préférences enregistrées ✓' : 'Enregistrer mes préférences'}
            </button>
            <button
              onClick={() => { setAnalytics(false); setMarketing(false); }}
              className="btn-ghost px-7 py-3.5 text-base"
            >
              Tout refuser
            </button>
          </div>
        </div>
      </div>

      {/* Dark sovereignty banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-20">
        <div className="bg-[#1A1C1E] rounded-3xl p-6 sm:p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6 lg:gap-8">
            <div className="flex-1 max-w-lg">
              <span className="inline-block text-[10px] font-semibold text-[#0052FF] uppercase tracking-widest mb-4 bg-[#0052FF]/15 px-3 py-1.5 rounded-full">
                DIGITAL SOVEREIGNTY
              </span>
              <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-white mb-3 leading-tight">
                Votre vie privée,<br />notre engagement.
              </h2>
              <p className="text-base text-white/55 leading-relaxed">
                NETCY ne vend jamais vos données. Nous appliquons une politique de collecte minimale,
                une transparence totale sur les finalités, et vous donnons le contrôle complet sur
                vos préférences de confidentialité.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
              <Link
                href="/politique-confidentialite"
                className="px-6 py-3 bg-surface-container-lowest text-on-surface font-semibold text-sm rounded-2xl hover:bg-surface-container-low transition-colors text-center"
              >
                Politique de confidentialité
              </Link>
              <a
                href="mailto:contact@netcy.fr"
                className="px-6 py-3 border border-white/20 text-white font-semibold text-sm rounded-2xl hover:border-white/50 hover:bg-surface-container-lowest/5 transition-colors text-center"
              >
                contact@netcy.fr
              </a>
            </div>
          </div>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
}

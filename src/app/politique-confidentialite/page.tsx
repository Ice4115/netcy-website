'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicBackground from '@/components/PublicBackground';
import { LogoNetcy } from '@/components/LogoNetcy';
import { usePathname } from 'next/navigation';
import { Download, Shield, Cookie, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'collecte', label: '01. Données Collectées' },
  { id: 'finalites', label: '02. Finalités & Bases légales' },
  { id: 'partage', label: '03. Partage & Sous-traitants' },
  { id: 'durees', label: '04. Durées de Conservation' },
  { id: 'droits', label: '05. Vos Droits RGPD' },
  { id: 'securite', label: '06. Sécurité & Cookies' },
];

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
          <Link href="/politique-confidentialite" className="text-[#0052FF] font-semibold">Privacy Policy</Link>
          <Link href="/cookies" className="hover:text-on-surface transition-colors">Cookie Settings</Link>
        </div>
        <p className="text-xs text-outline-variant">© {new Date().getFullYear()} NETCY Digital Architecture. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function PolitiqueConfidentialitePage() {
  const [activeSection, setActiveSection] = useState('collecte');

  return (
    <div className="min-h-screen">
      <PublicBackground />
      <div className="relative z-10">
      <LegalNav />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 pb-16">
        <span className="chip mb-6 inline-block">COMPLIANCE & SAFETY</span>
        <div className="lg:flex lg:items-start lg:justify-between gap-16">
          <div className="max-w-2xl">
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-on-surface leading-tight mb-4">
              Politique de<br />Confidentialité.
            </h1>
            <p className="text-on-surface-variant leading-relaxed max-w-xl mb-6">
              Nous traitons vos données personnelles avec le plus grand soin, dans le respect strict
              du Règlement Général sur la Protection des Données (RGPD).
            </p>
            <button onClick={() => window.print()} className="btn-ghost px-6 py-2.5 text-sm flex items-center gap-2 print-hide">
              <Download size={15} /> Télécharger en PDF
            </button>
          </div>
          <Card className="border-0 shadow-sm rounded-2xl mt-8 lg:mt-0 lg:w-64 flex-shrink-0">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-outline uppercase tracking-widest mb-1">Dernière mise à jour</p>
              <p className="font-display font-bold text-on-surface">Janvier 2026</p>
              <div className="mt-4 pt-4 border-t border-surface-container">
                <p className="text-xs text-outline">Droit applicable : Droit français — RGPD (UE) 2016/679</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-16">
        <div className="grid sm:grid-cols-3 gap-5">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center mb-4">
                <Shield size={18} className="text-[#0052FF]" />
              </div>
              <h3 className="font-display font-semibold text-on-surface mb-2">Données Personnelles</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">Collecte minimale, finalités explicites, conservation limitée dans le temps.</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl bg-[#0052FF]">
            <CardContent className="p-6">
              <div className="w-10 h-10 bg-surface-container-lowest/20 rounded-xl flex items-center justify-center mb-4">
                <Cookie size={18} className="text-white" />
              </div>
              <h3 className="font-display font-semibold text-white mb-2">Cookies</h3>
              <p className="text-sm text-white/80 leading-relaxed">Seuls les cookies nécessaires sont actifs par défaut. Statistiques soumis à consentement.</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center mb-4">
                <Lock size={18} className="text-[#0052FF]" />
              </div>
              <h3 className="font-display font-semibold text-on-surface mb-2">Sécurité Absolue</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">Chiffrement TLS, hachage des mots de passe, cloisonnement des accès et sauvegardes régulières.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-24">
        <div className="lg:grid lg:grid-cols-[240px_1fr] gap-20">

          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1.5">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setActiveSection(s.id)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-all font-medium
                    ${activeSection === s.id
                      ? 'text-[#0052FF] border-l-2 border-[#0052FF] pl-4 bg-[#EEF2FF]'
                      : 'text-outline hover:text-on-surface border-l-2 border-transparent pl-4'}`}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="space-y-24 pt-2">

            {/* 01 */}
            <section id="collecte" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">01</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Données collectées</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Nous collectons uniquement les informations nécessaires à la création et à la gestion de votre compte client :
              </p>
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6 space-y-3">
                  {[
                    'Identifiants de compte : nom, prénom, email, mot de passe (haché), téléphone facultatif.',
                    'Données de profil et de facturation : coordonnées professionnelles, références de factures et historique des paiements.',
                    'Journaux techniques : connexions, actions importantes dans l\'espace client, adresses IP horodatées à des fins de sécurité.',
                    'Données de navigation soumises à consentement : cookies de mesure d\'audience Google Analytics.',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#0052FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* 02 */}
            <section id="finalites" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">02</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Finalités & Bases légales</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">Nous utilisons vos données pour :</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { base: 'Exécution du contrat', desc: 'Authentifier et gérer les comptes, fournir le tableau de bord, les factures et le support client.' },
                  { base: 'Intérêt légitime', desc: 'Assurer la sécurité, prévenir la fraude et tracer les accès sensibles.' },
                  { base: 'Obligation légale', desc: 'Respecter nos obligations comptables (facturation, conservation légale).' },
                  { base: 'Consentement', desc: 'Mesurer l\'audience et améliorer le site via Google Analytics uniquement si vous y consentez.' },
                ].map((item) => (
                  <Card key={item.base} className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                      <p className="font-semibold text-on-surface text-sm mb-1">{item.base}</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* 03 */}
            <section id="partage" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">03</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Partage & Sous-traitants</h2>
              </div>
              <blockquote className="border-l-4 border-[#0052FF] pl-5 py-1 text-on-surface-variant italic leading-relaxed bg-surface-container-low rounded-r-xl">
                &ldquo;Vos données ne sont jamais vendues ni cédées à des tiers à des fins commerciales.&rdquo;
              </blockquote>
              <p className="text-on-surface-variant leading-relaxed">Elles peuvent être traitées par :</p>
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6 space-y-3">
                  {[
                    'Nos prestataires techniques (hébergement, authentification, messagerie) pour fournir le service.',
                    'Google Analytics pour les mesures d\'audience si vous avez accepté les cookies statistiques.',
                    'Les autorités compétentes si la loi l\'exige.',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF] flex-shrink-0 mt-2" />
                      <p className="text-sm text-on-surface-variant leading-relaxed">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* 04 */}
            <section id="durees" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">04</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Durées de Conservation</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Compte & facturation', value: '3 ans après la dernière activité (factures : 10 ans)' },
                  { label: 'Journaux de connexion', value: 'Jusqu\'à 12 mois' },
                  { label: 'Consentement cookies', value: '6 mois' },
                  { label: 'Google Analytics', value: '14 mois maximum' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3 border-b border-surface-container last:border-0">
                    <span className="text-sm font-medium text-on-surface">{row.label}</span>
                    <span className="text-sm text-on-surface-variant">{row.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 05 */}
            <section id="droits" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">05</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Vos Droits RGPD</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                {['Accès', 'Rectification', 'Suppression', 'Limitation', 'Opposition', 'Portabilité'].map((right, i) => (
                  <div key={right} className="flex items-center gap-3 bg-surface-container-lowest rounded-xl p-4 shadow-sm">
                    <span className="font-display font-extrabold text-lg text-outline">0{i + 1}</span>
                    <span className="font-medium text-sm text-on-surface">{right}</span>
                  </div>
                ))}
              </div>
              <Card className="border-0 rounded-2xl border-l-4 border-l-[#0052FF] pl-2">
                <CardContent className="p-5">
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Pour exercer vos droits ou retirer votre consentement aux cookies statistiques :{' '}
                    <a href="mailto:contact@netcy.fr" className="text-[#0052FF] hover:underline font-medium">contact@netcy.fr</a>.{' '}
                    Vous pouvez également saisir la CNIL si nécessaire.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* 06 */}
            <section id="securite" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">06</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Sécurité & Cookies</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Nous appliquons le chiffrement des communications (TLS), le hachage des mots de passe,
                le cloisonnement des accès et des sauvegardes régulières. En cas d&apos;incident de sécurité
                impactant vos données, vous serez informé conformément à la réglementation.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                Vous pouvez accepter ou refuser les cookies via la bannière ou le lien{' '}
                <Link href="/cookies" className="text-[#0052FF] hover:underline">Gérer les cookies</Link>.
                Seuls les cookies nécessaires sont déposés par défaut.
              </p>

              {/* Dark banner */}
              <div className="bg-[#191C1D] rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="font-display font-bold text-xl text-white mb-1">Votre sécurité est notre priorité.</p>
                  <p className="text-sm text-white/60">Architecture zero-trust. Données souveraines. Conformité RGPD.</p>
                </div>
                <Link href="/cookies" className="flex-shrink-0 px-5 py-2.5 bg-surface-container-lowest text-on-surface font-semibold text-sm rounded-full hover:bg-surface-container-low transition-colors">
                  Gérer les cookies
                </Link>
              </div>
            </section>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="btn-primary px-7 py-3.5 text-base flex items-center gap-2">
                <Download size={16} /> Télécharger en PDF
              </button>
              <Link href="/#contact" className="btn-ghost px-7 py-3.5 text-base">Nous contacter</Link>
            </div>
          </div>
        </div>
      </div>

      <LegalFooter />
      </div>
    </div>
  );
}

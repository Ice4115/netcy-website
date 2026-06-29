'use client';

import { useState } from 'react';
import Link from 'next/link';
import NavLink from '@/components/NavLink';
import { LogoNetcy } from '@/components/LogoNetcy';
import { usePathname } from 'next/navigation';
import { Download, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'objet', label: "01. Objet & Champ d'application" },
  { id: 'acces', label: '02. Accès et Compte utilisateur' },
  { id: 'usage', label: "03. Règles d'utilisation" },
  { id: 'pi', label: '04. Propriété Intellectuelle' },
  { id: 'donnees', label: '05. Données & Cookies' },
  { id: 'dispo', label: '06. Disponibilité & Sécurité' },
  { id: 'respo', label: '07. Limitation de responsabilité' },
  { id: 'final', label: '08. Dispositions finales' },
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
            <NavLink key={l.label} href={l.href}
              className={`text-sm font-medium transition-colors relative pb-0.5 ${pathname === l.href ? 'legal-nav-active' : 'text-on-surface-variant hover:text-[#0052FF]'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Link href="/#contact" className="btn-primary px-5 py-2.5 text-sm hidden md:inline-flex">Démarrer un projet</Link>
        <Link href="/" className="md:hidden text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors">← Accueil</Link>
      </div>
      {/* Mobile legal links */}
      <div className="md:hidden overflow-x-auto border-t border-surface-container">
        <div className="flex gap-1 px-3 py-2">
          {links.map((l) => (
            <NavLink key={l.label} href={l.href}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                ${pathname === l.href ? 'bg-[#EEF2FF] dark:bg-[#1a1f3d] text-[#0052FF]' : 'text-outline hover:text-on-surface hover:bg-surface-container-low'}`}>
              {l.label}
            </NavLink>
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
        <LogoNetcy className="h-8 w-auto" />
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-outline">
          <NavLink href="/cgu" className="text-[#0052FF] font-semibold">CGU</NavLink>
          <NavLink href="/cgv" className="hover:text-on-surface transition-colors">CGV</NavLink>
          <NavLink href="/politique-confidentialite" className="hover:text-on-surface transition-colors">Politique de confidentialité</NavLink>
          <NavLink href="/cookies" className="hover:text-on-surface transition-colors">Cookies</NavLink>
        </div>
        <p className="text-xs text-outline-variant">© {new Date().getFullYear()} NETCY — Jean-Marie Jung. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 bg-[#0052FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-sm text-on-surface-variant leading-relaxed">{text}</p>
    </div>
  );
}

export default function CGUPage() {
  const [activeSection, setActiveSection] = useState('objet');

  return (
    <div className="min-h-screen">
      <LegalNav />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 pb-12">
        <span className="chip mb-6 inline-block">CONDITIONS D'UTILISATION</span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-on-surface leading-tight max-w-3xl mb-4">
          Conditions Générales<br />
          <span className="text-[#0052FF]">d'Utilisation.</span>
        </h1>
        <p className="text-on-surface-variant leading-relaxed max-w-xl mb-2">
          Ce document régit les conditions d'accès et d'utilisation du site internet{' '}
          <span className="font-medium text-on-surface">netcy.fr</span> et de l'espace client associé.
          L'utilisation du site vaut acceptation sans réserve des présentes conditions.
        </p>
        <p className="text-sm text-outline">Dernière mise à jour : <strong className="text-on-surface">Janvier 2026</strong> — Version 1.0</p>

        {/* Distinction CGU / CGV */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="bg-[#EEF2FF] dark:bg-[#1a1f3d] rounded-2xl p-5 border border-[#BBCEF5]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-[#0052FF] rounded-lg flex items-center justify-center">
                <FileText size={14} className="text-white" />
              </div>
              <span className="font-semibold text-sm text-[#0052FF]">CGU — Utilisation (vous êtes ici)</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">Règles d'usage de la plateforme NETCY, droits d'accès, comportement acceptable, propriété intellectuelle de la plateforme.</p>
          </div>
          <NavLink href="/cgv" className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container hover:border-[#0052FF]/30 hover:shadow-sm transition-all block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-surface-container-low rounded-lg flex items-center justify-center">
                <FileText size={14} className="text-outline" />
              </div>
              <span className="font-semibold text-sm text-on-surface">CGV — Vente →</span>
            </div>
            <p className="text-xs text-outline leading-relaxed">Conditions d'achat des prestations, prix, devis, paiement, délais, transfert de propriété intellectuelle, garanties et litiges.</p>
          </NavLink>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-24">
        <div className="lg:grid lg:grid-cols-[240px_1fr] gap-16">

          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setActiveSection(s.id)}
                  className={`block px-3 py-2.5 rounded-lg text-sm transition-all font-medium
                    ${activeSection === s.id
                      ? 'text-[#0052FF] border-l-2 border-[#0052FF] pl-4 bg-[#EEF2FF] dark:bg-[#1a1f3d]'
                      : 'text-outline hover:text-on-surface border-l-2 border-transparent pl-4'}`}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="space-y-20 pt-2">

            {/* 01 */}
            <section id="objet" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-outline select-none">01</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Objet et champ d'application</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (ci-après <strong className="text-on-surface">« CGU »</strong>) ont
                pour objet de définir les modalités et conditions d'accès au site internet <strong>netcy.fr</strong> (ci-après
                « le Site ») ainsi qu'à l'espace client sécurisé, exploités par :
              </p>
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-2 text-on-surface-variant text-sm leading-relaxed">
                  <p><span className="font-semibold text-on-surface">Raison sociale :</span> NETCY — Auto-entrepreneur (Micro-entreprise)</p>
                  <p><span className="font-semibold text-on-surface">Responsable :</span> Jung Jean-Marie</p>
                  <p><span className="font-semibold text-on-surface">Adresse :</span> 145 chemin du pan perdu, 1 clos des mylord, 13160 Châteaurenard, France</p>
                  <p><span className="font-semibold text-on-surface">SIREN :</span> 995 301 546 — <span className="font-semibold text-on-surface">SIRET :</span> 99530154600025</p>
                  <p><span className="font-semibold text-on-surface">Contact :</span>{' '}
                    <a href="mailto:contact@netcy.fr" className="text-[#0052FF] hover:underline">contact@netcy.fr</a> — 07 49 64 44 78</p>
                </CardContent>
              </Card>
              <p className="text-on-surface-variant leading-relaxed">
                Les présentes CGU s'appliquent à tout visiteur ou utilisateur du Site (ci-après « l'Utilisateur »),
                qu'il soit un simple internaute ou un client disposant d'un espace personnel. L'accès au Site implique
                l'acceptation pleine et entière des présentes. NETCY se réserve le droit de modifier les CGU à tout
                moment ; la version en vigueur est celle accessible en ligne. L'Utilisateur est invité à les consulter
                régulièrement.
              </p>
            </section>

            {/* 02 */}
            <section id="acces" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-outline select-none">02</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Accès au site et compte utilisateur</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Le Site est accessible librement. Certaines fonctionnalités (tableau de bord, suivi de projet, factures,
                messagerie client) nécessitent la création d'un compte personnel. La création de compte est réservée aux
                personnes physiques majeures ou aux représentants légaux de personnes morales.
              </p>
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-3">
                  {[
                    'Les informations fournies lors de l\'inscription doivent être exactes, complètes et tenues à jour. Toute information erronée peut entraîner la suspension du compte.',
                    'Les identifiants de connexion (email et mot de passe) sont strictement personnels et confidentiels. Ils ne doivent pas être communiqués à des tiers.',
                    'L\'Utilisateur est seul responsable de toute utilisation faite depuis son compte. En cas de perte, vol ou utilisation non autorisée, il doit en informer NETCY immédiatement à contact@netcy.fr.',
                    'NETCY peut suspendre ou résilier un compte sans préavis en cas de violation des présentes CGU, d\'usage frauduleux ou de comportement préjudiciable.',
                    'La connexion via Google OAuth est soumise aux conditions d\'utilisation de Google LLC. NETCY ne stocke pas vos mots de passe Google.',
                  ].map((item) => <Bullet key={item} text={item} />)}
                </CardContent>
              </Card>
            </section>

            {/* 03 */}
            <section id="usage" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-outline select-none">03</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Règles d'utilisation acceptable</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                L'Utilisateur s'engage à utiliser le Site et les services dans le strict respect des lois et règlements en
                vigueur, notamment en droit français et européen (RGPD, loi pour la confiance dans l'économie numérique,
                code de la propriété intellectuelle).
              </p>
              <p className="text-on-surface-variant leading-relaxed font-medium text-on-surface">Sont expressément interdits :</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { title: 'Atteinte aux systèmes', desc: 'Toute tentative d\'accès non autorisé, d\'intrusion, de déni de service (DoS/DDoS), de scraping massif ou de perturbation des serveurs.' },
                  { title: 'Contenu illicite', desc: 'La transmission de contenus violents, diffamatoires, racistes, pédopornographiques ou portant atteinte aux droits d\'autrui.' },
                  { title: 'Usurpation d\'identité', desc: 'Se faire passer pour NETCY, un collaborateur ou un autre utilisateur, ou usurper l\'identité d\'une personne morale.' },
                  { title: 'Exploitation commerciale', desc: 'L\'utilisation du Site ou de ses contenus à des fins commerciales sans autorisation écrite préalable de NETCY.' },
                  { title: 'Logiciels malveillants', desc: 'L\'introduction ou la diffusion de virus, chevaux de Troie, ransomwares ou tout code nuisible au fonctionnement du Site.' },
                  { title: 'Contournement de sécurité', desc: 'Toute tentative de contournement des mécanismes d\'authentification, de chiffrement ou des filtres de sécurité mis en place.' },
                ].map((item) => (
                  <Card key={item.title} className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                      <p className="font-semibold text-on-surface text-sm mb-1">{item.title}</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <blockquote className="border-l-4 border-[#BF3003] pl-5 py-2 text-on-surface-variant italic leading-relaxed bg-[#FEF2F2] dark:bg-[#3b0404] rounded-r-xl">
                Tout manquement à ces règles peut entraîner la suspension immédiate du compte, des poursuites civiles
                et/ou pénales, et le cas échéant le signalement aux autorités compétentes (ANSSI, gendarmerie nationale).
              </blockquote>
            </section>

            {/* 04 */}
            <section id="pi" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-outline select-none">04</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Propriété Intellectuelle</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                L'ensemble des éléments constitutifs du Site (textes, typographies, visuels, logos, icônes, composants
                interactifs, code source, architecture, animations, bases de données) est la propriété exclusive de
                NETCY ou fait l'objet d'une licence accordée à NETCY, et est protégé par le droit français et
                international de la propriété intellectuelle.
              </p>
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-3">
                  {[
                    'Toute reproduction, représentation, modification, publication, adaptation ou exploitation, totale ou partielle, des éléments du Site, sans autorisation écrite préalable de NETCY, est strictement interdite.',
                    'L\'Utilisateur ne dispose que d\'un droit de consultation non exclusif, non cessible et révocable à tout moment.',
                    'La marque NETCY, le logo et les dénominations associées sont des marques déposées ou en cours d\'enregistrement. Leur utilisation sans accord est prohibée.',
                    'Les contenus créés par NETCY dans le cadre de prestations commandées restent la propriété de NETCY jusqu\'au paiement intégral (cf. CGV). Après règlement complet, une licence d\'exploitation est accordée au client selon les termes du devis.',
                  ].map((item) => <Bullet key={item} text={item} />)}
                </CardContent>
              </Card>
            </section>

            {/* 05 */}
            <section id="donnees" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-outline select-none">05</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Données personnelles et cookies</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                NETCY traite vos données personnelles conformément au Règlement Général sur la Protection des Données
                (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés modifiée. Le traitement détaillé
                est décrit dans notre{' '}
                <NavLink keepText href="/politique-confidentialite" className="text-[#0052FF] hover:underline font-medium">Politique de Confidentialité</NavLink>.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { base: 'Données collectées', desc: 'Nom, prénom, email, téléphone, adresse (pour la facturation), données de connexion, historique projet.' },
                  { base: 'Finalité', desc: 'Gestion du compte, exécution des prestations, facturation, support client, sécurité et prévention de la fraude.' },
                  { base: 'Vos droits', desc: 'Accès, rectification, suppression, portabilité, limitation et opposition. Exercice via contact@netcy.fr ou CNIL (cnil.fr).' },
                  { base: 'Cookies', desc: 'Seuls les cookies nécessaires sont déposés par défaut. Les cookies analytiques (Google Analytics) sont soumis à votre consentement explicite. Gestion via ' + '/cookies.' },
                ].map((item) => (
                  <Card key={item.base} className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                      <p className="font-semibold text-on-surface text-sm mb-1">{item.base}</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Le Site peut contenir des liens hypertextes vers des sites tiers. NETCY n'exerce aucun contrôle sur
                ces sites et décline toute responsabilité quant à leur contenu, leurs politiques de confidentialité
                ou leurs pratiques en matière de données personnelles.
              </p>
            </section>

            {/* 06 */}
            <section id="dispo" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-outline select-none">06</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Disponibilité et sécurité</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                NETCY s'efforce d'assurer la disponibilité du Site 24h/24, 7j/7, dans la limite des contraintes
                techniques. L'accès peut être temporairement interrompu sans préavis pour raisons de maintenance,
                mise à jour, incidents techniques ou de sécurité.
              </p>
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-3">
                  {[
                    'Les communications entre le navigateur et le serveur sont chiffrées via TLS (HTTPS). Les mots de passe sont hachés avec un algorithme sécurisé (bcrypt ou équivalent via Supabase Auth).',
                    'NETCY surveille les accès suspects et peut bloquer toute IP ou compte présentant un comportement anormal (tentatives de force brute, injections, etc.).',
                    'En cas d\'incident de sécurité affectant vos données personnelles, NETCY s\'engage à vous notifier conformément à l\'article 33 du RGPD dans un délai de 72 heures suivant la découverte.',
                    'L\'infrastructure repose sur des prestataires certifiés (hébergement Vercel / Supabase). NETCY effectue des sauvegardes régulières mais ne peut garantir une restauration totale en toutes circonstances.',
                  ].map((item) => <Bullet key={item} text={item} />)}
                </CardContent>
              </Card>
            </section>

            {/* 07 */}
            <section id="respo" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-outline select-none">07</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Limitation de responsabilité</h2>
              </div>
              <blockquote className="border-l-4 border-[#0052FF] pl-5 py-2 text-on-surface-variant italic leading-relaxed bg-surface-container-low rounded-r-xl">
                « Le Site est fourni "en l'état". NETCY décline toute garantie quant à l'exactitude, l'exhaustivité
                ou la pertinence des informations publiées, et ne saurait être tenue responsable de dommages directs
                ou indirects résultant de l'utilisation du Site. »
              </blockquote>
              <p className="text-on-surface-variant leading-relaxed">
                NETCY ne peut être tenue responsable :
              </p>
              <div className="space-y-2">
                {[
                  'Des interruptions ou dysfonctionnements du réseau Internet ou des prestataires tiers (hébergeurs, opérateurs téléphoniques, fournisseurs de services cloud).',
                  'Des dommages résultant d\'une utilisation non conforme du Site ou des services par l\'Utilisateur.',
                  'Des actes malveillants de tiers (piratage, phishing, usurpation d\'identité) résultant d\'une négligence de l\'Utilisateur (mot de passe faible, partage des identifiants).',
                  'Des pertes de données survenant malgré les mesures de sauvegarde mises en place.',
                  'Du contenu des sites tiers accessibles via des liens présents sur le Site.',
                ].map((item) => <Bullet key={item} text={item} />)}
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Dans les cas où la responsabilité de NETCY serait engagée, elle serait limitée aux prestations
                effectivement encaissées au cours des 12 derniers mois précédant le fait générateur.
              </p>
            </section>

            {/* 08 */}
            <section id="final" className="space-y-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-outline select-none">08</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Dispositions finales</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: 'Droit applicable', desc: 'Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou exécution relève de la compétence exclusive des tribunaux français.' },
                  { title: 'Médiation', desc: 'En cas de litige, l\'Utilisateur peut recourir gratuitement au service de médiation de la consommation MEDICYS ou à la plateforme européenne de résolution en ligne (ec.europa.eu/consumers/odr).' },
                  { title: 'Modifications', desc: 'NETCY peut mettre à jour les présentes CGU à tout moment. Les utilisateurs actifs seront notifiés par email. La poursuite de l\'utilisation du Site vaut acceptation des nouvelles conditions.' },
                  { title: 'Nullité partielle', desc: 'Si une clause est déclarée nulle ou inapplicable, les autres clauses restent pleinement en vigueur. La clause nulle sera remplacée par une disposition légalement valide s\'en rapprochant le plus.' },
                ].map((item) => (
                  <Card key={item.title} className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                      <p className="font-semibold text-on-surface text-sm mb-2">{item.title}</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="border-0 rounded-2xl border-l-4 border-l-[#0052FF] pl-2">
                <CardContent className="p-5">
                  <p className="font-semibold text-on-surface mb-2">Contact et exercice de vos droits</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Pour toute question relative aux présentes CGU, pour exercer vos droits sur vos données personnelles
                    ou pour signaler un contenu illicite :{' '}
                    <a href="mailto:contact@netcy.fr" className="text-[#0052FF] hover:underline font-medium">contact@netcy.fr</a>
                    {' '}— NETCY, 145 chemin du pan perdu, 13160 Châteaurenard.
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-4 pt-4 print-hide">
                <button onClick={() => window.print()} className="btn-primary px-7 py-3.5 text-base flex items-center gap-2">
                  <Download size={16} /> Télécharger en PDF
                </button>
                <Link href="/#contact" className="btn-ghost px-7 py-3.5 text-base">Nous contacter</Link>
                <NavLink href="/cgv" className="btn-ghost px-7 py-3.5 text-base">Voir les CGV →</NavLink>
              </div>
            </section>

          </div>
        </div>
      </div>

      <LegalFooter />
    </div>
  );
}

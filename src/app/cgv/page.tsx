'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicBackground from '@/components/PublicBackground';
import { LogoNetcy } from '@/components/LogoNetcy';
import { usePathname } from 'next/navigation';
import { Check, ArrowRight, FileText, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'vendeur', label: '01. Informations légales' },
  { id: 'services', label: '02. Services & Commande' },
  { id: 'prix', label: '03. Prix, Devis & TVA' },
  { id: 'paiement', label: '04. Paiement & Acomptes' },
  { id: 'delais', label: '05. Délais & Livraison' },
  { id: 'pi', label: '06. Propriété Intellectuelle' },
  { id: 'garanties', label: '07. Garanties & SAV' },
  { id: 'resiliation', label: '08. Résiliation & Litiges' },
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
          <Link href="/cgv" className="text-[#0052FF] font-semibold">CGV</Link>
          <Link href="/politique-confidentialite" className="hover:text-on-surface transition-colors">Politique de confidentialité</Link>
          <Link href="/cookies" className="hover:text-on-surface transition-colors">Cookies</Link>
        </div>
        <p className="text-xs text-outline-variant">© {new Date().getFullYear()} NETCY. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default function CGVPage() {
  const [activeSection, setActiveSection] = useState('vendeur');

  return (
    <div className="min-h-screen">
      <PublicBackground />
      <div className="relative z-10">
      <LegalNav />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 pb-12">
        <span className="chip mb-6 inline-block">CONDITIONS DE VENTE</span>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-on-surface leading-tight max-w-3xl mb-4">
          Conditions Générales<br />de Vente.
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <p className="text-on-surface-variant leading-relaxed max-w-2xl">
            Les présentes Conditions Générales de Vente (CGV) régissent exclusivement les relations commerciales
            entre NETCY et ses clients dans le cadre de l'achat de prestations de services numériques.
            Elles sont distinctes des{' '}
            <Link href="/cgu" className="text-[#0052FF] hover:underline font-medium">Conditions Générales d'Utilisation (CGU)</Link>{' '}
            qui encadrent l'usage de la plateforme.{' '}
            <span className="text-on-surface font-medium">Dernière mise à jour : Mars 2026.</span>
          </p>
        </div>

        {/* Distinction CGU / CGV */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl">
          <Link href="/cgu" className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container hover:border-[#0052FF]/30 hover:shadow-sm transition-all block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-surface-container-low rounded-lg flex items-center justify-center">
                <FileText size={14} className="text-outline" />
              </div>
              <span className="font-semibold text-sm text-on-surface">CGU — Utilisation →</span>
            </div>
            <p className="text-xs text-outline leading-relaxed">Règles d'usage de la plateforme NETCY, droits d'accès, comportement acceptable, propriété intellectuelle de la plateforme.</p>
          </Link>
          <div className="bg-[#EEF2FF] dark:bg-[#1a1f3d] rounded-2xl p-5 border border-[#BBCEF5] dark:border-[#2a2563]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-[#0052FF] rounded-lg flex items-center justify-center">
                <FileText size={14} className="text-white" />
              </div>
              <span className="font-semibold text-sm text-[#0052FF]">CGV — Vente (vous êtes ici)</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">Conditions d'achat des prestations, prix, devis, paiement, délais, transfert de propriété intellectuelle, garanties et litiges.</p>
          </div>
        </div>
      </div>

      {/* Body: sticky TOC + content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-20">
        <div className="lg:grid lg:grid-cols-[240px_1fr] gap-12">

          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActiveSection(s.id)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-all font-medium
                    ${activeSection === s.id
                      ? 'text-[#0052FF] dark:text-[#d0bcff] border-l-2 border-[#0052FF] dark:border-[#d0bcff] pl-4 bg-[#EEF2FF] dark:bg-[#1a1f3d]'
                      : 'text-outline hover:text-on-surface border-l-2 border-transparent pl-4'}`}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="space-y-20">

            {/* 01 — Informations légales du vendeur */}
            <section id="vendeur" className="space-y-6">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">01</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Informations légales du vendeur</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Les présentes CGV sont conclues entre le Client (toute personne physique ou morale passant commande
                auprès de NETCY) et le prestataire suivant :
              </p>
              <Card className="border border-surface-container shadow-none rounded-2xl">
                <CardContent className="p-6 grid sm:grid-cols-2 gap-4 text-sm">
                  {[
                    ['Dénomination', 'NETCY'],
                    ['Forme juridique', 'Auto-entrepreneur (Micro-entreprise)'],
                    ['Responsable', 'Jung Jean-Marie'],
                    ['Adresse', '145 chemin du pan perdu, 1 clos des mylord\n13160 Châteaurenard, France'],
                    ['Email professionnel', 'jeanmarie.jung@netcy.fr'],
                    ['Téléphone', '07 49 64 44 78'],
                    ['SIREN', '995 301 546'],
                    ['SIRET', '99530154600025'],
                    ['Régime TVA', 'TVA non applicable — art. 293B du CGI (franchise en base)'],
                    ['Code APE / NAF', '6201Z — Programmation informatique'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span className="font-semibold text-on-surface block">{k}</span>
                      <span className="text-on-surface-variant whitespace-pre-line">{v}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <p className="text-sm text-outline leading-relaxed">
                NETCY exerce en tant que micro-entrepreneur immatriculé en France. Les présentes CGV sont soumises
                au droit français et s'appliquent à l'exclusion de tout autre document commercial, notamment les
                conditions générales d'achat du Client.
              </p>
            </section>

            {/* 02 — Services & Processus de commande */}
            <section id="services" className="space-y-6">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">02</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Services proposés & Processus de commande</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                NETCY propose des prestations de services numériques sur mesure. Toute commande implique
                l'acceptation pleine et entière des présentes CGV, sans réserve ni condition.
              </p>

              <div className="space-y-3">
                <h3 className="font-semibold text-on-surface">Catalogue des prestations</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { titre: 'Sites web & Landing pages', desc: 'Conception, design et développement de sites vitrines, portfolios et pages de destination optimisées SEO.' },
                    { titre: 'E-commerce', desc: 'Boutiques en ligne complètes avec gestion des produits, paiements sécurisés, paniers et tunnels d\'achat.' },
                    { titre: 'Applications web', desc: 'Développement d\'applications React/Next.js avec back-end, authentification, bases de données et API.' },
                    { titre: 'Design UI/UX', desc: 'Conception d\'interfaces utilisateur, maquettes Figma, systèmes de design et optimisation de l\'expérience.' },
                    { titre: 'Maintenance & Hébergement', desc: 'Abonnements de maintenance technique, mises à jour de sécurité, sauvegardes et supervision applicative.' },
                    { titre: 'Conseil & Audit digital', desc: 'Audit de performance, conseil en stratégie digitale, accompagnement transformation numérique.' },
                  ].map((p) => (
                    <Card key={p.titre} className="border border-surface-container shadow-none rounded-2xl">
                      <CardContent className="p-4">
                        <p className="font-semibold text-sm text-on-surface mb-1">{p.titre}</p>
                        <p className="text-xs text-outline leading-relaxed">{p.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-on-surface">Processus de commande</h3>
                <ol className="space-y-3">
                  {[
                    { n: '1', t: 'Prise de contact', d: 'Le Client contacte NETCY via le formulaire en ligne, par email ou téléphone et expose son besoin.' },
                    { n: '2', t: 'Établissement du devis', d: 'NETCY analyse la demande et adresse un devis détaillé incluant le périmètre, le prix, les délais et les conditions spécifiques. Le devis est valable 30 jours.' },
                    { n: '3', t: 'Validation de la commande', d: 'La commande est ferme et définitive à réception du devis signé (ou validé par email) accompagné du règlement de l\'acompte prévu.' },
                    { n: '4', t: 'Réalisation', d: 'NETCY réalise les travaux selon le cahier des charges convenu. Des points d\'étape (jalons) peuvent être définis dans le devis.' },
                    { n: '5', t: 'Livraison & Recette', d: 'NETCY livre les livrables convenus. Le Client dispose d\'un délai de recette de 7 jours ouvrés pour formuler des réserves écrites.' },
                  ].map((step) => (
                    <div key={step.n} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#0052FF] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">{step.n}</div>
                      <div>
                        <p className="font-semibold text-on-surface text-sm">{step.t}</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </ol>
              </div>

              <blockquote className="border-l-4 border-[#0052FF] pl-5 py-2 bg-[#EEF2FF] dark:bg-[#1a1f3d] rounded-r-xl text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Absence de réponse à la recette :</strong> Si le Client ne formule aucune réserve dans le délai de 7 jours ouvrés
                suivant la livraison, les livrables sont réputés acceptés sans réserve et le solde devient immédiatement exigible.
              </blockquote>
            </section>

            {/* 03 — Prix, Devis & TVA */}
            <section id="prix" className="space-y-6">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">03</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Prix, Devis & TVA</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                NETCY pratique une tarification sur mesure. Chaque projet fait l'objet d'un devis personnalisé
                établi après analyse des besoins du Client. Aucun tarif catalogue ne peut être considéré comme
                ferme sans devis signé.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: '€',
                    titre: 'Expression des prix',
                    desc: 'Tous les prix sont exprimés en euros (€). NETCY bénéficiant de la franchise en base de TVA (art. 293B du CGI), les factures sont émises hors taxes (HT) sans mention de TVA. La mention « TVA non applicable, art. 293B du CGI » figure sur chaque facture.'
                  },
                  {
                    icon: '📄',
                    titre: 'Validité du devis',
                    desc: 'Tout devis est valable 30 jours calendaires à compter de sa date d\'émission. Passé ce délai, NETCY se réserve le droit de réviser les tarifs ou conditions. Un devis expiré n\'engage pas NETCY.'
                  },
                  {
                    icon: '🔄',
                    titre: 'Révision de prix',
                    desc: 'Toute demande de modification du périmètre initial par le Client après signature du devis fera l\'objet d\'un avenant tarifaire. NETCY se réserve le droit de refuser des modifications substantielles ou de réajuster le délai d\'exécution en conséquence.'
                  },
                  {
                    icon: '📦',
                    titre: 'Frais annexes',
                    desc: 'Les achats de licences logicielles, noms de domaine, hébergement, polices de caractères ou tout autre actif tiers nécessaire à la réalisation font l\'objet d\'une refacturation au coût réel sur justificatifs, sauf inclusion explicite dans le devis.'
                  },
                ].map((c) => (
                  <Card key={c.titre} className="border border-surface-container shadow-none rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-[#EEF2FF] dark:bg-[#1a1f3d] rounded-lg flex items-center justify-center text-base">{c.icon}</div>
                        <h3 className="font-semibold text-on-surface text-sm">{c.titre}</h3>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{c.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* 04 — Paiement & Acomptes */}
            <section id="paiement" className="space-y-6">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">04</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Modalités de paiement & Acomptes</h2>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-on-surface">Structure de paiement standard</h3>
                <div className="space-y-2">
                  {[
                    { pct: '40%', moment: 'À la commande', detail: 'Acompte versé à la signature du devis, déclenchant le démarrage des travaux. Non remboursable en cas d\'annulation par le Client sauf force majeure.' },
                    { pct: '30%', moment: 'À mi-parcours', detail: 'Applicable pour les projets d\'une durée supérieure à 4 semaines. Déclenché à la validation d\'un jalon intermédiaire défini au devis.' },
                    { pct: '30%', moment: 'À la livraison', detail: 'Solde dû à la livraison finale ou à l\'issue du délai de recette de 7 jours ouvrés sans réserve formulée.' },
                  ].map((p) => (
                    <div key={p.moment} className="flex gap-4 bg-surface-container-lowest border border-surface-container rounded-2xl p-4">
                      <div className="text-2xl font-extrabold text-[#0052FF] font-display w-16 flex-shrink-0">{p.pct}</div>
                      <div>
                        <p className="font-semibold text-sm text-on-surface">{p.moment}</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{p.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-outline">Pour les projets inférieurs à 500 €, un paiement intégral à la commande peut être exigé.</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-on-surface">Moyens de paiement acceptés</h3>
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  {[
                    'Virement bancaire (SEPA) — coordonnées communiquées sur facture.',
                    'Paiement en ligne sécurisé via lien de paiement Stripe (CB Visa, Mastercard, American Express).',
                    'PayPal sur demande expresse.',
                    'Chèque non accepté.',
                  ].map((m) => (
                    <li key={m} className="flex items-start gap-2">
                      <Check size={14} className="text-[#0052FF] mt-0.5 flex-shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-on-surface">Retards de paiement</h3>
                <blockquote className="border-l-4 border-[#BF3003] pl-5 py-2 bg-[#FFF5F5] dark:bg-[#3b0404] rounded-r-xl text-sm text-on-surface-variant leading-relaxed">
                  Conformément aux articles L.441-10 et suivants du Code de commerce, tout retard de paiement
                  entraîne de plein droit l'application de <strong className="text-[#BF3003]">pénalités de retard</strong> au taux légal en vigueur
                  (minimum 3× le taux légal), ainsi qu'une <strong className="text-[#BF3003]">indemnité forfaitaire de recouvrement de 40 €</strong>.
                  NETCY se réserve le droit de suspendre immédiatement toute prestation en cours jusqu'au
                  paiement intégral des sommes dues, sans préjudice de toute autre action en justice.
                </blockquote>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-on-surface">Abonnements de maintenance</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Les abonnements de maintenance sont facturés mensuellement ou annuellement selon l'offre choisie.
                  Le paiement s'effectue par prélèvement automatique (SEPA) ou par virement mensuel. L'abonnement
                  est résiliable par écrit (email) avec un préavis de 30 jours calendaires. Les mois entamés restent
                  dus intégralement.
                </p>
              </div>
            </section>

            {/* 05 — Délais & Livraison */}
            <section id="delais" className="space-y-6">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">05</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Délais d'exécution & Livraison</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Les délais d'exécution sont précisés dans le devis. Ils commencent à courir à compter de
                la date de réception de l'acompte et de l'ensemble des éléments nécessaires fournis par le Client
                (contenus, accès, identifiants, cahier des charges complet).
              </p>
              <ul className="space-y-3 text-on-surface-variant">
                {[
                  { title: 'Obligation de moyens', text: 'NETCY s\'engage à tout mettre en œuvre pour respecter les délais convenus. Les délais constituent des objectifs de bonne foi et non des engagements de résultat sauf clause expresse contraire dans le devis.' },
                  { title: 'Retards imputables au Client', text: 'Tout retard dans la fourniture des éléments nécessaires (textes, images, identifiants d\'accès, validations), entraîne automatiquement un report des délais d\'exécution équivalent, sans pénalité pour NETCY.' },
                  { title: 'Retards imputables à NETCY', text: 'En cas de retard significatif (supérieur à 2 semaines sur le délai convenu) imputable à NETCY et non justifié, le Client peut demander un geste commercial ou une révision de l\'échéancier. Aucun retard ne peut justifier un refus de paiement de l\'acompte déjà versé.' },
                  { title: 'Force majeure', text: 'NETCY ne peut être tenu responsable des retards causés par des événements indépendants de sa volonté : catastrophes naturelles, pandémies, défaillances d\'infrastructures tiers (hébergeurs, CDN), grèves, attaques informatiques massives. Un délai raisonnable supplémentaire est alors automatiquement accordé.' },
                  { title: 'Livraison et recette', text: 'La livraison s\'effectue par mise en ligne, par envoi d\'un lien de prévisualisation ou par transfert de fichiers selon la nature de la prestation. Le Client dispose de 7 jours ouvrés pour valider ou formuler des réserves par écrit.' },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <Check size={16} className="text-[#0052FF] mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-on-surface">{item.title} — </span>
                      <span className="leading-relaxed text-sm">{item.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* 06 — Propriété Intellectuelle & Cession de droits */}
            <section id="pi" className="space-y-6">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">06</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Propriété Intellectuelle & Cession de droits</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                La propriété intellectuelle est un élément central de la relation commerciale entre NETCY et ses Clients.
                Les règles ci-dessous s'appliquent par défaut, sauf stipulations contraires expressément mentionnées dans le devis.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    titre: 'Avant paiement intégral',
                    couleur: 'border-[#BF3003]',
                    bg: 'bg-[#FFF5F5] dark:bg-[#3b0404]',
                    items: [
                      'NETCY reste propriétaire de l\'intégralité des codes sources, maquettes, fichiers et livrables.',
                      'Le Client ne peut publier, diffuser ou commercialiser les livrables avant règlement total.',
                      'Toute utilisation partielle sans accord écrit est une contrefaçon (art. L335-2 CPI).',
                    ]
                  },
                  {
                    titre: 'Après paiement intégral',
                    couleur: 'border-[#0052FF]',
                    bg: 'bg-[#EEF2FF] dark:bg-[#1a1f3d]',
                    items: [
                      'NETCY cède au Client une licence d\'exploitation exclusive et perpétuelle sur les livrables spécifiquement créés pour lui.',
                      'La cession couvre les droits de reproduction, représentation, adaptation et distribution pour les besoins de l\'activité du Client.',
                      'Les fichiers sources (.fig, .psd, .ai, code source) sont remis sauf mention contraire dans le devis.',
                    ]
                  },
                ].map((bloc) => (
                  <div key={bloc.titre} className={`rounded-2xl p-5 border-l-4 ${bloc.couleur} ${bloc.bg}`}>
                    <p className="font-semibold text-on-surface text-sm mb-3">{bloc.titre}</p>
                    <ul className="space-y-2">
                      {bloc.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-on-surface-variant">
                          <Check size={12} className="mt-0.5 flex-shrink-0 text-[#0052FF]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {[
                  'Les briques open source, bibliothèques tierces et frameworks (React, Next.js, Tailwind CSS, etc.) intégrés dans les livrables restent soumis à leurs licences respectives (MIT, Apache 2.0, etc.).',
                  'NETCY se réserve le droit de mentionner la réalisation à titre de référence dans son portfolio (site, réseaux sociaux, présentations commerciales). Le Client peut s\'y opposer par écrit dans les 30 jours suivant la livraison.',
                  'Les contenus fournis par le Client (textes, images, logos, vidéos) restent sa propriété exclusive. Il garantit être titulaire des droits nécessaires et indemnise NETCY contre tout recours de tiers.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check size={14} className="text-[#0052FF] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* 07 — Garanties & SAV */}
            <section id="garanties" className="space-y-6">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">07</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Garanties, SAV & Limitation de responsabilité</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                NETCY s'engage à fournir des prestations de qualité professionnelle. Les garanties suivantes
                s'appliquent dans le cadre de l'obligation de moyens.
              </p>

              <div className="space-y-3">
                <h3 className="font-semibold text-on-surface">Garantie de conformité — 3 mois</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  NETCY garantit que les livrables sont conformes au cahier des charges validé pendant une durée
                  de <strong className="text-on-surface">3 mois calendaires</strong> à compter de la livraison finale. Pendant cette période,
                  NETCY corrige gratuitement tout bug ou non-conformité fonctionnelle imputable à NETCY,
                  à l'exclusion de toute modification du périmètre initial.
                </p>
                <blockquote className="border-l-4 border-[#73777F] pl-5 py-2 bg-surface-container-low rounded-r-xl text-sm text-on-surface-variant italic">
                  La garantie ne couvre pas : les modifications effectuées par le Client ou des tiers sur le code,
                  les défauts résultant d'une mauvaise utilisation, les évolutions des CMS ou frameworks tiers,
                  les pannes d'hébergement gérées par des prestataires externes.
                </blockquote>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-on-surface">Obligation de moyens & exclusions</h3>
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  {[
                    'NETCY est soumis à une obligation de moyens et non de résultat. La réussite commerciale du projet, les performances SEO, le chiffre d\'affaires généré ou la conversion des visiteurs ne peuvent être garantis.',
                    'La compatibilité avec 100% des navigateurs et appareils n\'est pas garantie. NETCY vise une compatibilité avec les navigateurs modernes (Chrome, Firefox, Safari, Edge dans leurs 2 dernières versions majeures).',
                    'NETCY décline toute responsabilité pour les dommages indirects : manque à gagner, perte de données, interruption d\'activité, atteinte à l\'image commerciale.',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check size={14} className="text-[#0052FF] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-on-surface">Limitation de responsabilité financière</h3>
                <Card className="border border-surface-container shadow-none rounded-2xl">
                  <CardContent className="p-5 text-sm text-on-surface-variant leading-relaxed">
                    En tout état de cause, la responsabilité totale de NETCY au titre des présentes CGV est
                    strictement limitée au montant des sommes effectivement encaissées par NETCY au cours
                    des <strong className="text-on-surface">12 mois précédant le fait générateur</strong> du préjudice. Cette limitation s'applique
                    à toutes les causes de responsabilité confondues (contractuelle, délictuelle, etc.),
                    sauf faute lourde ou dol caractérisé de NETCY.
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 08 — Résiliation, Force majeure & Litiges */}
            <section id="resiliation" className="space-y-6">
              <div className="flex items-baseline gap-4">
                <span className="font-display font-extrabold text-5xl text-outline">08</span>
                <h2 className="font-display font-bold text-2xl text-on-surface">Résiliation, Force majeure & Règlement des litiges</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    titre: 'Résiliation par le Client',
                    items: [
                      'Résiliation possible par écrit (email recommandé) avec préavis de 15 jours.',
                      'L\'acompte versé reste acquis à NETCY à titre d\'indemnité.',
                      'Les travaux réalisés à la date de résiliation sont facturés au prorata du devis.',
                      'Les livrables partiels ne sont pas remis tant que la facturation n\'est pas réglée.',
                    ]
                  },
                  {
                    titre: 'Résiliation par NETCY',
                    items: [
                      'NETCY peut résilier en cas de manquement grave du Client (impayé, violence, dénigrement public).',
                      'Mise en demeure préalable par email avec délai de régularisation de 15 jours.',
                      'En cas de résiliation pour faute du Client, les sommes dues restent exigibles intégralement.',
                      'NETCY peut suspendre les prestations sans résiliation en cas d\'impayé constaté.',
                    ]
                  },
                ].map((bloc) => (
                  <Card key={bloc.titre} className="border border-surface-container shadow-none rounded-2xl">
                    <CardContent className="p-5">
                      <p className="font-semibold text-on-surface text-sm mb-3">{bloc.titre}</p>
                      <ul className="space-y-2">
                        {bloc.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-on-surface-variant">
                            <Check size={12} className="text-[#0052FF] mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-on-surface">Droit applicable & juridiction compétente</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      titre: 'Droit applicable',
                      desc: 'Les présentes CGV sont régies exclusivement par le droit français, notamment le Code civil, le Code de commerce et le Code de la propriété intellectuelle.'
                    },
                    {
                      titre: 'Médiation',
                      desc: 'Conformément à l\'ordonnance n°2015-1033 du 20 août 2015, en cas de litige, le Client peut recourir gratuitement à la médiation via la plateforme européenne de règlement en ligne des litiges : ec.europa.eu/consumers/odr'
                    },
                    {
                      titre: 'Tentative amiable obligatoire',
                      desc: 'Avant toute action judiciaire, les parties s\'engagent à tenter de résoudre le différend à l\'amiable dans un délai de 30 jours à compter de la notification du litige par lettre recommandée ou email avec accusé de réception.'
                    },
                    {
                      titre: 'Tribunal compétent',
                      desc: 'À défaut de résolution amiable, tout litige relatif à l\'interprétation ou à l\'exécution des présentes CGV sera porté devant le Tribunal de Commerce d\'Aix-en-Provence, seul compétent, y compris en cas de pluralité de défendeurs.'
                    },
                  ].map((c) => (
                    <Card key={c.titre} className="border border-surface-container shadow-none rounded-2xl">
                      <CardContent className="p-5">
                        <p className="font-semibold text-sm text-on-surface mb-2">{c.titre}</p>
                        <p className="text-xs text-outline leading-relaxed">{c.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Contact card */}
              <div className="bg-[#1A1C1E] rounded-3xl p-8 mt-8">
                <p className="font-display font-bold text-xl text-white mb-2">Une question sur ces conditions ?</p>
                <p className="text-[#9EA3AE] text-sm mb-6 leading-relaxed">
                  Pour toute question relative aux présentes CGV, demande de devis, ou réclamation,
                  contactez-nous directement. Nous nous engageons à répondre sous 48h ouvrées.
                </p>
                <div className="flex flex-wrap gap-3 print-hide">
                  <Link href="/#contact" className="btn-primary px-6 py-3 text-sm">
                    Nous contacter
                  </Link>
                  <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-6 py-3 text-sm rounded-full bg-surface-container-lowest/10 text-white border border-white/30 hover:bg-surface-container-lowest/20 transition-colors">
                    <Download size={14} /> Télécharger en PDF
                  </button>
                  <Link href="/cgu" className="inline-flex items-center gap-2 px-6 py-3 text-sm rounded-full bg-transparent text-white border border-white/30 hover:bg-surface-container-lowest/10 transition-colors">
                    Voir les CGU <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <p className="text-xs text-outline-variant text-center pt-4">
                Version en vigueur depuis le 1er mars 2026. NETCY se réserve le droit de modifier les présentes CGV à tout moment.
                Les Clients seront informés des modifications substantielles par email. La version applicable est celle en vigueur à la date de signature du devis.
              </p>
            </section>

          </div>
        </div>
      </div>

      <LegalFooter />
      </div>
    </div>
  );
}

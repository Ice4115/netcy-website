'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LiquidEther = dynamic(() => import("@/components/LiquidEther"), {
  ssr: false,
});

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 1024;
  return ua || isSmallScreen;
};

export default function CGVPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.opacity = '0';
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = 'opacity 0.8s ease-in';
          contentRef.current.style.opacity = '1';
        }
      }, 100);
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#110F1B' }}>
      <div className="fixed inset-0 w-full h-full z-0">
        <LiquidEther 
          colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
          mouseForce={isMobile ? 80 : 20}
          cursorSize={isMobile ? 250 : 100}
          autoDemo={!isMobile}
          autoSpeed={0.5}
          autoIntensity={2.2}
          autoResumeDelay={1000}
          resolution={isMobile ? 0.35 : 0.5}
        />
      </div>

      <div ref={contentRef} className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour
        </Link>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            Conditions Générales de Vente
          </h1>

          <div className="space-y-8 text-white/90">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 1 – Informations légales
              </h2>
              <div className="leading-relaxed space-y-2">
                <p><strong>Prestataire :</strong> NETCY</p>
                <p><strong>Statut :</strong> Auto-entrepreneur (Micro-entreprise)</p>
                <p><strong>Responsable :</strong> Jung Jean-Marie</p>
                <p><strong>Nom commercial :</strong> NETCY</p>
                <p><strong>Adresse :</strong> 145 chemin du pan perdu, 1 clos des mylord, 13160 Châteaurenard</p>
                <p><strong>Email :</strong> jeanmarie.jung@netcy.fr</p>
                <p><strong>Téléphone :</strong> 07 49 64 44 78</p>
                <p><strong>SIREN :</strong> 995 301 546</p>
                <p><strong>SIRET :</strong> 99530154600025</p>
                <p><strong>TVA :</strong> TVA non applicable, art. 293B du CGI (sauf mention contraire)</p>
                <p className="mt-4">Le Prestataire est titulaire d&apos;une assurance responsabilité civile professionnelle.</p>
                <p className="mt-4">Les présentes Conditions Générales de Vente (CGV) régissent l&apos;ensemble des prestations fournies par NETCY.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 2 – Objet
              </h2>
              <p className="leading-relaxed mb-3">
                Les CGV définissent les conditions dans lesquelles NETCY fournit à ses clients :
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>création et refonte de sites internet,</li>
                <li>maintenance technique et sécurité informatique,</li>
                <li>services numériques annexes (messagerie, référencement, prises de vues, abonnements).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 3 – Champ d&apos;application
              </h2>
              <p className="leading-relaxed">
                Les CGV s&apos;appliquent à toute commande passée auprès de NETCY (devis signé, email, validation électronique).
                La commande implique l&apos;acceptation pleine et entière des présentes CGV.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 4 – Devis et commande
              </h2>
              <p className="leading-relaxed mb-3">
                Chaque prestation fait l&apos;objet d&apos;un devis détaillé : nature, prix, délais, modalités de paiement.
                Le devis est valable 30 jours. La commande est ferme dès :
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>signature du devis par le client,</li>
                <li>ou versement de l&apos;acompte demandé.</li>
              </ul>
              <p className="leading-relaxed mt-3">Le devis signé vaut contrat.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 5 – Tarifs et paiement
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Prix exprimés en euros (€), nets de TVA (TVA non applicable).</li>
                <li>NETCY peut modifier ses tarifs à tout moment, sans effet rétroactif.</li>
                <li>Abonnements annuels sans engagement, facturés à terme échu ou échoir.</li>
                <li>Retard de paiement : pénalités légales + indemnité forfaitaire 40 €.</li>
                <li>NETCY peut suspendre les prestations en cas d&apos;impayé.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 6 – Délais de réalisation
              </h2>
              <p className="leading-relaxed mb-3">
                Les délais sont indicatifs. NETCY n&apos;est pas responsable des retards dus :
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>au client (retard de transmission de contenus, validations),</li>
                <li>à des causes techniques ou de force majeure.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 7 – Obligations du client
              </h2>
              <p className="leading-relaxed mb-3">Le client s&apos;engage à :</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>fournir des informations exactes,</li>
                <li>transmettre les contenus nécessaires,</li>
                <li>disposer des droits sur ces contenus,</li>
                <li>collaborer activement au projet.</li>
              </ul>
              <p className="leading-relaxed mt-3">Le client reste seul responsable du contenu de son site.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 8 – Maintenance et sécurité
              </h2>
              <p className="leading-relaxed mb-3">
                Les prestations de maintenance et sécurité comprennent uniquement ce qui est précisé dans le devis/abonnement.
                Sauf mention contraire, ne sont pas inclus :
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>modifications graphiques ou fonctionnelles,</li>
                <li>création de nouveaux contenus,</li>
                <li>correction de problèmes causés par des interventions externes.</li>
              </ul>
              <p className="leading-relaxed mt-3">NETCY fournit une obligation de moyens et non de résultat.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 9 – Abonnements
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Abonnement annuel, sans engagement, renouvelable tacitement.</li>
                <li>Résiliation possible à tout moment par écrit, sans frais ni pénalité.</li>
                <li>Abonnement dû jusqu&apos;à la fin de la période annuelle, sans remboursement prorata.</li>
                <li>Suspension en cas d&apos;impayé.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 10 – Hébergement et prestataires tiers
              </h2>
              <p className="leading-relaxed mb-3">
                NETCY n&apos;assure pas l&apos;hébergement. Le client choisit un prestataire tiers pour son hébergement.
                NETCY n&apos;est pas responsable :
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>des pannes, interruptions, pertes de données des hébergeurs tiers,</li>
                <li>des modifications de conditions/tarifs imposées par ces prestataires,</li>
                <li>de l&apos;indisponibilité du site pour causes externes.</li>
              </ul>
              <p className="leading-relaxed mt-3">Le client demeure titulaire du contrat d&apos;hébergement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 11 – Propriété intellectuelle
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>NETCY reste propriétaire des éléments jusqu&apos;au paiement intégral.</li>
                <li>Après paiement, le client devient propriétaire, hors éléments tiers (plugins, thèmes, licences).</li>
                <li>Le site peut être cité en référence par NETCY.</li>
                <li>Droits d&apos;utilisation des composants logiciels tiers garantis par NETCY.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 12 – Cybersécurité, attaques et hacking
              </h2>
              <p className="leading-relaxed mb-3">
                NETCY met en œuvre des mesures de sécurité raisonnables (mises à jour, sauvegardes, surveillance si inclus).
                Le client accepte que :
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>le risque zéro n&apos;existe pas,</li>
                <li>aucune solution ne garantit protection totale contre attaques, malwares, ransomwares, DDoS, piratage.</li>
              </ul>
              <p className="leading-relaxed mt-3 mb-3">NETCY n&apos;est pas responsable :</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>d&apos;un piratage total ou partiel,</li>
                <li>d&apos;une perte ou altération de données,</li>
                <li>d&apos;une indisponibilité temporaire ou définitive,</li>
                <li>des conséquences financières ou juridiques.</li>
              </ul>
              <p className="leading-relaxed mt-3 mb-3">
                La remise en état après incident est prestation distincte sauf inclusion dans l&apos;abonnement.
                Le client est responsable de :
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>mots de passe,</li>
                <li>gestion des accès utilisateurs,</li>
                <li>respect des obligations légales (RGPD, mentions légales).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 13 – Garantie technique
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>3 mois de garantie après livraison finale pour défauts techniques ou visuels.</li>
                <li>Dysfonctionnements liés à des hébergeurs tiers ou interventions externes ne sont pas couverts.</li>
                <li>Toute modification après la garantie = prestation distincte facturable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 14 – Limitation de responsabilité
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>NETCY a obligation de moyens, pas de résultat.</li>
                <li>Responsabilité limitée aux 12 derniers mois de prestations encaissées.</li>
                <li>Non-responsabilité pour : mauvaise utilisation par le client, tiers non autorisés, failles de services tiers, pertes de chiffre d&apos;affaires/données.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 15 – Force majeure
              </h2>
              <p className="leading-relaxed">
                Aucune responsabilité si exécution retardée ou empêchée par force majeure (grève, panne réseau, restrictions légales, etc.).
                Notification rapide à l&apos;autre partie obligatoire.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 16 – Résiliation
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Résiliation possible en cas de manquement grave après mise en demeure 15 jours.</li>
                <li>Sommes déjà versées restent acquises.</li>
                <li>Abonnement : résiliation possible par écrit, facturation due pour l&apos;année en cours.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 17 – Données personnelles
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Collecte des données uniquement dans le cadre commercial.</li>
                <li>RGPD : droit d&apos;accès, rectification, suppression pour le client.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 18 – Droit applicable – Litiges
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Droit français.</li>
                <li>Tentative de résolution amiable obligatoire avant action judiciaire.</li>
                <li>Compétence exclusive : tribunaux du siège de NETCY.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 19 – Acceptation
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Validation du devis ou paiement = acceptation des CGV.</li>
                <li>CGV disponibles : site web NETCY, sur demande, en annexe de devis.</li>
                <li>Version web des CGV prévaut sur version papier ou email.</li>
                <li>NETCY peut modifier les CGV à tout moment ; celles en vigueur à la commande s&apos;appliquent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 20 – Abonnements spécifiques
              </h2>
              <p className="leading-relaxed mb-3">
                (Maintenance, messagerie, référencement, création de site)
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Renouvellement tacite annuel ou mensuel selon contrat.</li>
                <li>Suspension en cas d&apos;impayé jusqu&apos;à règlement complet.</li>
                <li>Détails des prestations, heures incluses, mises à jour, noms de domaine, messagerie, référencement détaillés dans le devis.</li>
                <li>Abonnement de création de site : propriété transférée au client après 36 mensualités, refonte gratuite après 48 mensualités.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Article 21 – Confidentialité
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Parties s&apos;engagent à garder confidentielles toutes les informations relatives à l&apos;autre partie.</li>
                <li>Limitation de diffusion aux personnels nécessaires.</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">
              Dernière mise à jour : Janvier 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

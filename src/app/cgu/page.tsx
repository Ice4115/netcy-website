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

export default function CGUPage() {
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
            Conditions Générales d&apos;Utilisation
          </h1>

          <div className="space-y-8 text-white/90">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Acceptation et objet
              </h2>
              <p className="leading-relaxed">
                En accédant au site et à l&apos;espace client, vous acceptez sans réserve les présentes conditions d&apos;utilisation qui encadrent les services de NETCY.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Services et comptes utilisateur
              </h2>
              <div className="space-y-3 leading-relaxed">
                <p>La création d&apos;un compte est nécessaire pour accéder aux fonctionnalités clients (tableau de bord, factures, support). Vous vous engagez à fournir des informations exactes et à les maintenir à jour.</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Les identifiants sont personnels et ne doivent pas être partagés.</li>
                  <li>Vous devez informer NETCY sans délai en cas d&apos;accès non autorisé ou de suspicion de compromission.</li>
                  <li>NETCY peut suspendre ou fermer un compte en cas de violation des présentes conditions ou d&apos;usage abusif.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Disponibilité et sécurité
              </h2>
              <div className="space-y-3 leading-relaxed">
                <p>NETCY met en œuvre des mesures techniques et organisationnelles pour sécuriser l&apos;accès et les données clients. L&apos;accès peut être temporairement interrompu pour maintenance ou amélioration.</p>
                <p>Vous vous engagez à n&apos;entraver ni à altérer le fonctionnement du site et à utiliser les services dans le respect des lois applicables.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Propriété intellectuelle
              </h2>
              <p className="leading-relaxed">
                Les contenus du site (textes, images, logos, vidéos, composants interactifs) sont la propriété de NETCY ou de ses partenaires. Toute reproduction ou exploitation sans autorisation écrite est interdite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Données personnelles et cookies
              </h2>
              <p className="leading-relaxed mb-3">
                Le traitement des données et l&apos;usage des cookies (dont Google Analytics soumis à votre consentement) sont décrits dans la Politique de Confidentialité et la politique de cookies. Vous pouvez modifier vos choix à tout moment via la bannière ou le lien "Gérer les cookies".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Liens externes
              </h2>
              <p className="leading-relaxed">
                Le site peut contenir des liens vers des sites tiers. NETCY n&apos;assume aucune responsabilité pour leur contenu, services ou politiques de confidentialité.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Responsabilité et suspension
              </h2>
              <div className="space-y-3 leading-relaxed">
                <p>Le site est fourni « tel quel ». NETCY ne saurait être tenue responsable des dommages résultant d&apos;une utilisation non conforme ou de causes externes (panne réseau, fournisseur tiers).</p>
                <p>En cas de non-respect des présentes conditions ou de risque pour la sécurité, NETCY peut suspendre ou limiter l&apos;accès aux services.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                8. Modifications et contact
              </h2>
              <div className="space-y-3 leading-relaxed">
                <p>NETCY peut adapter les présentes conditions. La version en ligne prévaut ; les utilisateurs sont invités à les consulter régulièrement.</p>
                <p>Pour toute question : <a href="mailto:contact@netcy.fr" className="text-[#7A8FFF] hover:text-[#8FA5FF] underline">contact@netcy.fr</a>.</p>
              </div>
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

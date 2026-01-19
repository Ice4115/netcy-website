'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LiquidEtherMobile = dynamic(() => import("@/components/LiquidEtherMobile"), {
  ssr: false,
});

const LiquidEther = dynamic(() => import("@/components/LiquidEther"), {
  ssr: false,
});

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 1024;
  return ua || isSmallScreen;
};

export default function PolitiqueConfidentialitePage() {
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
        {isMobile ? (
          <LiquidEtherMobile 
            colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
            mouseForce={80}
            cursorSize={250}
            resolution={0.35}
          />
        ) : (
          <LiquidEther 
            colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            autoResumeDelay={1000}
            resolution={0.5}
          />
        )}
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
            Politique de Confidentialité
          </h1>

          <div className="space-y-8 text-white/90">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Données collectées
              </h2>
              <div className="space-y-3 leading-relaxed">
                <p>Nous collectons uniquement les informations nécessaires à la création et à la gestion de votre compte client :</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Identifiants de compte : nom, prénom, email, mot de passe (haché), téléphone facultatif.</li>
                  <li>Données de profil et de facturation : coordonnées professionnelles, références de factures et historique des paiements le cas échéant.</li>
                  <li>Journaux techniques : connexions, actions importantes dans l&apos;espace client, adresses IP horodatées à des fins de sécurité.</li>
                  <li>Données de navigation soumises à consentement : cookies de mesure d&apos;audience Google Analytics.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Finalités et bases légales
              </h2>
              <div className="space-y-3 leading-relaxed">
                <p>Nous utilisons vos données pour :</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Authentifier et gérer les comptes, fournir le tableau de bord, les factures et le support client (exécution du contrat).</li>
                  <li>Assurer la sécurité, prévenir la fraude et tracer les accès sensibles (intérêt légitime).</li>
                  <li>Respecter nos obligations légales et comptables (facturation, conservation légale).</li>
                  <li>Mesurer l&apos;audience et améliorer le site via Google Analytics uniquement si vous y consentez (consentement).</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Partage et sous-traitants
              </h2>
              <div className="space-y-3 leading-relaxed">
                <p>Vos données ne sont jamais vendues. Elles peuvent être traitées par :</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>Nos prestataires techniques (hébergement, authentification, messagerie) pour fournir le service.</li>
                  <li>Google Analytics pour les mesures d&apos;audience si vous avez accepté les cookies statistiques.</li>
                  <li>Les autorités compétentes si la loi l&apos;exige.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Durées de conservation
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-4 leading-relaxed">
                <li>Compte et données de facturation : pendant la relation contractuelle puis 3 ans après la dernière activité, sauf obligations plus longues (factures : 10 ans).</li>
                <li>Journaux de connexion et de sécurité : jusqu&apos;à 12 mois.</li>
                <li>Consentement cookies : 6 mois.</li>
                <li>Mesures d&apos;audience Google Analytics : 14 mois maximum.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Vos droits
              </h2>
              <div className="space-y-3 leading-relaxed">
                <p>Conformément au RGPD, vous pouvez demander l&apos;accès, la rectification, la suppression, la limitation, l&apos;opposition et la portabilité de vos données.</p>
                <p>Pour exercer vos droits ou retirer votre consentement aux cookies statistiques : <a href="mailto:contact@netcy.fr" className="text-[#7A8FFF] hover:text-[#8FA5FF] underline">contact@netcy.fr</a>. Vous pouvez également saisir la CNIL si nécessaire.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Sécurité
              </h2>
              <p className="leading-relaxed">
                Nous appliquons le chiffrement des communications, le hachage des mots de passe, le cloisonnement des accès et des sauvegardes régulières. En cas d&apos;incident de sécurité impactant vos données, vous serez informé conformément à la réglementation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Cookies et traceurs
              </h2>
              <div className="space-y-4 leading-relaxed">
                <p>Vous pouvez accepter ou refuser les cookies via la bannière ou le lien « Gérer les cookies ». Seuls les cookies nécessaires sont déposés par défaut.</p>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white mb-2">Cookies nécessaires (toujours actifs)</h4>
                  <div className="text-sm space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Nom</span>
                      <span className="text-white md:col-span-2">netcy_cookie_consent</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Finalité</span>
                      <span className="text-white md:col-span-2">Mémoriser vos choix de consentement</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Durée</span>
                      <span className="text-white md:col-span-2">6 mois</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Fournisseur</span>
                      <span className="text-white md:col-span-2">NETCY (first-party)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white mb-2">Cookies statistiques (soumis à consentement)</h4>
                  <div className="text-sm space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Service</span>
                      <span className="text-white md:col-span-2">Google Analytics</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Cookies</span>
                      <span className="text-white md:col-span-2">_ga, _gid, _ga_*</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Finalité</span>
                      <span className="text-white md:col-span-2">Mesure d&apos;audience et amélioration de l&apos;expérience</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Durée</span>
                      <span className="text-white md:col-span-2">_ga et _ga_* : 14 mois, _gid : 24h</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Fournisseur</span>
                      <span className="text-white md:col-span-2">Google LLC (tiers)</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Aucune donnée statistique n&apos;est collectée sans votre accord. Les adresses IP sont anonymisées avant transmission à Google lorsque cela est proposé par le service.</p>
                </div>
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

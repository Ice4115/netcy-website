'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import LiquidEtherMobile from '@/components/LiquidEtherMobile';

export default function PolitiqueConfidentialitePage() {
  const contentRef = useRef<HTMLDivElement>(null);

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
      <div className="absolute inset-0 z-0">
        <LiquidEtherMobile
          colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
          mouseForce={80}
          cursorSize={250}
          resolution={0.35}
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
            Politique de Confidentialité
          </h1>

          <div className="space-y-8 text-white/90">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Collecte des données
              </h2>
              <p className="leading-relaxed mb-3">
                Nous collectons uniquement les informations nécessaires pour la gestion des contacts et services :
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Nom, prénom, email, téléphone (via formulaire de contact)</li>
                <li>Données de navigation (cookies, IP, analytics)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Finalités
              </h2>
              <p className="leading-relaxed mb-3">
                Les données sont utilisées pour :
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Répondre aux demandes des utilisateurs,</li>
                <li>Fournir les services proposés,</li>
                <li>Améliorer le site et ses fonctionnalités.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Partage des données
              </h2>
              <p className="leading-relaxed">
                Les données ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec des prestataires techniques pour assurer le fonctionnement du site (hébergement, messagerie).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Durée de conservation
              </h2>
              <p className="leading-relaxed">
                Les données personnelles sont conservées maximum 3 ans après le dernier contact, sauf obligation légale contraire.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Droits des utilisateurs
              </h2>
              <p className="leading-relaxed mb-3">
                Conformément au RGPD, vous pouvez :
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Accéder à vos données,</li>
                <li>Les rectifier ou supprimer,</li>
                <li>Vous opposer à leur traitement,</li>
                <li>Demander leur portabilité.</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Pour exercer vos droits, contactez : <a href="mailto:contact@netcy.fr" className="text-[#7A8FFF] hover:text-[#8FA5FF] underline">contact@netcy.fr</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Sécurité
              </h2>
              <p className="leading-relaxed">
                NETCY met en œuvre des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, divulgation ou perte.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Cookies
              </h2>
              <p className="leading-relaxed mb-4">
                Le site utilise des cookies pour améliorer la navigation et analyser le trafic. Vous pouvez gérer vos préférences via la bannière de cookies ou via le lien &quot;Gérer les cookies&quot; en bas de page.
              </p>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                Types de cookies utilisés
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white mb-2">🔒 Cookies Nécessaires (Toujours actifs)</h4>
                  <div className="text-sm space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Nom:</span>
                      <span className="text-white md:col-span-2">netcy_cookie_consent</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Finalité:</span>
                      <span className="text-white md:col-span-2">Mémoriser vos préférences de cookies</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Durée:</span>
                      <span className="text-white md:col-span-2">6 mois</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Fournisseur:</span>
                      <span className="text-white md:col-span-2">NETCY (First-party)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white mb-2">📊 Cookies Statistiques (Optionnels)</h4>
                  <p className="text-sm text-gray-400 mb-3">Ces cookies nous aident à comprendre comment vous utilisez notre site.</p>
                  <div className="text-sm space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Service:</span>
                      <span className="text-white md:col-span-2">Google Analytics (si activé)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Cookies:</span>
                      <span className="text-white md:col-span-2">_ga, _gid, _gat</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Finalité:</span>
                      <span className="text-white md:col-span-2">Analyse d&apos;audience, statistiques de navigation</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Durée:</span>
                      <span className="text-white md:col-span-2">_ga: 2 ans, _gid: 24h, _gat: 1 minute</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Fournisseur:</span>
                      <span className="text-white md:col-span-2">Google LLC (Third-party)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-white mb-2">📢 Cookies Marketing (Optionnels)</h4>
                  <p className="text-sm text-gray-400 mb-3">Ces cookies permettent de personnaliser les publicités.</p>
                  <div className="text-sm space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Services possibles:</span>
                      <span className="text-white md:col-span-2">Facebook Pixel, Google Ads (si activés)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Finalité:</span>
                      <span className="text-white md:col-span-2">Ciblage publicitaire, remarketing, mesure de conversion</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <span className="text-gray-400">Durée:</span>
                      <span className="text-white md:col-span-2">Variable selon le service (90 jours à 2 ans)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#6F3FFF]/10 border border-[#6F3FFF]/30 rounded-lg">
                <p className="text-sm text-white">
                  💡 <strong>Bon à savoir :</strong> Vous pouvez modifier vos préférences à tout moment en cliquant sur &quot;Gérer les cookies&quot; en bas de page. Votre choix sera mémorisé pendant 6 mois maximum.
                </p>
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

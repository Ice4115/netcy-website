'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export type Project = {
  num: string;
  title: string;
  context: string;
  problem: string;
  solution: string;
  tech: string[];
  github: string;
  gradient: string;
  glow: string;
  accent: string;
  details: {
    contexte: string;
    features: string[];
    securite: string[];
  };
};

export const PROJECTS: Project[] = [
  {
    num: '01',
    title: 'Hôtel Neptune',
    context: 'Projet Académique BTS SIO · Web Sécurisé',
    problem: "Développement complet d'une application web pour la gestion d'un hôtel fictif. L'enjeu : couvrir tout le cycle (recueil des besoins, conception BDD, développement front + back, sécurisation, mise en production) sur un cas réaliste avec réservations et gestion administrative.",
    solution: "Système de réservation en ligne avec gestion des disponibilités, interface d'administration sécurisée (back-office), historique clients, et durcissement des formulaires (authentification, protection contre les injections SQL, validation des entrées). Mise en place du contrôle d'accès par rôles.",
    tech: ['PHP', 'MySQL', 'JavaScript', 'HTML/CSS', 'Bootstrap', 'Git'],
    github: 'https://github.com/Ice4115/5---Projet-Neptune---Secure',
    gradient: 'linear-gradient(135deg, #0052FF, #4f46e5)',
    glow: 'rgba(0,82,255,0.15)',
    accent: '#0052FF',
    details: {
      contexte:
        "Développement d'une application web complète pour la gestion d'un hôtel fictif nommé \"Neptune\". Le projet couvre l'ensemble du cycle de développement : recueil des besoins, conception de la base de données, développement front + back, durcissement de la sécurité et déploiement.",
      features: [
        'Système de réservation de chambres en temps réel',
        'Gestion des disponibilités et prévention des surréservations (contraintes SQL)',
        "Interface d'administration sécurisée (back-office)",
        'Historique et fiches clients consultables',
        "Modules d'authentification et de sécurité des formulaires",
        'Contrôle d\'accès par rôles (admin / client)',
      ],
      securite: [
        'Requêtes préparées (PDO) contre l\'injection SQL',
        "Hachage des mots de passe (password_hash / verify)",
        'Validation et échappement systématique des entrées utilisateur',
        'Sessions PHP sécurisées + protection CSRF',
      ],
    },
  },
  {
    num: '02',
    title: 'Seigneur des Goodies',
    context: 'Projet Académique BTS SIO · E-Commerce',
    problem: "Conception d'un site e-commerce thématique (univers Seigneur des Anneaux) avec gestion d'un catalogue produits, panier, processus de commande sécurisé et back-office d'administration pour gérer le stock et les ventes.",
    solution: "Partie administrateur complète : gestion des produits (CRUD), sécurisation du site (authentification, contrôle des sessions, protection des formulaires), gestion des paiements et suivi des commandes. Interface responsive pour clients + dashboard dédié pour l'admin.",
    tech: ['PHP', 'MySQL', 'JavaScript', 'HTML/CSS', 'Bootstrap', 'Git'],
    github: 'https://github.com/Ice4115/Seigneur_des_goodies',
    gradient: 'linear-gradient(135deg, #d97706, #ea580c)',
    glow: 'rgba(217,119,6,0.15)',
    accent: '#d97706',
    details: {
      contexte:
        "Site e-commerce thématique sur l'univers du Seigneur des Anneaux. Mon rôle s'est concentré sur la partie administrateur du site, en assurant la sécurité globale du back-office et la gestion complète du catalogue de produits.",
      features: [
        'Catalogue produits avec catégorisation et fiches détaillées',
        'Panier client avec calcul automatique du total',
        'Processus de commande complet (sélection → paiement → confirmation)',
        'Back-office admin : CRUD complet sur les produits',
        'Gestion des commandes et suivi des stocks',
        'Interface responsive (mobile, tablette, desktop)',
      ],
      securite: [
        'Authentification administrateur séparée du front client',
        'Sessions PHP avec timeout et régénération de l\'ID',
        'Sécurisation du tunnel de paiement (validation côté serveur)',
        'Échappement des sorties (XSS) et requêtes préparées (SQLi)',
      ],
    },
  },
];

interface PortfolioModalsProps {
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
}

export default function PortfolioModals({ openIndex, setOpenIndex }: PortfolioModalsProps) {
  const [mounted, setMounted] = useState(false);
  const active = openIndex !== null ? PROJECTS[openIndex] ?? null : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    document.addEventListener('keydown', onKey);

    // Lock scroll en compensant la largeur de la scrollbar pour éviter le shift latéral
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [openIndex, setOpenIndex]);

  if (!active || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setOpenIndex(null)}
    >
      <div
        className="relative w-full max-w-2xl bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient top bar */}
        <div className="h-1 w-full sticky top-0 z-10" style={{ background: active.gradient }} />

        <button
          type="button"
          onClick={() => setOpenIndex(null)}
          aria-label="Fermer"
          className="absolute top-4 right-4 p-2 text-outline hover:text-on-surface transition-colors bg-surface-container rounded-md border border-outline-variant z-20"
        >
          <X size={16} />
        </button>

        <div className="p-5 md:p-8 lg:p-10">
          <div className="mb-6 md:mb-8 pr-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: active.accent, opacity: 0.8 }}>
              Projet {active.num}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mb-2">
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: active.gradient }}
              >
                {active.title}
              </span>
            </h2>
            <p className="text-xs font-mono text-outline uppercase tracking-widest">{active.context}</p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Contexte */}
            <div>
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 border-b border-outline-variant pb-2">
                Contexte du projet
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{active.details.contexte}</p>
            </div>

            {/* Fonctionnalités */}
            <div>
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 border-b border-outline-variant pb-2">
                Détail des fonctionnalités
              </h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {active.details.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: active.accent }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sécurité */}
            <div>
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 border-b border-outline-variant pb-2">
                Sécurité & bonnes pratiques
              </h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {active.details.securite.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-1 flex-shrink-0 text-emerald-500">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 border-b border-outline-variant pb-2">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {active.tech.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2.5 py-1 rounded border"
                    style={{
                      background: `${active.accent}14`,
                      borderColor: `${active.accent}30`,
                      color: active.accent,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* GitHub CTA */}
            <div className="pt-2">
              <a
                href={active.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: active.gradient }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                Voir le code sur GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

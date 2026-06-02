'use client';

import React from 'react';

type Veille = {
  title: string;
  desc: string;
  date: string;
  link: string;
  outils: string[];
  impact: string;
  gradient: string;
  color: string;
  icon: React.ReactNode;
};

const VEILLES: Veille[] = [
  {
    title: 'Machine Learning & LLM',
    desc: "Évolution des algorithmes d'intelligence artificielle et impact sociétal des grands modèles de langage (ChatGPT, Claude, Mistral...).",
    date: 'Année 2024 – 2025 · SN1',
    link: '/Veille/2024-25_SN1-JUNG-JEANMARIE_DocumentVeilleTechno.pdf',
    outils: ['Google Alerts', 'Feedly', 'X / Twitter'],
    impact: "L'arrivée des LLM transforme profondément le développement web (génération de code, agents) et l'infrastructure (orchestration assistée, ops augmenté). En SISR, c'est un changement de paradigme pour le support N1 et l'analyse de logs.",
    gradient: 'linear-gradient(135deg, #059669, #0d9488)',
    color: '#059669',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
  {
    title: 'Cybersécurité & Nouveaux Enjeux',
    desc: "Menaces émergentes en infrastructure SISR : ransomware ciblé, attaques supply chain, modèle Zero-Trust, et durcissement réseau.",
    date: 'Année 2025 – 2026 · SN2',
    link: '/Veille/2025-26_SN2-JUNG-JEANMARIE_DocumentVeilleTechno.pdf',
    outils: ['Google Alerts', 'Feedly', 'X / Twitter'],
    impact: "Le passage à Zero-Trust impose une refonte du périmètre réseau (plus de \"LAN de confiance\"). Pour le SISR, cela implique de maîtriser segmentation fine, micro-pare-feux, et authentification continue à chaque accès — y compris interne.",
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    color: '#059669',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

export default function VeillesSection() {
  return (
    <section id="veilles" className="relative scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Veilles Technologiques</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Deux travaux de veille réalisés dans le cadre de mon BTS SIO, accompagnés du sujet choisi, des outils utilisés pour la collecte d&apos;information, et de l&apos;analyse de l&apos;impact des évolutions sur mon domaine (SISR).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VEILLES.map((v, i) => (
          <a
            key={v.title}
            href={v.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden transition-all duration-300 hover:bg-surface-container hover:border-outline hover:-translate-y-1 hover:shadow-lg animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-1 w-full flex-shrink-0" style={{ background: v.gradient }} />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top left, ${v.color}12, transparent 70%)` }}
            />

            <div className="p-6 flex flex-col flex-1 relative">
              <div className="flex justify-between items-start mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${v.color}18`, color: v.color }}
                >
                  {v.icon}
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full"
                  style={{ background: `${v.color}14`, color: v.color, border: `1px solid ${v.color}30` }}
                >
                  Veille
                </span>
              </div>

              <h3 className="text-base font-bold text-on-surface mb-2">{v.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-5">{v.desc}</p>

              {/* Outils de veille */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Outils utilisés</p>
                <div className="flex flex-wrap gap-1.5">
                  {v.outils.map((o) => (
                    <span
                      key={o}
                      className="text-[10px] font-medium px-2 py-0.5 rounded border"
                      style={{
                        background: `${v.color}10`,
                        borderColor: `${v.color}30`,
                        color: v.color,
                      }}
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>

              {/* Impact */}
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Impact sur le SISR</p>
                <p className="text-xs text-on-surface-variant leading-relaxed italic">{v.impact}</p>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-outline-variant pt-4">
                <span className="text-xs font-mono text-outline">{v.date}</span>
                <span
                  className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 group-hover:translate-x-1"
                  style={{ color: v.color }}
                >
                  Lire le dossier →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

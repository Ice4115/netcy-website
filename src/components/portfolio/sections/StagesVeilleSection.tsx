'use client';

import React from 'react';

const DOCUMENTS = [
  {
    type: 'Rapport de Stage',
    title: 'Stage de 1ère Année — InfoBoost',
    desc: "Technicien reconditionnement et accompagnement informatique pour les TPE/PME.",
    date: 'Avril – Juillet 2025',
    link: '/Stages/Rapport_Stage_Jean-Marie_Jung_Infoboost.pdf',
    gradient: 'linear-gradient(135deg, #0052FF, #4f46e5)',
    color: '#0052FF',
    disabled: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/>
      </svg>
    ),
  },
  {
    type: 'Veille Technologique',
    title: 'Machine Learning & LLM',
    desc: "Dossier de veille sur l'évolution des algorithmes IA et l'impact sociétal des grands modèles de langage.",
    date: 'Année 2024-2025',
    link: '/Veille/Dossier_Veille_IA_ML_Jung_Jean_Marie.pdf',
    gradient: 'linear-gradient(135deg, #059669, #0d9488)',
    color: '#059669',
    disabled: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      </svg>
    ),
  },
  {
    type: 'Bientôt disponible',
    title: 'Cybersécurité & Nouveaux Enjeux',
    desc: "Prochaine veille technologique axée sur les menaces émergentes en infrastructure SISR.",
    date: 'En préparation (2025)',
    link: '#',
    gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)',
    color: '#6b7280',
    disabled: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
];

export default function StagesVeilleSection() {
  return (
    <section id="ressources" className="relative scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Stages & Veille Technologique</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Rapports d&apos;expériences professionnelles en entreprise et travaux documentaires liés aux évolutions du secteur IT.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOCUMENTS.map((doc, i) => (
          <a
            key={i}
            href={doc.link}
            target={doc.disabled ? undefined : '_blank'}
            rel="noopener noreferrer"
            className={`group relative bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden flex flex-col transition-all duration-300 animate-fade-up ${
              doc.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-surface-container hover:border-outline hover:-translate-y-1 hover:shadow-lg'
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
            onClick={(e) => doc.disabled && e.preventDefault()}
          >
            {/* Gradient top bar */}
            <div className="h-1 w-full flex-shrink-0" style={{ background: doc.gradient }} />

            {/* Hover glow */}
            {!doc.disabled && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${doc.color}12, transparent 70%)` }}
              />
            )}

            <div className="p-6 flex flex-col flex-1 relative">
              <div className="flex justify-between items-start mb-6">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${doc.color}18`, color: doc.color }}
                >
                  {doc.icon}
                </div>
                {/* Type badge */}
                <span
                  className="text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full"
                  style={{
                    background: `${doc.color}14`,
                    color: doc.color,
                    border: `1px solid ${doc.color}30`,
                  }}
                >
                  {doc.type}
                </span>
              </div>

              <h3 className="text-base font-bold text-on-surface mb-2">{doc.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6 flex-1">{doc.desc}</p>

              <div className="mt-auto flex items-center justify-between border-t border-outline-variant pt-4">
                <span className="text-xs font-mono text-outline">{doc.date}</span>
                {!doc.disabled && (
                  <span
                    className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 group-hover:translate-x-1"
                    style={{ color: doc.color }}
                  >
                    Lire le PDF →
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

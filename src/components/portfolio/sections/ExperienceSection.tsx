'use client';

import React from 'react';

const TYPE_COLORS: Record<string, { dot: string; badge: string; text: string }> = {
  'Stage':          { dot: '#0052FF', badge: 'rgba(0,82,255,0.12)', text: '#0052FF' },
  'Formation':      { dot: '#7c3aed', badge: 'rgba(124,58,237,0.12)', text: '#7c3aed' },
  'Expérience Pro': { dot: '#d97706', badge: 'rgba(217,119,6,0.12)', text: '#d97706' },
  'En cours':       { dot: '#059669', badge: 'rgba(5,150,105,0.12)', text: '#059669' },
  'Diplôme':        { dot: '#db2777', badge: 'rgba(219,39,119,0.12)', text: '#db2777' },
};

const EXPERIENCE = [
  {
    year: 'Juin → Juil 2026',
    role: 'Épreuves finales BTS SIO',
    company: 'Diplôme',
    type: 'Diplôme',
    desc: "Passage des épreuves E5 et E6. Préparation pour l'obtention du BTS SIO Option SISR.",
    current: false,
  },
  {
    year: 'Février 2026',
    role: "Aujourd'hui",
    company: 'Progression',
    type: 'En cours',
    desc: "Préparation active de l'examen final et finalisation du portfolio.",
    current: true,
  },
  {
    year: 'Jan → Fév 2026',
    role: '2ème Stage — Devensys Cybersécurité',
    company: 'Stage 2ème Année',
    type: 'Stage',
    desc: "Déploiement de PC, PKI, et découverte approfondie de la cybersécurité professionnelle et des audits en entreprise.",
    pdfLinks: [
      { label: 'Rapport de stage', url: '/Stages/Rapport_Stage_Jean-Marie_Jung_Devensys.pdf' },
      { label: 'Attestation de stage', url: '/Stages/Attestation_Stage_Devensys.pdf' },
    ],
    current: false,
  },
  {
    year: 'Avr → Juil 2025',
    role: '1er Stage — InfoBoost (Mauguio)',
    company: 'Stage 1ère Année',
    type: 'Stage',
    desc: "Technicien reconditionnement et sensibilisation cybersécurité pour les PME. Accompagnement technique des utilisateurs.",
    pdfLinks: [
      { label: 'Rapport de stage', url: '/Stages/Rapport_Stage_Jean-Marie_Jung_Infoboost.pdf' },
      { label: 'Attestation de stage', url: '/Stages/Attestation_Stage_InfoBoost.pdf' },
    ],
    current: false,
  },
  {
    year: 'Sept. 2024',
    role: 'Rentrée BTS SIO — EPSI',
    company: 'Études Supérieures',
    type: 'Formation',
    desc: "Intégration en BTS SIO option SISR. Major de promotion dès la 1ère session.",
    current: false,
  },
  {
    year: 'Sept. 2023 → Juin 2024',
    role: 'Vendeur CDI — Boulangerie Paul',
    company: 'Emploi',
    type: 'Expérience Pro',
    desc: "Expérience en vente et service client. Gestion du stress, relation clientèle et travail en équipe.",
    current: false,
  },
  {
    year: 'Juin 2021',
    role: 'Obtention du Baccalauréat',
    company: 'Diplôme',
    type: 'Diplôme',
    desc: "Diplôme général obtenu avec succès (spécialité Sciences).",
    current: false,
  },
  {
    year: 'Sept. 2017',
    role: 'Entrée au Lycée Philippe de Girard',
    company: 'Études Secondaires',
    type: 'Formation',
    desc: "Début du Baccalauréat général.",
    current: false,
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="relative scroll-mt-32">
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Parcours & Frise Chronologique</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Retrouvez l&apos;intégralité de mon parcours, depuis mes études secondaires jusqu&apos;à mon implication actuelle en BTS SIO et mes expériences en entreprise.
        </p>
      </div>

      <div className="relative border-l-2 border-outline-variant pl-8 ml-4 md:ml-0 space-y-12">
        {EXPERIENCE.map((exp, i) => {
          const colors = TYPE_COLORS[exp.type] ?? { dot: '#6b7280', badge: 'rgba(107,114,128,0.12)', text: '#6b7280' };
          return (
            <div key={i} className="relative group animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-1.5">
                <div
                  className="w-5 h-5 rounded-full border-[3px] border-surface transition-all duration-300 group-hover:scale-125"
                  style={{ background: exp.current ? colors.dot : 'var(--color-outline)', borderColor: 'var(--color-surface)' }}
                />
                {exp.current && (
                  <div
                    className="absolute top-0 left-0 w-5 h-5 rounded-full animate-ping opacity-30"
                    style={{ background: colors.dot }}
                  />
                )}
              </div>

              {/* Card */}
              <div
                className="relative bg-surface-container-low border border-outline-variant rounded-xl p-6 hover:bg-surface-container transition-all duration-300 overflow-hidden"
                style={{ borderLeftColor: colors.dot, borderLeftWidth: '3px' }}
              >
                {/* Subtle tint */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${colors.badge}, transparent 60%)` }}
                />

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-8 mb-3 relative">
                  <div>
                    <h3 className="text-base font-bold text-on-surface flex flex-wrap items-center gap-2 mb-1">
                      {exp.role}
                      <span
                        className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm"
                        style={{ background: colors.badge, color: colors.text, border: `1px solid ${colors.dot}30` }}
                      >
                        {exp.type}
                      </span>
                    </h3>
                    <p className="text-on-surface-variant text-sm font-medium">{exp.company}</p>
                  </div>
                  <span className="text-xs font-mono whitespace-nowrap pt-0.5" style={{ color: colors.dot, opacity: 0.85 }}>
                    {exp.year}
                  </span>
                </div>

                <p className="text-sm text-on-surface-variant leading-relaxed max-w-3xl relative">{exp.desc}</p>

                {exp.pdfLinks && exp.pdfLinks.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3 relative">
                    {exp.pdfLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all hover:scale-105"
                        style={{
                          color: colors.text,
                          background: colors.badge,
                          border: `1px solid ${colors.dot}30`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

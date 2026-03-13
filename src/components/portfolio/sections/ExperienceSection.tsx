'use client';

import React from 'react';

const EXPERIENCE = [
  {
    year: 'Juin → Juil 2026',
    role: 'Épreuves finales BTS SIO',
    company: 'Diplôme',
    type: 'Formation',
    desc: 'Passage des épreuves E5 et E6. Préparation pour l\'obtention du BTS SIO Option SISR.',
    current: false,
  },
  {
    year: 'Février 2026',
    role: 'Aujourd\'hui',
    company: 'Progression',
    type: 'En cours',
    desc: 'Préparation active de l\'examen final et finalisation du portfolio.',
    current: true, // Le point bleu entre Stage et Epreuve finale
  },
  {
    year: 'Jan → Fév 2026',
    role: '2ème Stage — Devensys Cybersécurité',
    company: 'Stage 2ème Année',
    type: 'Stage',
    desc: 'Déploiement de PC, PKI, et découverte approfondie de la cybersécurité professionnelle et des audits en entreprise.',
    pdfLinks: [
      { label: 'Rapport de stage', url: '/Stages/Rapport_Stage_Jean-Marie_Jung_Devensys.pdf' },
      { label: 'Attestation de stage', url: '/Stages/Attestation_Stage_Devensys.pdf' }
    ],
    current: false,
  },
  {
    year: 'Avr → Juil 2025',
    role: '1er Stage — InfoBoost (Mauguio)',
    company: 'Stage 1ère Année',
    type: 'Stage',
    desc: 'Technicien reconditionnement et sensibilisation cybersécurité pour les PME. Accompagnement technique des utilisateurs.',
    pdfLinks: [
      { label: 'Rapport de stage', url: '/Stages/Rapport_Stage_Jean-Marie_Jung_Infoboost.pdf' },
      { label: 'Attestation de stage', url: '/Stages/Attestation_Stage_InfoBoost.pdf' }
    ],
    current: false,
  },
  {
    year: 'Sept. 2024',
    role: 'Rentrée BTS SIO — EPSI',
    company: 'Études Supérieures',
    type: 'Formation',
    desc: 'Intégration en BTS SIO option SISR. Major de promotion dès la 1ère session.',
    current: false,
  },
  {
    year: 'Sept. 2023 → Juin 2024',
    role: 'Vendeur CDI — Boulangerie Paul',
    company: 'Emploi',
    type: 'Expérience Pro',
    desc: 'Expérience en vente et service client. Gestion du stress, relation clientèle et travail en équipe.',
    current: false,
  },
  {
    year: 'Juin 2021',
    role: 'Obtention du Baccalauréat',
    company: 'Diplôme',
    type: 'Formation',
    desc: 'Diplôme général obtenu avec succès (spécialité Sciences).',
    current: false,
  },
  {
    year: 'Sept. 2017',
    role: 'Entrée au Lycée Philippe de Girard',
    company: 'Études Secondaires',
    type: 'Formation',
    desc: 'Début du Baccalauréat général.',
    current: false,
  }
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="relative scroll-mt-32">
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">Parcours & Frise Chronologique</h2>
        <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
          Retrouvez l&apos;intégralité de mon parcours, depuis mes études secondaires jusqu&apos;à mon implication actuelle en BTS SIO et mes expériences en entreprise.
        </p>
      </div>

      <div className="relative border-l border-white/10 pl-8 ml-4 md:ml-0 space-y-16">
        {EXPERIENCE.map((exp, i) => (
          <div key={i} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[41px] top-1">
              <div className={`w-5 h-5 rounded-full border-[4px] border-[#0A0A0A] transition-colors duration-300 ${exp.current ? 'bg-blue-500' : 'bg-zinc-700 group-hover:bg-zinc-500'}`} />
              {exp.current && (
                <div className="absolute top-0 left-0 w-5 h-5 rounded-full bg-blue-500 animate-ping opacity-20" />
              )}
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-8 mb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-3">
                  {exp.role}
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-400 rounded-sm">
                    {exp.type}
                  </span>
                </h3>
                <p className="text-zinc-400 text-sm font-medium mt-1">{exp.company}</p>
              </div>
              <span className="text-xs font-mono text-zinc-500 whitespace-nowrap pt-1 md:pt-1.5">{exp.year}</span>
            </div>
            
            <p className="text-sm text-zinc-400 leading-relaxed font-light max-w-3xl">
              {exp.desc}
            </p>
            
            {exp.pdfLinks && exp.pdfLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {exp.pdfLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md hover:bg-blue-500/20 hover:border-blue-500/30 transition-colors"
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
        ))}
      </div>
    </section>
  );
}

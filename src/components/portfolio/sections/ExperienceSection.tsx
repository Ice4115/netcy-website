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
    year: 'Jan → Fév 2026',
    role: 'Stage — Devensys Cybersécurité',
    company: 'Stage 2ème Année',
    type: 'Stage',
    desc: 'Déploiement de PC, PKI, et découverte approfondie de la cybersécurité professionnelle et des audits en entreprise.',
    current: false,
  },
  {
    year: 'Avr → Juil 2025',
    role: 'Stage — InfoBoost (Mauguio)',
    company: 'Stage 1ère Année',
    type: 'Stage',
    desc: 'Technicien reconditionnement et sensibilisation cybersécurité pour les PME. Accompagnement technique des utilisateurs.',
    current: true,
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
          </div>
        ))}
      </div>
    </section>
  );
}

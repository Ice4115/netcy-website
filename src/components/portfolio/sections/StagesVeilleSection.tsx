'use client';

import React from 'react';

const DOCUMENTS = [
  {
    type: 'Rapport',
    title: 'Stage de 1ère Année — InfoBoost',
    desc: 'Technicien reconditionnement et accompagnement informatique pour les TPE/PME.',
    date: 'Avril – Juillet 2025',
    link: '/Stages/Rapport_Stage_Jean-Marie_Jung_Infoboost.pdf',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/>
      </svg>
    )
  },
  {
    type: 'Veille',
    title: 'Machine Learning & LLM',
    desc: 'Dossier de veille sur l\'évolution des algorithmes IA et l\'impact sociétal des grands modèles de langage.',
    date: 'Année 2024-2025',
    link: '/Veille/Dossier_Veille_IA_ML_Jung_Jean_Marie.pdf',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
      </svg>
    )
  },
  {
    type: 'Veille (À venir)',
    title: 'Cybersécurité & Nouveaux Enjeux',
    desc: 'Prochaine veille technologique axée sur les menaces émergentes en infrastructure SISR.',
    date: 'En préparation (2025)',
    link: '#',
    disabled: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    )
  }
];

export default function StagesVeilleSection() {
  return (
    <section id="ressources" className="relative scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Stages & Veille Technologique</h2>
        <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
          Rapports d&apos;expériences professionnelles en entreprise et travaux documentaires liés aux évolutions du secteur IT.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOCUMENTS.map((doc, i) => (
          <a
            key={i}
            href={doc.link}
            target={doc.disabled ? undefined : "_blank"}
            rel="noopener noreferrer"
            className={`group relative bg-[#121216] border border-white/5 rounded-2xl p-6 transition-all duration-300 ${
              doc.disabled 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:bg-[#18181C] hover:border-white/20 hover:-translate-y-1'
            }`}
            onClick={(e) => doc.disabled && e.preventDefault()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10 group-hover:scale-110 transition-transform">
                {doc.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 py-1 px-2 border border-white/10 rounded-full bg-[#0A0A0A]">
                {doc.type}
              </span>
            </div>

            <h3 className="text-lg font-bold text-zinc-100 mb-2">{doc.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1">
              {doc.desc}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-xs font-mono text-zinc-500">{doc.date}</span>
              {!doc.disabled && (
                <span className="text-xs font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Lire le PDF <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

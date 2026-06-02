'use client';

import React from 'react';

type Stage = {
  title: string;
  desc: string;
  date: string;
  attestation: string;
  rapport: string | null;
  gradient: string;
  color: string;
  icon: React.ReactNode;
};

const STAGES: Stage[] = [
  {
    title: '1ère Année — InfoBoost',
    desc: "Technicien reconditionnement et accompagnement informatique pour les TPE/PME. Reconditionnement de PC professionnels, diagnostic et réparation du rack R12, développement d'un simulateur d'aide à la vente en VBA, relecture d'un module de formation cybersécurité.",
    date: 'Avril – Juillet 2025',
    attestation: '/Stages/Attestation_Stage_InfoBoost.pdf',
    rapport: '/Stages/Rapport_Stage_Jean-Marie_Jung_Infoboost.pdf',
    gradient: 'linear-gradient(135deg, #0052FF, #4f46e5)',
    color: '#0052FF',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
        <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    title: '2ème Année — Devensys Cybersecurity',
    desc: "Immersion au sein du service IT interne et projet support d'une entreprise spécialisée en cybersécurité. Journées découverte BU (Red / Blue / Purple Team), installation et configuration de postes utilisateurs, participation au déploiement d'un serveur PKI pour la gestion des certificats.",
    date: 'Janvier – Février 2026',
    attestation: '/Stages/Attestation_Stage_Devensys.pdf',
    rapport: '/Stages/Rapport_Stage_Jean-Marie_Jung_Devensys.pdf',
    gradient: 'linear-gradient(135deg, #0052FF, #1e40af)',
    color: '#0052FF',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

function PdfButton({
  href,
  label,
  color,
  icon,
  primary,
}: {
  href: string | null;
  label: string;
  color: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  const baseClasses =
    'flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border';

  if (!href) {
    return (
      <span
        className={`${baseClasses} opacity-50 cursor-not-allowed`}
        style={{
          background: 'transparent',
          color: 'var(--color-outline)',
          borderColor: 'var(--color-outline-variant)',
        }}
      >
        {icon}
        <span>À venir</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} hover:-translate-y-0.5 hover:shadow-md`}
      style={
        primary
          ? { background: color, color: '#fff', borderColor: color }
          : { background: `${color}10`, color, borderColor: `${color}40` }
      }
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

export default function StagesSection() {
  const FileIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
      <path d="M14 3v5h5" />
    </svg>
  );
  const SealIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );

  return (
    <section id="stages" className="relative scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Stages en Entreprise</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Deux immersions complémentaires : la première en support et reconditionnement TPE/PME, la seconde au cœur d&apos;une équipe spécialisée en cybersécurité. Chaque stage dispose de son attestation et de son rapport détaillé.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STAGES.map((doc, i) => (
          <div
            key={doc.title}
            className="group relative bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:bg-surface-container hover:border-outline hover:-translate-y-1 hover:shadow-lg animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-1 w-full flex-shrink-0" style={{ background: doc.gradient }} />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top left, ${doc.color}12, transparent 70%)` }}
            />

            <div className="p-6 flex flex-col flex-1 relative">
              <div className="flex justify-between items-start mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${doc.color}18`, color: doc.color }}
                >
                  {doc.icon}
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full"
                  style={{ background: `${doc.color}14`, color: doc.color, border: `1px solid ${doc.color}30` }}
                >
                  Stage
                </span>
              </div>

              <h3 className="text-base font-bold text-on-surface mb-2">{doc.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-5 flex-1">{doc.desc}</p>

              <span className="text-xs font-mono text-outline mb-4">{doc.date}</span>

              <div className="flex gap-2 border-t border-outline-variant pt-4">
                <PdfButton href={doc.attestation} label="Attestation" color={doc.color} icon={SealIcon} />
                <PdfButton href={doc.rapport} label="Rapport" color={doc.color} icon={FileIcon} primary />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

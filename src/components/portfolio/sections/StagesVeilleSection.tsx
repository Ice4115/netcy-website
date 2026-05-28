'use client';

import React from 'react';

type StageDoc = {
  kind: 'stage';
  title: string;
  desc: string;
  date: string;
  attestation: string | null;
  rapport: string | null;
  gradient: string;
  color: string;
  badge?: string;
  icon: React.ReactNode;
};

type VeilleDoc = {
  kind: 'veille';
  title: string;
  desc: string;
  date: string;
  link: string;
  gradient: string;
  color: string;
  disabled?: boolean;
  badge?: string;
  icon: React.ReactNode;
};

type Doc = StageDoc | VeilleDoc;

const STAGES: StageDoc[] = [
  {
    kind: 'stage',
    title: '1ère Année — InfoBoost',
    desc: "Technicien reconditionnement et accompagnement informatique pour les TPE/PME.",
    date: 'Avril – Juillet 2025',
    attestation: '/Stages/Attestation_Stage_InfoBoost.pdf',
    rapport: '/Stages/Rapport_Stage_Jean-Marie_Jung_Infoboost.pdf',
    gradient: 'linear-gradient(135deg, #0052FF, #4f46e5)',
    color: '#0052FF',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/>
      </svg>
    ),
  },
  {
    kind: 'stage',
    title: '2ème Année — Devensys',
    desc: "Immersion au sein d'une équipe spécialisée en cybersécurité offensive et défensive.",
    date: 'Février – Mars 2026',
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

const VEILLES: VeilleDoc[] = [
  {
    kind: 'veille',
    title: 'Machine Learning & LLM',
    desc: "Évolution des algorithmes IA et impact sociétal des grands modèles de langage.",
    date: 'Année 2024 – 2025',
    link: '/Veille/2024-25_SN1-JUNG-JEANMARIE_DocumentVeilleTechno.pdf',
    gradient: 'linear-gradient(135deg, #059669, #0d9488)',
    color: '#059669',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      </svg>
    ),
  },
  {
    kind: 'veille',
    title: 'Cybersécurité & Nouveaux Enjeux',
    desc: "Veille axée sur les menaces émergentes en infrastructure SISR (ransomware, supply chain, Zero-Trust).",
    date: 'Année 2025 – 2026',
    link: '/Veille/2025-26_SN2-JUNG-JEANMARIE_DocumentVeilleTechno.pdf',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    color: '#059669',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
];

function PdfButton({
  href,
  label,
  color,
  icon,
  disabled,
  primary,
}: {
  href: string | null;
  label: string;
  color: string;
  icon: React.ReactNode;
  disabled?: boolean;
  primary?: boolean;
}) {
  const isDisabled = disabled || !href;
  const baseClasses =
    'flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border';

  if (isDisabled) {
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
        <span>{href ? label : 'À venir'}</span>
      </span>
    );
  }

  return (
    <a
      href={href!}
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

function StageCard({ doc, index }: { doc: StageDoc; index: number }) {
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
    <div
      className="group relative bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:bg-surface-container hover:border-outline hover:-translate-y-1 hover:shadow-lg animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
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
  );
}

function VeilleCard({ doc, index }: { doc: VeilleDoc; index: number }) {
  return (
    <a
      href={doc.link}
      target={doc.disabled ? undefined : '_blank'}
      rel="noopener noreferrer"
      onClick={(e) => doc.disabled && e.preventDefault()}
      className={`group relative bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden flex flex-col transition-all duration-300 animate-fade-up ${
        doc.disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:bg-surface-container hover:border-outline hover:-translate-y-1 hover:shadow-lg'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="h-1 w-full flex-shrink-0" style={{ background: doc.gradient }} />
      {!doc.disabled && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top left, ${doc.color}12, transparent 70%)` }}
        />
      )}

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
            {doc.badge ?? 'Veille'}
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
  );
}

function Group({
  title,
  color,
  description,
  iconBg,
  icon,
  children,
}: {
  title: string;
  color: string;
  description: string;
  iconBg: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: iconBg, color }}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-on-surface">{title}</h3>
      </div>
      <p className="text-sm text-on-surface-variant mb-6 max-w-2xl leading-relaxed">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

export default function StagesVeilleSection() {
  return (
    <section id="ressources" className="relative scroll-mt-32 space-y-14">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Stages & Veille Technologique</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Mes expériences professionnelles en entreprise et mes travaux documentaires sur les évolutions du secteur IT.
        </p>
      </div>

      {/* Stages */}
      <Group
        title="Stages en entreprise"
        color="#0052FF"
        iconBg="rgba(0,82,255,0.12)"
        description="Deux immersions complémentaires : la première en support et reconditionnement TPE/PME, la seconde au cœur d'une équipe spécialisée en cybersécurité. Chaque stage dispose de son attestation et de son rapport."
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
      >
        {STAGES.map((doc, i) => (
          <StageCard key={doc.title} doc={doc} index={i} />
        ))}
      </Group>

      {/* Veilles */}
      <Group
        title="Veilles technologiques"
        color="#059669"
        iconBg="rgba(5,150,105,0.12)"
        description="Travaux de recherche et de synthèse réalisés dans le cadre de mon BTS SIO sur des sujets clés de l'IT actuelle."
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        }
      >
        {VEILLES.map((doc, i) => (
          <VeilleCard key={doc.title} doc={doc} index={i} />
        ))}
      </Group>
    </section>
  );
}

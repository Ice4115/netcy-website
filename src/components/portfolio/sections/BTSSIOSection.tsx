'use client';

import React from 'react';

const OPTIONS = [
  {
    sigle: 'SLAM',
    titre: 'Solutions Logicielles et\nApplications Métiers',
    desc: "Orientée développement logiciel : conception d'applications, programmation, bases de données, gestion de projets informatiques et intégration de solutions métiers.",
    color: '#7c3aed',
    colorLight: 'rgba(124,58,237,0.12)',
    colorGlow: 'rgba(124,58,237,0.08)',
    chosen: false,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="12" y1="2" x2="12" y2="22" opacity="0.4" />
      </svg>
    ),
  },
  {
    sigle: 'SISR',
    titre: "Solutions d'Infrastructure,\nSystèmes et Réseaux",
    desc: "Orientée infrastructure : administration des systèmes, gestion des réseaux, cybersécurité, supervision, virtualisation et maintenance du parc informatique.",
    color: '#0052FF',
    colorLight: 'rgba(0,82,255,0.12)',
    colorGlow: 'rgba(0,82,255,0.08)',
    chosen: true,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="16" y="2" width="6" height="6" rx="1" />
        <rect x="9" y="16" width="6" height="6" rx="1" />
        <path d="M5 8v2a2 2 0 002 2h10a2 2 0 002-2V8" />
        <line x1="12" y1="12" x2="12" y2="16" />
      </svg>
    ),
  },
];

export default function BTSSIOSection() {
  return (
    <section id="bts-sio" className="relative scroll-mt-32">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Formation BTS SIO</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Le BTS SIO — <span className="font-medium text-on-surface">Services Informatiques aux Organisations</span> — est un diplôme de niveau Bac+2 centré sur les systèmes d'information. Il se divise en deux options selon l'orientation choisie.
        </p>
      </div>

      {/* Options cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {OPTIONS.map((opt) => (
          <div
            key={opt.sigle}
            className={`group relative rounded-2xl p-5 md:p-8 overflow-hidden transition-all duration-300 border ${opt.chosen
                ? 'bg-surface-container border-[#0052FF]/40 shadow-lg hover:-translate-y-1 hover:shadow-xl'
                : 'bg-surface-container-lowest border-outline-variant/40 opacity-50 hover:opacity-60'
              }`}
            style={opt.chosen ? { borderTopColor: opt.color, borderTopWidth: '2px' } : {}}
          >
            {/* Glow (chosen only) */}
            {opt.chosen && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${opt.colorGlow}, transparent 70%)` }}
              />
            )}

            {/* Chosen badge */}
            {opt.chosen && (
              <span
                className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: opt.colorLight, color: opt.color }}
              >
                ✓ Mon choix
              </span>
            )}

            {/* Icon */}
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-6 transition-transform duration-300 ${opt.chosen ? 'group-hover:scale-110' : ''}`}
              style={{
                background: opt.chosen ? opt.colorLight : 'rgba(128,128,128,0.08)',
                color: opt.chosen ? opt.color : 'var(--color-outline)',
              }}
            >
              {opt.icon}
            </div>

            <p
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: opt.chosen ? opt.color : 'var(--color-outline)' }}
            >
              {opt.sigle}
            </p>
            <h3 className={`text-lg font-bold mb-4 whitespace-pre-line leading-snug ${opt.chosen ? 'text-on-surface' : 'text-outline'}`}>
              {opt.titre}
            </h3>
            <p className="text-sm text-outline leading-relaxed">{opt.desc}</p>

            {/* Bottom accent (chosen only) */}
            {opt.chosen && (
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: `linear-gradient(90deg, ${opt.color}, transparent)` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Pourquoi SISR */}
      <div className="relative bg-surface-container-low border border-outline-variant rounded-2xl p-5 md:p-8 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top left, rgba(0,82,255,0.06), transparent 70%)' }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
          {/* Quote icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[rgba(0,82,255,0.12)] flex items-center justify-center text-[#0052FF]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.3 6C7.8 6 5 8.8 5 12.3c0 2.1 1 3.9 2.6 5-.3.9-.8 1.8-1.6 2.7 1.8-.3 3.3-1 4.4-2.1.6.1 1.2.2 1.9.2 3.5 0 6.3-2.8 6.3-6.3S14.8 6 11.3 6zM6.7 6C3.2 6 .4 8.8.4 12.3c0 2.1 1 3.9 2.6 5-.3.9-.8 1.8-1.6 2.7 1.8-.3 3.3-1 4.4-2.1.6.1 1.2.2 1.9.2.5 0 1-.1 1.5-.2C8.5 16.8 8 15.1 8 13.3c0-2.6 1.2-5 3.2-6.5C10.4 6.3 9.6 6 8.7 6H6.7z" opacity="0.4" />
              <path d="M11.3 7.5c-2.6 0-4.8 2.2-4.8 4.8s2.2 4.8 4.8 4.8 4.8-2.2 4.8-4.8S13.9 7.5 11.3 7.5z" opacity="0" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0052FF] mb-3">Pourquoi j'ai choisi SISR</p>
            <p className="text-sm text-on-surface leading-relaxed">
              Même si je développe et conçois des sites web, j'ai fait le choix de l'option <span className="font-semibold text-[#0052FF]">SISR</span> pour aller plus loin que le code. Comprendre comment sécuriser une application, ce n'est pas suffisant si on ne maîtrise pas l'infrastructure sur laquelle elle tourne. Le SISR m'a apporté une vraie compréhension du fonctionnement des réseaux : VLANs, routage, pare-feux, supervision,  et me permet aujourd'hui d'intervenir aussi bien au niveau applicatif qu'au niveau système et réseau.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

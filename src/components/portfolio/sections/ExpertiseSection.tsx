'use client';

import React from 'react';

const EXPERTISE = [
  {
    title: 'Ingénierie Réseaux',
    sub: 'Architecture & Administration',
    desc: "Déploiement, configuration et optimisation d'infrastructures locales et étendues. (VLANs, Routage avancé, DHCP/DNS).",
    color: '#0052FF',
    colorLight: 'rgba(0,82,255,0.12)',
    colorGlow: 'rgba(0,82,255,0.08)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="16" y="2" width="6" height="6" rx="1" />
        <rect x="9" y="16" width="6" height="6" rx="1" />
        <path d="M5 8v2a2 2 0 002 2h10a2 2 0 002-2V8" />
        <line x1="12" y1="12" x2="12" y2="16" />
      </svg>
    ),
    delay: '0ms',
  },
  {
    title: 'Cybersécurité',
    sub: 'Protection & Monitoring',
    desc: "Audit, sécurisation des accès, mise en place de pare-feux (pfSense), VPNs (OpenVPN) et supervision continue (Nagios).",
    color: '#059669',
    colorLight: 'rgba(5,150,105,0.12)',
    colorGlow: 'rgba(5,150,105,0.08)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    delay: '80ms',
  },
  {
    title: 'Développement Web',
    sub: 'Full-Stack & Intégration',
    desc: "Conception d'applications web performantes et d'interfaces utilisateurs modernes avec Next.js, React et PHP/MySQL.",
    color: '#7c3aed',
    colorLight: 'rgba(124,58,237,0.12)',
    colorGlow: 'rgba(124,58,237,0.08)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="12" y1="2" x2="12" y2="22" opacity="0.4" />
      </svg>
    ),
    delay: '160ms',
  },
  {
    title: 'Gestion de Parc',
    sub: 'Support & Maintenance',
    desc: "Maintenance préventive, diagnostic matériel, Masterisation, déploiement automatisé et résolution d'incidents.",
    color: '#d97706',
    colorLight: 'rgba(217,119,6,0.12)',
    colorGlow: 'rgba(217,119,6,0.08)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    delay: '240ms',
  },
];

export default function ExpertiseSection() {
  return (
    <section id="expertise" className="relative scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Domaines d&apos;Expertise</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Mon approche combine une base solide en administration système et réseau avec une forte sensibilité à la sécurité informatique et au développement de solutions sur mesure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {EXPERTISE.map((exp, i) => (
          <div
            key={i}
            className="group relative bg-surface-container-low border border-outline-variant rounded-2xl p-5 md:p-8 overflow-hidden hover:bg-surface-container transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-up"
            style={{
              animationDelay: exp.delay,
              borderTopColor: exp.color,
              borderTopWidth: '2px',
            }}
          >
            {/* Background glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top left, ${exp.colorGlow}, transparent 70%)` }}
            />

            {/* Icon */}
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-6 transition-transform duration-300 group-hover:scale-110"
              style={{ background: exp.colorLight, color: exp.color }}
            >
              {exp.icon}
            </div>

            <h3 className="text-xl font-bold text-on-surface mb-1.5 transition-colors duration-200" style={{ color: undefined }}>
              {exp.title}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: exp.color, opacity: 0.8 }}>
              {exp.sub}
            </p>
            <p className="text-sm text-on-surface-variant leading-relaxed">{exp.desc}</p>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
              style={{ background: `linear-gradient(90deg, ${exp.color}, transparent)` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

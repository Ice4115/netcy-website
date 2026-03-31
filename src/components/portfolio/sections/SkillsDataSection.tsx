'use client';

import React from 'react';

const SKILLS_DATA = [
  {
    group: 'OS & Systèmes',
    items: ['Windows Server (AD, GPO, DNS)', 'Linux (Debian, Ubuntu)', 'Windows 10/11', 'Proxmox VE (Virtualisation)'],
    color: '#d97706',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    group: 'Réseaux',
    items: ['Switching/Routing (Cisco)', 'VLANs, STP', 'pfSense, Fortinet', 'TCP/IP, DHCP, DNS, NAT'],
    color: '#0052FF',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="16" y="2" width="6" height="6" rx="1" />
        <rect x="9" y="16" width="6" height="6" rx="1" />
        <path d="M5 8v2a2 2 0 002 2h10a2 2 0 002-2V8" />
        <line x1="12" y1="12" x2="12" y2="16" />
      </svg>
    ),
  },
  {
    group: 'Cybersécurité',
    items: ["PKI (Autorités de cert.)", 'OpenVPN, IPsec', 'Supervision (Nagios, Zabbix)', 'Sensibilisation Phishing'],
    color: '#059669',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    group: 'Dév. Web',
    items: ['Next.js, React, TypeScript', 'PHP, MySQL (Base de données)', 'HTML, CSS (Tailwind)', 'Git, GitHub, Vercel'],
    color: '#7c3aed',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
];

const COMP_SIO = [
  { code: 'B1.1', label: 'Gérer le patrimoine informatique', desc: 'Recensement, documentation, cycle de vie des équipements.', color: '#0052FF' },
  { code: 'B1.2', label: 'Répondre aux incidents', desc: 'Gestion du SI, diagnostic, résolution, ticketing.', color: '#059669' },
  { code: 'B1.3', label: 'Développer la présence en ligne', desc: 'Création de sites web professionnels sécurisés.', color: '#7c3aed' },
  { code: 'B1.4', label: 'Travailler en mode projet', desc: 'Analyse des besoins, cahier des charges, livrables.', color: '#d97706' },
  { code: 'B1.5', label: 'Mettre à disposition un service', desc: 'Déploiement serveurs, postes clients, accès distants.', color: '#db2777' },
  { code: 'B3.1', label: 'Protéger les données & le réseau', desc: 'Firewall, cloisonnement réseau, sécurisation des accès (VPN).', color: '#059669' },
];

export default function SkillsDataSection() {
  return (
    <section id="competences" className="relative scroll-mt-32 space-y-20">

      {/* Tech Stack */}
      <div>
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-on-surface mb-4">Compétences Techniques</h2>
          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Vue d&apos;ensemble de mon stack technologique et des environnements maîtrisés, répartis par pôles d&apos;ingénierie.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SKILLS_DATA.map((col, i) => (
            <div
              key={i}
              className="group bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden hover:bg-surface-container hover:border-outline transition-all duration-300 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Colored top accent */}
              <div className="h-1" style={{ background: col.color }} />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-outline-variant">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${col.color}18`, color: col.color }}
                  >
                    {col.icon}
                  </div>
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest leading-tight">
                    {col.group}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {col.items.map((item, j) => (
                    <li key={j} className="text-sm text-on-surface-variant flex items-start gap-2.5">
                      <span
                        className="mt-1 flex-shrink-0"
                        style={{ color: col.color }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BTS SIO Référentiel */}
      <div>
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-on-surface mb-4">Référentiel BTS SIO (SISR)</h2>
          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Mise en application concrète des blocs de compétences exigés par la formation lors de mes stages et projets (Neptune, E5).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMP_SIO.map((comp, i) => (
            <div
              key={i}
              className="group flex flex-col p-5 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container transition-all duration-300 hover:-translate-y-0.5 animate-fade-up overflow-hidden"
              style={{ animationDelay: `${i * 60}ms`, borderLeftColor: comp.color, borderLeftWidth: '3px' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider font-mono"
                  style={{
                    background: `${comp.color}18`,
                    color: comp.color,
                    border: `1px solid ${comp.color}30`,
                  }}
                >
                  {comp.code}
                </span>
                <h4 className="text-sm font-bold text-on-surface leading-tight">{comp.label}</h4>
              </div>
              <p className="text-xs text-outline leading-relaxed">{comp.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

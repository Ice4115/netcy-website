'use client';

import React from 'react';

const SKILLS_DATA = [
  { group: 'OS & Systèmes', items: ['Windows Server (AD, GPO, DNS)', 'Linux (Debian, Ubuntu)', 'Windows 10/11', 'Proxmox VE (Virtualisation)'] },
  { group: 'Réseaux', items: ['Switching/Routing (Cisco)', 'VLANs, STP', 'pfSense, Fortinet', 'TCP/IP, DHCP, DNS, NAT'] },
  { group: 'Cybersécurité', items: ['PKI (Autorités de cert.)', 'OpenVPN, IPsec', 'Supervision (Nagios, Zabbix)', 'Sensibilisation Phishing'] },
  { group: 'Dév. Web', items: ['Next.js, React, TypeScript', 'PHP, MySQL (Base de données)', 'HTML, CSS (Tailwind)', 'Git, GitHub, Vercel'] },
];

const COMP_SIO = [
  { code: 'B1.1', label: 'Gérer le patrimoine informatique', desc: 'Recensement, documentation, cycle de vie des équipements.' },
  { code: 'B1.2', label: 'Répondre aux incidents', desc: 'Gestion du SI, diagnostic, résolution, ticketing.' },
  { code: 'B1.3', label: 'Développer la présence en ligne', desc: 'Création de sites web professionnels sécurisés.' },
  { code: 'B1.4', label: 'Travailler en mode projet', desc: 'Analyse des besoins, cahier des charges, livrables.' },
  { code: 'B1.5', label: 'Mettre à disposition un service', desc: 'Déploiement serveurs, postes clients, accès distants.' },
  { code: 'B3.1', label: 'Protéger les données & le réseau', desc: 'Firewall, cloisonnement réseau, sécurisation des accès (VPN).' },
];

export default function SkillsDataSection() {
  return (
    <section id="competences" className="relative scroll-mt-32 space-y-20">
      
      {/* Tech Stack */}
      <div>
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Compétences Techniques</h2>
          <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
            Vue d&apos;ensemble de mon stack technologique et des environnements maîtrisés, répartis par pôles d&apos;ingénierie.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SKILLS_DATA.map((col, i) => (
            <div key={i} className="bg-[#0D0D10] border border-white/10 rounded-xl p-6 hover:bg-[#15151A] hover:border-white/20 transition-all duration-300">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">
                {col.group}
              </h3>
              <ul className="space-y-4">
                {col.items.map((item, j) => (
                  <li key={j} className="text-sm text-zinc-400 flex items-start gap-2">
                    <span className="text-blue-500 mt-1 flex-shrink-0 opacity-70">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* BTS SIO Focus */}
      <div>
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Référentiel BTS SIO (SISR)</h2>
          <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
            Mise en application concrète des blocs de compétences exigés par la formation lors de mes stages et projets (Neptune, E5).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMP_SIO.map((comp, i) => (
            <div key={i} className="flex flex-col p-5 bg-[#0A0A0A] border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold tracking-wider font-mono">
                  {comp.code}
                </span>
                <h4 className="text-sm font-bold text-zinc-200">{comp.label}</h4>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium pl-14">
                {comp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

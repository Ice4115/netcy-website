'use client';

import React from 'react';

const EXPERTISE = [
  {
    title: 'Ingénierie Réseaux',
    sub: 'Architecture & Administration',
    desc: 'Déploiement, configuration et optimisation d\'infrastructures locales et étendues. (VLANs, Routage avacancé, DHCP/DNS).',
    color: 'from-blue-500/20 to-blue-500/0',
    border: 'border-blue-500/30'
  },
  {
    title: 'Cybersécurité',
    sub: 'Protection & Monitoring',
    desc: 'Audit, sécurisation des accès, mise en place de pare-feux (pfSense), VPNs (OpenVPN) et supervision continue (Nagios).',
    color: 'from-emerald-500/20 to-emerald-500/0',
    border: 'border-emerald-500/30'
  },
  {
    title: 'Développement Web',
    sub: 'Full-Stack & Intégration',
    desc: 'Conception d\'applications web performantes et d\'interfaces utilisateurs modernes avec Next.js, React et PHP/MySQL.',
    color: 'from-purple-500/20 to-purple-500/0',
    border: 'border-purple-500/30'
  },
  {
    title: 'Gestion de Parc',
    sub: 'Support & Maintenance',
    desc: 'Maintenance préventive, diagnostic matériel, Masterisation, déploiement automatisé et résolution d\'incidents.',
    color: 'from-zinc-500/20 to-zinc-500/0',
    border: 'border-zinc-500/30'
  }
];

export default function ExpertiseSection() {
  return (
    <section id="expertise" className="relative scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Domaines d&apos;Expertise</h2>
        <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
          Mon approche combine une base solide en administration système et réseau avec une forte sensibilité à la sécurité informatique et au développement de solutions sur mesure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPERTISE.map((exp, i) => (
          <div 
            key={i} 
            className="group relative bg-[#0F0F13] border border-white/10 rounded-xl p-8 overflow-hidden hover:border-white/20 transition-all duration-300"
          >
            {/* Subtle gradient glow block */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className={`w-8 h-px mb-6 sm:mb-8 bg-gradient-to-r ${exp.border} transition-all duration-300 group-hover:w-16`} />
            
            <h3 className="text-xl font-bold text-white mb-1.5">{exp.title}</h3>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">{exp.sub}</p>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              {exp.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

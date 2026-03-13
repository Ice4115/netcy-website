'use client';

import React from 'react';

const CASE_STUDIES = [
  {
    title: 'Hôtel Neptune',
    context: 'Projet Académique BTS SIO',
    problem: 'Développement complet de A à Z d\'une application web pour la gestion d\'un hôtel fictif "Neptune".',
    solution: 'Création d\'un système de réservation en ligne, gestion des chambres, interface d\'administration sécurisée et historique clients.',
    tech: ['HTML/CSS', 'JavaScript', 'PHP', 'MySQL', 'Bootstrap'],
    link: 'projet'
  },
  {
    title: 'Gestion de Parc Informatique',
    context: 'Projet E5 (BTS SIO)',
    problem: 'Nécessité d\'un outil centralisé pour le suivi du matériel, des tickets d\'interventions et la planification de la maintenance préventive.',
    solution: 'Création d\'une application web CRUD avec tableau de bord interactif, système de rôles (Utilisateur/Technicien) et export PDF des rapports.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap', 'HTML/CSS'],
    link: 'e5projet1'
  },
  {
    title: 'Infrastructure Réseau Sécurisée PME',
    context: 'Architecture E5 (BTS SIO)',
    problem: 'Cloisonnement des flux réseaux (Admin, Prod, Invités), accès distant sécurisé et manque de visibilité sur l\'état du réseau.',
    solution: 'Déploiement de VLANs dédiés, firewall pfSense avec filtrage strict, VPN OpenVPN pour le télétravail, DHCP/DNS, et supervision via Nagios.',
    tech: ['pfSense', 'VLANs', 'OpenVPN', 'Nagios', 'Packet Tracer'],
    link: 'e5projet2'
  }
];

export default function CaseStudiesSection({ onOpenModal }: { onOpenModal: (key: string) => void }) {
  return (
    <section id="projets" className="relative scroll-mt-32">
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">Projets & Études de Cas</h2>
        <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
          Sélection de projets illustrant ma capacité à analyser un besoin métier, concevoir une architecture logicielle ou réseau, et la déployer de manière sécurisée.
        </p>
      </div>

      <div className="space-y-6">
        {CASE_STUDIES.map((study, i) => (
          <div 
            key={i} 
            className="group relative bg-[#121216] border border-white/5 rounded-2xl p-6 md:p-10 hover:bg-[#18181C] hover:border-white/10 transition-all duration-300 cursor-pointer"
            onClick={() => onOpenModal(study.link)}
          >
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
              
              <div className="lg:w-1/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                    {study.context}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {study.tech.map((t, j) => (
                    <span key={j} className="text-[10px] font-medium px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-400 group-hover:border-white/20 transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:w-2/3 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Problématique / Défi
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                    {study.problem}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Solutions Apportées
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                    {study.solution}
                  </p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

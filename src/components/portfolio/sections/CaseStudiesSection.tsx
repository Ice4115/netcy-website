'use client';

import React from 'react';

type CaseStudy = {
  num: string;
  title: string;
  context: string;
  problem: string;
  solution: string;
  tech: string[];
  link?: string;
  pdf?: string;
  gradient: string;
  glow: string;
  accent: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    num: '01',
    title: 'Hôtel Neptune',
    context: 'Projet Académique BTS SIO',
    problem: "Développement complet de A à Z d'une application web pour la gestion d'un hôtel fictif \"Neptune\".",
    solution: "Création d'un système de réservation en ligne, gestion des chambres, interface d'administration sécurisée et historique clients.",
    tech: ['HTML/CSS', 'JavaScript', 'PHP', 'MySQL', 'Bootstrap'],
    link: 'projet',
    gradient: 'linear-gradient(135deg, #0052FF, #4f46e5)',
    glow: 'rgba(0,82,255,0.15)',
    accent: '#0052FF',
  },
  {
    num: '02',
    title: 'Infrastructure Web Haute Disponibilité',
    context: 'Situation Professionnelle N°1 · E6 SISR',
    problem: "Site web interne hébergé sur un serveur unique : point de défaillance critique (SPOF), aucune redondance, aucune supervision. Toute panne entraînait une interruption totale du service et les équipes IT n'intervenaient qu'en mode réactif.",
    solution: "Déploiement d'une architecture HA avec deux serveurs Apache redondants, répartition de charge HAProxy, IP virtuelle gérée par Keepalived (VRRP), synchronisation des fichiers via lsyncd + rsync, chiffrement HTTPS (SSL/TLS) et supervision centralisée Zabbix 6.4 avec agents sur tous les nœuds.",
    tech: ['Apache HTTPD', 'HAProxy', 'Keepalived', 'lsyncd', 'Zabbix 6.4', 'Rocky Linux'],
    pdf: '/Situations/Situation1_Jung_JeanMarie_SISR.pdf',
    gradient: 'linear-gradient(135deg, #7c3aed, #db2777)',
    glow: 'rgba(124,58,237,0.15)',
    accent: '#7c3aed',
  },
  {
    num: '03',
    title: 'Refonte SI Local & Sécurisation des Accès',
    context: 'Situation Professionnelle N°2 · E6 SISR',
    problem: "Suite à l'agrandissement de NETCY (annexion d'un bâtiment, ~20 nouveaux collaborateurs), l'AD + DNS + DHCP reposait sur un serveur unique. Une panne récente avait coupé le service 2h. Aucune redondance, DNS interne minimal, DHCP non distribué entre VLANs.",
    solution: "Mise en place d'un Active Directory Windows Server 2022 avec contrôleur de domaine secondaire (réplication multi-maître), DNS interne BIND avec zone dédiée, DHCP en Failover Master/Slave, DHCP Relay sur le pare-feu pour desservir tous les VLANs, et durcissement firewall (iptables + pfSense).",
    tech: ['Active Directory', 'BIND DNS', 'DHCP Failover', 'pfSense', 'Rocky Linux 9', 'Windows Server'],
    pdf: '/Situations/Situation2_Jung_JeanMarie_SISR.pdf',
    gradient: 'linear-gradient(135deg, #059669, #0d9488)',
    glow: 'rgba(5,150,105,0.15)',
    accent: '#059669',
  },
];

export default function CaseStudiesSection({ onOpenModal }: { onOpenModal: (key: string) => void }) {
  const handleClick = (study: CaseStudy) => {
    if (study.pdf) {
      window.open(study.pdf, '_blank', 'noopener,noreferrer');
    } else if (study.link) {
      onOpenModal(study.link);
    }
  };

  return (
    <section id="projets" className="relative scroll-mt-32">
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Projets & Études de Cas</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Sélection de projets illustrant ma capacité à analyser un besoin métier, concevoir une architecture logicielle ou réseau, et la déployer de manière sécurisée.
        </p>
      </div>

      <div className="space-y-6">
        {CASE_STUDIES.map((study, i) => (
          <div
            key={i}
            className="group relative bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden hover:bg-surface-container hover:border-outline transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
            onClick={() => handleClick(study)}
          >
            {/* Gradient top bar */}
            <div className="h-1 w-full" style={{ background: study.gradient }} />

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top left, ${study.glow}, transparent 60%)` }}
            />

            <div className="p-6 md:p-10">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                <div className="lg:w-1/3 flex flex-col justify-between">
                  <div>
                    {/* Number */}
                    <div
                      className="text-6xl font-black leading-none mb-3 select-none"
                      style={{ color: study.accent, opacity: 0.4 }}
                    >
                      {study.num}
                    </div>
                    <h3 className="text-xl font-bold text-on-surface mb-2 leading-tight transition-colors group-hover:text-on-surface">
                      <span
                        className="text-transparent bg-clip-text"
                        style={{ backgroundImage: study.gradient }}
                      >
                        {study.title}
                      </span>
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: study.accent, opacity: 0.7 }}>
                      {study.context}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {study.tech.map((t, j) => (
                      <span
                        key={j}
                        className="text-[10px] font-medium px-2 py-1 rounded border transition-colors"
                        style={{
                          background: `${study.accent}14`,
                          borderColor: `${study.accent}30`,
                          color: study.accent,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:w-2/3 space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" /> Problématique / Défi
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">{study.problem}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /> Solutions Apportées
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">{study.solution}</p>
                  </div>
                </div>

              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant flex justify-end">
                <span
                  className="text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                  style={{ color: study.accent }}
                >
                  {study.pdf ? (
                    <>
                      Lire le rapport
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 3h7v7" />
                        <path d="M10 14L21 3" />
                        <path d="M21 14v7H3V3h7" />
                      </svg>
                    </>
                  ) : (
                    'Voir les détails →'
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

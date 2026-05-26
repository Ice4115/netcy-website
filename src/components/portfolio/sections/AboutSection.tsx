'use client';

import React from 'react';

const TRAITS = [
  {
    label: 'Curieux',
    desc: 'Toujours en veille sur les nouvelles technologies, je teste, je casse, et je remonte ce que j’apprends.',
    color: '#0052FF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    label: 'Rigoureux',
    desc: 'Documentation, schémas réseau, procédures : je travaille proprement pour que ce soit reproductible et maintenable.',
    color: '#059669',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    label: 'Polyvalent',
    desc: 'À l’aise aussi bien sur l’infrastructure (pare-feux, VLANs, supervision) que sur le développement web full-stack.',
    color: '#7c3aed',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
];

export default function AboutSection() {
  return (
    <section id="a-propos" className="relative scroll-mt-32">
      <div className="mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0052FF] mb-3">
          À propos de moi
        </span>
        <h2 className="text-3xl font-bold text-on-surface mb-4">
          Étudiant SISR, passionné par l&apos;infrastructure et la sécurité.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        {/* Texte de présentation */}
        <div className="lg:col-span-3 space-y-5 text-sm md:text-base text-on-surface-variant leading-relaxed">
          <p>
            Je m&apos;appelle <span className="font-semibold text-on-surface">Jung Jean-Marie</span>, j&apos;ai grandi à Montpellier et j&apos;y poursuis aujourd&apos;hui mon <span className="font-semibold text-on-surface">BTS SIO option SISR</span> en tant que <span className="text-[#0052FF] font-semibold">Major de promotion</span>. Mon parcours s&apos;est construit autour d&apos;une seule envie : <span className="text-on-surface font-medium">comprendre comment ça marche, de la prise réseau jusqu&apos;à l&apos;interface utilisateur</span>.
          </p>
          <p>
            J&apos;ai débuté en autodidacte sur le développement web puis, par curiosité, j&apos;ai voulu maîtriser la couche en dessous : serveurs, routeurs, pare-feux, supervision. Aujourd&apos;hui, je suis aussi à l&apos;aise pour <span className="text-on-surface font-medium">déployer une infrastructure pfSense + VLANs</span> que pour <span className="text-on-surface font-medium">livrer une application Next.js en production</span>.
          </p>
          <p>
            Mes deux stages — <span className="text-on-surface font-medium">InfoBoost</span> en support et reconditionnement, puis <span className="text-on-surface font-medium">Devensys</span> en cybersécurité — m&apos;ont confirmé que c&apos;est en entreprise que j&apos;apprends le plus vite. Je suis aujourd&apos;hui <span className="text-on-surface font-semibold">en recherche active d&apos;une alternance</span> pour poursuivre cette progression sur le terrain.
          </p>
        </div>

        {/* Traits / valeurs */}
        <div className="lg:col-span-2 space-y-3">
          {TRAITS.map((t, i) => (
            <div
              key={t.label}
              className="group flex items-start gap-4 p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container hover:-translate-y-0.5 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${t.color}18`, color: t.color }}
              >
                {t.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-0.5">{t.label}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

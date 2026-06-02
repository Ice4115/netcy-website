'use client';

import React from 'react';
import { PROJECTS } from '@/components/portfolio/PortfolioModals';

interface Props {
  onOpenModal: (index: number) => void;
}

export default function CaseStudiesSection({ onOpenModal }: Props) {
  return (
    <section id="projets" className="relative scroll-mt-32">
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Projets Académiques</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Deux projets web développés en formation BTS SIO, illustrant ma capacité à concevoir, sécuriser et livrer une application complète de bout en bout. Cliquez sur une carte pour le détail — le code source est consultable sur GitHub.
        </p>
      </div>

      <div className="space-y-6">
        {PROJECTS.map((project, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onOpenModal(i)}
            className="group relative block w-full text-left bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden hover:bg-surface-container hover:border-outline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-fade-up cursor-pointer"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-1 w-full" style={{ background: project.gradient }} />

            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top left, ${project.glow}, transparent 60%)` }}
            />

            <div className="p-6 md:p-10">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                <div className="lg:w-1/3 flex flex-col justify-between">
                  <div>
                    <div
                      className="text-6xl font-black leading-none mb-3 select-none"
                      style={{ color: project.accent, opacity: 0.4 }}
                    >
                      {project.num}
                    </div>
                    <h3 className="text-xl font-bold text-on-surface mb-2 leading-tight">
                      <span
                        className="text-transparent bg-clip-text"
                        style={{ backgroundImage: project.gradient }}
                      >
                        {project.title}
                      </span>
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: project.accent, opacity: 0.7 }}>
                      {project.context}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t, j) => (
                      <span
                        key={j}
                        className="text-[10px] font-medium px-2 py-1 rounded border"
                        style={{
                          background: `${project.accent}14`,
                          borderColor: `${project.accent}30`,
                          color: project.accent,
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
                    <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">{project.problem}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /> Solutions Apportées
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">{project.solution}</p>
                  </div>
                </div>

              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant flex justify-end">
                <span
                  className="text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                  style={{ color: project.accent }}
                >
                  Voir les détails →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

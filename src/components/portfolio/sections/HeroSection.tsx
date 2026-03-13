'use client';

import React from 'react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* Text Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-subtle-pulse" />
            <span className="text-xs font-semibold tracking-wide text-zinc-300">En recherche active d&apos;alternance (SISR)</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6 animate-fade-up animation-delay-100">
            Ingénierie des <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Infrastructures</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Sécurité</span>.
          </h1>

          <p className="text-lg text-zinc-400 mb-10 max-w-xl leading-relaxed animate-fade-up animation-delay-200">
            Je conçois, déploie et sécurise des réseaux d&apos;entreprise robustes. Étudiant Major de promotion en BTS SIO (SISR), je suis prêt à intégrer vos équipes pour des missions à fort impact.
          </p>

          <div className="flex flex-wrap items-center gap-4 animate-fade-up animation-delay-300">
            <a
              href="#projets"
              className="px-6 py-3 rounded-md bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Découvrir mes projets
            </a>
            <a
              href="#cv"
              className="px-6 py-3 rounded-md border border-white/20 bg-transparent text-white font-semibold text-sm hover:bg-white/5 transition-colors"
            >
              Voir mon CV
            </a>
          </div>

          <div className="mt-16 flex items-center gap-6 animate-fade-up animation-delay-400">
            <div>
              <p className="text-3xl font-bold text-white mb-1">Major</p>
              <p className="text-xs font-medium text-zinc-500 tracking-wide uppercase">de promotion SIO</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div>
              <p className="text-3xl font-bold text-white mb-1">CEO</p>
              <p className="text-xs font-medium text-zinc-500 tracking-wide uppercase">Fondateur NETCY</p>
            </div>
          </div>
        </div>

        {/* Image / Visual */}
        <div className="lg:col-span-5 relative animate-fade-in animation-delay-500 hidden md:block">
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-lg overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
            <Image
              src="/images/profile.png"
              alt="Jung Jean-Marie"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-700"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}

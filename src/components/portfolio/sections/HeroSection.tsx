'use client';

import React from 'react';
import Image from 'next/image';

const STATS = [
  { value: 'Major', label: 'de Promotion SIO', color: '#0052FF' },
  { value: '2', label: 'Stages réalisés', color: '#059669' },
  { value: '3+', label: 'Projets E5 / Académiques', color: '#7c3aed' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">

      {/* Ambient blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-[100px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0052FF, transparent)' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-[90px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />

      <div className="max-w-5xl mx-auto px-4 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

        {/* Text */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
              En recherche active d&apos;alternance (SISR)
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-5 md:mb-6 animate-fade-up animation-delay-100">
            <span className="text-on-surface">Ingénierie des </span>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #0052FF 0%, #4f46e5 100%)' }}
            >
              Infrastructures
            </span>
            <br />
            <span className="text-on-surface">&amp; </span>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}
            >
              Sécurité
            </span>
            <span className="text-on-surface">.</span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant mb-6 md:mb-10 max-w-xl leading-relaxed animate-fade-up animation-delay-200">
            Je conçois, déploie et sécurise des réseaux d&apos;entreprise robustes. Étudiant <strong className="text-on-surface font-semibold">Major de promotion</strong> en BTS SIO (SISR), je suis prêt à intégrer vos équipes pour des missions à fort impact.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 animate-fade-up animation-delay-300">
            <a href="#projets" className="btn-primary px-6 py-3 text-sm">
              Découvrir mes projets
            </a>
            <a href="#cv" className="btn-ghost px-6 py-3 text-sm">
              Voir mon CV
            </a>

            {/* Social icon buttons */}
            <div className="flex items-center gap-2 sm:ml-2 sm:pl-3 sm:border-l sm:border-outline-variant">
              <a
                href="https://linkedin.com/in/jean-marie-jung-40683b218"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mon profil LinkedIn"
                title="LinkedIn"
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                style={{ color: '#0a66c2' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/Ice4115"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mon profil GitHub"
                title="GitHub"
                className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
            </div>
          </div>

          {/* Mobile profile image */}
          <div className="lg:hidden flex justify-center mt-6 animate-fade-up animation-delay-300">
            <div
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-xl"
              style={{ border: '2px solid rgba(0,82,255,0.2)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent z-10" />
              <Image
                src="/images/profile.png"
                alt="Jung Jean-Marie"
                fill
                className="object-cover object-top grayscale"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 md:mt-14 flex flex-wrap items-center gap-5 md:gap-8 animate-fade-up animation-delay-400">
            {STATS.map((stat, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="w-px h-10 bg-outline-variant hidden sm:block" />}
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-black mb-0.5" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium text-outline tracking-wide">{stat.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Profile image + floating chips */}
        <div className="lg:col-span-5 relative hidden md:flex items-center justify-center animate-fade-in animation-delay-500 py-10 px-10">
          {/* Floating skill chips */}
          <div
            className="absolute top-2 left-0 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg animate-float z-20"
            style={{ background: 'linear-gradient(135deg,#0052FF,#4f46e5)', animationDelay: '0s' }}
          >
            pfSense · VLANs
          </div>
          <div
            className="absolute bottom-2 left-2 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg animate-float z-20"
            style={{ background: 'linear-gradient(135deg,#059669,#0d9488)', animationDelay: '1.2s' }}
          >
            Next.js · React
          </div>
          <div
            className="absolute top-4 right-0 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg animate-float z-20"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#db2777)', animationDelay: '0.7s' }}
          >
            PKI · OpenVPN
          </div>
          <div
            className="absolute bottom-10 right-2 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg animate-float z-20"
            style={{ background: 'linear-gradient(135deg,#d97706,#ea580c)', animationDelay: '1.8s' }}
          >
            Nagios · Zabbix
          </div>

          {/* Photo */}
          <div className="relative aspect-[4/5] w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: '2px solid rgba(0,82,255,0.2)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10" />
            <div className="absolute inset-0 rounded-2xl z-20 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 40px rgba(0,82,255,0.08)' }} />
            <Image
              src="/images/profile.png"
              alt="Jung Jean-Marie"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}

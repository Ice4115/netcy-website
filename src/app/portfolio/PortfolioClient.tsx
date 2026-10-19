'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import AnimatedContent from '@/components/AnimatedContent';
import Header from '@/components/portfolio/Header';
import HeroSection from '@/components/portfolio/sections/HeroSection';
import AboutSection from '@/components/portfolio/sections/AboutSection';
import ExpertiseSection from '@/components/portfolio/sections/ExpertiseSection';
import BTSSIOSection from '@/components/portfolio/sections/BTSSIOSection';
// Imports statiques : toutes les sections sont rendues côté serveur et livrées
// dans le même bundle, rien ne se charge à la volée pendant le scroll.
import SkillsDataSection from '@/components/portfolio/sections/SkillsDataSection';
import SkillsTableSection from '@/components/portfolio/sections/SkillsTableSection';
import CaseStudiesSection from '@/components/portfolio/sections/CaseStudiesSection';
import StagesSection from '@/components/portfolio/sections/StagesSection';
import SituationsSection from '@/components/portfolio/sections/SituationsSection';
import VeillesSection from '@/components/portfolio/sections/VeillesSection';
import ExperienceSection from '@/components/portfolio/sections/ExperienceSection';
import CVSection from '@/components/portfolio/sections/CVSection';
import ContactSection from '@/components/portfolio/sections/ContactSection';

const PortfolioModals = dynamic(() => import('@/components/portfolio/PortfolioModals'), { ssr: false });

export default function PortfolioClient() {
  const [projectModal, setProjectModal] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary/20 selection:text-primary">
      <Header />

      <main>
        {/* 1. Présentation personnelle */}
        <HeroSection />

        <div className="max-w-5xl mx-auto px-4 md:px-12 py-12 md:py-24 space-y-20 md:space-y-40">
          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <AboutSection />
          </AnimatedContent>

          {/* Parcours (timeline) — directement après la présentation */}
          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <ExperienceSection />
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <ExpertiseSection />
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <CVSection />
          </AnimatedContent>

          {/* 2. Présentation du BTS et option choisie */}
          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <BTSSIOSection />
          </AnimatedContent>

          {/* 3. Tableau de compétence */}
          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <SkillsDataSection />
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <SkillsTableSection />
          </AnimatedContent>

          {/* 4. Projets académiques 1 et 2 (avec GitHub) */}
          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <CaseStudiesSection onOpenModal={setProjectModal} />
          </AnimatedContent>

          {/* 5. Stages */}
          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <StagesSection />
          </AnimatedContent>

          {/* 6. Situations professionnelles E6 (anciens "E5 projets") */}
          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <SituationsSection />
          </AnimatedContent>

          {/* 7. Veille technologique */}
          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <VeillesSection />
          </AnimatedContent>

          {/* 8. Page contact */}
          <AnimatedContent distance={40} duration={0.6} threshold={0.02}>
            <ContactSection />
          </AnimatedContent>
        </div>
      </main>

      <footer className="py-12 border-t border-outline-variant/40 text-center mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center">
          <div className="w-10 h-10 relative flex items-center justify-center mb-6">
            <Image
              src="/images/logo_tab.svg"
              alt="Netcy Logo"
              fill
              className="object-contain logo-adaptive"
            />
          </div>
          <p className="text-outline text-sm mb-2">
            © {new Date().getFullYear()} Jung Jean-Marie. Consultant Infrastructure & Cybersécurité Junior.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="https://linkedin.com/in/jean-marie-jung-40683b218" className="text-outline hover:text-on-surface transition-colors text-sm">LinkedIn</a>
            <a href="https://github.com/Ice4115" className="text-outline hover:text-on-surface transition-colors text-sm">GitHub</a>
            <a href="https://netcy.fr" className="text-outline hover:text-on-surface transition-colors text-sm">Netcy</a>
          </div>
        </div>
      </footer>

      <PortfolioModals openIndex={projectModal} setOpenIndex={setProjectModal} />
    </div>
  );
}

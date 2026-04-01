'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/portfolio/Header';
import HeroSection from '@/components/portfolio/sections/HeroSection';
import ExpertiseSection from '@/components/portfolio/sections/ExpertiseSection';
import BTSSIOSection from '@/components/portfolio/sections/BTSSIOSection';
import Image from 'next/image';

const AnimatedContent = dynamic(() => import('@/components/AnimatedContent'), { ssr: false });
const ExperienceSection = dynamic(() => import('@/components/portfolio/sections/ExperienceSection'));
const CVSection = dynamic(() => import('@/components/portfolio/sections/CVSection'));
const CaseStudiesSection = dynamic(() => import('@/components/portfolio/sections/CaseStudiesSection'));
const StagesVeilleSection = dynamic(() => import('@/components/portfolio/sections/StagesVeilleSection'));
const SkillsDataSection = dynamic(() => import('@/components/portfolio/sections/SkillsDataSection'));
const SkillsTableSection = dynamic(() => import('@/components/portfolio/sections/SkillsTableSection'));
const ContactSection = dynamic(() => import('@/components/portfolio/sections/ContactSection'));
const PortfolioModals = dynamic(() => import('@/components/portfolio/PortfolioModals'), { ssr: false });

type ModalKey = 'stage' | 'projet' | 'veille1' | 'veille2' | 'e5projet1' | 'e5projet2' | null;

export default function PortfolioClient() {
  const [openModal, setOpenModal] = useState<ModalKey>(null);

  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary/20 selection:text-primary">
      <Header />

      <main>
        <HeroSection />

        <div className="max-w-5xl mx-auto px-4 md:px-12 py-12 md:py-24 space-y-20 md:space-y-40">
          <AnimatedContent distance={40} duration={0.7}>
            <ExpertiseSection />
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.7}>
            <BTSSIOSection />
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.7}>
            <ExperienceSection />
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.7}>
            <CVSection />
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.7}>
            <CaseStudiesSection onOpenModal={(key: string) => setOpenModal(key as ModalKey)} />
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.7}>
            <StagesVeilleSection />
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.7}>
            <SkillsDataSection />
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.7}>
            <SkillsTableSection />
          </AnimatedContent>

          <AnimatedContent distance={40} duration={0.7}>
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
            <a href="https://github.com/jean-marie-jung" className="text-outline hover:text-on-surface transition-colors text-sm">GitHub</a>
            <a href="https://netcy.fr" className="text-outline hover:text-on-surface transition-colors text-sm">Netcy</a>
          </div>
        </div>
      </footer>

      <PortfolioModals openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}

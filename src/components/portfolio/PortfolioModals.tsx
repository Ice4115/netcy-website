'use client';

import React from 'react';
import { X } from 'lucide-react';

type ModalKey = 'stage' | 'projet' | 'veille1' | 'veille2' | null;

interface PortfolioModalsProps {
  openModal: ModalKey;
  setOpenModal: (key: ModalKey) => void;
}

function PremiumModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-2xl animate-fade-up max-h-[90vh] overflow-y-auto">
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-outline hover:text-on-surface transition-colors bg-surface-container rounded-md border border-outline-variant"
        >
          <X size={16} />
        </button>

        <div className="p-5 md:p-10">
          <div className="mb-5 md:mb-8 pr-8">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight mb-2">{title}</h2>
            {subtitle && (
              <p className="text-xs font-mono text-outline uppercase tracking-widest">{subtitle}</p>
            )}
          </div>

          <div className="space-y-5 md:space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 border-b border-outline-variant pb-2">
        {title}
      </h3>
      <div className="text-on-surface-variant text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function TechBadge({ tech }: { tech: string }) {
  return (
    <span className="text-[10px] font-medium px-2 py-1 rounded bg-surface-container border border-outline-variant text-on-surface-variant">
      {tech}
    </span>
  );
}

export default function PortfolioModals({ openModal, setOpenModal }: PortfolioModalsProps) {
  return (
    <>
      <PremiumModal
        isOpen={openModal === 'projet'}
        onClose={() => setOpenModal(null)}
        title="Application Hôtel Neptune"
        subtitle="Projet Académique — Développement de A à Z"
      >
        <Section title="Contexte du projet">
          <p>
            Développement complet d&apos;une application web pour la gestion d&apos;un hôtel fictif nommé &quot;Neptune&quot;. Ce projet a permis de couvrir l&apos;ensemble du cycle de développement logiciel, depuis le recueil des besoins jusqu&apos;à la mise en production.
          </p>
        </Section>
        <Section title="Détail des Fonctionnalités">
          <ul className="space-y-2 list-none p-0">
            <li><span className="text-blue-500 mr-2">›</span>Système de réservation de chambres en temps réel.</li>
            <li><span className="text-blue-500 mr-2">›</span>Gestion des disponibilités et prévention des surréservations (SQL).</li>
            <li><span className="text-blue-500 mr-2">›</span>Interface d&apos;administration sécurisée (back-office).</li>
            <li><span className="text-blue-500 mr-2">›</span>Historique et fiches clients.</li>
            <li><span className="text-blue-500 mr-2">›</span>Modules d&apos;authentification et de sécurité des formulaires.</li>
          </ul>
        </Section>
        <Section title="Technologies Exploités">
          <div className="flex flex-wrap gap-2 mt-2">
            {['PHP', 'MySQL', 'JavaScript', 'HTML/CSS', 'Bootstrap', 'Git'].map((t, i) => (
              <TechBadge key={i} tech={t} />
            ))}
          </div>
        </Section>
      </PremiumModal>
    </>
  );
}

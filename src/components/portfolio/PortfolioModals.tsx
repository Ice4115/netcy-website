'use client';

import React from 'react';
import { X } from 'lucide-react';

type ModalKey = 'stage' | 'projet' | 'veille1' | 'veille2' | 'e5projet1' | 'e5projet2' | null;

interface PortfolioModalsProps {
  openModal: ModalKey;
  setOpenModal: (key: ModalKey) => void;
}

function PremiumModal({ isOpen, onClose, title, subtitle, children }: { isOpen: boolean, onClose: () => void, title: string, subtitle?: string, children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-fade-up max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors bg-[#121216] rounded-md border border-white/5 sticky"
        >
          <X size={16} />
        </button>

        <div className="p-6 md:p-10">
          <div className="mb-8 pr-8">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">{title}</h2>
            {subtitle && <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{subtitle}</p>}
          </div>
          
          <div className="space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">{title}</h3>
      <div className="text-zinc-400 text-sm leading-relaxed">
        {children}
      </div>
    </div>
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
              <span key={i} className="text-[10px] font-medium px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-300">{t}</span>
            ))}
          </div>
        </Section>
      </PremiumModal>

      <PremiumModal 
        isOpen={openModal === 'e5projet1'} 
        onClose={() => setOpenModal(null)}
        title="Gestion de Parc Informatique"
        subtitle="Projet E5 — BTS SIO SISR"
      >
        <Section title="Contexte & Problématique">
          <p>
            Création d&apos;un outil centralisé pour le suivi de l&apos;inventaire matériel et logiciel d&apos;une entreprise, incluant la gestion des interventions techniques (ticketing) et la maintenance préventive.
          </p>
        </Section>
        <Section title="Gouvernance et Service (Compétences)">
          <ul className="space-y-2 list-none p-0">
            <li><span className="text-blue-500 mr-2">›</span><strong>B1.1 - Gérer le patrimoine informatique :</strong> Audit complet des assets réseau.</li>
            <li><span className="text-blue-500 mr-2">›</span><strong>B1.4 - Travailler en mode projet :</strong> Planification, jalons et livrables.</li>
            <li><span className="text-blue-500 mr-2">›</span><strong>B1.5 - Mettre à disposition un service :</strong> Interface CRUD pour techniciens.</li>
          </ul>
        </Section>
        <Section title="Solution Technique">
          <p>
            Application web développée en <strong>PHP / MySQL</strong> avec interface <strong>Bootstrap</strong>. Module de Ticketing (Ouvert, En cours, Clos), alertes automatiques et fonctionnalités d&apos;export PDF pour les rapports d&apos;interventions.
          </p>
        </Section>
      </PremiumModal>

      <PremiumModal 
        isOpen={openModal === 'e5projet2'} 
        onClose={() => setOpenModal(null)}
        title="Infrastructure Réseau Sécurisée"
        subtitle="Projet E5 — BTS SIO SISR"
      >
        <Section title="Topologie & Enjeux">
          <p>
            Conception et déploiement d&apos;une infrastructure réseau sécurisée pour une PME. L&apos;objectif était d&apos;isoler les flux critiques (Admin, Prod, Invités), de sécuriser l&apos;accès à Internet via pare-feu, et de permettre un télétravail sécurisé.
          </p>
        </Section>
        <Section title="Cybersécurité & Infrastructure (Compétences)">
          <ul className="space-y-2 list-none p-0">
            <li><span className="text-emerald-500 mr-2">›</span><strong>B1.1 - Gérer le patrimoine :</strong> Configuration routeurs et switchs virtuels.</li>
            <li><span className="text-emerald-500 mr-2">›</span><strong>B1.2 - Répondre aux incidents :</strong> Documentation et procédures de secours.</li>
            <li><span className="text-emerald-500 mr-2">›</span><strong>B3.1 - Protéger les données :</strong> Règles de firewalling et tunnels VPN chiffrés.</li>
          </ul>
        </Section>
        <Section title="Déploiement Technique">
          <p>
            Utilisation d&apos;un Firewall <strong>pfSense</strong> (Filtrage strict, NAT, DHCP), séparation en <strong>VLANs</strong> dédiés, accès distant par VPN <strong>OpenVPN</strong> avec certificats PKI locale, et supervision continue grâce à <strong>Nagios</strong>. Validation de l&apos;architecture via <strong>Packet Tracer</strong>.
          </p>
        </Section>
      </PremiumModal>
    </>
  );
}

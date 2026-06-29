'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/animate-ui/components/radix/checkbox';
import NavLink from '@/components/NavLink';

export default function ContactSection() {
  const [formData, setFormData] = useState({ nom: '', email: '', entreprise: '', message: '' });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) {
      alert("Veuillez accepter les conditions d'utilisation et la politique de confidentialité.");
      return;
    }
    setStatus('loading');
    try {
      const payload = {
        nom: formData.nom,
        email: formData.email,
        entreprise: formData.entreprise,
        typeProjet: 'Contact depuis Portfolio',
        details: formData.message,
      };
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Erreur');
      setStatus('success');
      setFormData({ nom: '', email: '', entreprise: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputClass =
    'w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none';

  return (
    <section id="contact" className="relative scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Me Contacter</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Que ce soit pour une opportunité d&apos;alternance, un stage spécialisé, ou une collaboration technique, n&apos;hésitez pas à m&apos;écrire.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

        {/* Contact Info */}
        <div className="space-y-4">

          {/* Localisation card */}
          <div className="flex items-start gap-4 p-5 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container transition-colors">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,82,255,0.12)', color: '#0052FF' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#0052FF' }}>Localisation</h4>
              <p className="text-sm text-on-surface font-medium">Montpellier &amp; Agglomération</p>
            </div>
          </div>

          {/* LinkedIn card */}
          <a
            href="https://linkedin.com/in/jean-marie-jung-40683b218"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 p-5 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container hover:border-[#0a66c2]/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: 'rgba(10,102,194,0.12)', color: '#0a66c2' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#0a66c2' }}>LinkedIn</h4>
              <p className="text-sm font-medium text-on-surface group-hover:underline transition-colors">
                Jean-Marie Jung
              </p>
            </div>
            <span className="self-center text-[#0a66c2] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </a>

          {/* GitHub card */}
          <a
            href="https://github.com/Ice4115"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 p-5 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container hover:border-on-surface/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-surface-container border border-outline-variant text-on-surface transition-transform duration-300 group-hover:scale-110">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-1 text-on-surface-variant">GitHub</h4>
              <p className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface group-hover:underline transition-colors">
                jean-marie-jung
              </p>
            </div>
            <span className="self-center text-on-surface opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </a>

          {/* Availability card */}
          <div className="flex items-start gap-4 p-5 rounded-xl border" style={{ background: 'rgba(5,150,105,0.08)', borderColor: 'rgba(5,150,105,0.25)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(5,150,105,0.15)', color: '#059669' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#059669' }}>Disponibilité</h4>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <p className="text-sm font-semibold" style={{ color: '#059669' }}>Prêt pour Alternance 2025-2026</p>
              </div>
            </div>
          </div>

        </div>

        {/* Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="nom" className="text-xs font-medium text-on-surface-variant">
                  Nom / Prénom <span className="text-blue-500">*</span>
                </label>
                <input
                  type="text"
                  id="nom"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="entreprise" className="text-xs font-medium text-on-surface-variant">Entreprise</label>
                <input
                  type="text"
                  id="entreprise"
                  value={formData.entreprise}
                  onChange={(e) => setFormData(prev => ({ ...prev, entreprise: e.target.value }))}
                  className={inputClass}
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-on-surface-variant">
                Email professionnel <span className="text-blue-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={inputClass}
                placeholder="john@acme.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-medium text-on-surface-variant">
                Message <span className="text-blue-500">*</span>
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className={`${inputClass} resize-none`}
                placeholder="Décrivez votre besoin ou proposition..."
              />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="privacy"
                checked={privacyAccepted}
                onCheckedChange={(v) => setPrivacyAccepted(!!v)}
                className="mt-0.5"
              />
              <label htmlFor="privacy" className="text-sm text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors leading-relaxed">
                J&apos;accepte les{' '}
                <NavLink keepText href="/cgu" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-all">
                  conditions d&apos;utilisation
                </NavLink>{' '}
                et la{' '}
                <NavLink keepText href="/politique-confidentialite" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-all">
                  politique de confidentialité
                </NavLink>{' '}
                *
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || !privacyAccepted}
              className="btn-primary w-full sm:w-auto px-8 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>

            {status === 'success' && (
              <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-2 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">✓</span>
                Message envoyé avec succès.
              </p>
            )}
            {status === 'error' && (
              <p className="text-rose-500 text-sm mt-2">✕ Une erreur est survenue, veuillez réessayer.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

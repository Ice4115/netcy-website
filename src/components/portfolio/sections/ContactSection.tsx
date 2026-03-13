'use client';

import React, { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ nom: '', email: '', entreprise: '', message: '' });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) {
      alert('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité.');
      return;
    }
    setStatus('loading');

    try {
      const payload = {
        nom: formData.nom,
        email: formData.email,
        entreprise: formData.entreprise,
        typeProjet: 'Contact depuis Portfolio',
        details: formData.message
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

  return (
    <section id="contact" className="relative scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Me Contacter</h2>
        <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
          Que ce soit pour une opportunité d&apos;alternance, un stage spécialisé, ou une collaboration technique, n&apos;hésitez pas à m&apos;écrire.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

        {/* Contact Info (Minimalist) */}
        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Localisation</h4>
            <p className="text-zinc-300">Montpellier & Agglomération</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Réseaux Pro</h4>
            <div className="flex flex-col gap-2">
              <a href="https://linkedin.com/in/jean-marie-jung-40683b218" className="text-blue-400 hover:text-blue-300 transition-colors w-fit">
                LinkedIn / Jean-Marie Jung
              </a>
              <a href="https://github.com/jean-marie-jung" className="text-zinc-300 hover:text-white transition-colors w-fit">
                GitHub / jean-marie-jung
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Disponibilité</h4>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">Prêt pour Alternance 2025-2026</span>
            </div>
          </div>
        </div>

        {/* Clean Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="nom" className="text-xs font-medium text-zinc-400">Nom / Prénom <span className="text-blue-500">*</span></label>
                <input
                  type="text"
                  id="nom"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  className="w-full bg-[#121216] border border-white/10 rounded-md px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="entreprise" className="text-xs font-medium text-zinc-400">Entreprise</label>
                <input
                  type="text"
                  id="entreprise"
                  value={formData.entreprise}
                  onChange={(e) => setFormData(prev => ({ ...prev, entreprise: e.target.value }))}
                  className="w-full bg-[#121216] border border-white/10 rounded-md px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-zinc-400">Email professionnel <span className="text-blue-500">*</span></label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-[#121216] border border-white/10 rounded-md px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                placeholder="john@acme.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-medium text-zinc-400">Message <span className="text-blue-500">*</span></label>
              <textarea
                id="message"
                required
                rows={4!}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full bg-[#121216] border border-white/10 rounded-md px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none resize-none"
                placeholder="Décrivez votre besoin ou proposition..."
              />
            </div>

            <div className="flex items-start gap-3 mt-4 mb-6 group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  id="privacy"
                  required
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border border-white/20 rounded-md bg-[#121216] checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-all hover:border-white/40 focus:ring-2 focus:ring-blue-500/30"
                />
                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="11.667 3.5 5.25 9.917 2.333 7" />
                </svg>
              </div>
              <label htmlFor="privacy" className="text-sm text-zinc-400 cursor-pointer group-hover:text-zinc-300 transition-colors leading-relaxed">
                J&apos;accepte les{' '}
                <a href="/cgu" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline transition-all">
                  conditions d&apos;utilisation
                </a>
                {' '}et la{' '}
                <a href="/politique-confidentialite" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline transition-all">
                  politique de confidentialité
                </a>
                {' '}*
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto px-8 py-3 bg-white text-black font-semibold text-sm rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>

            {status === 'success' && (
              <p className="text-emerald-400 text-sm mt-4 animate-fade-in">✓ Message envoyé avec succès.</p>
            )}
            {status === 'error' && (
              <p className="text-rose-400 text-sm mt-4 animate-fade-in">✕ Une erreur est survenue, veuillez réessayer.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

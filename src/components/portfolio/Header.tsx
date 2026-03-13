'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_ITEMS = [
  { href: '#expertise', label: 'Expertise' },
  { href: '#experience', label: 'Expérience' },
  { href: '#projets', label: 'Études de cas' },
  { href: '#competences', label: 'Compétences' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-[#0A0A0A]/80 backdrop-blur-md border-white/10 py-3 shadow-lg' 
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-8 h-8 relative flex items-center justify-center transition-transform group-hover:scale-95">
            <Image 
              src="/images/logo_tab.svg" 
              alt="Netcy Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <span className="font-semibold text-sm tracking-wide text-zinc-100 hidden sm:block">
            Jung <span className="text-zinc-500">Jean-Marie</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors tracking-wide"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors hidden sm:block"
          >
            Retour Accueil
          </Link>
          <a
            href="#contact"
            className="relative px-5 py-2 rounded-md bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Me Contacter
          </a>
        </div>
      </div>
    </header>
  );
}

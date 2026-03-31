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
          ? 'bg-surface/80 backdrop-blur-md border-outline-variant/50 py-3 shadow-sm dark:shadow-lg'
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
              className="object-contain logo-adaptive"
            />
          </div>
          <span className="font-semibold text-sm tracking-wide text-on-surface hidden sm:block">
            Jung <span className="text-outline">Jean-Marie</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors tracking-wide"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors hidden sm:block"
          >
            Retour Accueil
          </Link>
          <a
            href="#contact"
            className="btn-primary px-5 py-2 text-xs font-bold"
          >
            Me Contacter
          </a>
        </div>
      </div>
    </header>
  );
}

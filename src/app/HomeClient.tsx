'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLink from '@/components/NavLink';
import dynamic from 'next/dynamic';
import { motion, useScroll, useSpring } from 'motion/react';
import { Menu, X, ArrowRight, Github, Linkedin } from 'lucide-react';
import { LogoNetcy } from '@/components/LogoNetcy';
import { LayersIcon } from '@/components/animate-ui/icons/layers';
import { HeartIcon } from '@/components/animate-ui/icons/heart';
import { CogIcon } from '@/components/animate-ui/icons/cog';
import { SearchIcon } from '@/components/animate-ui/icons/search';
import { TerminalIcon } from '@/components/animate-ui/icons/terminal';
import { Checkbox } from '@/components/animate-ui/components/radix/checkbox';
import { Select } from 'radix-ui';
import ImmersiveHero from '@/components/immersive/ImmersiveHero';
import SectionReveal from '@/components/immersive/SectionReveal';

const ProfileCard = dynamic(() => import('@/components/ProfileCard'), { ssr: false });

/* ──────────────────────────────────────────
   Navbar
────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    let rafId = 0;
    let ticking = false;
    let lastScrolled = window.scrollY > 20;
    setScrolled(lastScrolled);
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        const next = window.scrollY > 20;
        if (next !== lastScrolled) {
          lastScrolled = next;
          setScrolled(next);
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const sectionIds = ['services', 'stack', 'apropos', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const links = [
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Stack', href: '#stack', id: 'stack' },
    { label: 'À Propos', href: '#apropos', id: 'apropos' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-sm' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <LogoNetcy className="h-[44px] w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors relative pb-0.5 ${activeSection === l.id ? 'legal-nav-active' : 'text-on-surface-variant hover:text-[#0052FF]'}`}
            >
              {l.label}
            </a>
          ))}
          <NavLink
            href="/portfolio"
            className="text-sm font-medium text-on-surface-variant hover:text-[#0052FF] transition-colors"
          >
            Portfolio
          </NavLink>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <NavLink href="/connexion" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
            Connexion
          </NavLink>
          <a
            href="#contact"
            className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
          >
            Démarrer un projet
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-on-surface bg-surface-container-low/80 backdrop-blur-sm rounded-lg border border-outline-variant/30 hover:bg-surface-container transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface-container-lowest border-t border-surface-container px-6 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-on-surface-variant py-2"
            >
              {l.label}
            </a>
          ))}
          <NavLink
            href="/portfolio"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-on-surface-variant py-2"
          >
            Portfolio
          </NavLink>
          <NavLink
            href="/connexion"
            onClick={() => setOpen(false)}
            className="block text-sm font-medium text-on-surface-variant py-2"
          >
            Connexion
          </NavLink>
          <a href="#contact" onClick={() => setOpen(false)} className="btn-primary block text-center px-5 py-3 text-sm mt-2">
            Démarrer un projet
          </a>
        </div>
      )}
    </header>
  );
}

/* ──────────────────────────────────────────
   Scroll Progress Bar (coherence indicator)
────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #0052FF 0%, #6F3FFF 50%, #F97316 100%)',
      }}
    />
  );
}

/* ──────────────────────────────────────────
   Features Section
────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: <LayersIcon size={22} animate={true} animation="default-loop" loop={true} loopDelay={800} />,
      title: 'Multi-plateforme',
      desc: 'Des interfaces qui s\'adaptent parfaitement à tous les écrans, du mobile au 4K.',
    },
    {
      icon: <HeartIcon size={22} animate={true} animation="default" loop={true} loopDelay={800} />,
      title: 'Design Émotionnel',
      desc: 'Nous créons des expériences qui marquent l\'esprit de vos utilisateurs.',
    },
    {
      icon: <CogIcon size={22} animate={true} animation="default-loop" loop={true} loopDelay={800} />,
      title: 'Clean Code',
      desc: 'Une architecture technique robuste pour une maintenance simplifiée.',
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left text */}
          <div className="space-y-4 animate-fade-up">
            <span className="chip text-[#0052FF] bg-[#EEF2FF] dark:bg-[#1a1f3d]">INNOVATION &amp; EXCELLENCE</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-on-surface">
              Une agence qui repousse les limites du{' '}
              <span className="text-[#0052FF]">Possible.</span>
            </h2>
            <p className="text-on-surface-variant text-base leading-relaxed max-w-md">
              Spécialisée dans le design web de haute qualité, NETCY combine stratégie
              créative et rigueur technique pour propulser votre présence digitale au
              niveau supérieur.
            </p>
          </div>

          {/* Right – highlight card + feature cards */}
          <div className="space-y-4 animate-fade-up animation-delay-200">
            {/* Big blue card */}
            <div className="bg-[#0052FF] dark:bg-gradient-to-br dark:from-[#d0bcff] dark:to-[#ffb0cd] rounded-2xl p-4 sm:p-6 text-white dark:text-[#1D1B20]">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <SearchIcon size={20} className="text-white dark:text-[#1D1B20]" animate={true} animation="default" loop={true} loopDelay={1000} />
              </div>
              <h3 className="font-display font-bold text-xl mb-1">Performance Native</h3>
              <p className="text-blue-100 dark:text-[#1D1B20]/70 text-sm leading-relaxed">
                Temps de chargement records et optimisation SEO totale.
              </p>
            </div>

            {/* Small cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {features.map((f) => (
                <div key={f.title} className="bg-surface-container-lowest rounded-2xl p-4 space-y-2">
                  <div className="text-[#0052FF]">{f.icon}</div>
                  <h4 className="font-display font-semibold text-sm text-on-surface">{f.title}</h4>
                  <p className="text-outline text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Tech Stack Section — infinite scroll marquee
────────────────────────────────────────── */
function StackSection() {
  const stack = [
    { label: 'HTML5', src: '/images/stack/html5.svg', h: 44 },
    { label: 'CSS3', src: '/images/stack/css3.svg', h: 44 },
    { label: 'JavaScript', src: '/images/stack/js.svg', h: 44 },
    { label: 'TypeScript', src: '/images/stack/typescript.svg', h: 44 },
    { label: 'React', src: '/images/stack/react.svg', h: 44 },
    { label: 'Node.js', src: '/images/stack/node.svg', h: 44 },
    { label: 'Tailwind CSS', src: '/images/stack/tailwind.svg', h: 44 },
    { label: 'PHP', src: '/images/stack/php.svg', h: 44 },
    { label: 'MySQL', src: '/images/stack/mysql.svg', h: 52 },
    { label: 'PostgreSQL', src: '/images/stack/postgresql.svg', h: 44 },
    { label: 'MariaDB', src: '/images/stack/mariadb.svg', h: 52 },
    { label: 'WordPress', src: '/images/stack/wordpress.svg', h: 44 },
    { label: 'Git', src: '/images/stack/git.svg', h: 44 },
    { label: 'GitHub', src: '/images/stack/github.svg', h: 44 },
  ];

  const Card = ({ item }: { item: typeof stack[0] }) => (
    <div className="flex flex-col items-center gap-3 group flex-shrink-0">
      <div className="w-[130px] h-[90px] bg-surface-container-lowest rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-200">
        <img
          src={item.src}
          alt={item.label}
          style={{ height: item.h, width: 'auto' }}
          loading="lazy"
          draggable={false}
        />
      </div>
      <span className="text-sm font-medium text-outline">{item.label}</span>
    </div>
  );

  return (
    <section id="stack" className="py-16 sm:py-24 bg-surface">
      <div className="text-center mb-10 sm:mb-14 max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 animate-fade-up">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-on-surface mb-3">
          Expertise Technique
        </h2>
        <p className="text-on-surface-variant">
          Nous maîtrisons les technologies les plus modernes pour garantir la pérennité de vos projets.
        </p>
      </div>

      {/* Marquee track — fade edges with mask */}
      <div
        className="overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div className="flex gap-5 w-max animate-scroll-left">
          {stack.map((item) => (
            <Card key={`a-${item.label}`} item={item} />
          ))}
          {stack.map((item) => (
            <Card key={`b-${item.label}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   About Section
────────────────────────────────────────── */
function AboutSection() {
  return (
    <section id="apropos" className="py-16 sm:py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ProfileCard */}
          <div className="flex justify-center lg:justify-start animate-slide-in-left">
            <div className="animate-float w-full max-w-[360px] sm:max-w-md lg:max-w-none">
              <ProfileCard
                avatarUrl="/images/profile.webp"
                miniAvatarUrl="/images/profile.webp"
                iconUrl="/images/iconpattern.png"
                grainUrl="/images/grain.webp"
                name="Jean-Marie Jung"
                title="Réseaux & Sécurité · NETCY"
                handle="jeanmariejung"
                status="Disponible"
                contactText="Me contacter"
                innerGradient="linear-gradient(145deg, #0052FF33 0%, #1A1C1E55 100%)"
                behindGlowColor="#0052FF"
                behindGlowSize="80px"
                onContactClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6 animate-fade-up animation-delay-200">
            <span className="chip inline-block">À PROPOS</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-on-surface leading-tight">
              Rencontrez<br />Jean-Marie Jung
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              Étudiant passionné en <strong className="text-on-surface">BTS SIO (SISR)</strong> et développeur web
              autodidacte, Jean-Marie est le moteur créatif de <strong className="text-on-surface">NETCY</strong>. Sa double compétence en
              infrastructure réseau et en développement d'interfaces lui permet de concevoir des
              solutions web robustes et sécurisées dès leur fondation.
            </p>
            <blockquote className="border-l-4 border-[#0052FF] pl-5 text-on-surface-variant italic leading-relaxed">
              "Ma passion pour le développement ne se limite pas à écrire du code. Il s'agit de
              construire des ponts numériques entre une idée et son utilisateur final, avec une
              précision chirurgicale."
            </blockquote>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl px-4 py-2.5 shadow-sm">
                <TerminalIcon size={16} className="text-[#0052FF]" animate={true} animation="default" loop={true} loopDelay={1200} />
                <span className="text-sm font-medium text-on-surface">Next.js / React</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl px-4 py-2.5 shadow-sm">
                <SearchIcon size={16} className="text-[#0052FF]" animate={true} animation="default" loop={true} loopDelay={1200} />
                <span className="text-sm font-medium text-on-surface">SEO & Performance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Contact Section
────────────────────────────────────────── */
function SelectField({ value, onChange, placeholder, options }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Select.Root value={value || undefined} onValueChange={onChange}>
      <Select.Trigger
        className={`w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30 transition-all flex items-center justify-between cursor-pointer ${value ? 'text-on-surface' : 'text-outline-variant'}`}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="shrink-0 ml-2">
          <svg className="w-4 h-4 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high overflow-hidden z-[200]"
          position="popper"
          sideOffset={4}
          style={{ minWidth: 'var(--radix-select-trigger-width)' }}
        >
          <Select.Viewport className="p-1.5">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="px-3 py-2.5 text-sm text-on-surface rounded-lg cursor-pointer outline-none select-none data-[highlighted]:bg-[#EEF2FF] data-[highlighted]:text-[#0052FF] dark:data-[highlighted]:bg-[#1a1f3d] dark:data-[highlighted]:text-[#6B9FFF] transition-colors"
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function ContactSection() {
  const [form, setForm] = useState({
    nom: '', email: '', entreprise: '',
    typeProjet: '', budget: '', delai: '', message: ''
  });
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [cgError, setCgError] = useState(false);

  const inputCls = "w-full px-4 py-3 bg-surface-container-low rounded-xl text-on-surface text-sm placeholder-outline-variant focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30 transition-all";
  const labelCls = "block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptCGU) { setCgError(true); return; }
    if (!form.typeProjet || !form.budget || !form.delai) return;
    setCgError(false);
    setStatus('loading');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, acceptCGU }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ nom: '', email: '', entreprise: '', typeProjet: '', budget: '', delai: '', message: '' });
        setAcceptCGU(false);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 animate-fade-up">
          <span className="chip inline-block mb-4">DÉMARRER UN PROJET</span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-on-surface mb-3">
            Parlons de votre <em className="not-italic text-[#0052FF]">projet.</em>
          </h2>
          <p className="text-on-surface-variant">
            Prêt à construire quelque chose d'exceptionnel ? Décrivez votre vision, nous la réalisons.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-8 lg:p-12 shadow-sm animate-fade-up animation-delay-200">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-[#DCFCE7] dark:bg-[#14532D] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#166534] dark:text-[#86EFAC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl text-on-surface mb-2">Message envoyé !</h3>
              <p className="text-outline">Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: nom + email */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Nom complet</label>
                  <input type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    required placeholder="Jean Dupont" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Adresse email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required placeholder="contact@exemple.com" className={inputCls} />
                </div>
              </div>

              {/* Entreprise */}
              <div>
                <label className={labelCls}>Nom de l'entreprise</label>
                <input type="text" value={form.entreprise} onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
                  placeholder="Votre société (optionnel)" className={inputCls} />
              </div>

              {/* Row 2: type + budget */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Type de projet</label>
                  <SelectField
                    value={form.typeProjet}
                    onChange={(v) => setForm({ ...form, typeProjet: v })}
                    placeholder="Sélectionnez un type..."
                    options={[
                      { value: 'site-web', label: 'Site Web' },
                      { value: 'e-commerce', label: 'E-Commerce' },
                      { value: 'application-web', label: 'Application Web' },
                      { value: 'consultation', label: 'Consultation' },
                      { value: 'autre', label: 'Autre' },
                    ]}
                  />
                </div>
                <div>
                  <label className={labelCls}>Budget souhaité</label>
                  <SelectField
                    value={form.budget}
                    onChange={(v) => setForm({ ...form, budget: v })}
                    placeholder="Votre budget..."
                    options={[
                      { value: 'moins-500', label: 'Moins de 500 €' },
                      { value: '500-1500', label: '500 – 1 500 €' },
                      { value: '1500-5000', label: '1 500 – 5 000 €' },
                      { value: '5000-10000', label: '5 000 – 10 000 €' },
                      { value: 'plus-10000', label: '10 000 € +' },
                    ]}
                  />
                </div>
              </div>

              {/* Délai */}
              <div>
                <label className={labelCls}>Délai souhaité</label>
                <SelectField
                  value={form.delai}
                  onChange={(v) => setForm({ ...form, delai: v })}
                  placeholder="Votre délai..."
                  options={[
                    { value: 'asap', label: 'Dès que possible' },
                    { value: '1-mois', label: 'Dans 1 mois' },
                    { value: '2-3-mois', label: 'Dans 2 – 3 mois' },
                    { value: '6-mois', label: 'Dans 6 mois' },
                    { value: 'non-defini', label: 'Pas encore défini' },
                  ]}
                />
              </div>

              {/* Message */}
              <div>
                <label className={labelCls}>Votre message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required rows={4} placeholder="Décrivez votre projet en quelques lignes..."
                  className={`${inputCls} resize-none`} />
              </div>

              {/* CGU Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="contact-cgu"
                  checked={acceptCGU}
                  onCheckedChange={(v) => { setAcceptCGU(!!v); setCgError(false); }}
                  className="mt-0.5 flex-shrink-0"
                />
                <label htmlFor="contact-cgu" className="text-sm text-on-surface-variant leading-snug cursor-pointer">J'accepte les <NavLink keepText href="/cgu" className="text-[#0052FF] hover:underline">Conditions d'utilisation</NavLink> et la <NavLink keepText href="/politique-confidentialite" className="text-[#0052FF] hover:underline">Politique de Confidentialité</NavLink> de NETCY.</label>
              </div>
              {cgError && (
                <p className="text-[#BF3003] text-xs -mt-2">Vous devez accepter les conditions pour continuer.</p>
              )}

              {status === 'error' && (
                <p className="text-[#BF3003] text-sm text-center">Une erreur est survenue. Veuillez réessayer.</p>
              )}

              <button type="submit" disabled={status === 'loading'}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60">
                {status === 'loading' ? 'Envoi en cours...' : (<>Envoyer la demande <ArrowRight size={16} /></>)}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Footer
────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-surface-container-low py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <LogoNetcy className="h-7 w-auto" />
          <p className="text-xs text-outline text-center">
            © {new Date().getFullYear()} NETCY – Jean-Marie Jung. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <NavLink href="/cgu" className="text-xs text-outline hover:text-on-surface transition-colors">
              Mentions Légales
            </NavLink>
            <NavLink href="/politique-confidentialite" className="text-xs text-outline hover:text-on-surface transition-colors">
              Politique de Confidentialité
            </NavLink>
            <a href="https://linkedin.com/in/jean-marie-jung" target="_blank" rel="noopener noreferrer" className="text-outline hover:text-[#0052FF] transition-colors">
              <Linkedin size={16} strokeWidth={1.5} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-outline hover:text-on-surface transition-colors">
              <Github size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────
   Page root
────────────────────────────────────────── */
export default function HomeClient() {
  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <div className="relative z-10">
        <Navbar />
        <main>
          <ImmersiveHero />
          <SectionReveal intensity="default">
            <FeaturesSection />
          </SectionReveal>
          <SectionReveal intensity="soft">
            <StackSection />
          </SectionReveal>
          <SectionReveal intensity="default">
            <AboutSection />
          </SectionReveal>
          <SectionReveal intensity="default">
            <ContactSection />
          </SectionReveal>
        </main>
        <Footer />
      </div>
    </div>
  );
}

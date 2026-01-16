'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import TextType from "@/components/TextType";
import GradientText from "@/components/GradientText";
import ResponsiveCardNav from "@/components/ResponsiveCardNav";
import StarBorder from "@/components/StarBorder";
import StructuredData from "@/components/StructuredData";
import GlareHover from "@/components/GlareHover";
import { Checkbox } from '@/components/animate-ui/components/base/checkbox';
import { useGooeyEffect } from "@/hooks/useGooeyEffect";
import { SpeedInsights } from "@vercel/speed-insights/next"

const LiquidEther = dynamic(() => import("@/components/LiquidEther"), {
  ssr: false,
});

const LiquidEtherMobile = dynamic(() => import("@/components/LiquidEtherMobile"), {
  ssr: false,
});

const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), {
  ssr: false,
});

const DecryptedText = dynamic(() => import("@/components/DecryptedText"), {
  ssr: false,
});

const TrueFocus = dynamic(() => import("@/components/TrueFocus"), {
  ssr: false,
});

const ScrollFloat = dynamic(() => import("@/components/ScrollFloat.jsx"), {
  ssr: false,
});

const ProfileCard = dynamic(() => import("@/components/ProfileCard"), {
  ssr: false,
});

const AnimatedContent = dynamic(() => import("@/components/AnimatedContent"), {
  ssr: false,
});

const LogoLoop = dynamic(() => import("@/components/LogoLoop"), {
  ssr: false,
});

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 1024;
  return ua || isSmallScreen;
};

export default function Home() {
  const initGooey = useGooeyEffect();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    const criticalImages = [
      '/images/logo_netcy_t.svg',
    ];

    const preloadImages = () => {
      const promises = criticalImages.map(src => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      return Promise.all(promises);
    };

    const handleLoad = async () => {
      await preloadImages();
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);


  const navItems = [
    {
      label: 'Expertise',
      bgColor: '#1a0f3a',
      textColor: '#8FA5FF',
      links: [
        { label: 'Stack Technologique', href: '#tech', ariaLabel: 'Voir stack technologique' },
        { label: 'Services Détaillés', href: '#services', ariaLabel: 'Voir services détaillés' },
        { label: 'Nous Contacter', href: '#contact', ariaLabel: 'Nous contacter' }
      ]
    },
    {
      label: 'À Propos',
      bgColor: '#1a1540',
      textColor: '#B5C4FF',
      links: [
        { label: 'Qui suis-je', href: '#me', ariaLabel: 'En savoir plus sur moi' },
        { label: 'Mes Compétences', href: '#skill', ariaLabel: 'Voir compétences' },
        { label: 'Netcy c\'est quoi', href: '#netcy', ariaLabel: 'En savoir plus sur Netcy' }
      ]
    },
    {
      label: 'Compte',
      bgColor: '#251550',
      textColor: '#CFDBFF',
      links: [
        { label: 'Connexion', href: '/connexion', ariaLabel: 'Se connecter' },
        { label: 'Inscription', href: '/inscription', ariaLabel: 'S&apos;inscrire' },
        { label: 'Nous Contacter', href: '#contact', ariaLabel: 'Nous contacter' }
      ]
    }
  ];

  return (
    <>
      <StructuredData />
      <LoadingScreen isLoading={isLoading} />
      {/* <DebugOverlay enabled={true} /> */}
      <div className="w-full text-white overflow-x-hidden relative">
        {/* SEO Content - Hidden for search engines only */}
        <div className="sr-only" aria-hidden="true">
          <h1>NETCY - Création de Sites Internet Sécurisé et Cybersécurité Réseau à Montpellier</h1>
          <p>NETCY, expert en développement web et cybersécurité réseau basé à Montpellier. Netcy propose des services de création de sites internet sécurisés, maintenance web, et conseil en sécurité réseau pour les PME. Jung Jean-Marie, étudiant BTS SIO SISR, développeur full stack spécialisé en Next.js, React, TypeScript et sécurité informatique.</p>
          <p>Services NETCY Montpellier : création site vitrine, site e-commerce sécurisé, développement web sur mesure, maintenance et support technique, audit de sécurité réseau, conformité RGPD, hébergement web sécurisé, protection cybersécurité PME.</p>
          <p>Technologies : Next.js, React, TypeScript, Tailwind CSS, Node.js, PHP, MySQL, PostgreSQL, MariaDB, WordPress, Git, GitHub. Stack technique moderne pour sites web performants et sécurisés.</p>
          <p>Netcy Montpellier - Network Cybersecurity - Jung Jean-Marie - BTS SIO SISR - Développeur web Montpellier - Cybersécurité réseau - Création sites internet - Sites web sécurisés - Maintenance web - Support technique - Audit sécurité - RGPD - Infrastructure réseau - Hébergement sécurisé.</p>
          <p>Zone d'intervention : Montpellier, Hérault, Occitanie, France. Services pour PME, TPE, entrepreneurs, professionnels. Développement web professionnel, sites responsives, SEO optimisé, performances web, accessibilité, animations modernes.</p>
        </div>
        <div className="fixed inset-0 w-full h-full z-0">
        {isMobile ? (
          <LiquidEtherMobile 
            colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
            mouseForce={80}
            cursorSize={250}
            resolution={0.35}
          />
        ) : (
          <LiquidEther 
            colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            autoResumeDelay={1000}
            resolution={0.5}
          />
        )}
      </div>
      
      <div className="relative z-10">
      
        <div className="fixed top-0 w-full z-50 flex items-center" style={{ pointerEvents: 'auto' }}>
          <div className="w-full">
            <ResponsiveCardNav
              logo="/images/logo_netcy_t.svg"
              logoAlt="NETCY - Création Sites Internet Sécurisés Montpellier"
              items={navItems}
              baseColor="#110F1B"
              menuColor="#E8EFFF"
              buttonBgColor="#6F3FFF"
              buttonTextColor="#E8EFFF"
              className="card-nav-custom"
            />
          </div>
        </div>

        <section id="hero" className="relative min-h-screen w-full overflow-hidden pt-40" style={{ pointerEvents: 'auto' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
            <TextType 
              text="NETCY"
              className="text-4xl md:text-6xl font-bold mb-25"
              typingSpeed={500}
              cursorCharacter="_"
            />
            <div className="text-2xl md:text-3xl mb-8 max-w-2xl">
              <GradientText>Création de Sites Internet Sécurisé</GradientText>
            </div>
            
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              Développement web moderne et sécurité réseau : je combine deux passions pour créer des solutions digitales 
              solides et performantes. Étudiant en BTS SIO, je mets mon expertise au service de votre entreprise.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <a 
                href="#about" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] hover:from-[#7A4FFF] hover:to-[#8A9FFF] rounded-lg font-semibold transition shadow-lg shadow-violet-500/30"
                style={{ width: '128.8px', height: '35px', padding: '10px 16px', boxSizing: 'content-box' }}
              >
                Netcy c&apos;est quoi ?
              </a>
              <StarBorder
                as="a"
                href="#services"
                color="white"
                speed="3s"
                thickness={3}
              >
                Services & Prestations
              </StarBorder>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 px-4 md:px-8" style={{ pointerEvents: 'auto' }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-12" id="netcy">
              <h2 className="sr-only">À Propos de NETCY - Création Sites Web et Cybersécurité Montpellier</h2>
              <ScrollFloat scrollContainerRef={null} containerClassName="text-center reduced mb-6">
                À Propos de NETCY
              </ScrollFloat>
              <AnimatedContent distance={30} duration={0.6}>
                <p className="text-center text-gray-300 mb-12 text-xl max-w-3xl mx-auto leading-relaxed">
                  NETCY est une jeune entreprise innovante, animée par la passion et dédiée à la qualité, proposant des solutions web et de sécurité adaptées aux PME.
                </p>
              </AnimatedContent>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <AnimatedContent distance={40} duration={0.8}>
                <div className="bg-gradient-to-br from-[#0f0a20] to-[#1a0f3a] border border-[#6F3FFF]/30 rounded-lg p-8 hover:border-[#6F3FFF]/60 transition shadow-lg shadow-violet-500/10">
                  <h3 className="text-2xl md:text-2xl font-bold mb-6">Jung Jean-Marie</h3>
                  <p className="text-[#8FA5FF] text-base md:text-sm mb-6">Étudiant BTS SIO SISR - Montpellier | Développeur Passionné</p>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed text-base md:text-base">
                    Étudiant en 2ème année de BTS SIO option SISR à Montpellier. Bien que ma formation soit axée sur <DecryptedText text="les réseaux et la sécurité" speed={80} animateOn="view" />, 
                    je suis aussi passionné par <DecryptedText text="le développement web moderne" speed={80} animateOn="view" />. Je combine ces deux domaines pour créer des solutions digitales complètes.
                  </p>

                  <p className="text-gray-400 mb-6 leading-relaxed text-base md:text-base">
                    Curieux et autodidacte, j&apos;explore constamment les nouvelles technologies pour élargir mes compétences. 
                    Je crois que le développement et la sécurité vont de pair pour créer des solutions fiables.
                  </p>
                  
                  <h4 className="font-semibold mb-4 text-lg md:text-lg"  id="skill">Compétences Principales :</h4>
                  <div className="bg-[#0f0a20]/50 rounded-lg p-4 mb-4 border border-[#7A8FFF]/20">
                    <TrueFocus 
                      sentence="Web Réseaux Sécurité Données"
                      separator=" "
                      blurAmount={3}
                      borderColor="#6F3FFF"
                      glowColor="rgba(111, 63, 255, 0.6)"
                    />
                  </div>
                  
                  <ul className="space-y-3 text-gray-300 text-base md:text-sm">
                    <li className="flex items-start">
                      <span className="text-[#8FA5FF] mr-3 font-bold">→</span>
                      <span><strong>Développement</strong> : HTML, CSS, Next.js, React, TypeScript, Tailwind CSS, PHP</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#7A8FFF] mr-3 font-bold">→</span>
                      <span><strong>Réseaux & Sécurité</strong> : Configuration réseau, Sécurité infrastructure, RGPD</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#6F3FFF] mr-3 font-bold">→</span>
                      <span><strong>Infrastructure</strong> : Hébergement sécurisé</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#4A2FFF] mr-3 font-bold">→</span>
                      <span><strong>UX/UI</strong> : Design responsive, Animations, Accessibilité</span>
                    </li>
                  </ul>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={40} delay={0.2} duration={0.8}>
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-[#6F3FFF]/20 to-[#7A8FFF]/20 border border-[#6F3FFF]/50 rounded-lg p-6 hover:border-[#6F3FFF] transition shadow-lg shadow-violet-500/10">
                    <h4 className="text-2xl font-bold mb-2 flex items-center gap-3">
                      <Image src="/images/icons/target.svg" alt="Mission NETCY - Création sites web sécurisés Montpellier" width={40} height={40} priority />
                      Mission
                    </h4>
                    <p className="text-gray-300 text-lg">
                      Créer des sites web performants et sécurisés tout en partageant mon expertise 
                      en sécurité réseau avec les PME.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#7A8FFF]/20 to-[#8FA5FF]/20 border border-[#7A8FFF]/50 rounded-lg p-6 hover:border-[#7A8FFF] transition shadow-lg shadow-blue-500/10">
                    <h4 className="text-2xl font-bold mb-2 flex items-center gap-3">
                      <Image src="/images/icons/rocket.svg" alt="Objectif NETCY - Infogérance PME" width={40} height={40} priority />
                      Objectif
                    </h4>
                    <p className="text-gray-300 text-lg">
                      Grandir progressivement et proposer à terme l&apos;infogérence et la gestion 
                      de sites pour les PME à plus grande échelle.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-[#8FA5FF]/20 to-[#4A2FFF]/20 border border-[#4A2FFF]/50 rounded-lg p-6 hover:border-[#4A2FFF] transition shadow-lg shadow-indigo-500/10">
                    <h4 className="text-2xl font-bold mb-2 flex items-center gap-3">
                      <Image src="/images/icons/diamond.svg" alt="Philosophie NETCY - Qualité et Sécurité" width={40} height={40} priority />
                      Philosophie
                    </h4>
                    <p className="text-gray-300 text-lg">
                      Qualité, Transparence, Sécurité et Apprentissage continu pour offrir 
                      des solutions fiables et innovantes.
                    </p>
                  </div>
                </div>
              </AnimatedContent>
            </div>
            
            <div className="mt-20" id="tech">
              <h2 className="text-center text-4xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] bg-clip-text text-transparent">Notre Stack Technologique</h2>
              <LogoLoop
                logos={[
                  { src: '/images/stack/html5.svg', alt: 'HTML5', title: 'HTML5' },
                  { src: '/images/stack/css3.svg', alt: 'CSS3', title: 'CSS3' },
                  { src: '/images/stack/js.svg', alt: 'JavaScript', title: 'JavaScript' },
                  { src: '/images/stack/typescript.svg', alt: 'TypeScript', title: 'TypeScript' },
                  { src: '/images/stack/react.svg', alt: 'React', title: 'React' },
                  { src: '/images/stack/node.svg', alt: 'Node.js', title: 'Node.js' },
                  { src: '/images/stack/tailwind.svg', alt: 'Tailwind CSS', title: 'Tailwind CSS' },
                  { src: '/images/stack/php.svg', alt: 'PHP', title: 'PHP' },
                  { src: '/images/stack/mysql.svg', alt: 'MySQL', title: 'MySQL', height: 95 },
                  { src: '/images/stack/postgresql.svg', alt: 'PostgreSQL', title: 'PostgreSQL' },
                  { src: '/images/stack/mariadb.svg', alt: 'MariaDB', title: 'MariaDB', height: 95 },
                  { src: '/images/stack/wordpress.svg', alt: 'WordPress', title: 'WordPress' },
                  { src: '/images/stack/git.svg', alt: 'Git', title: 'Git' },
                  { src: '/images/stack/github.svg', alt: 'GitHub', title: 'GitHub' }
                ]}
                speed={50}
                direction="left"
                pauseOnHover={true}
                logoHeight={60}
                gap={70}
                fadeOut={false}
                className="my-8"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto" id="me">
            <h2 className="sr-only">Jung Jean-Marie - Développeur Web et Expert Cybersécurité Montpellier</h2>
            <ScrollFloat scrollContainerRef={null} containerClassName="text-center reduced mb-6">
              Qui Suis-Je ?
            </ScrollFloat>
            <p className="text-center text-gray-300 mb-12 text-xl max-w-2xl mx-auto leading-relaxed">
              Passionné par le web et la sécurité, je combine développement et infrastructure 
              pour créer des solutions digitales complètes et fiables.
            </p>
          </div>
          
          <div className="flex justify-center items-center">
            <ProfileCard
              avatarUrl="/images/profile.png"
              iconUrl="/images/iconpattern.png"
              grainUrl="/images/grain.webp"
              enableTilt={true}
              behindGlowEnabled={true}
              behindGlowColor="rgba(167, 139, 250, 0.3)"
              innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
              behindGlowSize="80%"
              miniAvatarUrl="/images/profile.png"
              name="Jean-Marie Jung"
              title="Étudiant BTS SIO SISR"
              
              onContactClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mx-auto"
            />
          </div>
        </section>

        <section id="services" className="py-20 px-4 md:px-8" style={{ pointerEvents: 'auto' }}>
          <div className="max-w-6xl mx-auto">
              <h2 className="sr-only">Services NETCY - Création Sites Web, Maintenance et Cybersécurité Montpellier</h2>
              <ScrollFloat scrollContainerRef={null} containerClassName="text-center reduced mb-6">
                Services & Prestations
              </ScrollFloat>
            

            <p className="text-center text-gray-300 mb-12 text-xl max-w-3xl mx-auto leading-relaxed">
              Je propose des solutions en <DecryptedText text="création web et sécurité réseau " speed={80} animateOn="view" /> 
              pour donner à votre entreprise une présence digitale solide et sécurisée.
            </p>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                { 
                  id: 'creation',
                  title: 'Création de Sites', 
                  desc: 'Site vitrine, portfolio ou e-commerce performant et moderne',
                  items: ['Design responsive', 'Performance web', 'SEO optimisé', 'Sécurisé par défaut'],
                  icon: '/images/icons/laptop.svg',
                  iconAlt: 'Création de sites web Montpellier - NETCY développement Next.js React',
                  iconSize: 75,
                  accentColor: '#6F3FFF'
                  
                },
                { 
                  id: 'maintenance',
                  title: 'Maintenance & Support', 
                  desc: 'Suivi, mises à jour et support pour vos projets web',
                  items: ['Mises à jour', 'Monitoring', 'Sauvegardes', 'Support technique'],
                  icon: '/images/icons/support.svg',
                  iconAlt: 'Maintenance site web Montpellier - Support technique NETCY',
                  iconSize: 50,
                  accentColor: '#7A8FFF'
                },
                { 
                  id: 'securite',
                  title: 'Conseil en Sécurité', 
                  desc: 'Évaluation et recommandations pour sécuriser votre infrastructure',
                  items: ['Audit de sécurité', 'Conformité RGPD', 'Bonnes pratiques', 'Documentation'],
                  icon: '/images/icons/lock.svg',
                  iconAlt: 'Cybersécurité réseau Montpellier - Audit sécurité RGPD NETCY',
                  iconSize: 42,
                  accentColor: '#4A2FFF'
                }
              ].map((service, i) => (
                <AnimatedContent key={i} distance={40} delay={i * 0.15} duration={0.6} className="h-full">
                  <GlareHover 
                    width="100%" 
                    height="100%" 
                    background="linear-gradient(135deg, #0f0a20 0%, #1a0f3a 100%)"
                    borderColor={service.accentColor}
                    glareColor={service.accentColor}
                    glareOpacity={0.3}
                    glareSize={300}
                  >
                    <div id={service.id} className="p-6 h-full flex flex-col">
                      <div className="mb-4 flex items-center" style={{ minHeight: '75px' }}>
                        <Image src={service.icon} alt={service.iconAlt || service.title} width={service.iconSize} height={service.iconSize} />
                      </div>
                      <h3 className="text-xl md:text-xl font-bold mb-2 transition" style={{color: service.accentColor}}>{service.title}</h3>
                      <p className="text-gray-300 text-base md:text-sm mb-4 flex-grow">{service.desc}</p>
                      <ul className="space-y-2 text-gray-300 text-base md:text-sm">
                        {service.items.map((item, j) => (
                          <li key={j} className="flex items-center">
                            <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: service.accentColor}}></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlareHover>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 md:px-8 relative z-30" style={{ scrollMarginTop: '100px' }}>
          <div className="max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 30 }}>
              <h2 className="sr-only">Contact NETCY - Devis Gratuit Création Site Web Montpellier</h2>
              <ScrollFloat scrollContainerRef={null} containerClassName="text-center mb-4 reduced">
                Parlons de Votre Projet
              </ScrollFloat>
              
            <div className="mb-12">
              <p className="text-center text-gray-300 mb-6 text-xl">
                Vous avez besoin d&apos;un site web performant ou d&apos;une consultation en sécurité ? 
              </p>
              <p className="text-center text-gray-300 mb-8 text-xl leading-relaxed">
                Parlons de votre projet. Je suis disponible pour <DecryptedText text="discuter de vos besoins" speed={80} animateOn="view" /> 
                et proposer <DecryptedText text="des solutions adaptées" speed={80} animateOn="view" /> à votre budget et vos objectifs.
              </p>
              <div className="text-center mb-6">
                <p className="text-gray-300">
                  <span className="text-[#8FA5FF] font-semibold">Réactivité : </span>
                  Réponse rapide à vos questions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <AnimatedContent distance={40} delay={0} duration={0.6}>
                <div className="bg-gradient-to-br from-[#0f0a20]/50 to-[#1a0f3a]/50 border border-[#6F3FFF]/30 rounded-lg p-6 text-center hover:border-[#6F3FFF] transition shadow-lg shadow-violet-500/10">
                  <div className="flex justify-center mb-4">
                    <Image src="/images/icons/email.svg" alt="Contact email NETCY Montpellier" width={56} height={56} />
                  </div>
                  <h3 className="font-bold mb-2">Email</h3>
                  <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = 'mailto:' + ['contact', 'netcy.fr'].join('@'); }} className="text-[#8FA5FF] hover:text-[#6F3FFF] transition">
                    contact@netcy.fr
                  </a>
                </div>
              </AnimatedContent>

              <AnimatedContent distance={40} delay={0.15} duration={0.6}>
                <div className="bg-gradient-to-br from-[#0f0a20]/50 to-[#1a0f3a]/50 border border-[#7A8FFF]/30 rounded-lg p-6 text-center hover:border-[#7A8FFF] transition shadow-lg shadow-blue-500/10">
                  <div className="flex justify-center mb-4">
                    <Image src="/images/icons/smartphone.svg" alt="Instagram NETCY développeur web Montpellier" width={34} height={34} />
                  </div>
                  <h3 className="font-bold mb-2">Instagram</h3>
                  <a className="text-[#8FA5FF] hover:text-[#7A8FFF] transition">
                    @netcy.dev
                  </a>
                </div>
              </AnimatedContent>
            </div>

            <div className="w-full" style={{ position: 'relative', zIndex: 100, pointerEvents: 'auto' }}>
            <form id="contact" onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                
                const nom = formData.get('nom') as string;
                const email = formData.get('email') as string;
                const entreprise = formData.get('entreprise') as string;
                const typeProjet = formData.get('typeProjet') as string;
                const budget = formData.get('budget') as string;
                const delai = formData.get('delai') as string;
                const details = formData.get('details') as string;
                const privacy = formData.get('privacy') as string;

                if (!privacy) {
                  alert('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité');
                  return;
                }

                const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                if (submitButton) {
                  submitButton.disabled = true;
                  submitButton.textContent = 'Envoi en cours...';
                }

                try {
                  const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      nom,
                      email,
                      entreprise,
                      typeProjet,
                      budget,
                      delai,
                      details,
                    }),
                  });

                  const result = await response.json();

                  if (result.success) {
                    router.push('/contact-success');
                  } else {
                    alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
                    if (submitButton) {
                      submitButton.disabled = false;
                      submitButton.textContent = 'Envoyer le Message';
                    }
                  }
                } catch (error) {
                  console.error('Erreur:', error);
                  alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
                  if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Envoyer le Message';
                  }
                }
              }} className="bg-gradient-to-br from-[#0f0a20]/70 to-[#1a0f3a]/70 border border-[#6F3FFF]/40 rounded-xl p-8 shadow-2xl shadow-violet-500/20 backdrop-blur-md w-full">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#8FA5FF] to-[#6F3FFF] flex items-center gap-3">
                  <Image src="/images/icons/clipboard.svg" alt="Formulaire contact NETCY Montpellier" width={40} height={40} />
                  Formulaire de Contact
                </h2>
                <p className="text-gray-300 text-sm">Remplissez ce formulaire et je vous recontacterai dans les 24h</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Nom Complet *</label>
                  <input 
                    type="text"
                    name="nom"
                    required
                    className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Email *</label>
                  <input 
                    type="email"
                    name="email"
                    required
                    className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Entreprise</label>
                  <input 
                    type="text"
                    name="entreprise"
                    className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition"
                    placeholder="Votre entreprise"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Type de Projet *</label>
                  <div className="select-wrapper">
                    <select
                      name="typeProjet"
                      required
                      className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition appearance-none cursor-pointer"
                    >
                      <option value="">Sélectionnez un type...</option>
                      <option value="web">Site Web</option>
                      <option value="ecommerce">E-Commerce</option>
                      <option value="consultation">Consultation</option>
                      <option value="other">Autre</option>
                    </select>
                    <svg className="select-arrow w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Budget Estimé</label>
                <div className="select-wrapper">
                  <select
                    name="budget"
                    className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition appearance-none cursor-pointer"
                  >
                    <option value="">Sélectionnez un budget...</option>
                    <option value="1000">Moins de 1 000€</option>
                    <option value="5000">1 000€ - 5 000€</option>
                    <option value="10000">5 000€ - 10 000€</option>
                    <option value="25000">10 000€ - 25 000€</option>
                    <option value="50000">Plus de 25 000€</option>
                  </select>
                  <svg className="select-arrow w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
                  </svg>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Délai Souhaité</label>
                <div className="select-wrapper">
                  <select
                    name="delai"
                    className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition appearance-none cursor-pointer"
                  >
                    <option value="">Sélectionnez un délai...</option>
                    <option value="urgent">Urgent (moins d&apos;un mois)</option>
                    <option value="soon">Rapide (1-3 mois)</option>
                    <option value="flexible">Flexible (3+ mois)</option>
                  </select>
                  <svg className="select-arrow w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></polyline>
                  </svg>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Détails du Projet *</label>
                <textarea
                  name="details"
                  rows={5}
                  required
                  className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition resize-none"
                  placeholder="Décrivez votre projet, vos objectifs, et ce que vous attendez de moi..."
                ></textarea>
              </div>

              <div className="flex items-center mb-6 group">
                <Checkbox
                  name="privacy"
                  id="privacy"
                  required
                  checked={privacyAccepted}
                  onCheckedChange={setPrivacyAccepted}
                  className="border-[#6F3FFF]/40 bg-[#0f0a20] focus-visible:ring-[#6F3FFF]/50 [&[data-checked]]:bg-gradient-to-r [&[data-checked]]:from-[#6F3FFF] [&[data-checked]]:to-[#7A8FFF] [&[data-checked]]:border-[#6F3FFF] hover:border-[#6F3FFF]"
                />
                <label htmlFor="privacy" className="ml-3 text-sm text-gray-400 cursor-pointer group-hover:text-gray-300 transition-colors leading-5">
                  J&apos;accepte les{' '}
                  <a href="/cgu" target="_blank" rel="noopener noreferrer" className="text-[#7A8FFF] hover:text-[#8FA5FF] underline">
                    conditions d&apos;utilisation
                  </a>
                  {' '}et la{' '}
                  <a href="/politique-confidentialite" target="_blank" rel="noopener noreferrer" className="text-[#7A8FFF] hover:text-[#8FA5FF] underline">
                    politique de confidentialité
                  </a>
                  {' '}*
                </label>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] hover:from-[#7A4FFF] hover:to-[#8A9FFF] font-semibold py-3 rounded-lg transition shadow-lg shadow-violet-500/30 cursor-pointer"
              >
                Envoyer le Message
              </button>
            </form>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-[#6F3FFF]/30 py-8 px-4 md:px-8 backdrop-blur-sm relative z-40" style={{ pointerEvents: 'auto', backgroundColor: 'rgba(17, 15, 27, 0.5)' }}>
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p className="mb-2">
            <span className="inline sm:inline">© 2026 NETCY - Network Cybersecurity.</span>
            <span className="block sm:inline"> Tous droits réservés.</span>
          </p>
          <p className="text-sm mb-3">
            <span className="inline sm:inline">Création de sites internet & Cybersécurité Réseau</span>
            <span className="hidden sm:inline"> | </span>
            <span className="block sm:inline">Jung Jean-Marie</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 text-sm">
            <div className="flex gap-4">
              <a href="/cgu" className="text-gray-300 hover:text-[#7A8FFF] transition-colors">
                CGU
              </a>
              <span className="text-gray-500">|</span>
              <a href="/cgv" className="text-gray-300 hover:text-[#7A8FFF] transition-colors">
                CGV
              </a>
            </div>
            <span className="hidden sm:inline text-gray-500">|</span>
            <div className="flex gap-4">
              <a href="/politique-confidentialite" className="text-gray-300 hover:text-[#7A8FFF] transition-colors">
                Politique de Confidentialité
              </a>
              <span className="text-gray-500">|</span>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('openCookieSettings'));
                  }
                }}
                className="text-gray-300 hover:text-[#7A8FFF] transition-colors"
              >
                Gérer les cookies
              </button>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}

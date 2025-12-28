'use client';

import Image from 'next/image';
import LiquidEther from "@/components/LiquidEther";
import TextType from "@/components/TextType";
import GradientText from "@/components/GradientText";
import ResponsiveCardNav from "@/components/ResponsiveCardNav";
import SpotlightCard from "@/components/SpotlightCard";
import DecryptedText from "@/components/DecryptedText";
import TrueFocus from "@/components/TrueFocus";
import ScrollFloat from "@/components/ScrollFloat.jsx";
import ProfileCard from "@/components/ProfileCard";
import AnimatedContent from "@/components/AnimatedContent";
import GlareHover from "@/components/GlareHover";
import LogoLoop from "@/components/LogoLoop";
import { useGooeyEffect } from "@/hooks/useGooeyEffect";
import { SpeedInsights } from "@vercel/speed-insights/next"
export default function Home() {
  const initGooey = useGooeyEffect();


  const navItems = [
    {
      label: 'Services',
      bgColor: '#1a0f3a',
      textColor: '#8FA5FF',
      links: [
        { label: 'Création Web', href: '#services', ariaLabel: 'Voir création web' },
        { label: 'Maintenance & Support', href: '#services', ariaLabel: 'Voir maintenance' },
        { label: 'Sécurité Réseau', href: '#services', ariaLabel: 'Voir sécurité réseau' }
      ]
    },
    {
      label: 'À Propos',
      bgColor: '#0f0a20',
      textColor: '#7A8FFF',
      links: [
        { label: 'Qui suis-je', href: '#me', ariaLabel: 'En savoir plus sur moi' },
        { label: 'Mes Compétences', href: '#skill', ariaLabel: 'Voir compétences' },
        { label: 'Netcy c\'est quoi', href: '#netcy', ariaLabel: 'En savoir plus sur Netcy' }
      ]
    },
    {
      label: 'Expertise',
      bgColor: '#140820',
      textColor: '#6F3FFF',
      links: [
        { label: 'Stack Technologique', href: '#tech', ariaLabel: 'Voir stack technologique' },
        { label: 'Services Détaillés', href: '#services', ariaLabel: 'Voir services détaillés' },
        { label: 'Nous Contacter', href: '#contact', ariaLabel: 'Nous contacter' }
      ]
    }
  ];

  return (
    <div className="w-full text-white overflow-x-hidden relative">
      <div className="fixed inset-0 w-full h-full z-0">
        <LiquidEther 
          colors={['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF']}
          mouseForce={20}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          autoResumeDelay={1000}
        />
      </div>
      
      <div className="relative z-10">
      
        <div className="fixed top-0 w-full z-50 flex items-center">
          <div className="w-full">
            <ResponsiveCardNav
              logo="/images/logo_netcy_t.svg"
              logoAlt="NETCY"
              items={navItems}
              baseColor="#000"
              menuColor="#E8EFFF"
              buttonBgColor="#6F3FFF"
              buttonTextColor="#E8EFFF"
              className="card-nav-custom"
            />
          </div>
        </div>

        <section id="hero" className="relative min-h-screen w-full overflow-hidden pt-40">
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
            
            <div className="flex flex-col md:flex-row gap-4">
              <a 
                href="#about" 
                className="px-8 py-3 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] hover:from-[#7A4FFF] hover:to-[#8A9FFF] rounded-lg font-semibold transition shadow-lg shadow-violet-500/30"
              >
                Netcy c'est quoi ?
              </a>
              <a 
                href="#services" 
                className="px-8 py-3 border border-[#8FA5FF] hover:bg-[#8FA5FF]/10 rounded-lg font-semibold transition"
              >
                Services & Prestations
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12" id="netcy">
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
                      <Image src="/images/icons/target.svg" alt="Mission" width={40} height={40} />
                      Mission
                    </h4>
                    <p className="text-gray-300 text-lg">
                      Créer des sites web performants et sécurisés tout en partageant mon expertise 
                      en sécurité réseau avec les PME.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#7A8FFF]/20 to-[#8FA5FF]/20 border border-[#7A8FFF]/50 rounded-lg p-6 hover:border-[#7A8FFF] transition shadow-lg shadow-blue-500/10">
                    <h4 className="text-2xl font-bold mb-2 flex items-center gap-3">
                      <Image src="/images/icons/rocket.svg" alt="Objectif" width={40} height={40} />
                      Objectif
                    </h4>
                    <p className="text-gray-300 text-lg">
                      Grandir progressivement et proposer à terme l&apos;infogérence et la gestion 
                      de sites pour les PME à plus grande échelle.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-[#8FA5FF]/20 to-[#4A2FFF]/20 border border-[#4A2FFF]/50 rounded-lg p-6 hover:border-[#4A2FFF] transition shadow-lg shadow-indigo-500/10">
                    <h4 className="text-2xl font-bold mb-2 flex items-center gap-3">
                      <Image src="/images/icons/diamond.svg" alt="Philosophie" width={40} height={40} />
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
              <h3 className="text-center text-4xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] bg-clip-text text-transparent">Notre Stack Technologique</h3>
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
                  { src: '/images/stack/mysql.svg', alt: 'MySQL', title: 'MySQL', height: 80 },
                  { src: '/images/stack/postgresql.svg', alt: 'PostgreSQL', title: 'PostgreSQL' },
                  { src: '/images/stack/mariadb.svg', alt: 'MariaDB', title: 'MariaDB', height: 80 },
                  { src: '/images/stack/wordpress.svg', alt: 'WordPress', title: 'WordPress' },
                  { src: '/images/stack/git.svg', alt: 'Git', title: 'Git' },
                  { src: '/images/stack/github.svg', alt: 'GitHub', title: 'GitHub' }
                ]}
                speed={50}
                direction="left"
                pauseOnHover={true}
                logoHeight={50}
                gap={60}
                fadeOut={false}
                className="my-8"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto" id="me">
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
              title="Étudiant BTS SIO"
              
              onContactClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mx-auto"
            />
          </div>
        </section>

        <section id="services" className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
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
                  iconSize: 75,
                  accentColor: '#6F3FFF'
                  
                },
                { 
                  id: 'maintenance',
                  title: 'Maintenance & Support', 
                  desc: 'Suivi, mises à jour et support pour vos projets web',
                  items: ['Mises à jour', 'Monitoring', 'Sauvegardes', 'Support technique'],
                  icon: '/images/icons/support.svg',
                  iconSize: 50,
                  accentColor: '#7A8FFF'
                },
                { 
                  id: 'securite',
                  title: 'Conseil en Sécurité', 
                  desc: 'Évaluation et recommandations pour sécuriser votre infrastructure',
                  items: ['Audit de sécurité', 'Conformité RGPD', 'Bonnes pratiques', 'Documentation'],
                  icon: '/images/icons/lock.svg',
                  iconSize: 42,
                  accentColor: '#4A2FFF'
                }
              ].map((service, i) => (
                <AnimatedContent key={i} distance={40} delay={i * 0.15} duration={0.6}>
                  <GlareHover 
                    width="100%" 
                    height="auto" 
                    background="linear-gradient(135deg, #0f0a20 0%, #1a0f3a 100%)"
                    borderColor={service.accentColor}
                    glareColor={service.accentColor}
                    glareOpacity={0.3}
                    glareSize={300}
                  >
                    <div id={service.id} className="bg-gradient-to-br from-[#0f0a20]/50 to-[#1a0f3a]/50 border rounded-lg p-6 h-full flex flex-col" style={{borderColor: service.accentColor + '50'}}>
                      <div className="mb-4">
                        <Image src={service.icon} alt={service.title} width={service.iconSize} height={service.iconSize} />
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

        <section className="py-20 px-4 md:px-8 relative z-10" style={{ scrollMarginTop: '100px' }}>
          <div className="max-w-4xl mx-auto">
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
                    <Image src="/images/icons/email.svg" alt="Email" width={56} height={56} />
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
                    <Image src="/images/icons/smartphone.svg" alt="Instagram" width={34} height={34} />
                  </div>
                  <h3 className="font-bold mb-2">Instagram</h3>
                  <a className="text-[#8FA5FF] hover:text-[#7A8FFF] transition">
                    @netcy.dev
                  </a>
                </div>
              </AnimatedContent>
            </div>

            <AnimatedContent distance={50} duration={0.8} className="w-full">
              <form id="contact" className="bg-gradient-to-br from-[#0f0a20]/70 to-[#1a0f3a]/70 border border-[#6F3FFF]/40 rounded-xl p-8 shadow-2xl shadow-violet-500/20 backdrop-blur-md relative z-20">
              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#8FA5FF] to-[#6F3FFF] flex items-center gap-3">
                  <Image src="/images/icons/clipboard.svg" alt="Formulaire" width={40} height={40} />
                  Formulaire de Contact
                </h3>
                <p className="text-gray-300 text-sm">Remplissez ce formulaire et je vous recontacterai dans les 24h</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Nom Complet *</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Email *</label>
                  <input 
                    type="email" 
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
                    className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition"
                    placeholder="Votre entreprise"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Type de Projet *</label>
                  <select 
                    required
                    className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition"
                  >
                    <option value="">Sélectionnez un type...</option>
                    <option value="web">Site Web</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="consultation">Consultation</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Budget Estimé</label>
                <select 
                  className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition"
                >
                  <option value="">Sélectionnez un budget...</option>
                  <option value="1000">Moins de 1 000€</option>
                  <option value="5000">1 000€ - 5 000€</option>
                  <option value="10000">5 000€ - 10 000€</option>
                  <option value="25000">10 000€ - 25 000€</option>
                  <option value="50000">Plus de 25 000€</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Délai Souhaité</label>
                <select 
                  className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition"
                >
                  <option value="">Sélectionnez un délai...</option>
                  <option value="urgent">Urgent (moins d&apos;un mois)</option>
                  <option value="soon">Rapide (1-3 mois)</option>
                  <option value="flexible">Flexible (3+ mois)</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-[#E8EFFF]">Détails du Projet *</label>
                <textarea 
                  rows={5}
                  required
                  className="w-full bg-[#0f0a20] border border-[#6F3FFF]/30 rounded-lg px-4 py-2 text-white focus:border-[#6F3FFF] outline-none transition resize-none"
                  placeholder="Décrivez votre projet, vos objectifs, et ce que vous attendez de moi..."
                ></textarea>
              </div>

              <div className="flex items-center mb-6">
                <input 
                  type="checkbox"
                  id="privacy"
                  className="w-4 h-4 rounded bg-[#0f0a20] border border-[#6F3FFF]/30 accent-[#6F3FFF]"
                />
                <label htmlFor="privacy" className="ml-2 text-sm text-gray-400">
                  J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité
                </label>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#6F3FFF] to-[#7A8FFF] hover:from-[#7A4FFF] hover:to-[#8A9FFF] font-semibold py-3 rounded-lg transition shadow-lg shadow-violet-500/30"
              >
                Envoyer le Message
              </button>
            </form>
            </AnimatedContent>
          </div>
        </section>
      </div>

      <footer className="border-t border-[#6F3FFF]/20 py-8 px-4 md:px-8 backdrop-blur-sm relative z-40 bg-black/40">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p className="mb-2">
            © 2025 NETCY - Network Cybersecurity. Tous droits réservés.
          </p>
          <p className="text-sm">
            Création de sites internet & Cybersécurité Réseau | Jung Jean-Marie
          </p>
        </div>
      </footer>
    </div>
  );
}

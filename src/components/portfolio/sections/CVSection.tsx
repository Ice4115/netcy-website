'use client';

import React, { useState } from 'react';
import { Download, Eye, EyeOff, MapPin, Mail, Phone, Globe, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function CVSection() {
  const [showCV, setShowCV] = useState(false);

  const handleToggleCV = () => setShowCV((v) => !v);

  const handleDownloadCV = () => {
    const photoUrl = window.location.origin + '/images/profile.png';
    const htmlContent = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>CV - Jung Jean-Marie</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" />
<style>
* { margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important; }
body{font-family:'Segoe UI',Arial,sans-serif;background:white;}
.cv{width:210mm;min-height:297mm;margin:0 auto;display:flex;flex-direction:column;}
.header{display:flex;align-items:center;gap:28px;background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%);padding:28px 36px;}
.photo-ring{width:112px;height:112px;border-radius:50%;border:3px solid #6F3FFF;padding:3px;flex-shrink:0;}
.photo{width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:center 20%;display:block;}
.header-name{font-size:33px;font-weight:800;color:white;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px;}
.header-sub{font-size:12px;color:#a5b4fc;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;}
.header-badge{display:inline-block;background:#6F3FFF;color:white;font-size:11.5px;font-weight:700;padding:5px 14px;border-radius:20px;}
.body{display:flex;flex:1;}
.left-col{width:34%;background:#f1f5f9;padding:26px 20px;}
.right-col{width:66%;background:white;padding:22px 24px;border-left:1px solid #e2e8f0;}
.sec-title{font-size:10.5px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#6F3FFF;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.sec-title::after{content:'';flex:1;height:1px;background:#cbd5e1;}
.section{margin-bottom:24px;}
.contact-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;}
.c-icon{width:16px;flex-shrink:0;text-align:center;color:#6F3FFF;font-size:13px;margin-top:2px;}
.c-text{font-size:12px;color:#334155;line-height:1.5;word-break:break-all;}
.skill-tag{font-size:11.5px;background:#1e293b;color:white;padding:4px 10px;border-radius:4px;font-weight:500;display:inline-block;margin:3px;}
.soft-tag{font-size:11.5px;background:#ede9fe;color:#5b21b6;padding:4px 10px;border-radius:4px;font-weight:600;display:inline-block;margin:3px;}
.tl-item{position:relative;padding-left:22px;margin-bottom:14px;}
.tl-dot{position:absolute;left:0;top:4px;width:11px;height:11px;border-radius:50%;background:#6F3FFF;border:2px solid white;box-shadow:0 0 0 2px #6F3FFF;}
.tl-dot.stage{background:#0ea5e9;box-shadow:0 0 0 2px #0ea5e9;}
.exp-title{font-size:13px;font-weight:700;color:#0f172a;}
.exp-badge{display:inline-block;font-size:9.5px;font-weight:700;background:#0ea5e9;color:white;padding:1px 5px;border-radius:3px;margin-left:5px;vertical-align:middle;}
.exp-co{font-size:11px;color:#6F3FFF;font-weight:600;margin:2px 0;text-transform:uppercase;letter-spacing:0.5px;}
.exp-date{font-size:10.5px;color:#94a3b8;margin-bottom:3px;}
.exp-desc{font-size:11.5px;color:#64748b;line-height:1.5;}
.proj-item{margin-bottom:12px;padding-left:10px;border-left:2px solid #6F3FFF;}
.proj-title{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:2px;}
.proj-sub{font-size:11.5px;font-weight:600;color:#6F3FFF;margin-bottom:2px;}
.proj-desc{font-size:11.5px;color:#64748b;line-height:1.5;}
.profile-text{font-size:12px;color:#475569;line-height:1.8;}
.edu-item{margin-bottom:16px;}
.edu-degree{font-size:13px;font-weight:700;color:#0f172a;}
.edu-school{font-size:11.5px;color:#64748b;margin-top:3px;}
.edu-year{display:inline-block;font-size:10.5px;color:#6F3FFF;background:#ede9fe;padding:2px 9px;border-radius:10px;margin-top:5px;font-weight:600;}
@media print{@page{margin:0;size:A4 portrait;}body{margin:0;}.cv{width:100%;}}
</style></head>
<body><div class="cv">
<div class="header">
  <div class="photo-ring"><img class="photo" src="${photoUrl}" alt="Jung Jean-Marie" /></div>
  <div>
    <div class="header-name">Jung Jean-Marie</div>
    <div class="header-sub">BTS SIO &middot; Option SISR &middot; Fondateur de NETCY &middot; 23 ans</div>
    <div class="header-badge">En recherche d&apos;une alternance &mdash; BTS SIO SISR</div>
  </div>
</div>
<div class="body">
  <div class="left-col">
    <div class="section"><div class="sec-title">Contact</div>
      <div class="contact-row"><span class="c-icon"><i class="fas fa-map-marker-alt"></i></span><span class="c-text">3 Rue des Soldats, 34000 Montpellier</span></div>
      <div class="contact-row"><span class="c-icon"><i class="fas fa-envelope"></i></span><span class="c-text">jeanmarie.jung.pro@gmail.com</span></div>
      <div class="contact-row"><span class="c-icon"><i class="fas fa-phone"></i></span><span class="c-text">07 49 64 44 78</span></div>
      <div class="contact-row"><span class="c-icon"><i class="fas fa-globe"></i></span><span class="c-text">netcy.fr</span></div>
      <div class="contact-row"><span class="c-icon"><i class="fab fa-linkedin"></i></span><span class="c-text">linkedin.com/in/jean-marie-jung-40683b218</span></div>
    </div>
    <div class="section"><div class="sec-title">Formation</div>
      <div class="edu-item"><div class="edu-degree">BTS SIO &ndash; SISR</div><div class="edu-school">EPSI Montpellier</div><div class="edu-year">2024 &ndash; 2026 (en cours)</div></div>
      <div class="edu-item"><div class="edu-degree">Baccalaur&eacute;at G&eacute;n&eacute;ral S</div><div class="edu-school">Lyc&eacute;e Polyvalent Philippe de Girard</div><div class="edu-year">2017 &ndash; 2021</div></div>
    </div>
    <div class="section"><div class="sec-title">Comp&eacute;tences</div>
      <div><span class="skill-tag">PHP</span><span class="skill-tag">SQL</span><span class="skill-tag">HTML/CSS/JS</span><span class="skill-tag">Python</span><span class="skill-tag">C++</span><span class="skill-tag">Next.js/React</span><span class="skill-tag">R&eacute;seaux &amp; Infra</span><span class="skill-tag">Cybers&eacute;curit&eacute;</span><span class="skill-tag">Microsoft Office</span><span class="skill-tag">Sage</span></div>
    </div>
    <div class="section"><div class="sec-title">Soft Skills</div>
      <div><span class="soft-tag">Autonomie</span><span class="soft-tag">Travail en &eacute;quipe</span><span class="soft-tag">Polyvalence</span><span class="soft-tag">Responsable</span><span class="soft-tag">Entrepreneuriat</span></div>
    </div>
    <div class="section"><div class="sec-title">Centres d&apos;int&eacute;r&ecirc;t</div>
      <div><span class="soft-tag" style="background:#e2e8f0;color:#334155;">Arts martiaux</span><span class="soft-tag" style="background:#e2e8f0;color:#334155;">D&eacute;veloppement</span><span class="soft-tag" style="background:#e2e8f0;color:#334155;">Infrastructure</span><span class="soft-tag" style="background:#e2e8f0;color:#334155;">Jeux vid&eacute;o</span></div>
    </div>
  </div>
  <div class="right-col">
    <div class="section"><div class="sec-title">Profil</div>
      <p class="profile-text">Pratiquant le Viet Vo Dao depuis 9 ans, j&apos;ai d&eacute;velopp&eacute; rigueur, discipline et esprit d&apos;&eacute;quipe.<br/><br/>&Eacute;tudiant en deuxi&egrave;me ann&eacute;e &agrave; l&apos;EPSI en BTS SIO option SISR, j&apos;ai choisi cette fili&egrave;re par passion pour la programmation et les technologies. Orient&eacute; vers les r&eacute;seaux et la cybers&eacute;curit&eacute;, je m&apos;int&eacute;resse particuli&egrave;rement au fonctionnement des syst&egrave;mes et &agrave; la circulation s&eacute;curis&eacute;e des donn&eacute;es.<br/><br/>Mon objectif professionnel est de devenir administrateur r&eacute;seau, tout en continuant &agrave; d&eacute;velopper mes comp&eacute;tences en d&eacute;veloppement web, car je ne souhaite pas d&eacute;laisser ma passion pour le code. J&apos;ai d&apos;ailleurs cr&eacute;&eacute; ma micro-entreprise NETCY, sp&eacute;cialis&eacute;e en cr&eacute;ation de sites web s&eacute;curis&eacute;s. Je suis actuellement &agrave; la recherche d&apos;une alternance pour mon BTS SIO SISR, afin de mettre en pratique les comp&eacute;tences acquises au cours de ma formation.</p>
    </div>
    <div class="section"><div class="sec-title">Exp&eacute;riences</div>
      <div class="tl-item"><div class="tl-dot stage"></div><div class="exp-title">Stage &ndash; Technicien Informatique <span class="exp-badge">STAGE</span></div><div class="exp-co">Devensys Cybers&eacute;curit&eacute; &middot; Montpellier</div><div class="exp-date">19 janvier 2026 &ndash; 20 f&eacute;vrier 2026</div><div class="exp-desc">D&eacute;ploiement de PC, journ&eacute;es d&eacute;couverte, mise en place d&apos;un serveur PKI.</div></div>
      <div class="tl-item"><div class="tl-dot stage"></div><div class="exp-title">Stage &ndash; Technicien Informatique <span class="exp-badge">STAGE</span></div><div class="exp-co">Infoboost &middot; Mauguio</div><div class="exp-date">23 avril 2025 &ndash; 4 juillet 2025</div><div class="exp-desc">Reconditionnement de PC, infog&eacute;rance.</div></div>
      <div class="tl-item"><div class="tl-dot"></div><div class="exp-title">Vendeur &ndash; Polyvalent</div><div class="exp-co">Boulangeries Paul &middot; Saint-R&eacute;my-de-Provence &amp; Caract&egrave;res de Pain &middot; Ch&acirc;teaurenard</div><div class="exp-date">Sept. 2023 &ndash; Juin 2024 &middot; CDI / 2022 &ndash; 2023 &middot; 2 CDD</div></div>
    </div>
    <div class="section"><div class="sec-title">Projets R&eacute;alis&eacute;s</div>
      <div class="proj-item"><div class="proj-title">NETCY &ndash; Micro-entreprise</div><div class="proj-sub">Cr&eacute;ation de sites web s&eacute;curis&eacute;s</div><div class="proj-desc">Conception et d&eacute;veloppement de mon site vitrine NETCY (Next.js, React, TypeScript), sp&eacute;cialis&eacute; en cr&eacute;ation de sites web s&eacute;curis&eacute;s et cybers&eacute;curit&eacute; r&eacute;seau pour les professionnels. Gestion compl&egrave;te : d&eacute;veloppement full-stack, s&eacute;curisation, SEO et h&eacute;bergement.</div></div>
      <div class="proj-item"><div class="proj-title">Cr&eacute;ation d&apos;un site web &ndash; H&ocirc;tel Neptune</div><div class="proj-desc">Partie administrateur, s&eacute;curisation du site, gestion des r&eacute;servations et des paiements.</div></div>
      <div class="proj-item"><div class="proj-title">Cr&eacute;ation d&apos;un site web &ndash; E-Commerce</div><div class="proj-sub">Le Seigneur des Goodies</div><div class="proj-desc">Partie administrateur, s&eacute;curisation du site, gestion des produits et des paiements.</div></div>
    </div>
  </div>
</div>
</div>
<script>window.onload = function() { window.print(); }</script>
</body></html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onload = () => {
        setTimeout(() => { win.print(); URL.revokeObjectURL(url); }, 500);
      };
    }
  };

  return (
    <section id="cv" className="relative scroll-mt-32">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Curriculum Vitae
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">
            Mon Parcours <span className="text-outline">en Détail</span>
          </h2>
          <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
            Consultez ou téléchargez mon CV au format PDF pour découvrir l&apos;intégralité de mon parcours, mes compétences et mes expériences professionnelles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <button
            onClick={handleToggleCV}
            className="hidden md:flex group items-center justify-center gap-3 px-6 py-3 bg-surface-container border border-outline-variant hover:border-outline hover:bg-surface-container-high text-on-surface font-medium rounded-lg transition-all duration-300"
          >
            {showCV
              ? <EyeOff size={18} className="text-outline group-hover:text-on-surface transition-colors" />
              : <Eye size={18} className="text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            }
            <span>{showCV ? 'Masquer le CV' : 'Aperçu du CV'}</span>
          </button>

          <button
            onClick={handleDownloadCV}
            className="btn-primary flex items-center justify-center gap-3 px-6 py-3 text-sm"
          >
            <Download size={18} />
            <span>Télécharger mon CV</span>
          </button>
        </div>
      </div>

      <div
        aria-hidden={!showCV}
        className={`hidden md:grid duration-500 ease-out ${
          showCV
            ? 'grid-rows-[1fr] opacity-100 mt-8'
            : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
        }`}
        style={{ transitionProperty: 'grid-template-rows, opacity, margin-top' }}
      >
        <div className="overflow-hidden min-h-0">
          {/* Inline CV preview — always white/light as it's a print document */}
          <div className="bg-white text-black rounded-xl shadow-2xl border border-outline-variant overflow-hidden" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            <div className="max-w-4xl mx-auto flex flex-col min-h-[800px] border border-slate-200">
              {/* Header CV */}
              <div className="flex items-center gap-8 bg-gradient-to-br from-slate-900 to-blue-900 p-8">
                <div className="w-28 h-28 shrink-0 border-4 border-[#6F3FFF] rounded-full p-1 bg-white">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <Image src="/images/profile.png" alt="Jung Jean-Marie" fill className="object-cover object-[center_20%]" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-white tracking-[0.2em] uppercase mb-1">Jung Jean-Marie</h1>
                  <h2 className="text-blue-200 text-sm font-semibold tracking-widest uppercase mb-3">
                    BTS SIO &bull; Option SISR &bull; Fondateur de NETCY &bull; 23 ans
                  </h2>
                  <span className="inline-block bg-[#6F3FFF] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    En recherche d&apos;une alternance — BTS SIO SISR
                  </span>
                </div>
              </div>

              {/* Body CV */}
              <div className="flex flex-1 flex-col md:flex-row bg-white">
                {/* Left Column */}
                <div className="md:w-[35%] bg-slate-50 p-6 md:p-8 border-r border-slate-200">
                  {[
                    {
                      title: 'Contact',
                      content: (
                        <div className="space-y-3 text-sm text-slate-700">
                          {[
                            { icon: <MapPin size={16} className="text-[#6F3FFF] shrink-0 mt-0.5" />, text: '3 Rue des Soldats, 34000 Montpellier' },
                            { icon: <Mail size={16} className="text-[#6F3FFF] shrink-0 mt-0.5" />, text: 'jeanmarie.jung.pro@gmail.com' },
                            { icon: <Phone size={16} className="text-[#6F3FFF] shrink-0 mt-0.5" />, text: '07 49 64 44 78' },
                            { icon: <Globe size={16} className="text-[#6F3FFF] shrink-0 mt-0.5" />, text: 'netcy.fr' },
                            { icon: <Linkedin size={16} className="text-[#6F3FFF] shrink-0 mt-0.5" />, text: 'linkedin.com/in/jean-marie-jung-40683b218' },
                          ].map((c, i) => (
                            <div key={i} className="flex items-start gap-3">{c.icon}<span>{c.text}</span></div>
                          ))}
                        </div>
                      ),
                    },
                    {
                      title: 'Formation',
                      content: (
                        <>
                          {[
                            { deg: 'BTS SIO – SISR', school: 'EPSI Montpellier', year: '2024 – 2026 (en cours)' },
                            { deg: 'Baccalauréat Général S', school: 'Lycée Polyvalent Philippe de Girard', year: '2017 – 2021' },
                          ].map((e, i) => (
                            <div key={i} className="mb-4">
                              <p className="font-bold text-slate-900 text-sm">{e.deg}</p>
                              <p className="text-slate-500 text-xs mt-1">{e.school}</p>
                              <span className="inline-block text-[11px] text-[#6F3FFF] bg-violet-100 px-2 py-0.5 rounded-full mt-2 font-semibold">{e.year}</span>
                            </div>
                          ))}
                        </>
                      ),
                    },
                    {
                      title: 'Compétences',
                      content: (
                        <div className="flex flex-wrap gap-2">
                          {['PHP', 'SQL', 'HTML/CSS/JS', 'Python', 'C++', 'Next.js/React', 'Réseaux & Infra', 'Cybersécurité', 'Microsoft Office', 'Sage'].map((s, i) => (
                            <span key={i} className="text-xs bg-slate-800 text-white px-2.5 py-1 rounded font-medium">{s}</span>
                          ))}
                        </div>
                      ),
                    },
                    {
                      title: 'Soft Skills',
                      content: (
                        <div className="flex flex-wrap gap-2">
                          {['Autonomie', 'Travail en équipe', 'Polyvalence', 'Responsable', 'Entrepreneuriat'].map((s, i) => (
                            <span key={i} className="text-xs bg-violet-100 text-violet-800 px-2.5 py-1 rounded font-semibold">{s}</span>
                          ))}
                        </div>
                      ),
                    },
                    {
                      title: "Centres d'intérêt",
                      content: (
                        <div className="flex flex-wrap gap-2">
                          {['Arts martiaux', 'Développement', 'Infrastructure', 'Jeux vidéo'].map((s, i) => (
                            <span key={i} className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded font-semibold">{s}</span>
                          ))}
                        </div>
                      ),
                    },
                  ].map((sec, i) => (
                    <div key={i} className="mb-8">
                      <h3 className="text-xs font-extrabold tracking-widest uppercase text-[#6F3FFF] mb-4 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-slate-300">
                        {sec.title}
                      </h3>
                      {sec.content}
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="md:w-[65%] p-6 md:p-8 bg-white">
                  <div className="mb-8">
                    <h3 className="text-xs font-extrabold tracking-widest uppercase text-[#6F3FFF] mb-4 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-slate-300">Profil</h3>
                    <p className="text-sm text-slate-600 leading-relaxed text-justify">
                      Pratiquant le Viet Vo Dao depuis 9 ans, j&apos;ai développé rigueur, discipline et esprit d&apos;équipe.<br /><br />
                      Étudiant en deuxième année à l&apos;EPSI en BTS SIO option SISR et major de ma promotion, j&apos;ai choisi cette filière par passion pour la programmation et les technologies. Orienté vers les réseaux et la cybersécurité, je m&apos;intéresse particulièrement au fonctionnement des systèmes et à la circulation sécurisée des données.<br /><br />
                      Mon objectif professionnel est de devenir administrateur réseau, tout en continuant à développer mes compétences en développement web, car je ne souhaite pas délaisser ma passion pour le code. J&apos;ai d&apos;ailleurs créé ma micro-entreprise NETCY, spécialisée en création de sites web sécurisés.
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xs font-extrabold tracking-widest uppercase text-[#6F3FFF] mb-4 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-slate-300">Expériences</h3>
                    {[
                      { title: 'Stage – Technicien Informatique', stage: true, co: 'Devensys Cybersécurité · Montpellier', date: '19 janvier 2026 – 20 février 2026', desc: "Déploiement de PC en interne, journées découverte dans les différents services de l'entreprise, mise en place d'un serveur PKI." },
                      { title: 'Stage – Technicien Informatique', stage: true, co: 'Infoboost · Mauguio', date: '23 avril 2025 – 4 juillet 2025', desc: 'Reconditionnement de PC, infogérance.' },
                      { title: 'Vendeur – Polyvalent', stage: false, co: 'Boulangeries Paul · Saint-Rémy & Caractères de Pain · Châteaurenard', date: 'Sept. 2023 – Juin 2024 · CDI / 2022 – 2023 · 2 CDD', desc: null },
                    ].map((exp, i, arr) => (
                      <div key={i} className="relative pl-6 mb-5 border-l-2 border-[#6F3FFF]">
                        <div className={`absolute w-3 h-3 rounded-full left-[-7px] top-1 border-2 border-white ring-2 ${exp.stage ? 'bg-[#0ea5e9] ring-[#0ea5e9]' : 'bg-slate-300 ring-slate-300'}`} />
                        <h4 className="text-sm font-bold text-slate-900">
                          {exp.title}
                          {exp.stage && <span className="text-[10px] bg-[#0ea5e9] text-white px-1.5 py-0.5 rounded ml-2 align-middle">STAGE</span>}
                        </h4>
                        <p className="text-xs font-semibold text-[#6F3FFF] uppercase tracking-wide mt-1">{exp.co}</p>
                        <p className="text-xs text-slate-400 mt-1 mb-2">{exp.date}</p>
                        {exp.desc && <p className="text-xs text-slate-600">{exp.desc}</p>}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-xs font-extrabold tracking-widest uppercase text-[#6F3FFF] mb-4 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-slate-300">Projets Réalisés</h3>
                    {[
                      { title: 'NETCY – Micro-entreprise', sub: 'Création de sites web sécurisés', desc: 'Conception et développement de mon site vitrine NETCY (Next.js, React, TypeScript), spécialisé en création de sites web sécurisés et cybersécurité réseau pour les professionnels.' },
                      { title: "Création d'un site web – Hôtel Neptune", sub: null, desc: 'Partie administrateur, sécurisation du site, gestion des réservations et des paiements.' },
                      { title: "Création d'un site web – E-Commerce", sub: 'Le Seigneur des Goodies', desc: 'Partie administrateur, sécurisation du site, gestion des produits et des paiements.' },
                    ].map((p, i) => (
                      <div key={i} className="mb-4 pl-3 border-l-2 border-[#6F3FFF]">
                        <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                        {p.sub && <p className="text-xs font-semibold text-[#6F3FFF] mt-0.5">{p.sub}</p>}
                        <p className="text-xs text-slate-600 mt-1">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ScrollText, Mail, Download, Eye, Briefcase, GraduationCap,
  Sun, FileSignature, RotateCcw, FileText, ChevronDown, MapPin,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────
   Données de contact partagées (CV + Lettre)
   ──────────────────────────────────────────────────────────────── */
const CONTACT = {
  nom: 'Jung Jean-Marie',
  adresse: '3 Rue des Soldats, 34000 Montpellier',
  email: 'jeanmarie.jung.pro@gmail.com',
  tel: '07 82 76 54 02',
  site: 'netcy.fr',
  linkedin: 'linkedin.com/in/jean-marie-jung-40683b218',
};

/* Adresses sélectionnables pour les CV (Montpellier / Châteaurenard) */
const CV_ADDRESSES = {
  montpellier: '3 Rue des Soldats, 34000 Montpellier',
  chato: '145 Chemin du Pan Perdu, 1 Clos des Mylords, 13160 Ch&acirc;teaurenard',
} as const;
type CvAddressKey = keyof typeof CV_ADDRESSES;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ────────────────────────────────────────────────────────────────
   CSS commun aux deux CV (responsive à l'écran, A4 à l'impression)
   ──────────────────────────────────────────────────────────────── */
function cvCss(accent: string, hFrom: string, hTo: string, softBg: string, softFg: string, dot2: string) {
  return `
* { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
body { font-family:'Segoe UI',Arial,sans-serif; background:#e5e7eb; padding:16px; }
.cv { width:100%; max-width:820px; margin:0 auto; background:#fff; display:flex; flex-direction:column; box-shadow:0 10px 40px rgba(0,0,0,.15); border-radius:6px; overflow:hidden; }
.header { display:flex; align-items:center; gap:28px; background:linear-gradient(135deg,${hFrom} 0%,${hTo} 100%); padding:26px 34px; }
.photo-ring { width:108px; height:108px; border-radius:50%; border:3px solid ${accent}; padding:3px; flex-shrink:0; background:#fff; }
.photo { width:100%; height:100%; border-radius:50%; object-fit:cover; object-position:center 20%; display:block; }
.header-name { font-size:31px; font-weight:800; color:#fff; letter-spacing:3px; text-transform:uppercase; margin-bottom:4px; }
.header-sub { font-size:11.5px; color:rgba(255,255,255,.82); font-weight:600; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:10px; }
.header-badge { display:inline-block; background:${accent}; color:#fff; font-size:11.5px; font-weight:700; padding:5px 14px; border-radius:20px; }
.body { display:flex; flex:1; }
.left-col { width:34%; background:#f1f5f9; padding:24px 18px; }
.right-col { width:66%; background:#fff; padding:22px 24px; border-left:1px solid #e2e8f0; }
.sec-title { font-size:10.5px; font-weight:800; letter-spacing:2.5px; text-transform:uppercase; color:${accent}; margin-bottom:12px; display:flex; align-items:center; gap:8px; }
.sec-title::after { content:''; flex:1; height:1px; background:#cbd5e1; }
.section { margin-bottom:22px; }
.contact-row { display:flex; align-items:flex-start; gap:10px; margin-bottom:11px; }
.c-icon { width:16px; flex-shrink:0; text-align:center; color:${accent}; font-size:13px; margin-top:2px; }
.c-text { font-size:11.5px; color:#334155; line-height:1.5; word-break:break-word; }
.skill-tag { font-size:11px; background:#1e293b; color:#fff; padding:4px 10px; border-radius:4px; font-weight:500; display:inline-block; margin:3px; }
.soft-tag { font-size:11px; background:${softBg}; color:${softFg}; padding:4px 10px; border-radius:4px; font-weight:600; display:inline-block; margin:3px; }
.plain-tag { font-size:11px; background:#e2e8f0; color:#334155; padding:4px 10px; border-radius:4px; font-weight:600; display:inline-block; margin:3px; }
.tl-item { position:relative; padding-left:22px; margin-bottom:14px; }
.tl-dot { position:absolute; left:0; top:4px; width:11px; height:11px; border-radius:50%; background:${accent}; border:2px solid #fff; box-shadow:0 0 0 2px ${accent}; }
.tl-dot.alt { background:${dot2}; box-shadow:0 0 0 2px ${dot2}; }
.exp-title { font-size:13px; font-weight:700; color:#0f172a; }
.exp-badge { display:inline-block; font-size:9.5px; font-weight:700; background:${dot2}; color:#fff; padding:1px 5px; border-radius:3px; margin-left:5px; vertical-align:middle; }
.exp-co { font-size:11px; color:${accent}; font-weight:600; margin:2px 0; text-transform:uppercase; letter-spacing:0.4px; }
.exp-date { font-size:10.5px; color:#94a3b8; margin-bottom:3px; }
.exp-desc { font-size:11.5px; color:#64748b; line-height:1.5; }
.profile-text { font-size:11.8px; color:#475569; line-height:1.75; text-align:justify; }
.edu-item { margin-bottom:14px; }
.edu-degree { font-size:12.5px; font-weight:700; color:#0f172a; }
.edu-school { font-size:11px; color:#64748b; margin-top:3px; }
.edu-year { display:inline-block; font-size:10px; color:${accent}; background:${softBg}; padding:2px 9px; border-radius:10px; margin-top:5px; font-weight:600; }
.highlight { background:${softBg}; border-left:3px solid ${accent}; border-radius:6px; padding:12px 14px; font-size:11.5px; color:#475569; line-height:1.6; }
@media print { @page { margin:0; size:A4 portrait; } body { margin:0; padding:0; background:#fff; } .cv { width:100%; max-width:none; box-shadow:none; border-radius:0; } }
`;
}

const FA = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" />`;

function contactBlock(adresse: string) {
  return `
<div class="section"><div class="sec-title">Contact</div>
  <div class="contact-row"><span class="c-icon"><i class="fas fa-map-marker-alt"></i></span><span class="c-text">${adresse}</span></div>
  <div class="contact-row"><span class="c-icon"><i class="fas fa-envelope"></i></span><span class="c-text">${CONTACT.email}</span></div>
  <div class="contact-row"><span class="c-icon"><i class="fas fa-phone"></i></span><span class="c-text">${CONTACT.tel}</span></div>
  <div class="contact-row"><span class="c-icon"><i class="fas fa-globe"></i></span><span class="c-text">${CONTACT.site}</span></div>
  <div class="contact-row"><span class="c-icon"><i class="fab fa-linkedin"></i></span><span class="c-text">${CONTACT.linkedin}</span></div>
</div>`;
}

/* ────────────────────────────────────────────────────────────────
   CV 1 — ALTERNANCE (CV actuel)
   ──────────────────────────────────────────────────────────────── */
function buildAlternanceCV(photoUrl: string, adresse: string) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CV_Jung_Jean-Marie_Alternance</title>${FA}
<style>${cvCss('#6F3FFF', '#0f172a', '#1e3a8a', '#ede9fe', '#5b21b6', '#0ea5e9')}</style></head>
<body><div class="cv">
<div class="header">
  <div class="photo-ring"><img class="photo" src="${photoUrl}" alt="Jung Jean-Marie" /></div>
  <div>
    <div class="header-name">Jung Jean-Marie</div>
    <div class="header-sub">BTS SIO Dipl&ocirc;m&eacute; &middot; Option SISR &middot; Fondateur de NETCY &middot; 23 ans</div>
    <div class="header-badge">Recherche d&apos;alternance de 2026 &agrave; 2029</div>
  </div>
</div>
<div class="body">
  <div class="left-col">
    ${contactBlock(adresse)}
    <div class="section"><div class="sec-title">Formation</div>
      <div class="edu-item"><div class="edu-degree">BTS SIO &ndash; SISR</div><div class="edu-school">EPSI Montpellier</div><div class="edu-year">2024 &ndash; 2026 (Dipl&ocirc;m&eacute;)</div></div>
      <div class="edu-item"><div class="edu-degree">Baccalaur&eacute;at G&eacute;n&eacute;ral S</div><div class="edu-school">Lyc&eacute;e Polyvalent Philippe de Girard</div><div class="edu-year">2017 &ndash; 2021</div></div>
    </div>
    <div class="section"><div class="sec-title">Comp&eacute;tences</div>
      <div><span class="skill-tag">PHP</span><span class="skill-tag">SQL</span><span class="skill-tag">HTML/CSS/JS</span><span class="skill-tag">Python</span><span class="skill-tag">C++</span><span class="skill-tag">Next.js/React</span><span class="skill-tag">R&eacute;seaux &amp; Infra</span><span class="skill-tag">Cybers&eacute;curit&eacute;</span><span class="skill-tag">Microsoft Office</span><span class="skill-tag">Sage</span></div>
    </div>
    <div class="section"><div class="sec-title">Soft Skills</div>
      <div><span class="soft-tag">Autonomie</span><span class="soft-tag">Travail en &eacute;quipe</span><span class="soft-tag">Polyvalence</span><span class="soft-tag">Responsable</span><span class="soft-tag">Entrepreneuriat</span></div>
    </div>
    <div class="section"><div class="sec-title">Centres d&apos;int&eacute;r&ecirc;t</div>
      <div><span class="plain-tag">Arts martiaux</span><span class="plain-tag">D&eacute;veloppement</span><span class="plain-tag">Infrastructure</span><span class="plain-tag">Jeux vid&eacute;o</span></div>
    </div>
  </div>
  <div class="right-col">
    <div class="section"><div class="sec-title">Profil</div>
      <p class="profile-text">Pratiquant le Viet Vo Dao depuis 9 ans, j&apos;ai d&eacute;velopp&eacute; rigueur, discipline et esprit d&apos;&eacute;quipe.<br/><br/>Dipl&ocirc;m&eacute; du BTS SIO option SISR &agrave; l&apos;EPSI Montpellier, j&apos;ai choisi cette fili&egrave;re par passion pour la programmation et les technologies. Orient&eacute; vers les r&eacute;seaux et la cybers&eacute;curit&eacute;, je m&apos;int&eacute;resse particuli&egrave;rement au fonctionnement des syst&egrave;mes et &agrave; la circulation s&eacute;curis&eacute;e des donn&eacute;es.<br/><br/>Mon objectif professionnel est de devenir administrateur r&eacute;seau, tout en continuant &agrave; d&eacute;velopper mes comp&eacute;tences en d&eacute;veloppement web. J&apos;ai d&apos;ailleurs cr&eacute;&eacute; ma micro-entreprise NETCY, sp&eacute;cialis&eacute;e en cr&eacute;ation de sites web s&eacute;curis&eacute;s. Je recherche une alternance (2026 &ndash; 2029) afin de poursuivre mes &eacute;tudes et mettre en pratique mes comp&eacute;tences.</p>
    </div>
    <div class="section"><div class="sec-title">Exp&eacute;riences</div>
      <div class="tl-item"><div class="tl-dot alt"></div><div class="exp-title">Stage &ndash; Technicien Informatique <span class="exp-badge">STAGE</span></div><div class="exp-co">Devensys Cybers&eacute;curit&eacute; &middot; Montpellier</div><div class="exp-date">19 janvier 2026 &ndash; 20 f&eacute;vrier 2026</div><div class="exp-desc">D&eacute;ploiement de PC, journ&eacute;es d&eacute;couverte, mise en place d&apos;un serveur PKI.</div></div>
      <div class="tl-item"><div class="tl-dot alt"></div><div class="exp-title">Stage &ndash; Technicien Informatique <span class="exp-badge">STAGE</span></div><div class="exp-co">Infoboost &middot; Mauguio</div><div class="exp-date">23 avril 2025 &ndash; 4 juillet 2025</div><div class="exp-desc">Reconditionnement de PC, infog&eacute;rance.</div></div>
      <div class="tl-item"><div class="tl-dot"></div><div class="exp-title">Vendeur &ndash; Polyvalent</div><div class="exp-co">Boulangeries Paul &middot; Saint-R&eacute;my &amp; Caract&egrave;res de Pain &middot; Ch&acirc;teaurenard</div><div class="exp-date">Sept. 2023 &ndash; Juin 2024 &middot; CDI / 2022 &ndash; 2023 &middot; 2 CDD</div></div>
    </div>
    <div class="section"><div class="sec-title">Projets R&eacute;alis&eacute;s</div>
      <div class="tl-item" style="padding-left:12px;border-left:2px solid #6F3FFF;"><div class="exp-title">NETCY &ndash; Micro-entreprise</div><div class="exp-co">Cr&eacute;ation de sites web s&eacute;curis&eacute;s</div><div class="exp-desc">Conception et d&eacute;veloppement de mon site vitrine (Next.js, React, TypeScript), sp&eacute;cialis&eacute; en s&eacute;curit&eacute; web et cybers&eacute;curit&eacute; r&eacute;seau pour les professionnels.</div></div>
      <div class="tl-item" style="padding-left:12px;border-left:2px solid #6F3FFF;"><div class="exp-title">Site web &ndash; H&ocirc;tel Neptune</div><div class="exp-desc">Partie administrateur, s&eacute;curisation, gestion des r&eacute;servations et des paiements.</div></div>
      <div class="tl-item" style="padding-left:12px;border-left:2px solid #6F3FFF;"><div class="exp-title">Site e-commerce &ndash; Le Seigneur des Goodies</div><div class="exp-desc">Partie administrateur, s&eacute;curisation, gestion des produits et des paiements.</div></div>
    </div>
  </div>
</div>
</div></body></html>`;
}

/* ────────────────────────────────────────────────────────────────
   CV 2 — JOB D'ÉTÉ (optimisé : relation client, dispo, polyvalence)
   ──────────────────────────────────────────────────────────────── */
function buildSummerCV(photoUrl: string, adresse: string) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CV_Jung_Jean-Marie_Job_Ete</title>${FA}
<style>${cvCss('#ea580c', '#9a3412', '#f59e0b', '#ffedd5', '#9a3412', '#fb923c')}</style></head>
<body><div class="cv">
<div class="header">
  <div class="photo-ring"><img class="photo" src="${photoUrl}" alt="Jung Jean-Marie" /></div>
  <div>
    <div class="header-name">Jung Jean-Marie</div>
    <div class="header-sub">Dynamique &amp; Polyvalent &middot; Sens du contact &middot; 23 ans</div>
    <div class="header-badge">Disponible pour un job d&apos;&eacute;t&eacute; &middot; &Eacute;t&eacute; 2026</div>
  </div>
</div>
<div class="body">
  <div class="left-col">
    ${contactBlock(adresse)}
    <div class="section"><div class="sec-title">Disponibilit&eacute;</div>
      <div><span class="soft-tag">Juillet &ndash; Ao&ucirc;t 2026</span><span class="soft-tag">Temps plein</span><span class="soft-tag">Week-ends inclus</span></div>
    </div>
    <div class="section"><div class="sec-title">Atouts</div>
      <div><span class="soft-tag">S&eacute;rieux</span><span class="soft-tag">Ponctuel</span><span class="soft-tag">Dynamique</span><span class="soft-tag">Sens du contact</span><span class="soft-tag">Esprit d&apos;&eacute;quipe</span><span class="soft-tag">Polyvalent</span><span class="soft-tag">Autonome</span></div>
    </div>
    <div class="section"><div class="sec-title">Comp&eacute;tences</div>
      <div><span class="skill-tag">Relation client</span><span class="skill-tag">Vente &amp; encaissement</span><span class="skill-tag">Travail en &eacute;quipe</span><span class="skill-tag">Informatique &amp; Bureautique</span></div>
    </div>
    <div class="section"><div class="sec-title">Langues</div>
      <div><span class="plain-tag">Fran&ccedil;ais &middot; Natif</span><span class="plain-tag">Anglais &middot; Professionnel</span></div>
    </div>
    <div class="section"><div class="sec-title">Centres d&apos;int&eacute;r&ecirc;t</div>
      <div><span class="plain-tag">Arts martiaux (9 ans)</span><span class="plain-tag">Informatique</span><span class="plain-tag">Jeux vid&eacute;o</span></div>
    </div>
  </div>
  <div class="right-col">
    <div class="section"><div class="sec-title">Profil</div>
      <p class="profile-text">&Eacute;tudiant s&eacute;rieux et dynamique, je recherche un job d&apos;&eacute;t&eacute; pour la p&eacute;riode estivale 2026. Fort d&apos;exp&eacute;riences en r&eacute;ception de nuit (Appart&apos;City) et en vente (PAUL), men&eacute;es en parall&egrave;le de mes &eacute;tudes, je suis &agrave; l&apos;aise avec le public, ponctuel et rigoureux.<br/><br/>Pratiquant les arts martiaux depuis 9 ans, j&apos;ai d&eacute;velopp&eacute; discipline, endurance et esprit d&apos;&eacute;quipe. Polyvalent et motiv&eacute;, je m&apos;adapte rapidement &agrave; tout environnement de travail et suis pleinement disponible durant tout l&apos;&eacute;t&eacute;.</p>
    </div>
    <div class="section"><div class="sec-title">Exp&eacute;riences</div>
      <div class="tl-item"><div class="tl-dot alt"></div><div class="exp-title">R&eacute;ceptionniste de nuit</div><div class="exp-co">Appart&apos;City</div><div class="exp-date">D&eacute;c. 2025 &ndash; Janv. 2026 &middot; Mars &ndash; 2 juillet 2026</div><div class="exp-desc">En parall&egrave;le de mes &eacute;tudes. Accueil et check-in / check-out des clients, gestion des r&eacute;servations et des appels, cl&ocirc;ture de caisse, surveillance et s&eacute;curit&eacute; de l&apos;&eacute;tablissement durant la nuit. Autonomie totale et sens du service.</div></div>
      <div class="tl-item"><div class="tl-dot"></div><div class="exp-title">Vendeur &ndash; Polyvalent</div><div class="exp-co">PAUL &middot; Saint-R&eacute;my-de-Provence &middot; CDI</div><div class="exp-date">Sept. 2023 &ndash; Juin 2024</div><div class="exp-desc">Mise en place de la marchandise, de la vente, de l&apos;encaissement et de l&apos;entretien de la boutique.</div></div>
    </div>
    <div class="section"><div class="sec-title">Formation</div>
      <div class="edu-item"><div class="edu-degree">BTS SIO (Services Informatiques aux Organisations)</div><div class="edu-school">EPSI Montpellier</div><div class="edu-year">Dipl&ocirc;m&eacute; 2026</div></div>
      <div class="edu-item"><div class="edu-degree">Baccalaur&eacute;at G&eacute;n&eacute;ral S</div><div class="edu-school">Lyc&eacute;e Polyvalent Philippe de Girard</div><div class="edu-year">2021</div></div>
    </div>
    <div class="section"><div class="sec-title">Pourquoi me recruter&nbsp;?</div>
      <div class="highlight">Motiv&eacute; et fiable, je m&apos;investis pleinement dans chaque mission. Habitu&eacute; au contact client et au travail en &eacute;quipe, je suis op&eacute;rationnel rapidement et disponible sans interruption tout l&apos;&eacute;t&eacute;.</div>
    </div>
  </div>
</div>
</div></body></html>`;
}

/* ────────────────────────────────────────────────────────────────
   Lettre de motivation — template adaptable
   ──────────────────────────────────────────────────────────────── */
type LetterValues = {
  entreprise: string;
  poste: string;
  type: 'Job d’été' | 'Alternance' | 'Emploi' | 'Stage';
  ville: string;
  date: string;
  recruteur: string;
  adresseEntreprise: string;
  paragraphe: string;
};

function introSentence(v: LetterValues) {
  const poste = v.poste.trim() || '…';
  switch (v.type) {
    case 'Alternance':
      return `Actuellement en formation, je souhaite intégrer votre entreprise en alternance au poste de <strong>${poste}</strong> et vous soumets par la présente ma candidature.`;
    case 'Stage':
      return `Dans le cadre de ma formation, je recherche un stage au poste de <strong>${poste}</strong> et vous adresse ma candidature.`;
    case 'Emploi':
      return `Vivement intéressé par votre entreprise, je vous soumets ma candidature au poste de <strong>${poste}</strong>.`;
    default:
      return `Je me permets de vous adresser ma candidature pour un job d’été au poste de <strong>${poste}</strong> au sein de votre établissement.`;
  }
}

function buildLetter(v: LetterValues) {
  const entreprise = esc(v.entreprise.trim()) || 'Nom de l’entreprise';
  const objetType =
    v.type === 'Job d’été' ? 'job d’été' :
    v.type === 'Alternance' ? 'alternance' :
    v.type === 'Stage' ? 'stage' : 'emploi';
  const objet = `Candidature au poste de ${esc(v.poste.trim()) || '…'} — ${objetType}`;
  const recruteur = esc(v.recruteur.trim());
  const adresseEnt = esc(v.adresseEntreprise.trim());
  const para = v.paragraphe.trim()
    ? esc(v.paragraphe.trim()).replace(/\n{2,}/g, '</p><p class="body">').replace(/\n/g, '<br/>')
    : `Votre entreprise attire particulièrement mon attention par sa réputation et son sérieux. Rejoindre vos équipes serait pour moi l’occasion de m’investir pleinement, d’apprendre à vos côtés et de contribuer activement à votre activité durant cette période.`;

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lettre_Motivation_Jung_Jean-Marie</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
body { font-family:'Segoe UI',Arial,sans-serif; background:#e5e7eb; padding:16px; }
.letter { width:100%; max-width:820px; min-height:1000px; margin:0 auto; background:#fff; padding:48px 56px; box-shadow:0 10px 40px rgba(0,0,0,.15); border-radius:6px; color:#1f2937; font-size:13.5px; line-height:1.7; display:flex; flex-direction:column; }
.sender { font-size:12.5px; color:#475569; line-height:1.55; }
.sender .nm { font-weight:800; font-size:17px; color:#0f172a; letter-spacing:0.5px; }
.sender .accent { width:46px; height:3px; background:#0052FF; border-radius:2px; margin:8px 0 10px; }
.recipient { margin-top:30px; margin-left:auto; text-align:left; font-size:12.5px; color:#334155; max-width:300px; }
.recipient .rc-name { font-weight:700; color:#0f172a; }
.dater { margin-top:26px; text-align:right; font-size:12.5px; color:#334155; }
.objet { margin-top:28px; font-weight:700; color:#0f172a; }
.objet span { font-weight:400; color:#334155; }
.salut { margin-top:24px; }
p.body { margin-top:14px; text-align:justify; color:#374151; }
.closing { margin-top:20px; text-align:justify; color:#374151; }
.sign { margin-top:auto; padding-top:34px; text-align:right; }
.sign .nm { font-weight:800; color:#0f172a; font-size:15px; }
@media print { @page { margin:0; size:A4 portrait; } body { margin:0; padding:0; background:#fff; } .letter { width:100%; max-width:none; min-height:100vh; box-shadow:none; border-radius:0; padding:26mm 24mm; } }
</style></head>
<body><div class="letter">
  <div class="sender">
    <div class="nm">${esc(CONTACT.nom)}</div>
    <div class="accent"></div>
    ${esc(CONTACT.adresse)}<br/>
    ${esc(CONTACT.tel)} &middot; ${esc(CONTACT.email)}
  </div>

  <div class="recipient">
    <div class="rc-name">${entreprise}</div>
    ${recruteur ? `${recruteur}<br/>` : ''}
    ${adresseEnt ? `${adresseEnt}` : ''}
  </div>

  <div class="dater">${esc(v.ville.trim()) || 'Montpellier'}, le ${esc(v.date.trim())}</div>

  <div class="objet">Objet : <span>${objet}</span></div>

  <div class="salut">Madame, Monsieur,</div>

  <p class="body">${introSentence(v)}</p>
  <p class="body">Sérieux, dynamique et doté d’un bon sens du contact, je suis une personne motivée qui s’adapte rapidement à son environnement. J’ai eu l’occasion d’acquérir une première expérience professionnelle d’un an en vente chez PAUL, ce qui m’a permis de développer rigueur, sens du service et travail en équipe.</p>
  <p class="body">${para}</p>
  <div class="closing">Pleinement disponible, je me tiens à votre disposition pour un entretien afin de vous exposer plus en détail mes motivations. Dans l’attente de votre retour, je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.</div>

  <div class="sign"><div class="nm">${esc(CONTACT.nom)}</div></div>
</div></body></html>`;
}

/* ────────────────────────────────────────────────────────────────
   Lettre de motivation — version Word (.doc éditable dans Word)
   HTML compatible MS Word : ouvrable et entièrement modifiable.
   ──────────────────────────────────────────────────────────────── */
function buildLetterWord(v: LetterValues) {
  const entreprise = esc(v.entreprise.trim()) || 'Nom de l’entreprise';
  const objetType =
    v.type === 'Job d’été' ? 'job d’été' :
    v.type === 'Alternance' ? 'alternance' :
    v.type === 'Stage' ? 'stage' : 'emploi';
  const objet = `Candidature au poste de ${esc(v.poste.trim()) || '…'} — ${objetType}`;
  const recruteur = esc(v.recruteur.trim());
  const adresseEnt = esc(v.adresseEntreprise.trim());
  const para = v.paragraphe.trim()
    ? esc(v.paragraphe.trim()).replace(/\n{2,}/g, '</p><p class="just">').replace(/\n/g, '<br/>')
    : `Votre entreprise attire particulièrement mon attention par sa réputation et son sérieux. Rejoindre vos équipes serait pour moi l’occasion de m’investir pleinement, d’apprendre à vos côtés et de contribuer activement à votre activité durant cette période.`;

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Lettre de motivation — ${esc(CONTACT.nom)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
<style>
@page WordSection1 { size:21cm 29.7cm; margin:2.5cm 2.5cm 2.5cm 2.5cm; }
div.WordSection1 { page:WordSection1; }
body { font-family:'Calibri',Arial,sans-serif; font-size:11.5pt; color:#000000; line-height:1.5; }
p { margin:0 0 10pt 0; }
.name { font-size:15pt; font-weight:bold; margin-bottom:2pt; }
.right { text-align:right; }
.just { text-align:justify; }
.bold { font-weight:bold; }
</style></head>
<body><div class="WordSection1">
<p class="name">${esc(CONTACT.nom)}</p>
<p>${esc(CONTACT.adresse)}<br/>${esc(CONTACT.tel)}<br/>${esc(CONTACT.email)}</p>
<p class="right">${entreprise}${recruteur ? `<br/>${recruteur}` : ''}${adresseEnt ? `<br/>${adresseEnt}` : ''}</p>
<p class="right">${esc(v.ville.trim()) || 'Montpellier'}, le ${esc(v.date.trim())}</p>
<p class="bold">Objet : ${objet}</p>
<p>Madame, Monsieur,</p>
<p class="just">${introSentence(v)}</p>
<p class="just">Sérieux, dynamique et doté d’un bon sens du contact, je suis une personne motivée qui s’adapte rapidement à son environnement. J’ai eu l’occasion d’acquérir une première expérience professionnelle d’un an en vente chez PAUL, ce qui m’a permis de développer rigueur, sens du service et travail en équipe.</p>
<p class="just">${para}</p>
<p class="just">Pleinement disponible, je me tiens à votre disposition pour un entretien afin de vous exposer plus en détail mes motivations. Dans l’attente de votre retour, je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.</p>
<p>&nbsp;</p>
<p class="right bold">${esc(CONTACT.nom)}</p>
</div></body></html>`;
}

/* ────────────────────────────────────────────────────────────────
   Utilitaires d'ouverture / impression
   ──────────────────────────────────────────────────────────────── */
function downloadWord(html: string, filename: string) {
  const blob = new Blob(['﻿', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function openDoc(html: string, autoPrint: boolean) {
  const win = window.open('', '_blank');
  if (!win) return;
  const script = autoPrint
    ? `<script>window.onload=function(){setTimeout(function(){window.print();},450);};<\/script>`
    : '';
  win.document.open();
  win.document.write(html.replace('</body>', `${script}</body>`));
  win.document.close();
}

/* ────────────────────────────────────────────────────────────────
   Composant principal
   ──────────────────────────────────────────────────────────────── */
export default function AdminCV() {
  const [tab, setTab] = useState<'cv' | 'lettre'>('cv');

  const photoUrl = typeof window !== 'undefined' ? `${window.location.origin}/images/profile.webp` : '/images/profile.webp';

  /* Adresse sélectionnée pour les CV */
  const [cvAddress, setCvAddress] = useState<CvAddressKey>('montpellier');
  const adresse = CV_ADDRESSES[cvAddress];

  const alternanceHtml = useMemo(() => buildAlternanceCV(photoUrl, adresse), [photoUrl, adresse]);
  const summerHtml = useMemo(() => buildSummerCV(photoUrl, adresse), [photoUrl, adresse]);

  /* Lettre — état des champs */
  const todayFr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const defaultLetter: LetterValues = {
    entreprise: '', poste: '', type: 'Job d’été', ville: 'Montpellier',
    date: todayFr, recruteur: '', adresseEntreprise: '', paragraphe: '',
  };
  const [letter, setLetter] = useState<LetterValues>(defaultLetter);
  const letterHtml = useMemo(() => buildLetter(letter), [letter]);
  const letterWordHtml = useMemo(() => buildLetterWord(letter), [letter]);
  const set = <K extends keyof LetterValues>(k: K, val: LetterValues[K]) => setLetter(s => ({ ...s, [k]: val }));

  return (
    <div className="space-y-6">
      {/* ── Sous-onglets : CV (gauche) · Lettre de motivation (droite) — bulle glissante ── */}
      <div className="relative flex items-center gap-1 p-1 bg-surface-container-low rounded-2xl w-full sm:w-fit">
        {([
          { id: 'cv' as const, label: 'CV', Icon: ScrollText },
          { id: 'lettre' as const, label: 'Lettre de motivation', Icon: Mail },
        ]).map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors
              ${tab === id ? 'text-primary dark:text-[#d0bcff]' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {tab === id && (
              <motion.span
                layoutId="cvTabBubble"
                className="absolute inset-0 rounded-xl bg-surface-container-lowest shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2"><Icon size={16} /> {label}</span>
          </button>
        ))}
      </div>

      {/* ══════════ ONGLET CV ══════════ */}
      {tab === 'cv' && (
        <motion.div key="cv-panel" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="space-y-5">
          {/* Sélecteur d'adresse affichée sur les CV */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
              <MapPin size={14} className="text-primary dark:text-[#d0bcff]" /> Adresse affichée
            </span>
            <div className="relative flex items-center gap-1 p-1 bg-surface-container-low rounded-2xl w-full sm:w-fit">
              {([
                { id: 'montpellier' as const, label: 'Montpellier' },
                { id: 'chato' as const, label: 'Châteaurenard' },
              ]).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setCvAddress(id)}
                  className={`relative flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold transition-colors
                    ${cvAddress === id ? 'text-primary dark:text-[#d0bcff]' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {cvAddress === id && (
                    <motion.span
                      layoutId="cvAddrBubble"
                      className="absolute inset-0 rounded-xl bg-surface-container-lowest shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Les 2 CV */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CVCard
              title="CV — Alternance"
              subtitle="Recherche d'alternance 2026 – 2029"
              icon={<GraduationCap size={16} />}
              accentCls="text-[#6F3FFF] bg-violet-100 dark:bg-[#1e1a3d]"
              html={alternanceHtml}
              fileHint="CV actuel, orienté informatique / réseaux & cybersécurité."
            />
            <CVCard
              title="CV — Job d'été"
              subtitle="Disponible · Été 2026"
              icon={<Sun size={16} />}
              accentCls="text-orange-600 bg-orange-100 dark:bg-[#3d2410]"
              html={summerHtml}
              fileHint="Optimisé job d'été : relation client, disponibilité, polyvalence."
            />
          </div>
        </motion.div>
      )}

      {/* ══════════ ONGLET LETTRE DE MOTIVATION ══════════ */}
      {tab === 'lettre' && (
        <motion.div key="lettre-panel" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-6 items-start">
          {/* Formulaire d'adaptation */}
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardHeader className="px-6 pt-6 pb-0">
              <CardTitle className="font-display text-base text-on-surface flex items-center gap-2">
                <FileSignature size={16} className="text-primary dark:text-[#d0bcff]" /> Adapter la lettre
              </CardTitle>
              <p className="text-xs text-outline mt-0.5">Renseignez l&apos;offre — l&apos;aperçu se met à jour en direct.</p>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-4">
              <LField label="Entreprise">
                <input className={inputCls} value={letter.entreprise} onChange={e => set('entreprise', e.target.value)} placeholder="Ex. Boulangerie du Centre" />
              </LField>
              <div className="grid grid-cols-2 gap-3">
                <LField label="Poste visé">
                  <input className={inputCls} value={letter.poste} onChange={e => set('poste', e.target.value)} placeholder="Ex. Vendeur" />
                </LField>
                <LField label="Type">
                  <TypeSelect value={letter.type} onChange={v => set('type', v)} />
                </LField>
              </div>
              <LField label="Destinataire (optionnel)">
                <input className={inputCls} value={letter.recruteur} onChange={e => set('recruteur', e.target.value)} placeholder="Ex. À l'attention du service RH" />
              </LField>
              <LField label="Adresse de l'entreprise (optionnel)">
                <input className={inputCls} value={letter.adresseEntreprise} onChange={e => set('adresseEntreprise', e.target.value)} placeholder="Ex. 12 rue de la République, 34000 Montpellier" />
              </LField>
              <div className="grid grid-cols-2 gap-3">
                <LField label="Ville">
                  <input className={inputCls} value={letter.ville} onChange={e => set('ville', e.target.value)} placeholder="Montpellier" />
                </LField>
                <LField label="Date">
                  <input className={inputCls} value={letter.date} onChange={e => set('date', e.target.value)} />
                </LField>
              </div>
              <LField label="Paragraphe personnalisé (pourquoi cette entreprise)">
                <textarea className={inputCls + ' resize-none'} rows={5} value={letter.paragraphe} onChange={e => set('paragraphe', e.target.value)}
                  placeholder="Laissez vide pour utiliser le texte par défaut, ou personnalisez selon l'offre…" />
              </LField>

              <div className="space-y-2 pt-1">
                <button onClick={() => downloadWord(letterWordHtml, 'Lettre_Motivation_Jung_Jean-Marie.doc')}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl">
                  <FileText size={16} /> Télécharger (Word · modifiable)
                </button>
                <div className="flex gap-2">
                  <button onClick={() => openDoc(letterHtml, true)} className="btn-ghost flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl">
                    <Download size={16} /> PDF
                  </button>
                  <button onClick={() => openDoc(letterHtml, false)} className="btn-ghost flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl">
                    <Eye size={16} /> Ouvrir
                  </button>
                  <button onClick={() => setLetter(defaultLetter)} className="btn-ghost flex items-center justify-center gap-2 py-2.5 px-3 text-sm rounded-xl" title="Réinitialiser">
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aperçu live de la lettre */}
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-0">
              <CardTitle className="font-display text-base text-on-surface flex items-center gap-2">
                <Briefcase size={16} className="text-primary dark:text-[#d0bcff]" /> Aperçu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <iframe title="Aperçu lettre" srcDoc={letterHtml} className="w-full rounded-xl border border-surface-container-low bg-white" style={{ height: '70vh', minHeight: 520 }} />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

/* ── Carte CV réutilisable : aperçu intégré + boutons ── */
function CVCard({ title, subtitle, icon, accentCls, html, fileHint }: {
  title: string; subtitle: string; icon: React.ReactNode; accentCls: string; html: string; fileHint: string;
}) {
  return (
    <Card className="border-0 shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <CardHeader className="px-6 pt-6 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="font-display text-lg text-on-surface flex items-center gap-2">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${accentCls}`}>{icon}</span>
              {title}
            </CardTitle>
            <p className="text-xs text-outline mt-1">{subtitle}</p>
          </div>
        </div>
        <p className="text-xs text-outline mt-2">{fileHint}</p>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col gap-3">
        <iframe title={title} srcDoc={html} className="w-full rounded-xl border border-surface-container-low bg-white" style={{ height: '58vh', minHeight: 460 }} />
        <div className="flex gap-2">
          <button onClick={() => openDoc(html, true)} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl">
            <Download size={16} /> Télécharger (PDF)
          </button>
          <button onClick={() => openDoc(html, false)} className="btn-ghost flex items-center justify-center gap-2 py-2.5 px-4 text-sm rounded-xl">
            <Eye size={16} /> Ouvrir
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Petits helpers UI ── */
function LField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

/* ── Liste déroulante « Type » stylée (cohérente avec le site) ── */
const LETTER_TYPES: LetterValues['type'][] = ['Job d’été', 'Alternance', 'Stage', 'Emploi'];
const typeLabel = (t: LetterValues['type']) => (t === 'Job d’été' ? "Job d'été" : t);

function TypeSelect({ value, onChange }: { value: LetterValues['type']; onChange: (v: LetterValues['type']) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={`${inputCls} flex items-center justify-between gap-2 text-left`}>
          <span className="truncate">{typeLabel(value)}</span>
          <ChevronDown size={15} className={`text-outline shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={6}
        className="w-[var(--radix-popover-trigger-width)] p-1.5 rounded-xl bg-surface-container-lowest border-surface-container-low shadow-lg">
        {LETTER_TYPES.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => { onChange(t); setOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${value === t ? 'bg-blue-50 dark:bg-[#1a1f3d] text-primary dark:text-[#d0bcff]' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
          >
            {typeLabel(t)}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
const inputCls = "w-full bg-surface border border-surface-container rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-[#d0bcff]/20 focus:border-primary dark:focus:border-[#d0bcff] transition-colors placeholder-[#C3C6CF]";

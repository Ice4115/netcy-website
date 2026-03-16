'use client';

import React, { useRef } from 'react';
import { Download } from 'lucide-react';

// Global Short Headers
const SHORT_HEADERS = [
  "B1.1 Patrimoine IT",
  "B1.2 Incidents",
  "B1.3 Présence Web",
  "B1.4 Mode Projet",
  "B1.5 Service IT",
  "B1.6 Dév. Pro"
];

// Content for Tooltips
const FULL_DETAILS = [
  {
    title: "Gérer le patrimoine informatique",
    items: [
      "• Recenser et identifier les ressources numériques",
      "• Exploiter des référentiels, normes et standards",
      "• Mettre en place et vérifier les habilitations",
      "• Vérifier la continuité d'un service (sauvegardes)",
      "• Vérifier le respect des règles d'utilisation"
    ]
  },
  {
    title: "Répondre aux incidents & demandes",
    items: [
      "• Collecter, suivre et orienter des demandes",
      "• Traiter des demandes réseau et système",
      "• Traiter des demandes concernant les applications"
    ]
  },
  {
    title: "Développer la présence en ligne",
    items: [
      "• Valoriser l'image de l'organisation sur le web",
      "• Référencer les services en ligne et mesurer leur visibilité",
      "• Participer à l'évolution d'un site web"
    ]
  },
  {
    title: "Travailler en mode projet",
    items: [
      "• Analyser les objectifs et modalités du projet",
      "• Planifier les activités",
      "• Évaluer les indicateurs de suivi et analyser les écarts"
    ]
  },
  {
    title: "Mettre à disposition un service",
    items: [
      "• Réaliser les tests d'intégration et d'acceptation",
      "• Déployer un service",
      "• Accompagner les utilisateurs dans la mise en place"
    ]
  },
  {
    title: "Organiser son développement",
    items: [
      "• Mettre en place un environnement d'apprentissage",
      "• Outils et stratégies de veille informationnelle",
      "• Gérer son identité professionnelle",
      "• Développer son projet professionnel"
    ]
  }
];

const ROWS = [
  { section: 'Réalisation en cours de formation' },
  { name: 'Infrastructure système & réseaux', date: '31/03/2025 au 18/04/2025', checks: [true, false, false, false, false, false] },
  { section: 'Milieu professionnel (Première année)' },
  { name: 'Installation de postes', date: '-', checks: [false, false, false, false, false, false] },
  { name: 'Couverture wifi', date: '-', checks: [false, true, false, false, true, false] },
  { section: 'Milieu professionnel (Seconde année) - Devensys' },
  { name: 'Déploiement PKI', date: '01/2026 au 02/2026', checks: [true, false, false, false, true, false] },
  { section: 'Réalisations transverses' },
  { name: 'Workshop C (Compte rendu)', date: '09/09/2024 au 13/09/2024', checks: [false, false, false, true, false, false] },
  { name: 'Bataille navale (Algo & PHP)', date: '08/10/2024 au 04/11/2024', checks: [false, false, false, false, false, false] },
  { name: 'Projet Base de Données (SQL)', date: '15/10/2024 au 26/11/2024', checks: [false, false, false, true, false, false] },
  { name: 'Open Innovation (Scan IA)', date: '19/11/2024 au 2026', checks: [false, false, false, true, false, false] },
  { name: 'Projet solution web', date: '26/11/2024 au 09/01/2025', checks: [true, false, true, true, false, true] },
  { name: '(Projet communication digitale)', date: '28/11/2024 au 30/01/2025', checks: [false, false, true, true, false, false] },
  { name: 'Projet Application Objet', date: '06/02/2025 au 06/03/2025', checks: [false, false, false, true, false, false] }
];

export default function SkillsTableSection() {
  const handleDownloadPDF = () => {
    let rowsHtml = '';

    ROWS.forEach((row) => {
      if (row.section) {
        rowsHtml += `<tr><td colspan="8" class="section-title">${row.section}</td></tr>`;
      } else {
        const checksHtml = row.checks?.map((check) => {
          if (check) {
            return `<td class="text-center"><div class="check">&#10003;</div></td>`;
          } else {
            return `<td></td>`;
          }
        }).join('') || '';

        rowsHtml += `
          <tr>
            <td class="col-name">${row.name}</td>
            <td class="col-date">${row.date}</td>
            ${checksHtml}
          </tr>
        `;
      }
    });

    const headersHtml = SHORT_HEADERS.map(header => `<th class="col-header">${header}</th>`).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Tableau de synthèse - JUNG Jean-Marie</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
body { font-family: 'Segoe UI', Arial, sans-serif; background: white; color: #111; padding: 20px; }
.header-info { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; align-items: center; }
.info-block { display: flex; flex-direction: column; }
.info-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px; }
.info-value { font-size: 14px; font-weight: 600; color: #0f172a; }
.pill { padding: 2px 6px; background: #dbeafe; color: #2563eb; border-radius: 4px; font-size: 11px; margin-left: 8px; border: 1px solid #bfdbfe; display: inline-block; vertical-align: middle; }
h1 { font-size: 24px; color: #0f172a; margin-bottom: 20px; text-align: center; }
table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
th, td { border: 1px solid #cbd5e1; padding: 8px 10px; }
.col-header { text-align: center; font-size: 11px; width: 8%; }
.section-title { font-weight: 700; color: #2563eb; background: #f8fafc; font-size: 11px; text-transform: uppercase; padding-top: 15px; padding-bottom: 10px; }
.col-name { font-weight: 600; color: #1e293b; width: 30%; }
.col-date { font-family: monospace; color: #64748b; text-align: center; font-size: 10px; width: 22%; }
.text-center { text-align: center; }
.check { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; background: #dcfce7; border: 1px solid #bbf7d0; color: #16a34a; font-weight: bold; border-radius: 4px; font-size: 14px; }
@media print {
  @page { size: A4 landscape; margin: 10mm; }
  body { padding: 0; }
  .header-info { border: 1px solid #cbd5e1; }
}
</style>
</head>
<body>
  <h1>Tableau de synthèse BTS SIO</h1>
  <div class="header-info">
    <div class="info-block">
      <span class="info-label">Candidat</span>
      <span class="info-value">JUNG Jean-Marie</span>
    </div>
    <div class="info-block">
      <span class="info-label">Centre / Option</span>
      <span class="info-value">EPSI <span class="pill">SISR</span></span>
    </div>
    <div class="info-block">
      <span class="info-label">Portfolio</span>
      <span class="info-value" style="font-family: monospace; color: #2563eb; font-size: 12px;">https://www.netcy.fr/portfolio</span>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="vertical-align: bottom;">Réalisations & Périodes</th>
        <th style="vertical-align: bottom; text-align: center;">Période</th>
        ${headersHtml}
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</body>
</html>`;

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
    <section id="tableau" className="relative scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Tableau de synthèse BTS SIO</h2>
        <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
          Survolez les titres des colonnes de compétences pour afficher le détail du référentiel académique.
        </p>
      </div>

      {/* Mobile: download button only */}
      <div className="flex justify-center md:hidden">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors"
        >
          <Download className="w-4 h-4" />
          Télécharger le PDF
        </button>
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block bg-[#0A0A0A] border border-white/10 rounded-xl overflow-visible shadow-2xl -mx-4 lg:-mx-8">

        {/* Table Header Info */}
        <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-[#121216] border-b border-white/10 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
            <div className="flex flex-col justify-center">
              <span className="text-zinc-500 uppercase tracking-widest font-bold mb-1 text-[10px]">Candidat</span>
              <span className="text-white font-semibold text-sm">JUNG Jean-Marie</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-zinc-500 uppercase tracking-widest font-bold mb-1 text-[10px]">Centre / Option</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">EPSI</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">SISR</span>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-zinc-500 uppercase tracking-widest font-bold mb-1 text-[10px]">Portfolio</span>
              <a href="https://www.netcy.fr/portfolio" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-mono text-xs hover:underline">
                https://www.netcy.fr/portfolio
              </a>
            </div>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Télécharger le PDF
          </button>
        </div>

        {/* The Matrix */}
        <table className="w-full text-left border-collapse table-fixed">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[22%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
          </colgroup>
          <thead className="bg-[#18181C]">
            <tr>
              <th className="p-4 border-r border-white/5 align-bottom">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest block">Réalisations & Périodes</span>
              </th>

              <th className="p-3 border-r border-white/5 align-bottom text-center">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-tighter">Période</span>
              </th>

              {SHORT_HEADERS.map((header, i) => (
                <th key={i} className="group relative p-3 border-r border-white/5 align-bottom text-center">
                  <div className="text-[11px] font-bold text-white leading-tight cursor-help border-b border-dashed border-white/30 inline-block pb-1">
                    {header}
                  </div>

                  {/* Tooltip Hover Bubble */}
                  <div className={`absolute z-50 bottom-full mb-3 w-[260px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none 
                    ${i >= 4 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>
                    <div className="bg-[#1C1C22] border border-white/10 rounded-lg p-4 shadow-2xl text-left">
                      <h4 className="text-xs font-bold text-blue-400 mb-3 border-b border-white/10 pb-2">{FULL_DETAILS[i].title}</h4>
                      <ul className="space-y-1.5">
                        {FULL_DETAILS[i].items.map((item, j) => (
                          <li key={j} className="text-[10px] text-zinc-300 leading-snug break-words">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Arrow */}
                    <div className={`absolute top-full -mt-px border-4 border-transparent border-t-[#1C1C22] 
                      ${i >= 4 ? 'right-8' : 'left-1/2 -translate-x-1/2'}`}></div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => {
              if (row.section) {
                return (
                  <tr key={i} className="bg-[#121216] border-y border-white/5">
                    <td colSpan={8} className="px-4 py-2 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                      {row.section}
                    </td>
                  </tr>
                )
              }

              return (
                <tr key={i} className="border-b border-white/5 hover:bg-[#15151A] transition-colors group">
                  <td className="p-3 border-r border-white/5">
                    <span className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                      {row.name}
                    </span>
                  </td>
                  <td className="p-3 border-r border-white/5 text-center">
                    <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">
                      {row.date}
                    </span>
                  </td>
                  {row.checks?.map((check, j) => (
                    <td key={j} className="p-3 border-r border-white/5 text-center">
                      {check && (
                        <div className="flex justify-center">
                          <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>

      </div>
    </section>
  );
}

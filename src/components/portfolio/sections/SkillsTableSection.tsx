'use client';

import React from 'react';

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
  { name: 'Infrastructure système & réseaux', date: '03/25 - 04/25', checks: [true, false, false, false, false, false] },
  { section: 'Milieu professionnel (Première année)' },
  { name: 'Installation de postes', date: '-', checks: [false, false, false, false, false, false] },
  { name: 'Couverture wifi', date: '-', checks: [false, true, false, false, true, false] },
  { section: 'Milieu professionnel (Seconde année)' },
  { empty: true },
  { empty: true },
  { section: 'Réalisations transverses' },
  { name: 'Workshop C (Compte rendu)', date: '09/24', checks: [false, false, false, true, false, false] },
  { name: 'Bataille navale (Algo & PHP)', date: '10/24 - 11/24', checks: [false, false, false, false, false, false] },
  { name: 'Projet Base de Données (SQL)', date: '10/24 - 11/24', checks: [false, false, false, true, false, false] },
  { name: 'Open Innovation (Scan IA)', date: '11/24 - 25', checks: [false, false, false, true, false, false] },
  { name: 'Projet solution web', date: '11/24 - 01/25', checks: [true, false, true, true, false, true] },
  { name: '(Projet communication digitale)', date: '11/24 - 01/25', checks: [false, false, true, true, false, false] },
  { name: 'Projet Application Objet', date: '02/25 - 03/25', checks: [false, false, false, true, false, false] }
];

export default function SkillsTableSection() {
  return (
    <section id="tableau" className="relative scroll-mt-32">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Tableau de synthèse BTS SIO</h2>
        <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
          Survolez les titres des colonnes de compétences pour afficher le détail du référentiel académique.
        </p>
      </div>

      {/* Replaced overflow-hidden with overflow-visible so the absolute tooltips can break out of the container */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-visible shadow-2xl">
        
        {/* Table Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border-b border-white/10">
          <div className="bg-[#121216] p-3 text-xs flex flex-col justify-center">
            <span className="text-zinc-500 uppercase tracking-widest font-bold mb-1">Candidat</span>
            <span className="text-white font-semibold">JUNG Jean-Marie</span>
          </div>
          <div className="bg-[#121216] p-3 text-xs flex flex-col justify-center">
            <span className="text-zinc-500 uppercase tracking-widest font-bold mb-1">Centre / Option</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">EPSI</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">SISR</span>
            </div>
          </div>
          <div className="bg-[#121216] p-3 text-xs flex flex-col justify-center lg:col-span-2">
            <span className="text-zinc-500 uppercase tracking-widest font-bold mb-1">Portfolio</span>
            <span className="text-blue-400 font-mono">https://netcy-test.vercel.app/</span>
          </div>
        </div>

        {/* The Matrix */}
        <table className="w-full text-left border-collapse table-fixed">
          <colgroup>
            <col className="w-[35%]" />
            <col className="w-[11%]" />
            <col className="w-[9%]" />
            <col className="w-[9%]" />
            <col className="w-[9%]" />
            <col className="w-[9%]" />
            <col className="w-[9%]" />
            <col className="w-[9%]" />
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
              
              if (row.empty) {
                return (
                  <tr key={i} className="border-b border-white/5 h-8">
                    <td colSpan={8}></td>
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

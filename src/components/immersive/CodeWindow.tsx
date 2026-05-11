'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type Token = { t: string; c?: string };
type Line = { indent?: number; tokens: Token[] };
type Snippet = { file: string; lang: string; lines: Line[] };

const K = 'text-[#f472b6]';
const S = 'text-[#fcd34d]';
const F = 'text-[#60a5fa]';
const C = 'text-[#64748b] italic';
const T = 'text-[#f87171]';
const A = 'text-[#c4b5fd]';
const N = 'text-[#fb923c]';
const D = 'text-slate-200';

const SNIPPETS: Snippet[] = [
  {
    file: 'netcy.ts',
    lang: 'TypeScript',
    lines: [
      { tokens: [{ t: '// Agence web basée à Montpellier.', c: C }] },
      { tokens: [{ t: 'export const ', c: K }, { t: 'netcy ', c: F }, { t: '= {', c: D }] },
      { indent: 1, tokens: [{ t: 'nom: ', c: A }, { t: "'NETCY'", c: S }, { t: ',' }] },
      { indent: 1, tokens: [{ t: 'fondateur: ', c: A }, { t: "'Jean-Marie Jung'", c: S }, { t: ',' }] },
      { indent: 1, tokens: [{ t: 'metier: ', c: A }, { t: "'Sites web & cybersécurité'", c: S }, { t: ',' }] },
      { indent: 1, tokens: [{ t: 'ville: ', c: A }, { t: "'Montpellier'", c: S }, { t: ',' }] },
      { indent: 1, tokens: [{ t: 'annee: ', c: A }, { t: '2025', c: N }, { t: ',' }] },
      { tokens: [{ t: '};' }] },
    ],
  },
  {
    file: 'principes.ts',
    lang: 'TypeScript',
    lines: [
      { tokens: [{ t: '// Ce qui guide chaque ligne de code.', c: C }] },
      { tokens: [{ t: 'export const ', c: K }, { t: 'principes ', c: F }, { t: '= [', c: D }] },
      { indent: 1, tokens: [{ t: "'Sécurité dès la fondation'", c: S }, { t: ',' }] },
      { indent: 1, tokens: [{ t: "'Performance mesurable'", c: S }, { t: ',' }] },
      { indent: 1, tokens: [{ t: "'Design qui marque'", c: S }, { t: ',' }] },
      { indent: 1, tokens: [{ t: "'Code propre et maintenable'", c: S }, { t: ',' }] },
      { indent: 1, tokens: [{ t: "'Livraison au millimètre'", c: S }, { t: ',' }] },
      { tokens: [{ t: '];' }] },
    ],
  },
  {
    file: 'stack.ts',
    lang: 'TypeScript',
    lines: [
      { tokens: [{ t: '// Les outils que nous maîtrisons.', c: C }] },
      { tokens: [{ t: 'export const ', c: K }, { t: 'stack ', c: F }, { t: '= {', c: D }] },
      { indent: 1, tokens: [{ t: 'front: ', c: A }, { t: '[', c: D }, { t: "'Next.js'", c: S }, { t: ', ' }, { t: "'React'", c: S }, { t: ', ' }, { t: "'TypeScript'", c: S }, { t: '],' }] },
      { indent: 1, tokens: [{ t: 'style: ', c: A }, { t: '[', c: D }, { t: "'Tailwind'", c: S }, { t: ', ' }, { t: "'Motion'", c: S }, { t: ', ' }, { t: "'Three.js'", c: S }, { t: '],' }] },
      { indent: 1, tokens: [{ t: 'back: ', c: A }, { t: '[', c: D }, { t: "'Node.js'", c: S }, { t: ', ' }, { t: "'PHP'", c: S }, { t: ', ' }, { t: "'Supabase'", c: S }, { t: '],' }] },
      { indent: 1, tokens: [{ t: 'bdd: ', c: A }, { t: '[', c: D }, { t: "'PostgreSQL'", c: S }, { t: ', ' }, { t: "'MySQL'", c: S }, { t: '],' }] },
      { tokens: [{ t: '};' }] },
    ],
  },
];

function TokenSpan({ token }: { token: Token }) {
  return <span className={token.c ?? D}>{token.t}</span>;
}

export default function CodeWindow({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'hold' | 'erasing'>('typing');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snippet = SNIPPETS[snippetIdx];

  const lineText = useMemo(() => {
    return snippet.lines.map((l) => l.tokens.map((t) => t.t).join('').length);
  }, [snippet]);

  useEffect(() => {
    if (reduce) return;
    const clear = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    if (phase === 'typing') {
      const currentLineLen = lineText[lineIdx] ?? 0;
      if (charIdx < currentLineLen) {
        timeoutRef.current = setTimeout(() => setCharIdx((c) => c + 1), 22);
      } else if (lineIdx < snippet.lines.length - 1) {
        timeoutRef.current = setTimeout(() => {
          setLineIdx((l) => l + 1);
          setCharIdx(0);
        }, 120);
      } else {
        timeoutRef.current = setTimeout(() => setPhase('hold'), 1800);
      }
    } else if (phase === 'hold') {
      timeoutRef.current = setTimeout(() => setPhase('erasing'), 1400);
    } else if (phase === 'erasing') {
      if (lineIdx > 0 || charIdx > 0) {
        if (charIdx > 0) {
          timeoutRef.current = setTimeout(() => setCharIdx((c) => Math.max(0, c - 4)), 12);
        } else {
          timeoutRef.current = setTimeout(() => {
            setLineIdx((l) => l - 1);
            setCharIdx(lineText[lineIdx - 1] ?? 0);
          }, 40);
        }
      } else {
        setSnippetIdx((i) => (i + 1) % SNIPPETS.length);
        setPhase('typing');
        setLineIdx(0);
        setCharIdx(0);
      }
    }
    return clear;
  }, [phase, charIdx, lineIdx, snippet.lines.length, lineText, reduce]);

  const renderLine = (line: Line, i: number) => {
    const isCurrent = i === lineIdx;
    const isPast = i < lineIdx;
    if (!isCurrent && !isPast) return null;

    let remaining = isCurrent ? charIdx : Infinity;
    const rendered: React.ReactNode[] = [];
    for (let ti = 0; ti < line.tokens.length; ti++) {
      const tok = line.tokens[ti];
      if (remaining <= 0) break;
      const slice = tok.t.slice(0, remaining);
      rendered.push(<TokenSpan key={ti} token={{ ...tok, t: slice }} />);
      remaining -= tok.t.length;
    }

    return (
      <div key={i} className="flex whitespace-pre">
        <span className="w-8 select-none text-right pr-3 text-slate-600 tabular-nums">{i + 1}</span>
        <span style={{ paddingLeft: `${(line.indent ?? 0) * 1}rem` }}>
          {rendered}
          {isCurrent && <span className="inline-block w-[0.55ch] h-[1.1em] align-middle bg-[#d0bcff] ml-0.5 animate-pulse" />}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 ${className}`}
      style={{
        background: 'linear-gradient(145deg, #0b0b12 0%, #15151f 100%)',
      }}
      initial={{ opacity: 0, y: 24, rotateX: -6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -inset-24 opacity-60 blur-3xl"
           style={{ background: 'radial-gradient(circle at 30% 20%, #6F3FFF33, transparent 60%), radial-gradient(circle at 75% 85%, #0052FF33, transparent 55%)' }} />

      {/* Titlebar */}
      <div className="relative flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-pulse" />
            <span className="font-mono">{snippet.file}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-500">{snippet.lang}</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">netcy.fr</span>
      </div>

      {/* Code */}
      <div className="relative p-4 sm:p-5 min-h-[280px] sm:min-h-[340px] font-mono text-[13px] sm:text-sm leading-relaxed text-slate-200">
        {snippet.lines.map(renderLine)}
      </div>

      {/* Statusbar */}
      <div className="relative flex items-center justify-between px-4 py-2 border-t border-white/10 bg-black/30 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <span>Ln {lineIdx + 1}, Col {charIdx + 1}</span>
      </div>
    </motion.div>
  );
}

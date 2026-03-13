import React from 'react';

export default function SectionLabel({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xs font-mono font-bold text-indigo-400 tracking-widest">{num} —</span>
        <h2 className="text-xl font-bold text-slate-800 leading-tight tracking-tight">{children}</h2>
      </div>
      <div className="h-px bg-slate-200 w-full mt-2" />
    </div>
  );
}

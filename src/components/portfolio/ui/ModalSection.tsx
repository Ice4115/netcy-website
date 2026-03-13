import React from 'react';

export default function ModalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-indigo-300 font-semibold mb-3 text-xs uppercase tracking-widest border-b border-indigo-500/20 pb-2 mb-3">
        {title}
      </h4>
      {children}
    </div>
  );
}

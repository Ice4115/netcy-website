import React from 'react';

export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
      {children}
    </span>
  );
}

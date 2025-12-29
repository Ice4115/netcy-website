'use client';

import { useState, useEffect } from 'react';

interface DebugInfo {
  isMobile: boolean;
  component: 'desktop' | 'mobile' | 'unknown';
  touches: number;
  lastTouch: string;
  force: string;
}

export default function DebugOverlay({ enabled = true }: { enabled?: boolean }) {
  const [info, setInfo] = useState<DebugInfo>({
    isMobile: false,
    component: 'unknown',
    touches: 0,
    lastTouch: 'none',
    force: '0',
  });

  useEffect(() => {
    if (!enabled) return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     window.innerWidth <= 1024;

    setInfo(prev => ({ ...prev, isMobile }));

    // Listen to custom events from components
    const handleDebugUpdate = (e: CustomEvent) => {
      setInfo(prev => ({ ...prev, ...e.detail }));
    };

    window.addEventListener('debug-update' as any, handleDebugUpdate);

    return () => {
      window.removeEventListener('debug-update' as any, handleDebugUpdate);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#00ff00',
        padding: '10px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 9999,
        borderRadius: '5px',
        border: '2px solid #00ff00',
        minWidth: '200px',
      }}
    >
      <div style={{ marginBottom: '5px', fontWeight: 'bold', color: '#ffff00' }}>
        🐛 DEBUG MODE
      </div>
      <div>Device: {info.isMobile ? '📱 MOBILE' : '🖥️ DESKTOP'}</div>
      <div>Component: {info.component.toUpperCase()}</div>
      <div>Touches: {info.touches}</div>
      <div>Last Touch: {info.lastTouch}</div>
      <div>Force: {info.force}</div>
      <div style={{ marginTop: '5px', fontSize: '10px', color: '#888' }}>
        UA: {navigator.userAgent.substring(0, 30)}...
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const t = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(t);
  }, []);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a0000 0%, #2d0a0a 50%, #1a0000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          color: 'white',
          padding: '1rem',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          {/* Skull ASCII art */}
          <pre
            style={{
              fontSize: 'clamp(0.5rem, 2vw, 0.85rem)',
              color: '#FF4444',
              lineHeight: 1.3,
              margin: 0,
              opacity: 0.9,
            }}
          >
            {`
  ██████████████
 ████  ████  ████
██████████████████
██  ██████████  ██
██████████████████
 ████ ██████ ████
  ██████  ██████
    ████████████
      ████████
     ██ ████ ██
     ██      ██`}
          </pre>

          <h1
            style={{
              fontSize: 'clamp(4rem, 15vw, 8rem)',
              fontWeight: 900,
              margin: 0,
              background: 'linear-gradient(to right, #FF2200, #FF6600, #FF2200)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            OOPS
          </h1>

          <h2 style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)', margin: 0, color: '#FFAAAA' }}>
            Erreur critique — Le site a implosé
          </h2>

          <p style={{ color: '#AAA', lineHeight: 1.7, margin: 0, maxWidth: '480px' }}>
            On ne sait pas trop ce qui s'est passé. Le layout entier a planté, ce qui est assez
            fort niveau technique. Nos ingénieurs ont été réveillés à{' '}
            <span style={{ color: '#FF6600' }}>3h du matin</span> et ils n'ont pas l'air contents.
          </p>

          <div
            style={{
              background: 'rgba(255,0,0,0.1)',
              border: '1px solid rgba(255,0,0,0.3)',
              borderRadius: '12px',
              padding: '1rem',
              width: '100%',
              maxWidth: '480px',
              textAlign: 'left',
            }}
          >
            <p style={{ color: '#FF6644', margin: '0 0 0.5rem 0', fontSize: '0.75rem' }}>
              KERNEL PANIC — not syncing
            </p>
            <p style={{ color: '#888', margin: 0, fontSize: '0.75rem', wordBreak: 'break-word' }}>
              {`> sudo fix-everything`}
              <br />
              {`> bash: fix-everything: command not found`}
              <br />
              {`> sudo reboot${dots}`}
            </p>
            {error.digest && (
              <p style={{ color: '#555', margin: '0.5rem 0 0 0', fontSize: '0.65rem' }}>
                digest: {error.digest}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(to right, #FF2200, #FF6600)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              ↺ Tenter un reboot
            </button>
            <a
              href="/"
              style={{
                padding: '12px 28px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 700,
                fontSize: '15px',
                textDecoration: 'none',
                fontFamily: 'monospace',
              }}
            >
              ← Évacuer
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

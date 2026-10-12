'use client';

/**
 * MusicToggle — bouton discret d'activation du son.
 *
 * Règles tenues :
 *   · aucun son ne démarre tout seul (la lecture ne part que d'un clic) ;
 *   · si `music` vaut `null` dans le fichier de données, le bouton n'existe
 *     pas du tout et aucune balise <audio> n'est chargée ;
 *   · aucun morceau n'est fourni avec la page : c'est à toi de déposer un
 *     fichier dont tu possèdes les droits.
 */

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { music } from '@/data/nos-8-ans';

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  /* Coupe le son si l'onglet passe en arrière-plan. */
  useEffect(() => {
    if (!music) return;
    const onHide = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
        setPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, []);

  if (!music || failed) return null;

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    try {
      el.volume = 0.32;
      await el.play();
      setPlaying(true);
    } catch {
      // Lecture refusée ou fichier absent : on retire le bouton sans bruit.
      setFailed(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={music.src}
        loop
        preload="none"
        onError={() => setFailed(true)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Couper ${music.label}` : `Écouter ${music.label}`}
        title={playing ? 'Couper la musique' : 'Écouter la musique'}
        className="fixed bottom-5 right-5 z-[58] grid h-10 w-10 place-items-center rounded-full border border-[color:var(--r-sage)]/35 bg-[color:var(--r-ivory)]/75 text-[color:var(--r-forest)] backdrop-blur-md transition-all duration-300 hover:border-[color:var(--r-sage)] hover:bg-[color:var(--r-ivory)] sm:bottom-7 sm:right-7"
      >
        {playing ? (
          <Volume2 size={16} strokeWidth={1.6} />
        ) : (
          <VolumeX size={16} strokeWidth={1.6} />
        )}
      </button>
    </>
  );
}

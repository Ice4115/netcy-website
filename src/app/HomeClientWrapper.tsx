'use client';

// Rendu serveur activé : le HTML de toute la page arrive d'un coup,
// rien n'est chargé à la volée pendant le scroll.
import HomeClient from './HomeClient';

export default function HomeClientWrapper() {
  return <HomeClient />;
}

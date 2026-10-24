import { LogoNetcy } from '@/components/LogoNetcy';
import SiteLoaderController from './SiteLoaderController';

/*
 * Script exécuté pendant le parsing HTML, avant le premier affichage :
 * active le loader (classe `nl-loading` sur <html>). Sans JS, le loader reste caché.
 * Sécurité : si l'hydratation n'arrive jamais, le rideau se lève seul après 6 s.
 * Lors d'une navigation interne, React n'exécute pas ce script → pas de loader.
 */
const BOOT_SCRIPT = `(function(){try{var d=document.documentElement;d.classList.add('nl-loading');window.__nlFallback=setTimeout(function(){d.classList.add('nl-exit','nl-reveal');window.__nlReady=true;window.dispatchEvent(new Event('nl:ready'));setTimeout(function(){d.classList.remove('nl-loading','nl-exit','nl-reveal')},1600)},6000)}catch(e){}})();`;

/** Écran de chargement plein écran, à placer en tout premier dans la page. */
export default function SiteLoader({ images = [] }: { images?: string[] }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      <div id="nl-loader" aria-hidden="true">
        <div className="nl-loader-glow" />
        <div className="nl-loader-inner">
          <LogoNetcy className="nl-loader-logo" />
          <div className="nl-loader-bar">
            <span />
          </div>
          <p className="nl-loader-caption">Chargement</p>
        </div>
      </div>
      <SiteLoaderController images={images} />
    </>
  );
}

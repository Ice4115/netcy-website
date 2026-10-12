'use client';

/**
 * Finale — la lettre pour la suite.
 *
 * On revient à l'ambiance de l'ouverture : fond profond, lumière chaude, et
 * la rose blanche du bouquet qui réapparaît, seule. Les pétales tombent ici,
 * et seulement ici. La page se termine ensuite sur un long moment de calme :
 * aucun bouton, aucun lien vers les services de NETCY.
 */

import { finale } from '@/data/nos-8-ans';
import { Reveal, RevealWords } from './RevealText';
import WhiteRoseMark from './WhiteRoseMark';
import Petals from './Petals';

export default function Finale() {
  return (
    <section
      id="la-suite"
      data-tone="dark"
      aria-label={finale.title}
      className="relative overflow-hidden"
    >
      {/* Lumière chaude, reprise du bouquet d'ouverture. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(52% 40% at 50% 34%, rgba(255,233,206,0.14) 0%, rgba(255,233,206,0.04) 46%, rgba(13,36,29,0) 74%)',
        }}
      />

      <Petals />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-[14svh] pt-[22svh] text-center sm:pt-[26svh]">
        <Reveal y={14}>
          <p className="r-eyebrow text-[color:var(--r-blush)]/60">{finale.eyebrow}</p>
        </Reveal>

        {/* La rose blanche centrale, revenue seule. */}
        <Reveal y={20} delay={0.1} className="mt-8">
          <WhiteRoseMark size={132} withGlow withLeaves className="sm:w-[168px]" />
        </Reveal>

        <RevealWords
          as="h2"
          text={finale.title}
          className="r-serif mt-8 text-balance text-[2.1rem] leading-[1.06] text-[color:var(--r-ivory)] sm:text-[3.1rem] lg:text-[3.6rem]"
          stagger={0.07}
          amount={0.3}
        />

        <Reveal y={18} delay={0.12}>
          <p className="mx-auto mt-8 max-w-[48ch] text-[0.975rem] leading-[1.9] text-[color:var(--r-ivory)]/62 sm:text-[1.0625rem]">
            {finale.text}
          </p>
        </Reveal>

        <Reveal y={16} delay={0.2} className="mt-14 sm:mt-20">
          <span aria-hidden="true" className="mx-auto mb-8 block h-px w-14 bg-[color:var(--r-blush)]/30" />
          <p className="r-serif text-balance text-[1.6rem] leading-[1.3] text-[color:var(--r-blush)] sm:text-[2.2rem]">
            {finale.signature}
            <span className="ml-2 align-middle text-[color:var(--r-red)]" aria-hidden="true">
              ❤
            </span>
          </p>
        </Reveal>
      </div>

      {/* Le dernier silence. */}
      <div aria-hidden="true" className="relative h-[34svh]">
        <span className="absolute bottom-[14svh] left-1/2 block h-10 w-px -translate-x-1/2 bg-gradient-to-b from-[color:var(--r-blush)]/22 to-transparent" />
      </div>
    </section>
  );
}

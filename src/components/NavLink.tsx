'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { usePageVisibility } from './PageVisibilityProvider';

type NavLinkProps = ComponentProps<typeof Link> & {
  /**
   * Si true, conserve le texte (rendu dans un <span>) au lieu de masquer
   * entièrement le lien quand la page cible est désactivée. À utiliser pour
   * les liens insérés dans une phrase (consentement, contenu) afin de ne pas
   * casser la grammaire. Par défaut le lien disparaît complètement.
   */
  keepText?: boolean;
};

/**
 * Lien interne « intelligent » : se masque automatiquement (rendu `null`)
 * dès que la page cible a été désactivée depuis l'espace admin.
 *
 * Remplace `next/link` pour tout lien (navbar, footer, contenu) pointant vers
 * une page désactivable. Les ancres (#...) et liens externes ne sont jamais
 * affectés.
 */
export default function NavLink({ keepText, children, className, ...props }: NavLinkProps) {
  const { isPathEnabled } = usePageVisibility();
  const href = typeof props.href === 'string' ? props.href : '';

  if (href && !isPathEnabled(href)) {
    if (keepText) return <span className={className}>{children}</span>;
    return null;
  }

  return (
    <Link className={className} {...props}>
      {children}
    </Link>
  );
}

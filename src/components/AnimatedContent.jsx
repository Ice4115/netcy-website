'use client';

import { useRef, useEffect, useState } from 'react';

// Équivalents CSS des easings GSAP utilisés auparavant.
const EASINGS = {
  'power3.out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'power2.out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'power1.out': 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  'power3.in': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
};

/**
 * Apparition au scroll (translation + fondu).
 * IntersectionObserver + transition CSS : animation gérée par le GPU, aucune librairie
 * et aucune boucle requestAnimationFrame permanente (contrairement à GSAP ScrollTrigger).
 */
const AnimatedContent = ({
  children,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete = undefined,
  className = '',
  style = undefined,
  ...props
}) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      // Équivalent du `start: top ${(1 - threshold) * 100}%` de ScrollTrigger.
      { rootMargin: `0px 0px -${Math.round(threshold * 100)}% 0px`, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const offset = reverse ? -distance : distance;
  const translate = direction === 'horizontal' ? `translate3d(${offset}px,0,0)` : `translate3d(0,${offset}px,0)`;
  const hiddenTransform = scale !== 1 ? `${translate} scale(${scale})` : translate;
  const easing = EASINGS[ease] || ease;

  return (
    <div
      ref={ref}
      className={className}
      onTransitionEnd={shown && onComplete ? (e) => e.target === ref.current && onComplete() : undefined}
      style={{
        opacity: shown || !animateOpacity ? 1 : initialOpacity,
        transform: shown ? 'none' : hiddenTransform,
        transition: `opacity ${duration}s ${easing} ${delay}s, transform ${duration}s ${easing} ${delay}s`,
        willChange: shown ? undefined : 'transform, opacity',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedContent;

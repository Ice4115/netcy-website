import { useEffect, useCallback } from 'react';

const noise = (n = 1) => n / 2 - Math.random() * n;

const createParticleFromBorder = (width, height, colors = [1, 2, 3, 1, 2, 3, 1, 4]) => {
  const perimeter = 2 * (width + height);
  const randomPoint = Math.random() * perimeter;
  let x, y;

  if (randomPoint < width) {
    x = randomPoint;
    y = 0;
  } else if (randomPoint < width + height) {
    x = width;
    y = randomPoint - width;
  } else if (randomPoint < 2 * width + height) {
    x = width - (randomPoint - width - height);
    y = height;
  } else {
    x = 0;
    y = height - (randomPoint - 2 * width - height);
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  const endDistance = distance + 80 + noise(40);
  const endX = centerX + Math.cos(angle) * endDistance;
  const endY = centerY + Math.sin(angle) * endDistance;

  return {
    start: [x, y],
    end: [endX, endY],
    time: 600 * 2 + noise(300 * 2),
    scale: 1 + noise(0.2),
    color: colors[Math.floor(Math.random() * colors.length)],
    rotate: noise(100 / 10) > 0 ? (noise(100 / 10) + 100 / 20) * 10 : (noise(100 / 10) - 100 / 20) * 10
  };
};

export const triggerGooeyEffect = (element, options = {}) => {
  if (!element) return;

  const {
    colors = [1, 2, 3, 1, 2, 3, 1, 4],
    particleCount = 20,
    animationTime = 600,
    timeVariance = 300
  } = options;

  const rect = element.getBoundingClientRect();
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: ${rect.left}px;
    top: ${rect.top}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(container);

  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      const p = createParticleFromBorder(rect.width, rect.height, colors);
      const particle = document.createElement('span');
      const point = document.createElement('span');
      
      particle.style.cssText = `
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 1;
      `;
      
      point.style.cssText = `
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 100%;
        background: ${
          p.color === 1 ? '#6F3FFF' :
          p.color === 2 ? '#7A8FFF' :
          p.color === 3 ? '#8FA5FF' :
          '#4A2FFF'
        };
        opacity: 1;
      `;
      
      particle.appendChild(point);
      container.appendChild(particle);

      const startTime = performance.now();
      const duration = p.time;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const x = p.start[0] + (p.end[0] - p.start[0]) * progress - 10;
        const y = p.start[1] + (p.end[1] - p.start[1]) * progress - 10;
        const rotate = (p.rotate * progress);
        const scale = progress < 0.7 ? 1 : Math.max(0, 1 - (progress - 0.7) / 0.3);

        particle.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`;
        point.style.opacity = progress < 0.85 ? 1 : Math.max(0, 1 - (progress - 0.85) / 0.15);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          try {
            container.removeChild(particle);
          } catch (e) {}
        }
      };

      requestAnimationFrame(animate);
    }, 30 + i * 20);
  }

  setTimeout(() => {
    if (container.parentNode) {
      try {
        container.parentNode.removeChild(container);
      } catch (e) {}
    }
  }, animationTime * 2 + timeVariance + 1000);
};

export const useGooeyEffect = () => {
  const initGooeyLinks = useCallback((options) => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        triggerGooeyEffect(target, options);
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }, []);
  return initGooeyLinks;
};

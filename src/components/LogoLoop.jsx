import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import './LogoLoop.css';

const TooltipWrapper = ({ children, title }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      setShowTooltip(!showTooltip);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowTooltip(false);
    }
  };

  return (
    <div 
      className="tooltip-container"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {showTooltip && title && (
        <div 
          className="tooltip-box"
          style={{
            position: 'absolute',
            bottom: '120%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1a0f3a',
            color: '#A5B4FF',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            border: '1px solid #6F3FFF',
            boxShadow: '0 4px 12px rgba(111, 63, 255, 0.3)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          {title}
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #6F3FFF'
            }}
          />
        </div>
      )}
    </div>
  );
};

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }
    const observers = elements.map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });
    callback();
    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, [callback, elements, dependencies]);
};

const useImageLoader = (seqRef, onLoad, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];
    if (images.length === 0) {
      onLoad();
      return;
    }
    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) onLoad();
    };
    images.forEach(img => {
      const htmlImg = img;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true });
        htmlImg.addEventListener('error', handleImageLoad, { once: true });
      }
    });
    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
  }, [onLoad, seqRef, dependencies]);
};

const useAnimationLoop = (trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, isDragging, dragOffsetRef) => {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const momentumVelocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      const transformValue = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
      track.style.transform = transformValue;
    }

    const animate = timestamp => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (isDragging) {
        if (seqSize > 0 && dragOffsetRef.current !== null) {
          offsetRef.current = dragOffsetRef.current;
          const transformValue = isVertical
            ? `translate3d(0, ${-offsetRef.current}px, 0)`
            : `translate3d(${-offsetRef.current}px, 0, 0)`;
          track.style.transform = transformValue;
        }
      } else {
        let target = targetVelocity;
        if (momentumVelocityRef.current !== 0) {
          target = momentumVelocityRef.current;
          momentumVelocityRef.current *= 0.95;
          if (Math.abs(momentumVelocityRef.current) < 1) {
            momentumVelocityRef.current = 0;
          }
        } else if (isHovered && hoverSpeed !== undefined) {
          target = hoverSpeed;
        }

        const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
        velocityRef.current += (target - velocityRef.current) * easingFactor;

        if (seqSize > 0) {
          let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
          nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
          offsetRef.current = nextOffset;

          const transformValue = isVertical
            ? `translate3d(0, ${-offsetRef.current}px, 0)`
            : `translate3d(${-offsetRef.current}px, 0, 0)`;
          track.style.transform = transformValue;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef, isDragging, dragOffsetRef]);

  return { offsetRef, momentumVelocityRef };
};

export const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    pauseOnHover,
    hoverSpeed,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    renderItem,
    ariaLabel = 'Partner logos',
    className,
    style
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [seqHeight, setSeqHeight] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0, offset: 0, time: 0 });
    const dragOffsetRef = useRef(null);
    const dragHistoryRef = useRef([]);

    const effectiveHoverSpeed = useMemo(() => {
      if (hoverSpeed !== undefined) return hoverSpeed;
      if (pauseOnHover === true) return 0;
      if (pauseOnHover === false) return undefined;
      return 0;
    }, [hoverSpeed, pauseOnHover]);

    const isVertical = direction === 'up' || direction === 'down';

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      let directionMultiplier;
      if (isVertical) {
        directionMultiplier = direction === 'up' ? 1 : -1;
      } else {
        directionMultiplier = direction === 'left' ? 1 : -1;
      }
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction, isVertical]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceRect = seqRef.current?.getBoundingClientRect?.();
      const sequenceWidth = sequenceRect?.width ?? 0;
      const sequenceHeight = sequenceRect?.height ?? 0;
      if (isVertical) {
        const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
        if (containerRef.current && parentHeight > 0) {
          const targetHeight = Math.ceil(parentHeight);
          if (containerRef.current.style.height !== `${targetHeight}px`)
            containerRef.current.style.height = `${targetHeight}px`;
        }
        if (sequenceHeight > 0) {
          setSeqHeight(Math.ceil(sequenceHeight));
          const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
          const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
          setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
        }
      } else if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, [isVertical]);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);

    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);

    const { offsetRef, momentumVelocityRef } = useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical, isDragging, dragOffsetRef);

    const handleDragStart = useCallback((clientX, clientY) => {
      setIsDragging(true);
      const now = Date.now();
      dragStartRef.current = { x: clientX, y: clientY, offset: offsetRef.current, time: now };
      dragHistoryRef.current = [{ x: clientX, y: clientY, time: now }];
      dragOffsetRef.current = offsetRef.current;
    }, [offsetRef]);

    const handleDragMove = useCallback((clientX, clientY) => {
      if (!isDragging) return;
      const delta = isVertical ? (clientY - dragStartRef.current.y) : (clientX - dragStartRef.current.x);
      const seqSize = isVertical ? seqHeight : seqWidth;
      if (seqSize > 0) {
        let newOffset = dragStartRef.current.offset - delta;
        newOffset = ((newOffset % seqSize) + seqSize) % seqSize;
        dragOffsetRef.current = newOffset;
      }
      const now = Date.now();
      dragHistoryRef.current.push({ x: clientX, y: clientY, time: now });
      if (dragHistoryRef.current.length > 5) {
        dragHistoryRef.current.shift();
      }
    }, [isDragging, isVertical, seqWidth, seqHeight]);

    const handleDragEnd = useCallback(() => {
      const now = Date.now();
      const recentHistory = dragHistoryRef.current.filter(h => now - h.time < 100);
      
      if (recentHistory.length >= 2) {
        const first = recentHistory[0];
        const last = recentHistory[recentHistory.length - 1];
        const timeDelta = Math.max(16, last.time - first.time);
        const delta = isVertical ? (last.y - first.y) : (last.x - first.x);
        const velocity = -(delta / timeDelta) * 1000;
        
        if (Math.abs(velocity) > 50) {
          momentumVelocityRef.current = Math.max(-3000, Math.min(3000, velocity));
        }
      }
      
      setIsDragging(false);
      dragOffsetRef.current = null;
      dragHistoryRef.current = [];
    }, [isVertical, momentumVelocityRef]);

    useEffect(() => {
      const track = trackRef.current;
      if (!track) return;

      let hasMoved = false;

      const handleMouseDown = (e) => {
        hasMoved = false;
        handleDragStart(e.clientX, e.clientY);
      };

      const handleMouseMove = (e) => {
        if (isDragging) {
          hasMoved = true;
          handleDragMove(e.clientX, e.clientY);
        }
      };

      const handleMouseUp = () => {
        handleDragEnd();
      };

      const handleClick = (e) => {
        if (hasMoved) {
          e.preventDefault();
          e.stopPropagation();
        }
        hasMoved = false;
      };

      const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
          hasMoved = false;
          handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      const handleTouchMove = (e) => {
        if (e.touches.length === 1) {
          hasMoved = true;
          handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
          e.preventDefault();
        }
      };

      const handleTouchEnd = () => {
        handleDragEnd();
      };

      track.addEventListener('mousedown', handleMouseDown, { passive: true });
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', handleMouseUp, { passive: true });
      track.addEventListener('click', handleClick, { capture: true });
      track.addEventListener('touchstart', handleTouchStart, { passive: true });
      track.addEventListener('touchmove', handleTouchMove, { passive: false });
      track.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        track.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        track.removeEventListener('click', handleClick);
        track.removeEventListener('touchstart', handleTouchStart);
        track.removeEventListener('touchmove', handleTouchMove);
        track.removeEventListener('touchend', handleTouchEnd);
      };
    }, [handleDragStart, handleDragMove, handleDragEnd, trackRef, isDragging]);

    const cssVariables = useMemo(
      () => ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
      }),
      [gap, logoHeight, fadeOutColor]
    );

    const rootClassName = useMemo(
      () =>
        [
          'logoloop',
          isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
          fadeOut && 'logoloop--fade',
          scaleOnHover && 'logoloop--scale-hover',
          className
        ]
          .filter(Boolean)
          .join(' '),
      [isVertical, fadeOut, scaleOnHover, className]
    );

    const handleMouseEnter = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(true);
    }, [effectiveHoverSpeed]);
    const handleMouseLeave = useCallback(() => {
      if (effectiveHoverSpeed !== undefined) setIsHovered(false);
    }, [effectiveHoverSpeed]);

    const renderLogoItem = useCallback(
      (item, key) => {
        if (renderItem) {
          return (
            <li className="logoloop__item" key={key} role="listitem">
              {renderItem(item, key)}
            </li>
          );
        }
        const isNodeItem = 'node' in item;
        const content = isNodeItem ? (
          <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
            {item.node}
          </span>
        ) : (
          <img
            src={item.src}
            srcSet={item.srcSet}
            sizes={item.sizes}
            width={item.width}
            height={item.height}
            alt={item.alt ?? ''}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        );
        const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title);
        const wrappedContent = (
          <TooltipWrapper title={item.title}>
            {content}
          </TooltipWrapper>
        );
        const itemContent = item.href ? (
          <a
            className="logoloop__link"
            href={item.href}
            aria-label={itemAriaLabel || 'logo link'}
            target="_blank"
            rel="noreferrer noopener"
          >
            {wrappedContent}
          </a>
        ) : (
          wrappedContent
        );
        const itemStyle = item.height ? { '--item-height': `${item.height}px` } : undefined;
        return (
          <li className="logoloop__item" key={key} role="listitem" style={itemStyle}>
            {itemContent}
          </li>
        );
      },
      [renderItem]
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="logoloop__list"
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    const containerStyle = useMemo(
      () => ({
        width: isVertical
          ? toCssLength(width) === '100%'
            ? undefined
            : toCssLength(width)
          : (toCssLength(width) ?? '100%'),
        ...cssVariables,
        ...style
      }),
      [width, cssVariables, style, isVertical]
    );

    return (
      <div ref={containerRef} className={rootClassName} style={containerStyle} role="region" aria-label={ariaLabel}>
        <div className="logoloop__track" ref={trackRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;

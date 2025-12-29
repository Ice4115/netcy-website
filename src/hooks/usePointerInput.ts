import { useEffect, useRef, useCallback } from 'react';

export interface PointerState {
  coords: { x: number; y: number };
  coordsOld: { x: number; y: number };
  diff: { x: number; y: number };
  velocity: { x: number; y: number };
  isActive: boolean;
  pointerCount: number;
}

interface UsePointerInputOptions {
  inertia?: number;
  amplification?: number;
  onPointerChange?: (state: PointerState) => void;
}

export const usePointerInput = (
  containerRef: React.RefObject<HTMLElement | null>,
  options: UsePointerInputOptions = {}
) => {
  const { inertia = 0.90, amplification = 12.0, onPointerChange } = options;

  const stateRef = useRef<PointerState>({
    coords: { x: 0, y: 0 },
    coordsOld: { x: 0, y: 0 },
    diff: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    isActive: false,
    pointerCount: 0,
  });

  const activePointers = useRef<Map<number, PointerEvent>>(new Map());

  const normalizeCoords = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;
    
    return {
      x: nx * 2 - 1,
      y: -(ny * 2 - 1),
    };
  }, [containerRef]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    console.log('👆 PointerDown:', e.clientX, e.clientY, '| Type:', e.pointerType);
    e.preventDefault();
    e.stopPropagation();

    activePointers.current.set(e.pointerId, e);
    const state = stateRef.current;
    
    state.isActive = true;
    state.pointerCount = activePointers.current.size;

    if (activePointers.current.size === 1) {
      const normalized = normalizeCoords(e.clientX, e.clientY);
      state.coords = normalized;
      state.coordsOld = { ...normalized };
      console.log('📍 Normalized coords:', normalized.x.toFixed(2), normalized.y.toFixed(2));
      
      // Debug event
      window.dispatchEvent(new CustomEvent('debug-update', { 
        detail: { 
          touches: activePointers.current.size,
          lastTouch: `${e.clientX},${e.clientY}`,
        } 
      }));
    }

    onPointerChange?.(state);
  }, [normalizeCoords, onPointerChange]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!activePointers.current.has(e.pointerId)) return;
    
    activePointers.current.set(e.pointerId, e);
    const state = stateRef.current;

    if (activePointers.current.size === 1) {
      const normalized = normalizeCoords(e.clientX, e.clientY);
      state.coords = normalized;
    } else if (activePointers.current.size === 2) {
      console.log('✌️ Two fingers detected');
      const pointers = Array.from(activePointers.current.values());
      const cx = (pointers[0].clientX + pointers[1].clientX) * 0.5;
      const cy = (pointers[0].clientY + pointers[1].clientY) * 0.5;
      state.coords = normalizeCoords(cx, cy);

      const dx = pointers[0].clientX - pointers[1].clientX;
      const dy = pointers[0].clientY - pointers[1].clientY;
      state.velocity.x += -dy * 0.003;
      state.velocity.y += dx * 0.003;
    }

    onPointerChange?.(state);
  }, [normalizeCoords, onPointerChange]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    e.preventDefault();
    
    activePointers.current.delete(e.pointerId);
    const state = stateRef.current;
    
    state.pointerCount = activePointers.current.size;
    state.isActive = activePointers.current.size > 0;

    onPointerChange?.(state);
  }, [onPointerChange]);

  const update = useCallback(() => {
    const state = stateRef.current;
    
    const rawDiffX = state.coords.x - state.coordsOld.x;
    const rawDiffY = state.coords.y - state.coordsOld.y;
    
    state.coordsOld = { ...state.coords };

    if (state.isActive) {
      const amplifiedDiffX = rawDiffX * amplification;
      const amplifiedDiffY = rawDiffY * amplification;
      
      state.velocity.x += amplifiedDiffX;
      state.velocity.y += amplifiedDiffY;
      state.velocity.x *= 0.80;
      state.velocity.y *= 0.80;
      
      state.diff.x = amplifiedDiffX;
      state.diff.y = amplifiedDiffY;
      
      if (Math.abs(amplifiedDiffX) > 0.001 || Math.abs(amplifiedDiffY) > 0.001) {
        console.log('🔥 Diff amplified:', amplifiedDiffX.toFixed(3), amplifiedDiffY.toFixed(3));
        
        // Debug event
        window.dispatchEvent(new CustomEvent('debug-update', { 
          detail: { 
            force: `${amplifiedDiffX.toFixed(2)}, ${amplifiedDiffY.toFixed(2)}`,
          } 
        }));
      }
    } else {
      state.velocity.x *= inertia;
      state.velocity.y *= inertia;
      state.diff.x = state.velocity.x;
      state.diff.y = state.velocity.y;
    }

    return state;
  }, [amplification, inertia]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.error('❌ usePointerInput: container is null');
      return;
    }

    console.log('✅ usePointerInput: Attaching pointer event listeners');

    container.addEventListener('pointerdown', handlePointerDown as any, { passive: false });
    container.addEventListener('pointermove', handlePointerMove as any, { passive: false });
    container.addEventListener('pointerup', handlePointerUp as any);
    container.addEventListener('pointercancel', handlePointerUp as any);
    container.addEventListener('pointerleave', handlePointerUp as any);

    console.log('🎯 Pointer events attached to:', container.className);

    return () => {
      console.log('🧹 Cleaning up pointer events');
      container.removeEventListener('pointerdown', handlePointerDown as any);
      container.removeEventListener('pointermove', handlePointerMove as any);
      container.removeEventListener('pointerup', handlePointerUp as any);
      container.removeEventListener('pointercancel', handlePointerUp as any);
      container.removeEventListener('pointerleave', handlePointerUp as any);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  return {
    state: stateRef.current,
    update,
    reset: useCallback(() => {
      activePointers.current.clear();
      stateRef.current = {
        coords: { x: 0, y: 0 },
        coordsOld: { x: 0, y: 0 },
        diff: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        isActive: false,
        pointerCount: 0,
      };
    }, []),
  };
};

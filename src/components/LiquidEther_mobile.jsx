'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LiquidEther.mobile.css';

export default function LiquidEther({
  mouseForce = 28,
  cursorSize = 140,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 16,
  iterationsPoisson = 16,
  dt = 0.014,
  BFECC = true,
  resolution = 0.35,
  isBounce = true,
  colors = ['#3F12F3', '#4670D2', '#5670A4'],
  style = {},
  className = '',
  autoDemo = false
}) {
  const mountRef = useRef(null);
  const webglRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    /* =====================================================
       COMMON (inchangé)
    ===================================================== */
    class CommonClass {
      constructor() {
        this.width = 0;
        this.height = 0;
        this.pixelRatio = 1;
        this.renderer = null;
        this.clock = null;
      }
      init(container) {
        this.container = container;
        this.pixelRatio = 1;
        this.resize();
        this.renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance'
        });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setSize(this.width, this.height);
        container.appendChild(this.renderer.domElement);
        this.clock = new THREE.Clock();
      }
      resize() {
        const r = this.container.getBoundingClientRect();
        this.width = Math.max(1, r.width);
        this.height = Math.max(1, r.height);
        if (this.renderer) this.renderer.setSize(this.width, this.height, false);
      }
      update() {
        this.delta = this.clock.getDelta();
      }
    }

    const Common = new CommonClass();

    /* =====================================================
       MOUSE → VERSION MOBILE AVEC INERTIE + MULTI-TOUCH
    ===================================================== */
    class MouseClass {
      constructor() {
        this.coords = new THREE.Vector2();
        this.coords_old = new THREE.Vector2();
        this.diff = new THREE.Vector2();

        this.velocity = new THREE.Vector2();
        this.inertia = 0.88;

        this.container = null;
        this.touches = [];
        this.onInteract = null;

        this._start = this.onTouchStart.bind(this);
        this._move = this.onTouchMove.bind(this);
        this._end = this.onTouchEnd.bind(this);
      }

      init(container) {
        this.container = container;
        container.addEventListener('touchstart', this._start, { passive: false });
        container.addEventListener('touchmove', this._move, { passive: false });
        container.addEventListener('touchend', this._end);
        container.addEventListener('touchcancel', this._end);
      }

      dispose() {
        this.container.removeEventListener('touchstart', this._start);
        this.container.removeEventListener('touchmove', this._move);
        this.container.removeEventListener('touchend', this._end);
        this.container.removeEventListener('touchcancel', this._end);
      }

      setFromTouch(t) {
        const r = this.container.getBoundingClientRect();
        const nx = (t.clientX - r.left) / r.width;
        const ny = (t.clientY - r.top) / r.height;
        this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
      }

      onTouchStart(e) {
        e.preventDefault();
        this.touches = [...e.touches];
        if (this.onInteract) this.onInteract();
        this.setFromTouch(this.touches[0]);
        this.coords_old.copy(this.coords);
      }

      onTouchMove(e) {
        e.preventDefault();
        this.touches = [...e.touches];

        /* ===== 1 doigt : déplacement normal ===== */
        if (this.touches.length === 1) {
          this.setFromTouch(this.touches[0]);
        }

        /* ===== 2 doigts : vortex 🌪️ ===== */
        if (this.touches.length === 2) {
          const a = this.touches[0];
          const b = this.touches[1];
          const cx = (a.clientX + b.clientX) * 0.5;
          const cy = (a.clientY + b.clientY) * 0.5;
          this.setFromTouch({ clientX: cx, clientY: cy });

          const dx = a.clientX - b.clientX;
          const dy = a.clientY - b.clientY;
          this.velocity.x += -dy * 0.0006;
          this.velocity.y += dx * 0.0006;
        }
      }

      onTouchEnd() {
        this.touches = [];
      }

      update() {
        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);

        this.velocity.add(this.diff);
        this.velocity.multiplyScalar(this.inertia);
        this.diff.copy(this.velocity);
      }
    }

    const Mouse = new MouseClass();

    /* =====================================================
       SIMULATION + RENDER (IDENTIQUE À TON CODE)
       ⚠️ POUR GARDER LE MESSAGE LISIBLE :
       ➜ RIEN N’A ÉTÉ MODIFIÉ ICI
    ===================================================== */

    // 👉 ICI tu gardes EXACTEMENT :
    // Simulation
    // Shaders
    // Output
    // WebGLManager
    // (strictement identiques à ta version PC)

    /* ===================================================== */

    Common.init(mountRef.current);
    Mouse.init(mountRef.current);

    // ⚠️ pour déclencher la simulation
    Mouse.onInteract = () => {};

    const animate = () => {
      Mouse.update();
      Common.update();
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      Mouse.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`liquid-ether-container ${className}`}
      style={style}
    />
  );
}

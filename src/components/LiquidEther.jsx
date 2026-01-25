import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6
}) {
  const mountRef = useRef(null);
  const webglRef = useRef(null);
  const rafRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const intersectionObserverRef = useRef(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Detect mobile
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const adaptedMouseForce = isMobile ? mouseForce * 4 : mouseForce;
    const adaptedCursorSize = isMobile ? cursorSize * 2.5 : cursorSize;

    function makePaletteTexture(stops) {
      let arr = stops && stops.length > 0 ? (stops.length === 1 ? [stops[0], stops[0]] : stops) : ['#ffffff', '#ffffff'];
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i * 4 + 0] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    // Common class for renderer
    class CommonClass {
      constructor() {
        this.width = 0;
        this.height = 0;
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.renderer = null;
        this.clock = null;
        this.container = null;
        this.time = 0;
        this.delta = 0;
      }
      init(container) {
        this.container = container;
        this.renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
        this.renderer.setPixelRatio(this.pixelRatio);
        this.resize();
        container.appendChild(this.renderer.domElement);
        this.clock = new THREE.Clock();
        this.clock.start();
      }
      resize() {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.renderer.setSize(this.width, this.height);
      }
      update() {
        this.delta = this.clock.getDelta();
        this.time += this.delta;
      }
    }

    const Common = new CommonClass();

    // Minimal mouse handler
    class MouseClass {
      constructor() {
        this.coords = new THREE.Vector2(0, 0);
        this.coords_old = new THREE.Vector2(0, 0);
        this.diff = new THREE.Vector2(0, 0);
        this.mouseMoved = false;
      }
      setCoords(x, y) {
        const rect = mountRef.current.getBoundingClientRect();
        const nx = (x - rect.left) / rect.width;
        const ny = (y - rect.top) / rect.height;
        this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);
      }
    }

    const Mouse = new MouseClass();

    // Setup simple output mesh
    class Output {
      constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        this.output = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.RawShaderMaterial({
            vertexShader: `
              precision highp float;
              attribute vec3 position;
              void main(){ gl_Position = vec4(position,1.0); }`,
            fragmentShader: `
              precision highp float;
              uniform vec3 color;
              void main(){ gl_FragColor = vec4(color,1.0); }`,
            uniforms: { color: { value: new THREE.Color(colors[0]) } },
            transparent: true
          })
        );
        this.scene.add(this.output);
      }
      render() {
        Common.renderer.render(this.scene, this.camera);
      }
    }

    const OutputInstance = new Output();
    Common.init(mountRef.current);

    const animate = () => {
      Common.update();
      OutputInstance.render();
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (Common.renderer && mountRef.current) {
        mountRef.current.removeChild(Common.renderer.domElement);
        Common.renderer.dispose();
      }
    };
  }, [colors, mouseForce, cursorSize, isViscous, viscous]);

  return <div ref={mountRef} className={`liquid-ether-container ${className || ''}`} style={{ width: '100%', height: '100%', ...style }} />;
}

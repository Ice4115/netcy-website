'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { usePointerInput } from '@/hooks/usePointerInput';
import './LiquidEther.css';

interface LiquidEtherMobileProps {
  colors?: string[];
  mouseForce?: number;
  cursorSize?: number;
  resolution?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function LiquidEtherMobile({
  colors = ['#6F3FFF', '#7A8FFF', '#8FA5FF', '#4A2FFF'],
  mouseForce = 80,
  cursorSize = 250,
  resolution = 0.35,
  className = '',
  style = {},
}: LiquidEtherMobileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number | null>(null);
  const simulationRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const pointerInput = usePointerInput(containerRef, {
    inertia: 0.90,
    amplification: 12.0,
  });

  const checkWebGLSupport = useCallback((): boolean => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      console.error('WebGL not supported:', e);
      return false;
    }
  }, []);

  const createPaletteTexture = useCallback((stops: string[]): THREE.DataTexture => {
    const arr = stops.length > 0 ? stops : ['#ffffff'];
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
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!checkWebGLSupport()) {
      console.warn('WebGL not supported, showing fallback');
      return;
    }

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(1);
    renderer.setSize(width, height);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';
    
    container.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;
    rendererRef.current = renderer;

    const paletteTex = createPaletteTexture(colors);

    const precision = 'mediump';

    const faceVert = `
      attribute vec3 position;
      uniform vec2 px;
      uniform vec2 boundarySpace;
      varying vec2 uv;
      precision ${precision} float;
      void main() {
        vec3 pos = position;
        vec2 scale = 1.0 - boundarySpace * 2.0;
        pos.xy = pos.xy * scale;
        uv = vec2(0.5) + (pos.xy) * 0.5;
        gl_Position = vec4(pos, 1.0);
      }
    `;

    const mouseVert = `
      precision ${precision} float;
      attribute vec3 position;
      attribute vec2 uv;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main() {
        vec2 pos = position.xy * scale * 2.0 * px + center;
        vUv = uv;
        gl_Position = vec4(pos, 0.0, 1.0);
      }
    `;

    const advectionFrag = `
      precision ${precision} float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform bool isBFECC;
      uniform vec2 fboSize;
      uniform vec2 px;
      varying vec2 uv;
      void main() {
        vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
        vec2 vel = texture2D(velocity, uv).xy;
        vec2 uv2 = uv - vel * dt * ratio;
        vec2 newVel = texture2D(velocity, uv2).xy;
        gl_FragColor = vec4(newVel, 0.0, 0.0);
      }
    `;

    const externalForceFrag = `
      precision ${precision} float;
      uniform vec2 force;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main() {
        vec2 circle = (vUv - 0.5) * 2.0;
        float d = 1.0 - min(length(circle), 1.0);
        d *= d;
        gl_FragColor = vec4(force * d, 0.0, 1.0);
      }
    `;

    const divergenceFrag = `
      precision ${precision} float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 px;
      varying vec2 uv;
      void main() {
        float x0 = texture2D(velocity, uv - vec2(px.x, 0.0)).x;
        float x1 = texture2D(velocity, uv + vec2(px.x, 0.0)).x;
        float y0 = texture2D(velocity, uv - vec2(0.0, px.y)).y;
        float y1 = texture2D(velocity, uv + vec2(0.0, px.y)).y;
        float divergence = (x1 - x0 + y1 - y0) / 2.0;
        gl_FragColor = vec4(divergence / dt);
      }
    `;

    const poissonFrag = `
      precision ${precision} float;
      uniform sampler2D pressure;
      uniform sampler2D divergence;
      uniform vec2 px;
      varying vec2 uv;
      void main() {
        float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
        float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
        float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
        float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
        float div = texture2D(divergence, uv).r;
        float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
        gl_FragColor = vec4(newP);
      }
    `;

    const pressureFrag = `
      precision ${precision} float;
      uniform sampler2D pressure;
      uniform sampler2D velocity;
      uniform vec2 px;
      uniform float dt;
      varying vec2 uv;
      void main() {
        float step = 1.0;
        float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
        float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
        float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
        float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
        vec2 v = texture2D(velocity, uv).xy;
        vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
        v = v - gradP * dt;
        gl_FragColor = vec4(v, 0.0, 1.0);
      }
    `;

    const colorFrag = `
      precision ${precision} float;
      uniform sampler2D velocity;
      uniform sampler2D palette;
      uniform vec4 bgColor;
      varying vec2 uv;
      void main() {
        vec2 vel = texture2D(velocity, uv).xy;
        float lenv = clamp(length(vel), 0.0, 1.0);
        vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
        vec3 outRGB = mix(bgColor.rgb, c, lenv);
        float outA = mix(bgColor.a, 1.0, lenv);
        gl_FragColor = vec4(outRGB, outA);
      }
    `;

    const simWidth = Math.max(1, Math.round(resolution * width));
    const simHeight = Math.max(1, Math.round(resolution * height));
    const cellScaleX = 1.0 / simWidth;
    const cellScaleY = 1.0 / simHeight;

    const fboOpts: THREE.RenderTargetOptions = {
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
    };

    const vel0 = new THREE.WebGLRenderTarget(simWidth, simHeight, fboOpts);
    const vel1 = new THREE.WebGLRenderTarget(simWidth, simHeight, fboOpts);
    const div = new THREE.WebGLRenderTarget(simWidth, simHeight, fboOpts);
    const pressure0 = new THREE.WebGLRenderTarget(simWidth, simHeight, fboOpts);
    const pressure1 = new THREE.WebGLRenderTarget(simWidth, simHeight, fboOpts);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const planeGeometry = new THREE.PlaneGeometry(2, 2);

    const advectionMat = new THREE.RawShaderMaterial({
      vertexShader: faceVert,
      fragmentShader: advectionFrag,
      uniforms: {
        boundarySpace: { value: new THREE.Vector2(0, 0) },
        px: { value: new THREE.Vector2(cellScaleX, cellScaleY) },
        fboSize: { value: new THREE.Vector2(simWidth, simHeight) },
        velocity: { value: vel0.texture },
        dt: { value: 0.014 },
        isBFECC: { value: true },
      },
    });
    const advectionMesh = new THREE.Mesh(planeGeometry, advectionMat);

    const forceMat = new THREE.RawShaderMaterial({
      vertexShader: mouseVert,
      fragmentShader: externalForceFrag,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        px: { value: new THREE.Vector2(cellScaleX, cellScaleY) },
        force: { value: new THREE.Vector2(0, 0) },
        center: { value: new THREE.Vector2(0, 0) },
        scale: { value: new THREE.Vector2(cursorSize, cursorSize) },
      },
    });
    const forceMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), forceMat);

    const divMat = new THREE.RawShaderMaterial({
      vertexShader: faceVert,
      fragmentShader: divergenceFrag,
      uniforms: {
        boundarySpace: { value: new THREE.Vector2(0, 0) },
        velocity: { value: vel1.texture },
        px: { value: new THREE.Vector2(cellScaleX, cellScaleY) },
        dt: { value: 0.014 },
      },
    });
    const divMesh = new THREE.Mesh(planeGeometry, divMat);

    const poissonMat = new THREE.RawShaderMaterial({
      vertexShader: faceVert,
      fragmentShader: poissonFrag,
      uniforms: {
        boundarySpace: { value: new THREE.Vector2(0, 0) },
        pressure: { value: pressure0.texture },
        divergence: { value: div.texture },
        px: { value: new THREE.Vector2(cellScaleX, cellScaleY) },
      },
    });
    const poissonMesh = new THREE.Mesh(planeGeometry, poissonMat);

    const pressureMat = new THREE.RawShaderMaterial({
      vertexShader: faceVert,
      fragmentShader: pressureFrag,
      uniforms: {
        boundarySpace: { value: new THREE.Vector2(0, 0) },
        pressure: { value: pressure0.texture },
        velocity: { value: vel1.texture },
        px: { value: new THREE.Vector2(cellScaleX, cellScaleY) },
        dt: { value: 0.014 },
      },
    });
    const pressureMesh = new THREE.Mesh(planeGeometry, pressureMat);

    const outputScene = new THREE.Scene();
    const outputMat = new THREE.RawShaderMaterial({
      vertexShader: faceVert,
      fragmentShader: colorFrag,
      transparent: true,
      depthWrite: false,
      uniforms: {
        velocity: { value: vel0.texture },
        boundarySpace: { value: new THREE.Vector2() },
        palette: { value: paletteTex },
        bgColor: { value: new THREE.Vector4(0, 0, 0, 0) },
      },
    });
    const outputMesh = new THREE.Mesh(planeGeometry, outputMat);
    outputScene.add(outputMesh);

    let lastTime = performance.now();

    const animate = () => {
      if (isPaused || !isVisible) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = performance.now();
      const deltaTime = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const state = pointerInput.update();

      const forceX = state.diff.x * mouseForce;
      const forceY = state.diff.y * mouseForce;

      scene.clear();
      scene.add(advectionMesh);
      renderer.setRenderTarget(vel1);
      renderer.render(scene, camera);

      scene.clear();
      scene.add(forceMesh);
      forceMat.uniforms.force.value.set(forceX, forceY);
      forceMat.uniforms.center.value.set(state.coords.x, state.coords.y);
      renderer.setRenderTarget(vel1);
      renderer.render(scene, camera);

      scene.clear();
      scene.add(divMesh);
      renderer.setRenderTarget(div);
      renderer.render(scene, camera);

      let pIn = pressure0;
      let pOut = pressure1;
      scene.clear();
      scene.add(poissonMesh);
      for (let i = 0; i < 16; i++) {
        poissonMat.uniforms.pressure.value = pIn.texture;
        renderer.setRenderTarget(pOut);
        renderer.render(scene, camera);
        [pIn, pOut] = [pOut, pIn];
      }

      scene.clear();
      scene.add(pressureMesh);
      pressureMat.uniforms.pressure.value = pIn.texture;
      renderer.setRenderTarget(vel0);
      renderer.render(scene, camera);

      renderer.setRenderTarget(null);
      renderer.render(outputScene, camera);

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      
      const sw = Math.max(1, Math.round(resolution * w));
      const sh = Math.max(1, Math.round(resolution * h));
      const csx = 1.0 / sw;
      const csy = 1.0 / sh;
      
      vel0.setSize(sw, sh);
      vel1.setSize(sw, sh);
      div.setSize(sw, sh);
      pressure0.setSize(sw, sh);
      pressure1.setSize(sw, sh);
      
      advectionMat.uniforms.px.value.set(csx, csy);
      advectionMat.uniforms.fboSize.value.set(sw, sh);
      forceMat.uniforms.px.value.set(csx, csy);
      divMat.uniforms.px.value.set(csx, csy);
      poissonMat.uniforms.px.value.set(csx, csy);
      pressureMat.uniforms.px.value.set(csx, csy);
    };

    window.addEventListener('resize', handleResize);

    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
      renderer.dispose();
      vel0.dispose();
      vel1.dispose();
      div.dispose();
      pressure0.dispose();
      pressure1.dispose();
      paletteTex.dispose();
      planeGeometry.dispose();
      advectionMat.dispose();
      forceMat.dispose();
      divMat.dispose();
      poissonMat.dispose();
      pressureMat.dispose();
      outputMat.dispose();
    };
  }, [colors, mouseForce, cursorSize, resolution, createPaletteTexture, checkWebGLSupport, pointerInput, isPaused, isVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`liquid-ether-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        touchAction: 'none',
        overscrollBehavior: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        ...style,
      }}
    />
  );
}

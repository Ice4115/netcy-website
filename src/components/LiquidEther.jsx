'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function LiquidEther({
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  mouseForce = 20,
  cursorSize = 100,
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  autoResumeDelay = 1000,
  resolution = 0.5,
  style = {},
  className = ''
}) {
  const mountRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    const isMobile =
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    )

    mountRef.current.appendChild(renderer.domElement)

    /* Palette texture */
    function makePaletteTexture(cols) {
      const data = new Uint8Array(cols.length * 4)

      cols.forEach((hex, i) => {
        const c = new THREE.Color(hex)
        data[i * 4] = Math.round(c.r * 255)
        data[i * 4 + 1] = Math.round(c.g * 255)
        data[i * 4 + 2] = Math.round(c.b * 255)
        data[i * 4 + 3] = 255
      })

      const tex = new THREE.DataTexture(
        data,
        cols.length,
        1,
        THREE.RGBAFormat
      )
      tex.magFilter = THREE.LinearFilter
      tex.minFilter = THREE.LinearFilter
      tex.needsUpdate = true
      return tex
    }

    const paletteTex = makePaletteTexture(colors)

    /* Scene */
    const scene = new THREE.Scene()
    const camera = new THREE.Camera()

    const material = new THREE.RawShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        palette: { value: paletteTex },
        time: { value: 0 },
        intensity: { value: autoIntensity }
      },
      vertexShader: `
        precision highp float;
        attribute vec3 position;
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D palette;
        uniform float time;
        uniform float intensity;

        void main() {
          vec2 uv = gl_FragCoord.xy / 1000.0;
          float v =
            sin(uv.x * 10.0 + time) *
            cos(uv.y * 10.0 + time);

          v = v * 0.5 + 0.5;
          vec3 col = texture2D(palette, vec2(v, 0.5)).rgb;
          gl_FragColor = vec4(col, v * intensity);
        }
      `
    })

    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      material
    )

    scene.add(quad)

    const clock = new THREE.Clock()

    const animate = () => {
      material.uniforms.time.value += clock.getDelta()
      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    const resize = () => {
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      )
    }

    window.addEventListener('resize', resize)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      mountRef.current.removeChild(renderer.domElement)
    }
  }, [colors, autoIntensity])

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    />
  )
}

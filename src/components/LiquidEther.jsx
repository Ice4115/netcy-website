import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './LiquidEther.css'

export default function LiquidEther({
  style = {},
  className = '',
  colors,
  mouseForce,
  cursorSize,
  autoDemo,
  autoSpeed,
  autoIntensity,
  autoResumeDelay,
  resolution
}) {
  const mountRef = useRef(null)
  const webglRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    /* ----------------------------------
       1. Détection mobile / iOS
    ---------------------------------- */
    const isMobile =
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    const isIOS =
      /iPad|iPhone|iPod/i.test(navigator.userAgent)

    /* ----------------------------------
       2. Réglages SAFE par plateforme
    ---------------------------------- */
    const SETTINGS = {
      colors: colors || ['#5227FF', '#FF9FFC', '#B19EEF'],

      // Qualité
      resolution: resolution !== undefined ? resolution : (isMobile ? 0.3 : 0.5),
      dt: 0.016,

      // Simulation
      mouseForce: mouseForce !== undefined ? mouseForce : (isMobile ? 10 : 20),
      cursorSize: cursorSize !== undefined ? cursorSize : (isMobile ? 70 : 100),

      // Physique
      isViscous: !isMobile,
      viscous: isMobile ? 12 : 30,
      iterationsViscous: isMobile ? 6 : 32,
      iterationsPoisson: isMobile ? 12 : 32,

      // Qualité avancée
      BFECC: !isMobile,
      isBounce: false,

      // Auto demo
      autoDemo: autoDemo !== undefined ? autoDemo : !isMobile,
      autoSpeed: autoSpeed !== undefined ? autoSpeed : 0.5,
      autoIntensity: autoIntensity !== undefined ? autoIntensity : 2.2,
      autoResumeDelay: autoResumeDelay !== undefined ? autoResumeDelay : 1000
    }

    /* ----------------------------------
       3. Palette texture (mobile safe)
    ---------------------------------- */
    function makePaletteTexture(colors) {
      const data = new Uint8Array(colors.length * 4)
      colors.forEach((hex, i) => {
        const c = new THREE.Color(hex)
        data[i * 4] = c.r * 255
        data[i * 4 + 1] = c.g * 255
        data[i * 4 + 2] = c.b * 255
        data[i * 4 + 3] = 255
      })
      const tex = new THREE.DataTexture(
        data,
        colors.length,
        1,
        THREE.RGBAFormat
      )
      tex.magFilter = THREE.LinearFilter
      tex.minFilter = THREE.LinearFilter
      tex.needsUpdate = true
      return tex
    }

    const paletteTex = makePaletteTexture(SETTINGS.colors)

    /* ----------------------------------
       4. Renderer
    ---------------------------------- */
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

    /* ----------------------------------
       5. Gestion iOS WebGL crash
    ---------------------------------- */
    renderer.domElement.addEventListener(
      'webglcontextlost',
      e => {
        e.preventDefault()
        cancelAnimationFrame(rafRef.current)
      },
      false
    )

    renderer.domElement.addEventListener(
      'webglcontextrestored',
      () => {
        animate()
      },
      false
    )

    /* ----------------------------------
       6. Scene simple (output final)
       ⚠️ Ici tu branches TA simulation
    ---------------------------------- */
    const scene = new THREE.Scene()
    const camera = new THREE.Camera()

    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.RawShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          palette: { value: paletteTex },
          time: { value: 0 }
        },
        vertexShader: `
          precision highp float;
          attribute vec3 position;
          void main(){
            gl_Position = vec4(position,1.0);
          }
        `,
        fragmentShader: `
          precision highp float;
          uniform sampler2D palette;
          uniform float time;
          void main(){
            float v = sin(time + gl_FragCoord.x*0.01) * 0.5 + 0.5;
            vec3 c = texture2D(palette, vec2(v,0.5)).rgb;
            gl_FragColor = vec4(c, v);
          }
        `
      })
    )

    scene.add(quad)

    /* ----------------------------------
       7. Loop
    ---------------------------------- */
    function animate(t = 0) {
      quad.material.uniforms.time.value = t * 0.001
      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    /* ----------------------------------
       8. Resize
    ---------------------------------- */
    const resize = () => {
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      )
    }

    window.addEventListener('resize', resize)

    /* ----------------------------------
       9. Cleanup
    ---------------------------------- */
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      mountRef.current.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={`liquid-ether-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style
      }}
    />
  )
}

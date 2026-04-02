import { useEffect, useRef } from 'react'
import Parallax from 'parallax-js'
import rinImg from './assets/rin.jpg'
import './App.css'

// Deterministic ember/spark particles
const SPARKS = Array.from({ length: 90 }, (_, i) => ({
  cx: Math.round((i * 137.508) % 1920),
  cy: Math.round((i * 97.333) % 1080),
  r: +(0.6 + (i % 5) * 0.55).toFixed(1),
  opacity: +(0.12 + (i % 8) * 0.08).toFixed(2),
}))

// Magic circle SVG component — pentagram-in-ring design
// outerClass spins the outer ring+ticks; innerClass counter-spins the pentagram
function MagicCircle({ r, stroke = '#ff8844', strokeWidth = 1.8, outerClass = '', innerClass = '' }) {
  const star = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2
    return `${(r * 0.66 * Math.cos(a)).toFixed(2)},${(r * 0.66 * Math.sin(a)).toFixed(2)}`
  }).join(' ')

  const ticks = Array.from({ length: 32 }, (_, i) => {
    const a = (i * Math.PI * 2) / 32
    const long = i % 4 === 0
    const r1 = r * (long ? 0.86 : 0.9)
    const r2 = r * 0.97
    return (
      <line
        key={i}
        x1={(Math.cos(a) * r1).toFixed(2)} y1={(Math.sin(a) * r1).toFixed(2)}
        x2={(Math.cos(a) * r2).toFixed(2)} y2={(Math.sin(a) * r2).toFixed(2)}
        strokeWidth={long ? strokeWidth * 1.4 : strokeWidth * 0.7}
      />
    )
  })

  return (
    <g fill="none" stroke={stroke} strokeWidth={strokeWidth}>
      {/* Outer ring + ticks — rotates CW */}
      <g className={outerClass}>
        <circle r={r} />
        <circle r={r * 0.82} strokeWidth={strokeWidth * 0.5} />
        {ticks}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI * 2) / 8
          return (
            <line
              key={i}
              x1={(Math.cos(a) * r * 0.66).toFixed(2)} y1={(Math.sin(a) * r * 0.66).toFixed(2)}
              x2={(Math.cos(a) * r * 0.82).toFixed(2)} y2={(Math.sin(a) * r * 0.82).toFixed(2)}
              strokeWidth={strokeWidth * 0.6}
            />
          )
        })}
      </g>
      {/* Inner pentagram — counter-rotates CCW */}
      <g className={innerClass}>
        <circle r={r * 0.66} strokeWidth={strokeWidth * 0.8} />
        <circle r={r * 0.22} />
        <polygon points={star} />
      </g>
    </g>
  )
}

// SVG-space centres + influence radius for each circle (same order as circleRefs)
const CIRCLE_DATA = [
  { x: 310,  y: 260, r: 295 },
  { x: 1580, y: 840, r: 210 },
  { x: 1430, y: 195, r: 170 },
  { x: 1650, y: 200, r: 95  },
]

export default function App() {
  const sceneRef      = useRef(null)
  const circleRefs    = useRef([])
  const circleIntensity = useRef([0, 0, 0, 0])

  // Fire glow: cursor proximity → per-circle RGB drop-shadow
  useEffect(() => {
    const mouse = { x: -9999, y: -9999 }
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', onMove)

    let raf
    const tick = () => {
      const svgX = (mouse.x / window.innerWidth)  * 1920
      const svgY = (mouse.y / window.innerHeight) * 1080

      CIRCLE_DATA.forEach(({ x, y, r }, i) => {
        const el = circleRefs.current[i]
        if (!el) return

        const dist   = Math.hypot(svgX - x, svgY - y)
        const target = Math.max(0, 1 - dist / (r + 520))
        // Smooth lerp toward target intensity
        const cur  = circleIntensity.current[i]
        const next = cur + (target - cur) * 0.09
        circleIntensity.current[i] = next

        if (next < 0.015) {
          el.style.filter = ''
          return
        }

        const t  = next
        const t2 = t * t
        // Fire palette: deep red → orange → amber → white-yellow at peak
        const g      = Math.round(t2 * 210)
        const b      = Math.round(t2 * t * 55)
        const gInner = Math.min(255, g + 90)
        const blur1  = (16 + t * 75).toFixed(0)
        const blur2  = (t * 55).toFixed(0)
        const blur3  = (t * t * 28).toFixed(0)
        const a1     = (0.50 + t * 0.50).toFixed(2)
        const a2     = (t * 0.70).toFixed(2)
        const a3     = (t2 * 0.55).toFixed(2)

        el.style.filter = [
          `drop-shadow(0 0 ${blur1}px rgba(255,${g},${b},${a1}))`,
          `drop-shadow(0 0 ${blur2}px rgba(255,${gInner},0,${a2}))`,
          `drop-shadow(0 0 ${blur3}px rgba(255,235,120,${a3}))`,
        ].join(' ')
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!sceneRef.current) return
    const parallax = new Parallax(sceneRef.current, {
      scalarX: 12,
      scalarY: 8,
      frictionX: 0.08,
      frictionY: 0.08,
    })
    return () => parallax.destroy()
  }, [])

  return (
    <div className="page">
      <ul ref={sceneRef} className="scene">

        {/* Layer 0 — Rin Tohsaka wallpaper */}
        <li data-depth="0.0" className="layer">
          <div className="rin-bg" style={{ backgroundImage: `url(${rinImg})` }} />
        </li>

        {/* Layer 1 — Crimson atmospheric glow */}
        <li data-depth="0.12" className="layer">
          <div className="atmos" />
        </li>

        {/* Layer 2 — Floating ember sparks */}
        <li data-depth="0.28" className="layer">
          <svg className="lsvg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {SPARKS.map((s, i) => (
              <circle
                key={i}
                className="ember"
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill="#ff5522"
                opacity={s.opacity}
                style={{
                  animationDelay: `${((i * 0.23) % 4).toFixed(2)}s`,
                  animationDuration: `${(2.4 + (i % 7) * 0.38).toFixed(1)}s`,
                }}
              />
            ))}
          </svg>
        </li>

        {/* Layer 3 — Large back magic circles */}
        <li data-depth="0.42" className="layer">
          <svg className="lsvg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g ref={el => { circleRefs.current[0] = el }} transform="translate(310,260)" className="circle-wrap circle-pulse-a">
              <MagicCircle r={295} outerClass="spin-cw-slow" innerClass="spin-ccw-slow" />
            </g>
            <g ref={el => { circleRefs.current[1] = el }} transform="translate(1580,840)" className="circle-wrap circle-pulse-b">
              <MagicCircle r={210} stroke="#ff9955" outerClass="spin-ccw-slow" innerClass="spin-cw-med" />
            </g>
          </svg>
        </li>

        {/* Layer 4 — Mid magic circle (top-right) */}
        <li data-depth="0.62" className="layer">
          <svg className="lsvg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g ref={el => { circleRefs.current[2] = el }} transform="translate(1430,195)" className="circle-wrap circle-pulse-c">
              <MagicCircle r={170} stroke="#ffaa44" strokeWidth={1.6} outerClass="spin-cw-med" innerClass="spin-ccw-fast" />
            </g>
          </svg>
        </li>

        {/* Layer 5 — Near foreground magic circle + glow pool */}
        <li data-depth="0.85" className="layer">
          <div className="ground-glow" />
          <svg className="lsvg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g ref={el => { circleRefs.current[3] = el }} transform="translate(1650,200)" className="circle-wrap circle-pulse-d">
              <MagicCircle r={95} stroke="#ffcc66" strokeWidth={1.5} outerClass="spin-ccw-fast" innerClass="spin-cw-fast" />
            </g>
          </svg>
        </li>

      </ul>

      {/* Vignette frame — doesn't move */}
      <div className="vignette" aria-hidden="true" />

      {/* Title overlay — above the scene, doesn't move */}
      <div className="overlay">
        <p className="overlay__eyebrow">Fate / Stay Night</p>
        <h1 className="overlay__title">Rin Tohsaka</h1>
        <p className="overlay__subtitle">Move your cursor — feel the magic</p>
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import Parallax from 'parallax-js'
import './App.css'

// Deterministic star field via golden-angle spiral
const STARS = Array.from({ length: 220 }, (_, i) => ({
  cx: Math.round((i * 137.508) % 1920),
  cy: Math.round((i * 97.333) % 680),
  r: +(0.4 + (i % 5) * 0.38).toFixed(1),
  opacity: +(0.3 + (i % 9) * 0.076).toFixed(2),
}))

// Pine-tree silhouette path — deterministic, built from sin/cos waves
function buildTreePath() {
  const parts = []
  const baseY = 835
  let x = -40
  while (x < 1960) {
    const h = 100 + Math.sin(x * 0.038) * 58 + Math.cos(x * 0.022) * 38
    const w = 46 + Math.sin(x * 0.075) * 13
    const tx = x + w / 2
    const ty = baseY - h
    parts.push(`M${x.toFixed(0)},${baseY} L${(x + w).toFixed(0)},${baseY} L${tx.toFixed(0)},${ty.toFixed(0)} Z`)
    x += w * 0.6
  }
  parts.push(`M0,${baseY} L1920,${baseY} L1920,1080 L0,1080 Z`)
  return parts.join(' ')
}

const TREE_PATH = buildTreePath()

export default function App() {
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!sceneRef.current) return
    const parallax = new Parallax(sceneRef.current, {
      scalarX: 14,
      scalarY: 10,
      frictionX: 0.07,
      frictionY: 0.07,
    })
    return () => parallax.destroy()
  }, [])

  return (
    <div className="page">
      <ul ref={sceneRef} className="scene">

        {/* Layer 0 — Night sky */}
        <li data-depth="0.0" className="layer">
          <div className="sky" />
        </li>

        {/* Layer 1 — Stars */}
        <li data-depth="0.1" className="layer">
          <svg className="lsvg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {STARS.map((s, i) => (
              <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.opacity} />
            ))}
          </svg>
        </li>

        {/* Layer 2 — Moon */}
        <li data-depth="0.18" className="layer">
          <div className="moon-wrap">
            <div className="moon" />
          </div>
        </li>

        {/* Layer 3 — Far mountains */}
        <li data-depth="0.28" className="layer">
          <svg className="lsvg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="gFar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#201050" />
                <stop offset="100%" stopColor="#0b071e" />
              </linearGradient>
            </defs>
            <polygon fill="url(#gFar)"
              points="0,1080 0,545 140,395 275,458 415,272 545,368 675,188 808,328 952,152 1068,294 1198,168 1342,314 1492,214 1652,358 1795,238 1920,325 1920,1080"
            />
          </svg>
        </li>

        {/* Layer 4 — Near mountains */}
        <li data-depth="0.5" className="layer">
          <svg className="lsvg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
              <linearGradient id="gNear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0e0820" />
                <stop offset="100%" stopColor="#040210" />
              </linearGradient>
            </defs>
            <polygon fill="url(#gNear)"
              points="0,1080 0,648 195,515 375,588 548,435 715,518 882,378 1032,475 1185,412 1362,538 1522,440 1695,565 1848,475 1920,535 1920,1080"
            />
          </svg>
        </li>

        {/* Layer 5 — Pine tree silhouette */}
        <li data-depth="0.75" className="layer">
          <svg className="lsvg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path fill="#03020b" d={TREE_PATH} />
          </svg>
        </li>

        {/* Layer 6 — Ground fog */}
        <li data-depth="0.88" className="layer">
          <div className="fog" />
        </li>

        {/* Layer 7 — Foreground ground */}
        <li data-depth="1.0" className="layer">
          <div className="ground" />
        </li>

      </ul>

      {/* Vignette frame — doesn't move */}
      <div className="vignette" aria-hidden="true" />

      {/* Title — above the scene, doesn't move */}
      <div className="overlay">
        <p className="overlay__eyebrow">parallax · depth · motion</p>
        <h1 className="overlay__title">Into the Night</h1>
        <p className="overlay__subtitle">Move your cursor — feel the depth</p>
      </div>
    </div>
  )
}

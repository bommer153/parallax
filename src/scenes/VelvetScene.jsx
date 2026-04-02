import { useEffect, useRef } from 'react'
import Parallax from 'parallax-js'
import { Flame, Zap, Skull, Swords, Wind } from 'lucide-react'
import velvetImg from '../assets/velvet.jpg'
import '../App.css'
import './VelvetScene.css'

// Deterministic ash + ember particles — larger & brighter
const ASHES = Array.from({ length: 90 }, (_, i) => ({
  cx: Math.round((i * 137.508) % 1920),
  cy: Math.round((i * 97.333) % 1080),
  r: +(1.4 + (i % 6) * 0.80).toFixed(1),
  opacity: +(0.42 + (i % 7) * 0.07).toFixed(2),
  isEmber: i % 4 === 0,
}))

// Floating Lucide icon positions for the beast atmosphere
const VELVET_ICONS = [
  { Icon: Flame,  x: '4%',  y: '52%', size: 40, color: '#ff7722', dur: '1.6s' },
  { Icon: Zap,    x: '16%', y: '22%', size: 30, color: '#ffaa33', dur: '2.0s' },
  { Icon: Flame,  x: '10%', y: '72%', size: 28, color: '#ff5511', dur: '1.8s' },
  { Icon: Swords, x: '32%', y: '15%', size: 26, color: '#ff8844', dur: '3.2s' },
  { Icon: Skull,  x: '46%', y: '62%', size: 24, color: '#dd3300', dur: '3.8s' },
  { Icon: Wind,   x: '60%', y: '20%', size: 26, color: '#ffbb55', dur: '2.6s' },
  { Icon: Flame,  x: '78%', y: '38%', size: 32, color: '#ff6600', dur: '1.5s' },
  { Icon: Zap,    x: '86%', y: '60%', size: 24, color: '#ffaa44', dur: '2.2s' },
  { Icon: Swords, x: '68%', y: '74%', size: 20, color: '#ff7733', dur: '2.9s' },
  { Icon: Wind,   x: '24%', y: '84%', size: 18, color: '#ff9944', dur: '3.4s' },
]

// Beast claw scratch marks — bright scarlet, clearly visible
function ClawMark({ cx, cy, angle, count = 3, length = 180, spread = 20, color = '#ff5533', opacity = 0.75 }) {
  return (
    <g
      transform={`rotate(${angle}, ${cx}, ${cy})`}
      stroke={color}
      strokeLinecap="round"
      opacity={opacity}
      fill="none"
    >
      {Array.from({ length: count }, (_, i) => {
        const offset = (i - (count - 1) / 2) * spread
        return (
          <line
            key={i}
            x1={cx + offset} y1={cy}
            x2={cx + offset} y2={cy - length}
            strokeWidth={(2.4 - i * 0.3).toFixed(1)}
          />
        )
      })}
    </g>
  )
}

// Organic upward flame wisp using bezier curves
function FlameWisp({ x, h, w = 40, color = '#dd4400', className = '', style = {} }) {
  const baseY = 1110
  const d = [
    `M ${x - w},${baseY}`,
    `C ${x - w},${baseY - h * 0.35} ${x - w * 0.28},${baseY - h * 0.68} ${x},${baseY - h}`,
    `C ${x + w * 0.28},${baseY - h * 0.68} ${x + w},${baseY - h * 0.35} ${x + w},${baseY}`,
    'Z',
  ].join(' ')
  return <path d={d} fill={color} className={className} style={style} />
}

// Flame positions along the bottom — brighter
const FLAME_DATA = [
  { x: 160,  h: 270, w: 58,  color: '#ff5500' },
  { x: 380,  h: 350, w: 78,  color: '#ff6600' },
  { x: 610,  h: 210, w: 48,  color: '#ee4400' },
  { x: 870,  h: 410, w: 88,  color: '#ff7700' },
  { x: 1120, h: 300, w: 68,  color: '#ff6600' },
  { x: 1360, h: 250, w: 54,  color: '#ff5500' },
  { x: 1590, h: 330, w: 72,  color: '#ff8800' },
  { x: 1800, h: 185, w: 44,  color: '#ee5500' },
]

export default function VelvetScene() {
  const sceneRef       = useRef(null)
  const flameRefs      = useRef([])
  const flameIntensity = useRef(FLAME_DATA.map(() => 0))

  // Cursor proximity → per-flame fire glow
  useEffect(() => {
    const mouse = { x: -9999, y: -9999 }
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', onMove)

    let raf
    const tick = () => {
      const svgX = (mouse.x / window.innerWidth)  * 1920
      const svgY = (mouse.y / window.innerHeight) * 1080

      FLAME_DATA.forEach(({ x, h }, i) => {
        const el = flameRefs.current[i]
        if (!el) return

        // proximity to mid-point of flame
        const flameCY = 1080 - h / 2
        const dist    = Math.hypot(svgX - x, svgY - flameCY)
        const target  = Math.max(0, 1 - dist / 680)
        const cur     = flameIntensity.current[i]
        const next    = cur + (target - cur) * 0.08
        flameIntensity.current[i] = next

        const t  = next
        const t2 = t * t
        // Beast fire: dark blood red → fierce orange (no yellow-white — rawer than Rin)
        const g     = Math.round(t2 * 175)
        const blur1 = (18 + t * 65).toFixed(0)
        const blur2 = (t * 42).toFixed(0)
        const a1    = (0.45 + t * 0.55).toFixed(2)
        const a2    = (t * 0.70).toFixed(2)

        el.style.filter = [
          `drop-shadow(0 -${blur1}px ${blur1}px rgba(255,${g},0,${a1}))`,
          `drop-shadow(0 0 ${blur2}px rgba(255,${Math.min(255, g + 70)},20,${a2}))`,
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

        {/* Layer 0 — Velvet Crowe wallpaper */}
        <li data-depth="0.0" className="layer">
          <div className="velvet-bg" style={{ backgroundImage: `url(${velvetImg})` }} />
        </li>

        {/* Layer 1 — Dark smoke atmosphere */}
        <li data-depth="0.12" className="layer">
          <div className="smoke-atmos" />
        </li>

        {/* Layer 2 — Ash + ember particles */}
        <li data-depth="0.25" className="layer">
          <svg className="lsvg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {ASHES.map((s, i) => (
              <circle
                key={i}
                className="ash"
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill={s.isEmber ? '#ffbb44' : '#ccaa88'}
                opacity={s.opacity}
                style={{
                  animationDelay: `${((i * 0.19) % 4).toFixed(2)}s`,
                  animationDuration: `${(2.8 + (i % 8) * 0.42).toFixed(1)}s`,
                }}
              />
            ))}
          </svg>
        </li>

        {/* Layer 2b — Floating Lucide beast icons */}
        <li data-depth="0.32" className="layer">
          <div className="icon-scatter">
            {VELVET_ICONS.map((ic, i) => (
              <span
                key={i}
                className="icon-float"
                style={{ left: ic.x, top: ic.y, '--dur': ic.dur, '--delay': `${(i * 0.28).toFixed(2)}s`, '--glow': ic.color }}
              >
                <ic.Icon size={ic.size} color={ic.color} strokeWidth={1.4} />
              </span>
            ))}
          </div>
        </li>

        {/* Layer 3 — Beast claw marks */}
        <li data-depth="0.40" className="layer">
          <svg className="lsvg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <ClawMark cx={200}  cy={350} angle={50}  count={4} length={210} spread={18} opacity={0.80} />
            <ClawMark cx={1640} cy={520} angle={125} count={3} length={165} spread={22} color="#ff6644" opacity={0.70} />
            <ClawMark cx={940}  cy={800} angle={48}  count={5} length={245} spread={16} color="#ff5533" opacity={0.62} />
            <ClawMark cx={480}  cy={680} angle={135} count={3} length={130} spread={20} color="#ff4422" opacity={0.55} />
          </svg>
        </li>

        {/* Layer 4 — Rising beast flames */}
        <li data-depth="0.65" className="layer">
          <svg className="lsvg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {FLAME_DATA.map((f, i) => (
              <g
                key={i}
                ref={el => { flameRefs.current[i] = el }}
                style={{ filter: 'drop-shadow(0 -10px 12px rgba(200,50,0,0.42))' }}
              >
                {/* outer flame body */}
                <FlameWisp
                  x={f.x} h={f.h} w={f.w}
                  color={f.color}
                  className="flame-outer"
                  style={{ animationDelay: `${((i * 0.17) % 0.9).toFixed(2)}s` }}
                />
                {/* inner bright core */}
                <FlameWisp
                  x={f.x} h={f.h * 0.58} w={f.w * 0.42}
                  color="#ffcc55"
                  className="flame-inner"
                  style={{ animationDelay: `${((i * 0.17 + 0.22) % 0.45).toFixed(2)}s` }}
                />
              </g>
            ))}
          </svg>
        </li>

        {/* Layer 5 — Foreground ground smoke */}
        <li data-depth="0.88" className="layer">
          <div className="ground-smoke" />
        </li>

      </ul>

      {/* Vignette frame — doesn't move */}
      <div className="vignette" aria-hidden="true" />

      {/* Title overlay — above the scene, doesn't move */}
      <div className="overlay">
        <p className="overlay__eyebrow velvet-eyebrow">Tales of Berseria</p>
        <h1 className="overlay__title velvet-title">Velvet Crowe</h1>
        <p className="overlay__subtitle velvet-subtitle">Move your cursor — ignite the beast</p>
      </div>
    </div>
  )
}

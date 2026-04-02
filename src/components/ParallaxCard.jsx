import { useEffect, useRef } from 'react'
import Parallax from 'parallax-js'
import './ParallaxCard.css'

/**
 * ParallaxCard
 *
 * Props:
 *   title      — card title shown as an overlay label
 *   layers     — array of { src, depth, alt? }
 *                depth: 0.0 (static) → 1.0 (moves most)
 *   options    — optional parallax-js config overrides
 */
export default function ParallaxCard({ title, layers = [], options = {} }) {
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!sceneRef.current) return

    const parallax = new Parallax(sceneRef.current, {
      scalarX: 8,
      scalarY: 8,
      frictionX: 0.08,
      frictionY: 0.08,
      ...options,
    })

    return () => parallax.destroy()
  }, [])

  return (
    <div className="parallax-card">
      <ul ref={sceneRef} className="parallax-scene">
        {layers.map((layer, i) => (
          <li key={i} className="parallax-layer" data-depth={layer.depth}>
            <img src={layer.src} alt={layer.alt || `layer-${i}`} />
          </li>
        ))}
      </ul>
      {title && <span className="parallax-card__title">{title}</span>}
    </div>
  )
}

import ParallaxCard from './ParallaxCard'
import './Gallery.css'

/**
 * Gallery
 *
 * Props:
 *   items — array of { title, layers: [{ src, depth, alt? }] }
 *
 * Each card expects 2–4 layers. Use depth 0.0 for background → 1.0 for foreground.
 * Replace the placeholder URLs below with your own images.
 */

const DEFAULT_ITEMS = [
  {
    title: 'Mountain Mist',
    layers: [
      { src: 'https://picsum.photos/seed/mist1/600/760', depth: 0.0 },
      { src: 'https://picsum.photos/seed/mist2/600/760', depth: 0.4 },
      { src: 'https://picsum.photos/seed/mist3/600/760', depth: 0.8 },
    ],
  },
  {
    title: 'City Lights',
    layers: [
      { src: 'https://picsum.photos/seed/city1/600/760', depth: 0.0 },
      { src: 'https://picsum.photos/seed/city2/600/760', depth: 0.5 },
      { src: 'https://picsum.photos/seed/city3/600/760', depth: 1.0 },
    ],
  },
  {
    title: 'Forest Walk',
    layers: [
      { src: 'https://picsum.photos/seed/forest1/600/760', depth: 0.0 },
      { src: 'https://picsum.photos/seed/forest2/600/760', depth: 0.35 },
      { src: 'https://picsum.photos/seed/forest3/600/760', depth: 0.7 },
    ],
  },
  {
    title: 'Ocean Depth',
    layers: [
      { src: 'https://picsum.photos/seed/ocean1/600/760', depth: 0.0 },
      { src: 'https://picsum.photos/seed/ocean2/600/760', depth: 0.5 },
      { src: 'https://picsum.photos/seed/ocean3/600/760', depth: 1.0 },
    ],
  },
  {
    title: 'Desert Dunes',
    layers: [
      { src: 'https://picsum.photos/seed/dune1/600/760', depth: 0.0 },
      { src: 'https://picsum.photos/seed/dune2/600/760', depth: 0.45 },
      { src: 'https://picsum.photos/seed/dune3/600/760', depth: 0.9 },
    ],
  },
  {
    title: 'Aurora Night',
    layers: [
      { src: 'https://picsum.photos/seed/aurora1/600/760', depth: 0.0 },
      { src: 'https://picsum.photos/seed/aurora2/600/760', depth: 0.4 },
      { src: 'https://picsum.photos/seed/aurora3/600/760', depth: 0.8 },
    ],
  },
]

export default function Gallery({ items = DEFAULT_ITEMS }) {
  return (
    <section className="gallery">
      {items.map((item, i) => (
        <ParallaxCard key={i} title={item.title} layers={item.layers} />
      ))}
    </section>
  )
}

export { DEFAULT_ITEMS }

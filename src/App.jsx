import { useMemo } from 'react'
import RinScene from './scenes/RinScene'
import VelvetScene from './scenes/VelvetScene'

const SCENES = {
  rin:    RinScene,
  velvet: VelvetScene,
}

export default function App() {
  const key = useMemo(() => {
    return new URLSearchParams(window.location.search).get('scene') ?? 'rin'
  }, [])

  const Scene = SCENES[key] ?? RinScene
  return <Scene />
}

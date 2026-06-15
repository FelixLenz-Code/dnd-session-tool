import VelmoorMap from './VelmoorMap'
import TowerMap from './TowerMap'
import { FloorKeller, FloorBibliothek, FloorLabor, FloorSpiegel, FloorArchiv, FloorSanctum } from './FloorMaps'

const RENDERERS = {
  'velmoor':      VelmoorMap,
  'tower':        TowerMap,
  'floor-keller': FloorKeller,
  'floor-1':      FloorBibliothek,
  'floor-2':      FloorLabor,
  'floor-3':      FloorSpiegel,
  'floor-4':      FloorArchiv,
  'floor-5':      FloorSanctum,
}

export default function MapRenderer({ mapId, marker, interactive = false, puzzleState, puzzleWrong, fullscreen = false }) {
  const Component = RENDERERS[mapId]
  const style = fullscreen
    ? { display: 'block', width: '100%', height: '100%', maxHeight: '100%' }
    : { display: 'block', width: '100%' }

  if (!Component) {
    return (
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={style}>
        <rect width="400" height="300" fill="#1a1510" />
        <text x="200" y="150" textAnchor="middle" fill="#5a4020" fontSize="14">
          Karte nicht verfügbar: {mapId}
        </text>
      </svg>
    )
  }
  return <Component marker={marker} interactive={interactive} puzzleState={puzzleState} puzzleWrong={puzzleWrong} svgStyle={style}/>
}

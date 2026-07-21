import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { escapeHTML } from '../../utils/escapeHTML'

function getStopLabel(index) {
  if (index < 26) return String.fromCharCode(65 + index)
  return String.fromCharCode(64 + Math.floor(index / 26)) + String.fromCharCode(65 + (index % 26))
}

function AnimatedRoute({ geometry, isActive }) {
  const map = useMap()
  const layerRef = useRef(null)
  const outlineRef = useRef(null)
  const animFrameRef = useRef(null)

  useEffect(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }

    if (layerRef.current) {
      map.removeLayer(layerRef.current)
      layerRef.current = null
    }
    if (outlineRef.current) {
      map.removeLayer(outlineRef.current)
      outlineRef.current = null
    }

    if (!geometry || !isActive) return

    let coords = geometry.type === 'LineString' ? geometry.coordinates : []
    if (coords.length === 0) return

    const outlineStyle = {
      color: '#ffffff',
      weight: 9,
      opacity: 0.7,
      lineCap: 'round',
      lineJoin: 'round',
    }

    const routeStyle = {
      color: '#4285F4',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }

    const totalPoints = coords.length
    const duration = Math.min(2000, Math.max(600, totalPoints * 2))
    const startTime = performance.now()
    let destroyed = false

    function animate(now) {
      if (destroyed) return

      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const visibleCount = Math.max(2, Math.floor(eased * totalPoints))

      const visibleCoords = coords.slice(0, visibleCount)
      const latLngs = visibleCoords.map(c => [c[1], c[0]])

      if (!outlineRef.current) {
        outlineRef.current = L.polyline(latLngs, outlineStyle).addTo(map)
      } else {
        outlineRef.current.setLatLngs(latLngs)
      }

      if (!layerRef.current) {
        layerRef.current = L.polyline(latLngs, routeStyle).addTo(map)
      } else {
        layerRef.current.setLatLngs(latLngs)
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      destroyed = true
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
      if (outlineRef.current) {
        map.removeLayer(outlineRef.current)
        outlineRef.current = null
      }
    }
  }, [map, geometry, isActive])

  return null
}

function StopMarkers({ stops, activeIndex, onSelect }) {
  const map = useMap()
  const markersRef = useRef([])
  const prevActiveRef = useRef(null)

  useEffect(() => {
    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []

    stops.forEach((stop, i) => {
      const coord = Array.isArray(stop.coordinates)
        ? stop.coordinates
        : stop.coordinates?.lat != null
          ? [stop.coordinates.lat, stop.coordinates.lng]
          : null

      if (!coord) return

      const isActive = i === activeIndex
      const isEndpoint = i === 0 || i === stops.length - 1
      const label = getStopLabel(i)
      const showName = stops.length <= 10

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
            <div style="
              width:${isActive ? 36 : 28}px;height:${isActive ? 36 : 28}px;
              border-radius:50%;
              background:${isEndpoint ? (i === 0 ? '#EA4335' : '#34A853') : '#4285F4'};
              color:#fff;display:flex;align-items:center;justify-content:center;
              font-size:${isActive ? 14 : 11}px;font-weight:700;
              box-shadow:0 2px 8px rgba(0,0,0,0.3);
              border:3px solid #fff;
              transition:all 0.3s ease;
              ${isActive ? 'transform:scale(1.2);' : ''}
            ">${label}</div>
            ${showName ? `<div style="
              background:rgba(255,255,255,0.95);border:1px solid rgba(0,0,0,0.08);
              border-radius:6px;padding:2px 6px;margin-top:2px;
              font-size:10px;font-weight:600;color:#334155;
              white-space:nowrap;max-width:120px;overflow:hidden;text-overflow:ellipsis;
              box-shadow:0 1px 4px rgba(0,0,0,0.1);
              text-align:center;line-height:1.3;
            "            >${escapeHTML(stop.name)}</div>` : ''}
            ${isActive ? '<div style="position:absolute;inset:-6px;border-radius:50%;border:2px solid #4285F4;opacity:0.5;animation:pulse-ring 1.5s infinite;"></div>' : ''}
          </div>
        `,
        iconSize: [isActive ? 36 : 28, isActive ? 36 : 28],
        iconAnchor: [isActive ? 18 : 14, isActive ? 18 : 14],
      })

      const marker = L.marker(coord, { icon })
        .addTo(map)
        .on('click', () => onSelect?.(i))

      markersRef.current.push(marker)
    })

    prevActiveRef.current = activeIndex

    return () => {
      markersRef.current.forEach(m => map.removeLayer(m))
      markersRef.current = []
    }
  }, [map, stops, activeIndex, onSelect])

  return null
}

function FallbackLine({ stops }) {
  const map = useMap()

  useEffect(() => {
    if (stops.length < 2) return

    const coords = stops
      .map(s => Array.isArray(s.coordinates) ? s.coordinates : s.coordinates?.lat != null ? [s.coordinates.lat, s.coordinates.lng] : null)
      .filter(Boolean)

    if (coords.length < 2) return

    const line = L.polyline(coords, {
      color: '#4285F4',
      weight: 4,
      opacity: 0.6,
      dashArray: '8, 8',
      lineCap: 'round',
    }).addTo(map)

    return () => { map.removeLayer(line) }
  }, [map, stops])

  return null
}

export default function RoutePolyline({ geometry, stops, activeStopIndex, isActive, onStopSelect }) {
  return (
    <>
      <AnimatedRoute geometry={geometry} isActive={isActive} />
      {!geometry && stops.length >= 2 && (
        <FallbackLine stops={stops} />
      )}
      {stops.length > 0 && (
        <StopMarkers
          stops={stops}
          activeIndex={activeStopIndex}
          onSelect={onStopSelect}
        />
      )}
    </>
  )
}

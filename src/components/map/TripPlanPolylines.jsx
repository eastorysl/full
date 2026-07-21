import { useEffect, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { presetTrips } from '../../data/presetTrips'
import { fetchSegmentedRoute, formatDistance, formatDuration } from '../../services/routingService'
import { escapeHTML } from '../../utils/escapeHTML'

const ROUTE_COLOR = '#3b82f6'

export default function TripPlanPolylines({ allData, isVisible, onLoadPreset }) {
  const map = useMap()
  const layersRef = useRef([])
  const markersRef = useRef([])
  const [routes, setRoutes] = useState({})
  const successRef = useRef(new Set())
  const inflightRef = useRef(new Set())

  useEffect(() => {
    if (!isVisible) return

    const needed = presetTrips.filter(
      (t) => !successRef.current.has(t.id) && !inflightRef.current.has(t.id)
    )
    if (needed.length === 0) return

    let cancelled = false

    needed.forEach((trip) => {
      inflightRef.current.add(trip.id)

      const coords = trip.stopIds
        .map((id) => {
          const item = allData.find((d) => d.id === id)
          if (!item?.coordinates) return null
          return Array.isArray(item.coordinates)
            ? item.coordinates
            : [item.coordinates.lat, item.coordinates.lng]
        })
        .filter((c) => c && c.length === 2)

      if (coords.length < 2) {
        inflightRef.current.delete(trip.id)
        return
      }

      fetchSegmentedRoute(coords)
        .then((result) => {
          if (cancelled) return
          if (result) {
            successRef.current.add(trip.id)
            setRoutes((prev) => ({ ...prev, [trip.id]: result }))
          }
        })
        .catch(() => {})
        .finally(() => inflightRef.current.delete(trip.id))
    })

    return () => { cancelled = true }
  }, [isVisible, allData])

  useEffect(() => {
    layersRef.current.forEach((l) => map.removeLayer(l))
    layersRef.current = []
    markersRef.current.forEach((m) => map.removeLayer(m))
    markersRef.current = []

    if (!isVisible) return

    presetTrips.forEach((trip) => {
      const route = routes[trip.id]
      const color = ROUTE_COLOR

      const rawCoords = trip.stopIds
        .map((id) => {
          const item = allData.find((d) => d.id === id)
          if (!item?.coordinates) return null
          return Array.isArray(item.coordinates)
            ? item.coordinates
            : [item.coordinates.lat, item.coordinates.lng]
        })
        .filter((c) => c && c.length === 2)

      if (rawCoords.length < 2) return

      const roadGeo = route?.geometry
      let roadLatLngs = null

      if (roadGeo?.coordinates?.length > 0) {
        roadLatLngs = roadGeo.coordinates.map((c) => [c[1], c[0]])
      }

      if (!roadLatLngs) {
        const loadingIcon = L.divIcon({
          html: `<div style="animation:preset-spin 1.2s linear infinite;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.92);box-shadow:0 2px 8px rgba(0,0,0,0.18);"><svg stroke="#0d9488" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })
        const marker = L.marker(rawCoords[0], { icon: loadingIcon, interactive: false }).addTo(map)
        marker.bindTooltip(
          `<div style="font-weight:700;font-size:11px;">${escapeHTML(trip.icon)} ${escapeHTML(trip.name)}</div><div style="font-size:10px;color:#94a3b8;">Loading route\u2026</div>`,
          { direction: 'top', offset: [0, -20], className: 'preset-route-popup' }
        )
        markersRef.current.push(marker)
        return
      }

      const useCoords = roadLatLngs

      const roadDist = route?.distance
      const roadDur = route?.duration
      const distLabel = roadDist ? formatDistance(roadDist) : trip.distance
      const durLabel = roadDur ? formatDuration(roadDur) : trip.duration

      const outline = L.polyline(useCoords, {
        color: '#ffffff',
        weight: 7,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map)
      layersRef.current.push(outline)

      const line = L.polyline(useCoords, {
        color,
        weight: 4,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map)

      const tooltipHtml = [
        `<div style="font-weight:700;font-size:11px;line-height:1.2;">${escapeHTML(trip.icon)} ${escapeHTML(trip.name)}</div>`,
        `<div style="font-size:10px;color:#0f766e;font-weight:600;">${distLabel} · ${durLabel}</div>`,
        `<div style="font-size:9px;color:#94a3b8;">${trip.stopIds.length} stops · Road route</div>`,
      ].join('')

      line.bindTooltip(tooltipHtml, {
        permanent: false,
        direction: 'center',
        className: 'preset-route-tooltip',
        opacity: 0.95,
      })

      line.on('click', () => {
        const bounds = L.latLngBounds(useCoords)
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12, duration: 0.6 })
        onLoadPreset?.(trip)
      })

      layersRef.current.push(line)

      rawCoords.forEach((coord, i) => {
        if (i === 0 || i === rawCoords.length - 1) {
          const marker = L.circleMarker(coord, {
            radius: 5,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9,
          }).addTo(map)

          marker.bindTooltip(
            [
              `<div style="font-weight:700;font-size:11px;">${escapeHTML(trip.icon)} ${escapeHTML(trip.name)}</div>`,
              `<div style="font-size:10px;color:#0f766e;font-weight:600;">${distLabel} · ${durLabel}</div>`,
              `<div style="font-size:9px;color:#94a3b8;">${i === 0 ? 'Start' : 'End'} · ${trip.stopIds.length} stops</div>`,
            ].join(''),
            { direction: 'top', offset: [0, -8], className: 'preset-route-popup' }
          )

          marker.on('click', () => {
            const bounds = L.latLngBounds(useCoords)
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12, duration: 0.6 })
            onLoadPreset?.(trip)
          })

          markersRef.current.push(marker)
        }
      })
    })

    return () => {
      layersRef.current.forEach((l) => map.removeLayer(l))
      layersRef.current = []
      markersRef.current.forEach((m) => map.removeLayer(m))
      markersRef.current = []
    }
  }, [map, isVisible, routes, allData])

  return null
}

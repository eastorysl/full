import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { fetchRoute, findNearbyPlaces, formatDuration, formatDistance, haversineDistance } from '../services/routingService'
import { optimizeRoute, reorderStops, generateItinerary } from '../utils/routeOptimizer'

export default function useRoutePlanner(allData) {
  const [stops, setStops] = useState([])
  const [routeGeometry, setRouteGeometry] = useState(null)
  const [routeLegs, setRouteLegs] = useState([])
  const [totalDistance, setTotalDistance] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [routeError, setRouteError] = useState(null)
  const [nearbyPlaces, setNearbyPlaces] = useState([])
  const [activeStopIndex, setActiveStopIndex] = useState(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [navPosition, setNavPosition] = useState(null)
  const watchIdRef = useRef(null)
  const stopsRef = useRef([])
  const allDataRef = useRef(allData)

  stopsRef.current = stops
  allDataRef.current = allData

  const getCoordArray = useCallback((item) => {
    if (Array.isArray(item.coordinates)) return item.coordinates
    if (item.coordinates?.lat != null) return [item.coordinates.lat, item.coordinates.lng]
    return null
  }, [])

  const addStop = useCallback((item) => {
    setStops(prev => {
      if (prev.find(s => s.id === item.id)) return prev
      return [...prev, item]
    })
  }, [])

  const addStopAtOptimal = useCallback((item) => {
    setStops(prev => {
      if (prev.find(s => s.id === item.id)) return prev
      if (prev.length < 2) return [...prev, item]

      const newCoord = getCoordArray(item)
      if (!newCoord) return [...prev, item]

      let bestIndex = prev.length
      let bestDetour = Infinity

      for (let i = 0; i < prev.length - 1; i++) {
        const c1 = getCoordArray(prev[i])
        const c2 = getCoordArray(prev[i + 1])
        if (!c1 || !c2) continue

        const d1 = haversineDistance(c1[0], c1[1], newCoord[0], newCoord[1])
        const d2 = haversineDistance(newCoord[0], newCoord[1], c2[0], c2[1])
        const direct = haversineDistance(c1[0], c1[1], c2[0], c2[1])
        const detour = d1 + d2 - direct

        if (detour < bestDetour) {
          bestDetour = detour
          bestIndex = i + 1
        }
      }

      const next = [...prev]
      next.splice(bestIndex, 0, item)
      return next
    })
  }, [getCoordArray])

  const removeStop = useCallback((id) => {
    setStops(prev => prev.filter(s => s.id !== id))
  }, [])

  const clearStops = useCallback(() => {
    setStops([])
    setRouteGeometry(null)
    setRouteLegs([])
    setTotalDistance(0)
    setTotalDuration(0)
    setNearbyPlaces([])
    setActiveStopIndex(null)
    setRouteError(null)
  }, [])

  const reorderStop = useCallback((fromIndex, toIndex) => {
    setStops(prev => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  const loadPreset = useCallback((preset, data) => {
    if (!preset?.stopIds || !data) return
    const presetStops = preset.stopIds
      .map(id => data.find(d => d.id === id))
      .filter(Boolean)
    if (presetStops.length > 0) {
      setRouteGeometry(null)
      setRouteLegs([])
      setTotalDistance(0)
      setTotalDuration(0)
      setNearbyPlaces([])
      setRouteError(null)
      setActiveStopIndex(null)
      setStops(presetStops)
    }
  }, [])

  const loadStopsByIds = useCallback((ids, data) => {
    if (!ids || !data) return
    const found = ids
      .map(id => data.find(d => d.id === id))
      .filter(Boolean)
    if (found.length > 0) {
      setRouteGeometry(null)
      setRouteLegs([])
      setTotalDistance(0)
      setTotalDuration(0)
      setNearbyPlaces([])
      setRouteError(null)
      setActiveStopIndex(null)
      prevStopsLenRef.current = found.length
      setStops(found)
    }
  }, [])

  const generateRoute = useCallback(async (overrideStops) => {
    const currentStops = (Array.isArray(overrideStops) && overrideStops.length > 0) ? overrideStops : stopsRef.current
    const currentAllData = allDataRef.current

    if (currentStops.length < 2) {
      setRouteError('Add at least 2 stops to generate a route.')
      return
    }

    const coords = currentStops.map(getCoordArray).filter(Boolean)
    if (coords.length < 2) {
      setRouteError('Stops need valid coordinates.')
      return
    }

    setIsLoadingRoute(true)
    setRouteError(null)
    setNearbyPlaces([])

    try {
      const result = await fetchRoute(coords)
      if (!result) {
        setRouteError('No route found. Try different stops.')
        return
      }

      setRouteGeometry(result.geometry)
      setRouteLegs(result.legs)
      setTotalDistance(result.distance)
      setTotalDuration(result.duration)

      const nearby = findNearbyPlaces(
        result.geometry.coordinates.map(c => [c[1], c[0]]),
        currentAllData,
        5
      )
      setNearbyPlaces(nearby)
    } catch (err) {
      setRouteError('Routing service is temporarily unavailable. Please check your connection and try again.')
      console.error('generateRoute error:', err)
    } finally {
      setIsLoadingRoute(false)
    }
  }, [getCoordArray])

  const optimizeStops = useCallback(() => {
    if (stopsRef.current.length <= 2) return
    const order = optimizeRoute(stopsRef.current)
    const reordered = reorderStops(stopsRef.current, order)
    setStops(reordered)
    generateRoute(reordered)
  }, [generateRoute])

  const startNavigation = useCallback(() => {
    if (!navigator.geolocation) return

    setIsNavigating(true)
    setActiveStopIndex(0)
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setNavPosition([pos.coords.latitude, pos.coords.longitude])
      },
      (err) => {
        console.warn('Geolocation watch error:', err.message)
        setIsNavigating(false)
        setNavPosition(null)
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    )
  }, [])

  const stopNavigation = useCallback(() => {
    setIsNavigating(false)
    setNavPosition(null)
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (stops.length === 0) {
      setActiveStopIndex(null)
    } else if (activeStopIndex != null && activeStopIndex >= stops.length) {
      setActiveStopIndex(stops.length - 1)
    }
  }, [stops.length, activeStopIndex])

  const prevStopsLenRef = useRef(0)
  useEffect(() => {
    const prevLen = prevStopsLenRef.current
    const currLen = stops.length
    prevStopsLenRef.current = currLen
    if (currLen >= 2 && currLen > prevLen) {
      const timer = setTimeout(() => optimizeStops(), 150)
      return () => clearTimeout(timer)
    }
  }, [stops.length, optimizeStops])

  const stopCoords = useMemo(() =>
    stops.map(getCoordArray).filter(Boolean),
    [stops, getCoordArray]
  )

  const formattedDistance = useMemo(() => formatDistance(totalDistance), [totalDistance])
  const formattedDuration = useMemo(() => formatDuration(totalDuration), [totalDuration])

  const legDurations = useMemo(() =>
    routeLegs.map((leg, i) => ({
      from: stops[i]?.name,
      to: stops[i + 1]?.name,
      distance: formatDistance(leg.distance),
      duration: formatDuration(leg.duration),
      steps: leg.steps || [],
      distanceMeters: leg.distance,
      durationSeconds: leg.duration,
    })),
    [routeLegs, stops]
  )

  const itinerary = useMemo(() => {
    if (stops.length < 2) return [stops]
    return generateItinerary(stops)
  }, [stops])

  const currentTurnInstruction = useMemo(() => {
    if (!isNavigating || !navPosition || !routeLegs.length || activeStopIndex == null) return null

    const legIdx = Math.min(activeStopIndex, routeLegs.length - 1)
    const leg = routeLegs[legIdx]
    if (!leg?.steps?.length) return null

    let bestStep = null
    let bestDist = Infinity
    for (const step of leg.steps) {
      const manCoord = step.maneuver?.location
      if (!manCoord) continue
      const dist = haversineDistance(navPosition[0], navPosition[1], manCoord[1], manCoord[0])
      if (dist < bestDist) {
        bestDist = dist
        bestStep = step
      }
    }

    if (!bestStep) return null

    const maneuverType = bestStep.maneuver?.type || ''
    const modifier = bestStep.maneuver?.modifier || ''
    let icon = '→'
    if (maneuverType === 'turn' || maneuverType === 'end of road') {
      if (modifier.includes('left')) icon = '↰'
      else if (modifier.includes('right')) icon = '↱'
      else if (modifier.includes('sharp')) icon = modifier.includes('left') ? '↲' : '↳'
      else if (modifier.includes('slight')) icon = modifier.includes('left') ? '↖' : '↗'
    } else if (maneuverType === 'depart') icon = '▶'
    else if (maneuverType === 'arrive') icon = '🏁'
    else if (maneuverType === 'roundabout' || maneuverType === 'rotary') icon = '⟳'
    else if (maneuverType === 'merge') icon = '⤵'
    else if (maneuverType === 'fork') icon = modifier.includes('left') ? '↰' : '↱'
    else if (maneuverType === 'new name' || maneuverType === 'continue') icon = '↑'

    const roadName = bestStep.name
    const distance = bestStep.distance
    let instruction = ''
    if (maneuverType === 'arrive') {
      instruction = `Arrive at ${stops[Math.min(activeStopIndex + 1, stops.length - 1)]?.name || 'destination'}`
    } else if (maneuverType === 'depart') {
      instruction = roadName ? `Head ${modifier || ''} on ${roadName}` : `Head ${modifier || 'straight'}`
    } else {
      const action = maneuverType === 'turn' ? `Turn ${modifier}`
        : maneuverType === 'roundabout' || maneuverType === 'rotary' ? 'At roundabout'
        : maneuverType === 'merge' ? `Merge ${modifier}`
        : maneuverType === 'fork' ? `At fork, keep ${modifier}`
        : `Continue ${modifier || 'straight'}`
      instruction = roadName ? `${action} onto ${roadName}` : action
    }

    return {
      icon,
      instruction,
      roadName,
      distance,
      formattedDistance: formatDistance(distance),
      modifier,
      type: maneuverType,
    }
  }, [isNavigating, navPosition, routeLegs, activeStopIndex, stops])

  return {
    stops,
    routeGeometry,
    routeLegs,
    totalDistance,
    totalDuration,
    formattedDistance,
    formattedDuration,
    legDurations,
    isLoadingRoute,
    routeError,
    nearbyPlaces,
    activeStopIndex,
    isNavigating,
    navPosition,
    stopCoords,
    itinerary,
    currentTurnInstruction,
    addStop,
    addStopAtOptimal,
    removeStop,
    clearStops,
    reorderStop,
    loadPreset,
    loadStopsByIds,
    optimizeStops,
    generateRoute,
    setActiveStopIndex,
    startNavigation,
    stopNavigation,
  }
}

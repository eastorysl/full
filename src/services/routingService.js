const OSRM_MIRRORS = [
  { name: 'OSRM Official', build: (q) => `https://router.project-osrm.org/route/v1/driving/${q}` },
  { name: 'OSRM OSM.DE', build: (q) => `https://routing.openstreetmap.de/routed-car/route/v1/driving/${q}` },
]

const PROVIDERS = {
  osrm: {
    name: 'OSRM',
    baseUrl: 'https://router.project-osrm.org',
    buildUrl: (coords, options = {}) => {
      const { overview = 'full', geometries = 'geojson', steps = true } = options
      const coordStr = coords.map(c => `${c[1]},${c[0]}`).join(';')
      return `${PROVIDERS.osrm.baseUrl}/route/v1/driving/${coordStr}?overview=${overview}&geometries=${geometries}&steps=${steps}`
    },
    parseResponse: (data) => {
      if (!data.routes || data.routes.length === 0) return null
      const route = data.routes[0]
      return {
        geometry: route.geometry,
        distance: route.distance,
        duration: route.duration,
        legs: route.legs.map(leg => ({
          distance: leg.distance,
          duration: leg.duration,
          steps: leg.steps.map(step => ({
            distance: step.distance,
            duration: step.duration,
            name: step.name,
            maneuver: step.maneuver,
            geometry: step.geometry,
          })),
        })),
      }
    },
  },
  graphhopper: {
    name: 'GraphHopper',
    baseUrl: 'https://graphhopper.com/api/1',
    apiKey: '',
    buildUrl: (coords, _options = {}) => {
      const points = coords.map(c => `point=${c[1]},${c[0]}`).join('&')
      return `${PROVIDERS.graphhopper.baseUrl}/route?${points}&vehicle=car&locale=en&calc_points=true&key=${PROVIDERS.graphhopper.apiKey}`
    },
    parseResponse: (data) => {
      if (!data.paths || data.paths.length === 0) return null
      const path = data.paths[0]
      return {
        geometry: { type: 'LineString', coordinates: path.points.coordinates },
        distance: path.distance,
        duration: path.time / 1000,
        legs: [],
      }
    },
  },
  mapbox: {
    name: 'Mapbox',
    baseUrl: 'https://api.mapbox.com/directions/v5/mapbox',
    accessToken: '',
    buildUrl: (coords, _options = {}) => {
      const coordStr = coords.map(c => `${c[1]},${c[0]}`).join(';')
      return `${PROVIDERS.mapbox.baseUrl}/driving/${coordStr}?geometries=geojson&overview=full&steps=true&access_token=${PROVIDERS.mapbox.accessToken}`
    },
    parseResponse: (data) => {
      if (!data.routes || data.routes.length === 0) return null
      const route = data.routes[0]
      return {
        geometry: route.geometry,
        distance: route.distance,
        duration: route.duration,
        legs: route.legs.map(leg => ({
          distance: leg.distance,
          duration: leg.duration,
          steps: (leg.steps || []).map(step => ({
            distance: step.distance,
            duration: step.duration,
            name: step.name,
            maneuver: step.maneuver,
            geometry: step.geometry,
          })),
        })),
      }
    },
  },
}

let activeProvider = 'osrm'
let routeCache = new Map()

function getCacheKey(coords) {
  return coords.map(c => `${c[0].toFixed(4)},${c[1].toFixed(4)}`).join('|')
}

function clearCache() {
  routeCache.clear()
}

function setActiveProvider(provider) {
  if (PROVIDERS[provider]) {
    activeProvider = provider
    clearCache()
  }
}

function getActiveProvider() {
  return PROVIDERS[activeProvider]
}

function configureProvider(provider, config) {
  if (PROVIDERS[provider]) {
    Object.assign(PROVIDERS[provider], config)
  }
}

async function fetchWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      mode: 'cors',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    clearTimeout(timeout)
    throw error
  }
}

async function fetchRoute(coords, options = {}) {
  if (coords.length < 2) return null

  const cacheKey = getCacheKey(coords)
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)
  }

  const { overview = 'full', geometries = 'geojson', steps = true } = options

  let lastError = null

  for (const mirror of OSRM_MIRRORS) {
    const coordStr = coords.map(c => `${c[1]},${c[0]}`).join(';')
    const query = `${coordStr}?overview=${overview}&geometries=${geometries}&steps=${steps}`
    const url = mirror.build(query)
    try {
      const data = await fetchWithTimeout(url, 12000)
      const result = PROVIDERS.osrm.parseResponse(data)
      if (result) {
        if (routeCache.size >= 200) {
          const firstKey = routeCache.keys().next().value
          routeCache.delete(firstKey)
        }
        routeCache.set(cacheKey, result)
        return result
      }
    } catch (error) {
      console.warn(`${mirror.name} failed:`, error.message)
      lastError = error
    }
  }

  throw lastError || new Error('All routing servers failed')
}

async function fetchSegmentedRoute(coords, options = {}) {
  if (coords.length < 2) return null

  const cacheKey = 'seg_' + getCacheKey(coords)
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)
  }

  const segments = []
  for (let i = 0; i < coords.length - 1; i++) {
    segments.push([coords[i], coords[i + 1]])
  }

  const segmentResults = await Promise.all(
    segments.map(async (pair, i) => {
      const pairKey = getCacheKey(pair)
      const pairCacheKey = 'seg_' + pairKey

      if (routeCache.has(pairCacheKey)) {
        return { index: i, result: routeCache.get(pairCacheKey) }
      }

      try {
        const result = await fetchRoute(pair, options)
        if (result) {
          routeCache.set(pairCacheKey, result)
        }
        return { index: i, result }
      } catch {
        return { index: i, result: null }
      }
    })
  )

  const allCoords = []
  let totalDistance = 0
  let totalDuration = 0

  for (let i = 0; i < segments.length; i++) {
    const segResult = segmentResults[i]?.result
    if (segResult?.geometry?.coordinates?.length > 0) {
      const segCoords = segResult.geometry.coordinates.map(c => [c[1], c[0]])
      if (allCoords.length > 0) {
        const last = allCoords[allCoords.length - 1]
        const first = segCoords[0]
        if (last[0] === first[0] && last[1] === first[1]) {
          segCoords.shift()
        }
      }
      allCoords.push(...segCoords)
      totalDistance += segResult.distance || 0
      totalDuration += segResult.duration || 0
    } else {
      const pair = segments[i]
      allCoords.push([pair[1][0], pair[1][1]])
    }
  }

  if (allCoords.length < 2) return null

  const merged = {
    geometry: {
      type: 'LineString',
      coordinates: allCoords.map(c => [c[1], c[0]]),
    },
    distance: totalDistance,
    duration: totalDuration,
    legs: [],
  }

  if (routeCache.size >= 200) {
    const firstKey = routeCache.keys().next().value
    routeCache.delete(firstKey)
  }
  routeCache.set(cacheKey, merged)

  return merged
}

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return ''
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h} hr ${m} min`
  return `${m} min`
}

function formatDistance(meters) {
  if (!meters && meters !== 0) return ''
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

function findNearbyPlaces(routeCoords, places, maxDistanceKm = 5) {
  if (!routeCoords || routeCoords.length === 0 || !places || places.length === 0) return []

  const maxDistMeters = maxDistanceKm * 1000
  const step = Math.max(1, Math.floor(routeCoords.length / 60))
  const sampledPoints = routeCoords.filter((_, i) => i % step === 0)

  return places
    .filter(p => p.coordinates)
    .map(place => {
      const placeCoord = Array.isArray(place.coordinates)
        ? place.coordinates
        : [place.coordinates.lat, place.coordinates.lng]

      const minDist = sampledPoints.reduce((min, pt) => {
        const dist = haversineDistance(pt[0], pt[1], placeCoord[0], placeCoord[1])
        return dist < min ? dist : min
      }, Infinity)

      return { ...place, distanceToRoute: minDist }
    })
    .filter(p => p.distanceToRoute <= maxDistMeters)
    .sort((a, b) => a.distanceToRoute - b.distanceToRoute)
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function generateShareUrl(stops) {
  if (!stops || stops.length < 2) return null
  const ids = stops.map(s => s.id).filter(Boolean)
  if (ids.length < 2) return null
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  const params = new URLSearchParams()
  params.set('trip', ids.join(','))
  return `${base}/map?${params.toString()}`
}

function shareRoute(stops) {
  const url = generateShareUrl(stops)
  if (!url) return false
  const names = stops.slice(0, 5).map(s => s.name).join(' → ')
  const more = stops.length > 5 ? ` +${stops.length - 5} more` : ''
  const text = `Check out this Sri Lanka road trip:\n${names}${more}\n\n${url}`
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {})
    return 'clipboard'
  }
  return false
}

export {
  fetchRoute,
  fetchSegmentedRoute,
  formatDuration,
  formatDistance,
  findNearbyPlaces,
  setActiveProvider,
  getActiveProvider,
  configureProvider,
  clearCache,
  haversineDistance,
  generateShareUrl,
  shareRoute,
  PROVIDERS,
}

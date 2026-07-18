function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getCoord(item) {
  if (Array.isArray(item.coordinates)) return item.coordinates
  if (item.coordinates?.lat != null) return [item.coordinates.lat, item.coordinates.lng]
  return null
}

function nearestNeighbour(stops, startIndex = 0) {
  if (stops.length <= 2) return stops.map((_, i) => i)

  const n = stops.length
  const visited = new Set([startIndex])
  const order = [startIndex]
  let current = startIndex

  while (visited.size < n) {
    let nearest = -1
    let nearestDist = Infinity
    const c1 = getCoord(stops[current])

    for (let i = 0; i < n; i++) {
      if (visited.has(i)) continue
      const c2 = getCoord(stops[i])
      if (!c1 || !c2) continue
      const dist = haversineDistance(c1[0], c1[1], c2[0], c2[1])
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = i
      }
    }

    if (nearest === -1) break
    visited.add(nearest)
    order.push(nearest)
    current = nearest
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) order.push(i)
  }

  return order
}

function twoOptImprove(order, stops) {
  let best = [...order]

  let foundImprovement = true
  while (foundImprovement) {
    foundImprovement = false
    for (let i = 1; i < best.length - 1; i++) {
      for (let j = i + 1; j < best.length; j++) {
        const newOrder = [...best]
        newOrder.splice(i, j - i + 1, ...best.slice(i, j + 1).reverse())

        if (totalRouteDistance(newOrder, stops) < totalRouteDistance(best, stops)) {
          best = newOrder
          foundImprovement = true
        }
      }
    }
  }

  return best
}

function totalRouteDistance(order, stops) {
  let total = 0
  for (let i = 0; i < order.length - 1; i++) {
    const c1 = getCoord(stops[order[i]])
    const c2 = getCoord(stops[order[i + 1]])
    if (c1 && c2) {
      total += haversineDistance(c1[0], c1[1], c2[0], c2[1])
    }
  }
  return total
}

function optimizeRoute(stops, startId = null) {
  if (stops.length <= 1) return stops.map((_, i) => i)

  let startIdx = 0
  if (startId) {
    const found = stops.findIndex(s => s.id === startId)
    if (found !== -1) startIdx = found
  }

  const order = nearestNeighbour(stops, startIdx)
  const improved = twoOptImprove(order, stops)

  return improved
}

function reorderStops(stops, order) {
  return order.map(i => stops[i])
}

function generateItinerary(stops, maxDrivingHoursPerDay = 5) {
  const maxSecondsPerDay = maxDrivingHoursPerDay * 3600
  const days = []
  let currentDay = []
  let currentTime = 0

  for (let i = 0; i < stops.length; i++) {
    currentDay.push(stops[i])

    if (i < stops.length - 1) {
      const c1 = getCoord(stops[i])
      const c2 = getCoord(stops[i + 1])
      if (c1 && c2) {
        const distKm = haversineDistance(c1[0], c1[1], c2[0], c2[1])
        const estDriveSeconds = (distKm / 40) * 3600
        currentTime += estDriveSeconds + 3600

        if (currentTime >= maxSecondsPerDay && currentDay.length > 1) {
          days.push([...currentDay])
          currentDay = []
          currentTime = 0
        }
      }
    }
  }

  if (currentDay.length > 0) {
    days.push(currentDay)
  }

  return days
}

export {
  optimizeRoute,
  reorderStops,
  generateItinerary,
  nearestNeighbour,
  totalRouteDistance,
  haversineDistance,
  getCoord,
}

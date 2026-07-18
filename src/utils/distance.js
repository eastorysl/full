export function distanceFromColombo(item) {
  if (!item) return null
  if (item.clDistance != null) return item.clDistance
  if (item.coordinates) {
    const R = 6371
    const [clat, clng] = [6.9271, 79.8612]
    const toRad = (d) => (d * Math.PI) / 180
    const dlat = toRad(item.coordinates.lat - clat)
    const dlng = toRad(item.coordinates.lng - clng)
    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(toRad(clat)) * Math.cos(toRad(item.coordinates.lat)) * Math.sin(dlng / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c)
  }
  return null
}

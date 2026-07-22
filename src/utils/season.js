const fullMonthNames = {
  jan: 'January', january: 'January', feb: 'February', february: 'February', mar: 'March', march: 'March',
  apr: 'April', april: 'April', may: 'May', jun: 'June', june: 'June',
  jul: 'July', july: 'July', aug: 'August', august: 'August', sep: 'September', september: 'September',
  oct: 'October', october: 'October', nov: 'November', november: 'November', dec: 'December', december: 'December',
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function monthName(n) {
  return monthNames[n - 1] || ''
}

export function isInSeason(bestTime, month) {
  if (!bestTime || bestTime === 'Year-round') return true

  const m = monthNames.indexOf(month)
  if (m === -1) return false

  const ranges = bestTime.split(',').map(s => s.trim())
  for (let range of ranges) {
    if (range.toLowerCase().includes('year-round')) return true
    range = range.replace(/\s*\([^)]*\)/g, '').trim()
    const parts = range.split(/[–-]/).map(s => s.trim())
    if (parts.length === 2) {
      const start = fullMonthNames[parts[0].toLowerCase()]
      const end = fullMonthNames[parts[1].toLowerCase()]
      if (start && end) {
        const si = monthNames.indexOf(start)
        const ei = monthNames.indexOf(end)
        if (si <= ei) {
          if (m >= si && m <= ei) return true
        } else {
          if (m >= si || m <= ei) return true
        }
      }
    }
    if (fullMonthNames[range.toLowerCase()] === month) return true
  }
  return false
}

export function getSeasonalDestinations(destinations, month, category = 'All') {
  let filtered = destinations.filter(d => isInSeason(d.bestTime, month))
  if (category !== 'All') {
    filtered = filtered.filter(d => d.category === category.toLowerCase())
  }
  return filtered
}

export function getSeasonalFoods(items, month) {
  return items
    .filter(d => d.category === 'seasonal-foods' && isInSeason(d.seasonMonths, month))
    .sort((a, _b) => (a.type === 'fruit' ? -1 : _b.type === 'fruit' ? 1 : 0))
}

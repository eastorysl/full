import { useMemo } from 'react'
import DestinationCard from './DestinationCard'

const tierOrder = { premium: 0, featured: 1, standard: 2, free: 3 }

export default function DestinationGrid({ destinations }) {
  const sorted = useMemo(() => {
    if (!destinations) return []
    return [...destinations].sort((a, b) => (tierOrder[a.tier] ?? 2) - (tierOrder[b.tier] ?? 2))
  }, [destinations])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {sorted.map((dest, i) => (
        <DestinationCard key={dest.id} destination={dest} index={i} />
      ))}
    </div>
  )
}

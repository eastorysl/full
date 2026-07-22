import { useState, useMemo } from 'react'
import { FiChevronDown, FiChevronUp, FiPlus } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORY_ICONS = {
  beaches: '\u{1F3D6}\u{FE0F}',
  waterfalls: '\u{1F4A7}',
  nature: '\u{1F33F}',
  mountains: '\u{26F0}\u{FE0F}',
  historical: '\u{1F3DB}\u{FE0F}',
  religious: '\u{1F6D5}',
  wildlife: '\u{1F981}',
  parks: '\u{1F3DE}\u{FE0F}',
  forts: '\u{1F3F0}',
  cultural: '\u{1F3AD}',
}

function formatDist(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export default function NearbyPlaces({ places, onSelectPlace, onAddToRoute, isExpanded: externalExpanded, onToggleExpand }) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const isExpanded = externalExpanded !== undefined ? externalExpanded : internalExpanded
  const toggleExpand = onToggleExpand ? () => onToggleExpand(prev => !prev) : () => setInternalExpanded(prev => !prev)
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = useMemo(() => {
    if (!places || places.length === 0) return []
    const cats = new Set(places.map(p => p.category).filter(Boolean))
    return ['All', ...Array.from(cats)]
  }, [places])

  const filtered = useMemo(() => {
    if (!places) return []
    if (activeFilter === 'All') return places.slice(0, 12)
    return places.filter(p => p.category === activeFilter).slice(0, 12)
  }, [places, activeFilter])

  if (!places || places.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <button
          onClick={() => toggleExpand()}
          aria-expanded={isExpanded}
          className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">🔍</span>
            <span className="text-sm font-semibold text-slate-700">Nearby Attractions</span>
            <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full font-bold">{places.length}</span>
          </div>
          {isExpanded ? (
            <FiChevronUp className="text-slate-400" />
          ) : (
            <FiChevronDown className="text-slate-400" />
          )}
        </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Category filters */}
            <div className="px-3 pb-2 flex gap-1 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold font-['Poppins'] whitespace-nowrap transition-all ${
                    activeFilter === cat
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {cat !== 'All' && <span className="mr-0.5">{CATEGORY_ICONS[cat] || ''}</span>}
                  {cat}
                </button>
              ))}
            </div>

            {/* Place list */}
            <div className="max-h-48 overflow-y-auto px-3 pb-3 space-y-1.5">
              {filtered.map(place => {
                const coord = Array.isArray(place.coordinates) ? place.coordinates : place.coordinates?.lat != null ? [place.coordinates.lat, place.coordinates.lng] : null
                return (
                  <div
                    key={place.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                    onClick={() => onSelectPlace?.(place)}
                  >
                    <span className="text-sm flex-shrink-0">
                      {CATEGORY_ICONS[place.category] || '📍'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{place.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {place.distanceToRoute != null ? `${formatDist(place.distanceToRoute)} from route` : ''}
                      </p>
                    </div>
                    {coord && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onAddToRoute?.(place)
                        }}
                        className="touch-manipulation w-11 h-11 rounded-full bg-teal-500 text-white hover:bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm active:scale-95 transition-all"
                        title="Add to route"
                      >
                        <FiPlus className="text-[10px]" strokeWidth={3} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

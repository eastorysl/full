import { useMemo, useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiSearch, FiX, FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import { getCategoryClass, getCategoryLabel, getEffectiveTier } from '../../utils/mapHelpers'
import { handleImgError } from '../../utils/fallback'

const CATEGORIES = [
  'All', 'Beaches', 'Waterfalls', 'Mountains', 'Nature', 'Wildlife', 'Parks',
  'Historical', 'Ancient Kingdoms', 'Forts', 'Religious Places', 'Cultural',
  'Lakes & Rivers', 'Islands', 'Botanical Gardens', 'Viewpoints',
  'Scenic Train Journeys', 'Marine Attractions', 'Adventure', 'Festivals & Events',
  'Museums', 'Cities & Urban', 'Food & Culinary', 'Tea & Spice Trails',
  'Famous People', 'Caves & Geology', 'Seasonal Foods',
  'Hotels', 'Shopping', 'Restaurants',
]

export default function MapPlaceList({ items, selectedItem, onSelect, searchQuery, onSearchChange, activeCategory, onCategoryChange, onClose, showHeader = true }) {
  const listRef = useRef(null)
  const selectedRef = useRef(null)
  const scrollRef = useRef(null)
  const [scrollStart, setScrollStart] = useState(true)
  const [scrollEnd, setScrollEnd] = useState(false)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setScrollStart(el.scrollLeft <= 2)
    setScrollEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (selectedRef.current && listRef.current) {
      const container = listRef.current
      const target = selectedRef.current
      container.scrollTo({
        top: target.offsetTop - container.offsetTop - 16,
        behavior: 'smooth',
      })
    }
  }, [selectedItem])

  useEffect(() => {
    updateScrollState()
    const onResize = () => updateScrollState()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      const btn = scrollRef.current.querySelector('[data-active="true"]')
      if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeCategory])

  const sorted = useMemo(() => {
    const tierOrder = { premium: 0, featured: 1, standard: 2, free: 2 }
    return [...items].sort((a, b) => (tierOrder[getEffectiveTier(a)] ?? 2) - (tierOrder[getEffectiveTier(b)] ?? 2))
  }, [items])

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="shrink-0 border-b border-slate-100">
        <div className={`px-4 ${showHeader ? 'pt-4 pb-3' : 'pt-3 pb-3'}`}>
          {showHeader && (
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-heading font-semibold text-slate-800">
              Places
              <span className="ml-1.5 text-xs font-normal text-slate-400">({items.length})</span>
            </h2>
            {onClose && (
              <button onClick={onClose} aria-label="Close list" className="touch-manipulation w-11 h-11 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all duration-200">
                <FiX size={16} />
              </button>
            )}
          </div>
          )}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search places..." aria-label="Search places"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-100 border-0 text-xs text-slate-800 placeholder:text-slate-400 italic outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:shadow-sm transition-all duration-200"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="touch-manipulation absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <FiX size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 mt-3">
            <button
              onClick={() => scroll(-1)}
              disabled={scrollStart}
              className={`hidden md:flex min-h-[28px] w-7 items-center justify-center rounded-full border transition-all duration-200 shrink-0 ${
                scrollStart
                  ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                  : 'bg-white text-slate-500 hover:bg-teal-50 hover:text-teal-600 border-slate-200'
              }`}
              aria-label="Scroll left"
            >
              <FiChevronLeft size={12} />
            </button>
            <div ref={scrollRef} onScroll={updateScrollState} className="flex gap-1.5 overflow-x-auto scroll-smooth no-scrollbar" style={{ touchAction: 'pan-x' }}>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(isActive ? null : cat)}
                    data-active={isActive || undefined}
                    className={`touch-manipulation text-[11px] font-bold font-['Poppins'] px-3 py-2.5 min-h-[44px] rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/30'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => scroll(1)}
              disabled={scrollEnd}
              className={`hidden md:flex min-h-[28px] w-7 items-center justify-center rounded-full border transition-all duration-200 shrink-0 ${
                scrollEnd
                  ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                  : 'bg-white text-slate-500 hover:bg-teal-50 hover:text-teal-600 border-slate-200'
              }`}
              aria-label="Scroll right"
            >
              <FiChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-3 space-y-2">
          {sorted.map((item, i) => {
            const isSelected = selectedItem?.id === item.id
            return (
              <motion.button
                key={item.id}
                ref={isSelected ? selectedRef : null}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.3 }}
                onClick={() => onSelect(item)}
                className={`group w-full text-left rounded-xl overflow-hidden transition-all duration-200 cursor-pointer touch-manipulation ${
                  isSelected
                    ? 'bg-teal-50 ring-2 ring-teal-400 shadow-md shadow-teal-500/10'
                    : 'bg-white hover:bg-slate-50 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex gap-3 p-2.5">
                  <div className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={handleImgError}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isSelected ? 'scale-105' : 'group-hover:scale-110'
                      }`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className={`absolute bottom-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm ${getCategoryClass(item)}`}>
                      {getCategoryLabel(item)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-heading font-semibold text-sm text-slate-900 leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                      {isSelected && (
                        <FiChevronRight className="text-teal-500 shrink-0 mt-0.5" size={14} />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-0.5 text-[11px] text-slate-400 truncate">
                        <FiMapPin className="shrink-0" size={11} />
                        {item.location || item.district}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-1 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-8">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
              <FiMapPin className="text-slate-400" size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-500">No places found</p>
            <p className="text-xs text-slate-400 mt-1.5 text-center max-w-[200px]">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  )
}



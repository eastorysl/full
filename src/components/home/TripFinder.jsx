import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiX, FiMap, FiArrowRight, FiMapPin } from 'react-icons/fi'
import { destinations } from '../../data/destinations'
import { businesses } from '../../data/businesses'
import { prideItems } from '../../data/sriLankaPride'

const ALL_DATA = [
  ...destinations,
  ...businesses,
  ...prideItems.filter((p) => p.coordinates),
]

function PlaceSearch({ value, onChange, placeholder, onSelect }) {
  const [focused, setFocused] = useState(false)
  const [selected, setSelected] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  const results = useMemo(() => {
    if (!value || value.length < 2 || selected) return []
    const q = value.toLowerCase()
    return ALL_DATA
      .filter((d) =>
        d.name?.toLowerCase().includes(q) ||
        d.location?.toLowerCase().includes(q) ||
        d.district?.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [value, selected])

  function handleChange(v) {
    setSelected(false)
    onChange(v)
  }

  function handleSelect(item) {
    setSelected(true)
    onSelect(item)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
        <FiMapPin className="text-teal-500 text-sm shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { timeoutRef.current = setTimeout(() => setFocused(false), 200) }}
          aria-label="Search start point"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none min-h-[44px]"
        />
        {value && (
          <button onClick={() => handleChange('')} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600">
            <FiX className="text-xs" />
          </button>
        )}
      </div>
      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden max-h-56 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.id}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(item) }}
              className="w-full flex items-center gap-2.5 px-3 py-3 min-h-[48px] hover:bg-teal-50 transition-colors text-left"
            >
              <FiMap className="text-teal-500 text-xs shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">{item.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{item.location || item.district}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TripFinder() {
  const navigate = useNavigate()
  const [startVal, setStartVal] = useState('')
  const [endVal, setEndVal] = useState('')
  const [startSelected, setStartSelected] = useState(null)
  const [endSelected, setEndSelected] = useState(null)

  function handleSelectStart(item) {
    setStartSelected(item)
    setStartVal(item.name)
  }

  function handleSelectEnd(item) {
    setEndSelected(item)
    setEndVal(item.name)
  }

  function handleGenerate() {
    if (!startSelected || !endSelected) return
    navigate(`/map?trip=${startSelected.id},${endSelected.id}`)
  }

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, #0d9488 0%, transparent 50%), radial-gradient(circle at 70% 50%, #0284c7 0%, transparent 50%)',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-3">Plan Your Route</h2>
          <p className="text-slate-500 text-sm sm:text-base mb-8">
            Pick a start point and end point, then generate your route on the map.
          </p>

          <div className="space-y-4 text-left">
            <PlaceSearch
              value={startVal}
              onChange={(v) => { setStartVal(v); setStartSelected(null) }}
              placeholder="Start point..."
              onSelect={handleSelectStart}
            />
            <div className="flex items-center justify-center">
              <div className="w-0.5 h-6 bg-gradient-to-b from-teal-400 to-ocean-500 rounded-full" />
            </div>
            <PlaceSearch
              value={endVal}
              onChange={(v) => { setEndVal(v); setEndSelected(null) }}
              placeholder="End point..."
              onSelect={handleSelectEnd}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!startSelected || !endSelected}
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 min-h-[44px] rounded-xl bg-gradient-to-r from-teal-600 to-ocean-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiMap />
            Generate Route
            <FiArrowRight />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

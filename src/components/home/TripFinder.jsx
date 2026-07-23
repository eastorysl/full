import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiX, FiMap, FiArrowRight, FiMapPin, FiCrosshair } from 'react-icons/fi'
import { destinations } from '../../data/destinations'
import { businesses } from '../../data/businesses'
import { prideItems } from '../../data/sriLankaPride'
import useGeolocation from '../../hooks/useGeolocation'

const ALL_DATA = [
  ...destinations,
  ...businesses,
  ...prideItems.filter((p) => p.coordinates),
]

const CURRENT_LOCATION_ITEM = {
  id: '__current_location',
  name: 'My Current Location',
  location: 'Current Position',
  coordinates: null,
}

function PlaceSearch({ value, onChange, placeholder, onSelect, showCurrentLocation, currentLocation, onFocusClear }) {
  const [focused, setFocused] = useState(false)
  const [selected, setSelected] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  useEffect(() => {
    if (!value) setSelected(false)
  }, [value])

  const results = useMemo(() => {
    if (selected) return []
    const items = []

    if (!value || value.length < 2) {
      if (showCurrentLocation && currentLocation) {
        items.push({ ...CURRENT_LOCATION_ITEM, coordinates: currentLocation })
      }
      const suggestions = ALL_DATA
        .filter((d) => d.coordinates)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
      items.push(...suggestions)
    } else {
      const q = value.toLowerCase()
      const matches = ALL_DATA
        .filter((d) =>
          d.name?.toLowerCase().includes(q) ||
          d.location?.toLowerCase().includes(q) ||
          d.district?.toLowerCase().includes(q)
        )
        .slice(0, 6)
      items.push(...matches)
    }

    return items.slice(0, 7)
  }, [value, selected, showCurrentLocation, currentLocation])

  function handleChange(v) {
    setSelected(false)
    onChange(v)
  }

  function handleSelect(item) {
    setSelected(true)
    onSelect(item)
  }

  return (
    <div className="relative rounded-xl focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
      <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 focus-within:bg-white transition-all">
        <FiMapPin className="text-teal-500 text-sm shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => { setFocused(true); if (onFocusClear) onFocusClear() }}
          onBlur={() => { timeoutRef.current = setTimeout(() => setFocused(false), 200) }}
          aria-label="Search start point"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 italic outline-none focus-visible:ring-0 min-h-[44px]"
        />
        {value && (
          <button onClick={() => handleChange('')} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600">
            <FiX className="text-xs" />
          </button>
        )}
      </div>
      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden max-h-56 overflow-y-auto">
          {results.map((item) => {
            const isCurrentLocation = item.id === '__current_location'
            return (
              <button
                key={item.id}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(item) }}
                className="w-full flex items-center gap-2.5 px-3 py-3 min-h-[48px] hover:bg-teal-50 transition-colors text-left"
              >
                {isCurrentLocation ? (
                  <FiCrosshair className="text-teal-600 text-sm shrink-0" />
                ) : (
                  <FiMap className="text-teal-500 text-xs shrink-0" />
                )}
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isCurrentLocation ? 'text-teal-700' : 'text-slate-700'}`}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {isCurrentLocation ? 'Use GPS coordinates' : (item.location || item.district)}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function TripFinder() {
  const navigate = useNavigate()
  const { location: userLocation } = useGeolocation()
  const [startVal, setStartVal] = useState('')
  const [endVal, setEndVal] = useState('')
  const [startSelected, setStartSelected] = useState(null)
  const [endSelected, setEndSelected] = useState(null)
  const autoSelectedRef = useRef(false)

  useEffect(() => {
    if (userLocation && !autoSelectedRef.current) {
      autoSelectedRef.current = true
      const autoStart = { ...CURRENT_LOCATION_ITEM, coordinates: userLocation }
      setStartSelected(autoStart)
      setStartVal('My Current Location')
    }
  }, [userLocation])

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
    const ids = [startSelected.id, endSelected.id].join(',')
    navigate(`/map?trip=${ids}`)
  }

  return (
    <section className="section-padding bg-white relative">
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
              showCurrentLocation
              currentLocation={userLocation}
              onFocusClear={() => { setStartVal(''); setStartSelected(null) }}
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

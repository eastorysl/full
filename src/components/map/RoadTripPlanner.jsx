import { useState, useMemo, useCallback, useRef, useEffect, forwardRef } from 'react'
import { FiSearch, FiX, FiPlay, FiList, FiMap, FiChevronLeft } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import RouteTimeline from './RouteTimeline'
import RouteSummary from './RouteSummary'
import NearbyPlaces from './NearbyPlaces'
import PresetTrips from './PresetTrips'
import { presetTrips } from '../../data/presetTrips'

function SearchInput({ value, onChange, placeholder, onSelect, allData }) {
  const [isFocused, setIsFocused] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  const results = useMemo(() => {
    if (!value || value.length < 2) return []
    const q = value.toLowerCase()
    return allData
      .filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.location?.toLowerCase().includes(q) ||
        d.district?.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [value, allData])

  return (
    <div className="relative rounded-xl focus-within:ring-2 focus-within:ring-teal-500/20 transition-all duration-200">
      <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2.5 focus-within:bg-white focus-within:shadow-sm transition-all duration-200">
        <FiSearch className="text-slate-400 text-sm flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { timeoutRef.current = setTimeout(() => setIsFocused(false), 200) }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 italic outline-none focus-visible:ring-0 min-h-[44px]"
        />
        {value && (
          <button onClick={() => onChange('')} className="touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600">
            <FiX className="text-xs" />
          </button>
        )}
      </div>
      {isFocused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden max-h-56 overflow-y-auto custom-scrollbar">
          {results.map(item => (
              <button
                key={item.id}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onSelect(item)
                  onChange('')
                }}
                className="touch-manipulation w-full flex items-center gap-2.5 px-3 py-3 min-h-[48px] hover:bg-teal-50 active:bg-teal-100 transition-colors text-left"
              >
                <FiMap className="text-teal-500 text-xs flex-shrink-0" />
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

const RoadTripPlannerDesktop = forwardRef(function RoadTripPlannerDesktop({
  allData,
  stops,
  routeGeometry,
  legDurations,
  formattedDistance,
  formattedDuration,
  isLoadingRoute,
  routeError,
  nearbyPlaces,
  activeStopIndex,
  itinerary,
  onAddStop,
  onRemoveStop,
  onClearStops,
  onReorderStops,
  onLoadPreset,
  onOptimize,
  onGenerateRoute,
  onStopClick,
  onAddNearbyToRoute,
  onSelectPlaceOnMap,
  isOpen,
  onToggle,
}, ref) {
  const [activeTab, setActiveTab] = useState('plan')
  const [searchVal, setSearchVal] = useState('')

  const handleSearchSelect = useCallback((item) => {
    onAddStop(item)
  }, [onAddStop])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          ref={ref}
          className="hidden md:flex absolute left-0 top-0 bottom-0 z-20 w-[360px] flex-col bg-white/95 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.08)] rounded-r-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-slate-100">
            <button onClick={onToggle} className="w-11 h-11 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <FiChevronLeft className="text-slate-500 text-sm" />
            </button>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-slate-800">Road Trip Planner</h2>
              <p className="text-[10px] text-slate-400">{stops.length} stops \u00B7 {formattedDistance || '—'}</p>
            </div>
            {stops.length > 0 && (
              <button
                onClick={onClearStops}
                className="touch-manipulation min-h-[44px] text-[10px] text-red-400 hover:text-red-500 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {[
              { id: 'plan', icon: <FiMap className="text-xs" />, label: 'Plan' },
              { id: 'presets', icon: <FiList className="text-xs" />, label: 'Presets' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-teal-600 border-b-2 border-teal-500 bg-teal-50/50'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {activeTab === 'plan' && (
              <>
                <SearchInput
                  value={searchVal}
                  onChange={setSearchVal}
                  placeholder="Add a stop..."
                  onSelect={handleSearchSelect}
                  allData={allData}
                />

                {stops.length >= 2 && (
                    <RouteSummary
                      formattedDistance={formattedDistance}
                      formattedDuration={formattedDuration}
                      stops={stops}
                      isLoading={isLoadingRoute}
                      onOptimize={onOptimize}
                      itinerary={itinerary}
                    />
                )}

                {isLoadingRoute && (
                  <div className="flex items-center justify-center gap-2 py-4 text-teal-600 text-xs font-semibold">
                    <span className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    Calculating route...
                  </div>
                )}

                {routeError && (
                  <div className="bg-red-50 rounded-xl p-3 text-xs text-red-600 flex items-start gap-2">
                    <span className="flex-1">{routeError}</span>
                    <button
                      onClick={() => onGenerateRoute()}
                      className="flex-shrink-0 text-[11px] font-bold text-blue-600 hover:text-blue-700 underline"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {stops.length > 0 && (
                  <RouteTimeline
                    stops={stops}
                    legDurations={legDurations}
                    activeStopIndex={activeStopIndex}
                    onStopClick={onStopClick}
                    onRemoveStop={onRemoveStop}
                    onReorderStops={onReorderStops}
                    itinerary={itinerary}
                  />
                )}

                {stops.length >= 2 && !routeGeometry && !isLoadingRoute && (
                  <button
                    onClick={() => onGenerateRoute()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
                  >
                    <FiPlay className="text-sm" />
                    Generate Route
                  </button>
                )}

                {nearbyPlaces.length > 0 && (
                  <NearbyPlaces
                    places={nearbyPlaces}
                    onSelectPlace={onSelectPlaceOnMap}
                    onAddToRoute={onAddNearbyToRoute}
                  />
                )}
              </>
            )}

            {activeTab === 'presets' && (
              <PresetTrips
                presets={presetTrips}
                onSelectPreset={onLoadPreset}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

const RoadTripPlannerMobile = forwardRef(function RoadTripPlannerMobile({
  allData,
  stops,
  routeGeometry,
  legDurations,
  formattedDistance,
  formattedDuration,
  isLoadingRoute,
  routeError,
  nearbyPlaces,
  activeStopIndex,
  itinerary,
  onAddStop,
  onRemoveStop,
  onClearStops,
  onReorderStops,
  onLoadPreset,
  onOptimize,
  onGenerateRoute,
  onStopClick,
  onAddNearbyToRoute,
  onSelectPlaceOnMap,
  isOpen,
  onToggle,
}, ref) {
  const [activeTab, setActiveTab] = useState('plan')
  const [searchVal, setSearchVal] = useState('')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-20 md:hidden"
        >
          <div className="bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 overflow-hidden" style={{ height: 'min(75vh, 560px)' }}>
            {/* Handle */}
            <button
              onClick={onToggle}
              className="w-full flex justify-center pt-3 pb-1"
            >
              <div className="w-10 h-1 rounded-full bg-slate-400" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 px-4 pb-2">
              <h2 className="text-sm font-bold text-slate-800 flex-1">Road Trip Planner</h2>
              {stops.length > 0 && (
                <button onClick={onClearStops} className="touch-manipulation min-h-[44px] text-[10px] text-red-400 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50">
                  Clear
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-4">
              {[
                { id: 'plan', icon: <FiMap className="text-xs" />, label: 'Plan' },
                { id: 'presets', icon: <FiList className="text-xs" />, label: 'Presets' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'text-teal-600 border-b-2 border-teal-500'
                      : 'text-slate-400'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-4 py-3 space-y-3" style={{ height: 'calc(100% - 100px)' }}>
              {activeTab === 'plan' && (
                <>
                  <SearchInput
                    value={searchVal}
                    onChange={setSearchVal}
                    placeholder="Add a stop..."
                    onSelect={(item) => { onAddStop(item); setSearchVal('') }}
                    allData={allData}
                  />

                  {stops.length >= 2 && (
                    <RouteSummary
                      formattedDistance={formattedDistance}
                      formattedDuration={formattedDuration}
                      stops={stops}
                      isLoading={isLoadingRoute}
                      onOptimize={onOptimize}
                      itinerary={itinerary}
                    />
                  )}

                  {isLoadingRoute && (
                    <div className="flex items-center justify-center gap-2 py-4 text-teal-600 text-xs font-semibold">
                      <span className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                      Calculating route...
                    </div>
                  )}

                  {routeError && (
                    <div className="bg-red-50 rounded-xl p-3 text-xs text-red-600 flex items-start gap-2">
                      <span className="flex-1">{routeError}</span>
                      <button
                        onClick={() => onGenerateRoute()}
                        className="flex-shrink-0 text-[11px] font-bold text-blue-600 hover:text-blue-700 underline"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {stops.length > 0 && (
                    <RouteTimeline
                      stops={stops}
                      legDurations={legDurations}
                      activeStopIndex={activeStopIndex}
                      onStopClick={onStopClick}
                      onRemoveStop={onRemoveStop}
                      onReorderStops={onReorderStops}
                      itinerary={itinerary}
                    />
                  )}

                  {stops.length >= 2 && !routeGeometry && !isLoadingRoute && (
                    <button
                      onClick={() => onGenerateRoute()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold shadow-lg"
                    >
                      <FiPlay className="text-sm" />
                      Generate Route
                    </button>
                  )}

                  {nearbyPlaces.length > 0 && (
                    <NearbyPlaces
                      places={nearbyPlaces}
                      onSelectPlace={onSelectPlaceOnMap}
                      onAddToRoute={onAddNearbyToRoute}
                    />
                  )}
                </>
              )}

              {activeTab === 'presets' && (
                <PresetTrips
                  presets={presetTrips}
                  onSelectPreset={onLoadPreset}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export { RoadTripPlannerDesktop, RoadTripPlannerMobile, SearchInput }

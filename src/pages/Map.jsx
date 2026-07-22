import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import L from 'leaflet'
import { FiMap, FiList, FiNavigation, FiMapPin, FiPlay } from 'react-icons/fi'
import MapView from '../components/map/MapView'
import MapLayers from '../components/map/MapLayers'
import SEO from '../components/seo/SEO'
import MapPlaceList from '../components/map/MapPlaceList'
import MapSidePanel from '../components/map/MapSidePanel'
import RoutePolyline from '../components/map/RoutePolyline'
import { SearchInput } from '../components/map/RoadTripPlanner'
import RouteTimeline from '../components/map/RouteTimeline'
import RouteSummary from '../components/map/RouteSummary'
import NearbyPlaces from '../components/map/NearbyPlaces'
import PresetTrips from '../components/map/PresetTrips'
import PresetRoutePolylines from '../components/map/TripPlanPolylines'
import { presetTrips } from '../data/presetTrips'
import NavigationMode from '../components/map/NavigationMode'
import DraggableBottomSheet from '../components/map/DraggableBottomSheet'
import useRoutePlanner from '../hooks/useRoutePlanner'

import { destinations } from '../data/destinations'
import { businesses } from '../data/businesses'
import { prideItems } from '../data/sriLankaPride'
import { shuffle } from '../utils/mapHelpers'

function toArrayCoords(c) {
  if (!c) return c
  if (Array.isArray(c)) return c
  return [c.lat, c.lng]
}

const ALL_DATA = [
  ...destinations.map((d) => ({ ...d, _source: 'destinations', coordinates: toArrayCoords(d.coordinates) })),
  ...businesses.map((b) => ({ ...b, _source: 'businesses', coordinates: toArrayCoords(b.coordinates) })),
  ...prideItems.filter((p) => p.coordinates).map((p) => ({ ...p, _source: 'pride', coordinates: toArrayCoords(p.coordinates) })),
]

function TripPlannerPanel({
  allData, stops, routeGeometry, legDurations, formattedDistance, formattedDuration,
  isLoadingRoute, routeError, nearbyPlaces, activeStopIndex, itinerary,
  onAddStop, onRemoveStop, onClearStops, onReorderStops, onLoadPreset,
  onOptimize, onGenerateRoute, onStopClick, onAddNearbyToRoute, onSelectPlaceOnMap
}) {
  const [activeTab, setActiveTab] = useState('plan')
  const [searchVal, setSearchVal] = useState('')
  const [nearbyExpanded, setNearbyExpanded] = useState(false)

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100 shrink-0 bg-white">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-800 leading-tight">Road Trip Planner</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {stops.length > 0 ? `${stops.length} stop${stops.length !== 1 ? 's' : ''}${formattedDistance ? ` \u00B7 ${formattedDistance}` : ''}` : 'Add stops to plan your route'}
          </p>
        </div>
        {stops.length > 0 && (
          <button
            onClick={onClearStops}
            className="shrink-0 text-[10px] text-red-400 hover:text-red-500 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex border-b border-slate-100 shrink-0 bg-white">
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

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3">
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
              <div className="bg-red-50 rounded-xl p-3 text-xs text-red-600 flex items-start gap-2 border border-red-100">
                <span className="flex-1">{routeError}</span>
                <button
                  onClick={() => onGenerateRoute()}
                  className="flex-shrink-0 text-[11px] font-bold text-teal-600 hover:text-teal-700 underline"
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
                className="touch-manipulation w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
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
                isExpanded={nearbyExpanded}
                onToggleExpand={setNearbyExpanded}
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
  )
}

export default function Map() {
  const [searchParams] = useSearchParams()
  const hasAutoSelected = useRef(false)

  const [activeLayers, setActiveLayers] = useState({
    destinations: true,
    beaches: true,
    businesses: true,
    cultural: true,
    presetRoutes: false,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [flyToCoord, setFlyToCoord] = useState(null)

  const [showLayers, setShowLayers] = useState(true)
  const [showList, setShowList] = useState(true)
  const [sheetSnap, setSheetSnap] = useState(1)
  const [activeCategory, setActiveCategory] = useState(null)
  const [sidebarTab, setSidebarTab] = useState('places')
  const [userLocation, setUserLocation] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locateError, setLocateError] = useState(null)
  const mapInstanceRef = useRef(null)

  const rp = useRoutePlanner(ALL_DATA)

  const shuffledAllData = useMemo(() => shuffle(ALL_DATA), [])

  const filteredData = useMemo(() => {
    let data = shuffledAllData.filter((item) => {
      if (item._source === 'businesses') return activeLayers.businesses
      if (item._source === 'pride') return activeLayers.cultural
      if (item.category === 'beaches') return activeLayers.beaches
      return activeLayers.destinations
    })

    if (activeCategory) {
      switch (activeCategory) {
        case 'All':
          break
        case 'Beaches':
          data = data.filter((item) => item.category === 'beaches')
          break
        case 'Waterfalls':
          data = data.filter((item) => item.category === 'waterfalls')
          break
        case 'Mountains':
          data = data.filter((item) => item.category === 'mountains')
          break
        case 'Ancient Kingdoms':
          data = data.filter((item) => item.category === 'historical' || item.category === 'ancient-kingdoms')
          break
        case 'Religious Places':
          data = data.filter((item) => item.category === 'religious')
          break
        case 'Wildlife':
          data = data.filter((item) => item.category === 'wildlife')
          break
        case 'Parks':
          data = data.filter((item) => item.category === 'parks')
          break
        case 'Museums':
          data = data.filter((item) => item._source === 'pride' && item.category === 'museums')
          break
        case 'Hotels':
          data = data.filter((item) => item._source === 'businesses' && (item.subCategory === 'Hotels' || item.subCategory === 'Guest Houses' || item.subCategory === 'Resorts'))
          break
        case 'Shopping':
          data = data.filter((item) => item._source === 'businesses' && (item.type === 'shop' || item.category === 'shopping'))
          break
        default:
          break
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      data = data.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q) ||
          item.district?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      )
    }

    return data
  }, [activeLayers, searchQuery, activeCategory, shuffledAllData])

  const handleToggleLayer = useCallback((id) => {
    setActiveLayers((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const handleSelectItem = useCallback((item) => {
    setSelectedItem(item)
    setSheetSnap(1)
    if (item.coordinates) {
      setFlyToCoord(item.coordinates)
    }
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedItem(null)
    setSheetSnap(1)
  }, [])

  const handleMapMove = useCallback(() => {
    setSheetSnap(0)
  }, [])

  const fetchLocation = useCallback((flyTo) => {
    if (!navigator.geolocation) {
      setLocateError('Geolocation is not supported by your browser')
      return
    }
    setIsLocating(true)
    setLocateError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coord = [pos.coords.latitude, pos.coords.longitude]
        setUserLocation(coord)
        if (flyTo) setFlyToCoord(coord)
        setIsLocating(false)
        setLocateError(null)
      },
      (err) => {
        setIsLocating(false)
        setLocateError(
          err.code === 1 ? 'Location access denied. Please enable location permissions.'
          : err.code === 2 ? 'Location unavailable. Try again.'
          : 'Location request timed out. Try again.'
        )
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  const hasAutoLocated = useRef(false)

  useEffect(() => {
    if (!hasAutoLocated.current) {
      hasAutoLocated.current = true
      fetchLocation(false)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    if (hasAutoSelected.current) return
    const itemId = searchParams.get('item')
    if (!itemId) return
    const found = ALL_DATA.find((d) => d.id === itemId)
    if (found) {
      hasAutoSelected.current = true
      handleSelectItem(found)
    }
  }, [searchParams]) // eslint-disable-line

  const hasAutoLoadedTrip = useRef(false)
  useEffect(() => {
    if (hasAutoLoadedTrip.current) return
    const tripParam = searchParams.get('trip')
    if (!tripParam) return
    hasAutoLoadedTrip.current = true
    const ids = tripParam.split(',').map(s => s.trim()).filter(Boolean)
    if (ids.length >= 2) {
      rp.loadStopsByIds(ids, ALL_DATA)
      setSidebarTab('planner')
      setShowList(true)
      setSheetSnap(1)
      const presetStops = ids.map(id => ALL_DATA.find(d => d.id === id)).filter(Boolean)
      if (presetStops.length >= 2) {
        rp.generateRoute(presetStops)
      }
    }
  }, [searchParams]) // eslint-disable-line

  const handleLocate = useCallback(() => {
    fetchLocation(true)
  }, [fetchLocation])

  const handleMapReady = useCallback((map) => {
    mapInstanceRef.current = map
  }, [])

  const handleZoomOut = useCallback(() => {
    const map = mapInstanceRef.current
    if (map) {
      const currentZoom = map.getZoom()
      map.flyTo(map.getCenter(), Math.max(currentZoom - 1, 7), { duration: 0.35 })
    }
  }, [])

  const handleRouteStopClick = useCallback((index) => {
    const stop = rp.stops[index]
    if (stop) {
      rp.setActiveStopIndex(index)
      const c = toArrayCoords(stop.coordinates)
      if (c) setFlyToCoord(c)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rp.stops, rp.setActiveStopIndex])

  const handleSelectPlaceOnMap = useCallback((place) => {
    const coord = Array.isArray(place.coordinates) ? place.coordinates : null
    if (coord) setFlyToCoord(coord)
    setSelectedItem(place)
    setSheetSnap(1)
  }, [])

  const handleAddNearbyToRoute = useCallback((place) => {
    rp.addStopAtOptimal(place)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rp.addStopAtOptimal])

  const handleReroute = useCallback(() => {
    if (rp.stops.length >= 2) {
      rp.generateRoute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rp.stops, rp.generateRoute])

  const prevRouteGeoRef = useRef(null)
  useEffect(() => {
    const geo = rp.routeGeometry
    if (!geo) {
      prevRouteGeoRef.current = null
      return
    }
    if (geo === prevRouteGeoRef.current) return
    prevRouteGeoRef.current = geo

    const coords = geo.type === 'LineString' ? geo.coordinates : geo.type === 'MultiLineString' ? geo.coordinates.flat() : []
    if (coords.length === 0) return

    const bounds = L.latLngBounds(coords.map(c => [c[1], c[0]]))
    const map = mapInstanceRef.current
    if (map) {
      setTimeout(() => {
        map.flyToBounds(bounds, { padding: [60, 60], duration: 0.8, maxZoom: 13 })
      }, 300)
    }
  }, [rp.routeGeometry])

  const handlePresetLoadAndGenerate = useCallback(async (preset) => {
    if (!preset?.stopIds) return
    const presetStops = preset.stopIds
      .map(id => ALL_DATA.find(d => d.id === id))
      .filter(Boolean)
    if (presetStops.length < 2) return
    rp.loadStopsByIds(preset.stopIds, ALL_DATA)
    setSidebarTab('planner')
    setShowList(true)
    setSheetSnap(1)
    rp.generateRoute(presetStops)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rp.loadStopsByIds, rp.generateRoute])

  const plannerProps = useMemo(() => ({
    allData: ALL_DATA,
    stops: rp.stops,
    routeGeometry: rp.routeGeometry,
    legDurations: rp.legDurations,
    formattedDistance: rp.formattedDistance,
    formattedDuration: rp.formattedDuration,
    isLoadingRoute: rp.isLoadingRoute,
    routeError: rp.routeError,
    nearbyPlaces: rp.nearbyPlaces,
    activeStopIndex: rp.activeStopIndex,
    itinerary: rp.itinerary,
    onAddStop: rp.addStop,
    onRemoveStop: rp.removeStop,
    onClearStops: rp.clearStops,
    onReorderStops: rp.reorderStop,
    onLoadPreset: handlePresetLoadAndGenerate,
    onOptimize: rp.optimizeStops,
    onGenerateRoute: rp.generateRoute,
    onStopClick: handleRouteStopClick,
    onAddNearbyToRoute: handleAddNearbyToRoute,
    onSelectPlaceOnMap: handleSelectPlaceOnMap,
  }), [rp.stops, rp.routeGeometry, rp.legDurations, rp.formattedDistance, rp.formattedDuration, rp.isLoadingRoute, rp.routeError, rp.nearbyPlaces, rp.activeStopIndex, rp.itinerary, rp.addStop, rp.removeStop, rp.clearStops, rp.reorderStop, rp.optimizeStops, rp.generateRoute, handlePresetLoadAndGenerate, handleRouteStopClick, handleAddNearbyToRoute, handleSelectPlaceOnMap])

  return (
    <div className="h-full relative">
      <h1 className="sr-only">Sri Lanka Interactive Map</h1>
      <SEO
        title="Sri Lanka Interactive Map"
        description="Explore Sri Lanka with our interactive map — find destinations, hotels, restaurants, and points of interest across the island."
        keywords="Sri Lanka map, Sri Lanka travel map, Sri Lanka attractions map, Eastern Sri Lanka map, Sri Lanka guide, interactive Sri Lanka map, Sri Lanka destinations map"
        ogImage="/images/home/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/map`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Sri Lanka Interactive Travel Map',
          description: 'Explore Sri Lanka with an interactive map — find destinations, hotels, restaurants, and points of interest.',
          url: `${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/map`,
          applicationCategory: 'TravelApplication',
          operatingSystem: 'Web',
        }}
      />
      <div className="absolute inset-0 pt-16 md:pt-20">
        <div className="h-full flex overflow-hidden relative">
        <AnimatePresence>
          {showList && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="hidden md:flex absolute left-0 top-0 bottom-0 z-20 flex-col overflow-hidden rounded-3xl shadow-[4px_0_24px_rgba(0,0,0,0.06)]"
              style={{ width: 340 }}
            >
              <div className="w-[340px] h-full flex flex-col">
                {/* Tabs */}
                <div className="flex items-center border-b border-slate-100 shrink-0 bg-white">
                  <div className="flex flex-1">
                    {[
                      { id: 'places', icon: <FiMapPin className="text-xs" />, label: 'Places', count: filteredData.length },
                      { id: 'planner', icon: <FiMap className="text-xs" />, label: 'Trip Planner' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSidebarTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all ${
                          sidebarTab === tab.id
                            ? 'text-teal-600 border-b-2 border-teal-500 bg-teal-50/50'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                        {tab.count !== undefined && (
                          <span className="text-[10px] text-slate-400 font-normal">({tab.count})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                  {sidebarTab === 'places' && (
                    <MapPlaceList
                      items={filteredData}
                      selectedItem={selectedItem}
                      onSelect={handleSelectItem}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      activeCategory={activeCategory}
                      onCategoryChange={setActiveCategory}
                      onClose={() => setShowList(false)}
                      showHeader={false}
                    />
                  )}
                  {sidebarTab === 'planner' && (
                    <TripPlannerPanel
                      allData={ALL_DATA}
                      stops={rp.stops}
                      routeGeometry={rp.routeGeometry}
                      legDurations={rp.legDurations}
                      formattedDistance={rp.formattedDistance}
                      formattedDuration={rp.formattedDuration}
                      isLoadingRoute={rp.isLoadingRoute}
                      routeError={rp.routeError}
                      nearbyPlaces={rp.nearbyPlaces}
                      activeStopIndex={rp.activeStopIndex}
                      itinerary={rp.itinerary}
                      onAddStop={rp.addStop}
                      onRemoveStop={rp.removeStop}
                      onClearStops={rp.clearStops}
                      onReorderStops={rp.reorderStop}
                      onLoadPreset={handlePresetLoadAndGenerate}
                      onOptimize={rp.optimizeStops}
                      onGenerateRoute={rp.generateRoute}
                      onStopClick={handleRouteStopClick}
                      onAddNearbyToRoute={handleAddNearbyToRoute}
                      onSelectPlaceOnMap={handleSelectPlaceOnMap}
                    />
                  )}
                </div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>


        <div className="flex-1 relative">
          <MapView
            filteredData={filteredData}
            onSelectItem={handleSelectItem}
            flyToCoord={flyToCoord}
            selectedItem={selectedItem}
            userLocation={userLocation}
            onMapReady={handleMapReady}
            onMapMove={handleMapMove}
          >
            <RoutePolyline
              geometry={rp.routeGeometry}
              stops={rp.stops}
              activeStopIndex={rp.activeStopIndex}
              isActive={!!rp.routeGeometry}
              onStopSelect={handleRouteStopClick}
            />
            <PresetRoutePolylines
              allData={ALL_DATA}
              isVisible={activeLayers.presetRoutes}
              onLoadPreset={handlePresetLoadAndGenerate}
            />
          </MapView>
        </div>

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="hidden lg:block absolute right-0 top-0 bottom-0 z-20 overflow-hidden rounded-3xl shadow-[-4px_0_24px_rgba(0,0,0,0.06)]"
              style={{ width: 420 }}
            >
              <div className="w-[420px] h-full">
                <MapSidePanel item={selectedItem} onClose={handleClosePanel} plannerProps={plannerProps} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

        {/* Map Controls */}
        <div className={`fixed md:top-24 top-20 right-4 z-30 flex-col gap-2 items-end ${selectedItem ? 'hidden' : sheetSnap > 0 ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLocate}
              disabled={isLocating}
              className={`touch-manipulation w-11 h-11 rounded-xl bg-white/90 backdrop-blur-xl shadow-lg border border-white/30 flex items-center justify-center transition-all duration-200 ${
                locateError
                  ? 'text-red-400 hover:text-red-500 border-red-200'
                  : userLocation
                    ? 'text-teal-600 bg-teal-50 border-teal-200'
                    : 'text-slate-500 hover:text-teal-600 hover:bg-white'
              }`}
              title={isLocating ? 'Locating...' : 'Show my location'}
              aria-label={isLocating ? 'Locating...' : 'Show my location'}
            >
              <FiNavigation className={`text-sm ${isLocating ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowLayers(!showLayers)}
              className="touch-manipulation w-11 h-11 rounded-xl bg-white/90 backdrop-blur-xl shadow-lg border border-white/30 flex items-center justify-center text-slate-500 hover:text-teal-600 hover:bg-white transition-all duration-200"
              title="Toggle layers"
              aria-label="Toggle map layers"
            >
              <FiMap className="text-sm" />
            </button>
            <button
              onClick={handleZoomOut}
              className="touch-manipulation w-11 h-11 rounded-lg bg-white/90 backdrop-blur-xl shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-teal-600 hover:bg-white transition-all duration-200"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
          {locateError && (
            <div className="w-48 sm:w-56 p-2.5 bg-red-50 border border-red-200 rounded-lg shadow-lg">
              <p className="text-xs text-red-700">{locateError}</p>
            </div>
          )}
          {showLayers && (
            <MapLayers activeLayers={activeLayers} onToggle={handleToggleLayer} />
          )}
        </div>

      {/* Mobile Draggable Bottom Sheet */}
      <DraggableBottomSheet
        snapIndex={sheetSnap}
        onSnapChange={setSheetSnap}
      >
        {/* Tabs */}
        {!selectedItem && (
          <div className="flex items-center border-b border-slate-100 shrink-0 sticky top-0 bg-white z-10">
            <div className="flex flex-1">
              {[
                { id: 'places', icon: <FiMapPin className="text-xs" />, label: 'Places', count: filteredData.length },
                { id: 'planner', icon: <FiMap className="text-xs" />, label: 'Trip Planner' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSidebarTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all ${
                    sidebarTab === tab.id
                      ? 'text-teal-600 border-b-2 border-teal-500 bg-teal-50/50'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="text-[10px] text-slate-400 font-normal">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* List Content */}
        {!selectedItem && sidebarTab === 'places' && (
          <MapPlaceList
            items={filteredData}
            selectedItem={null}
            onSelect={handleSelectItem}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onClose={() => setSheetSnap(0)}
            showHeader={false}
          />
        )}

        {!selectedItem && sidebarTab === 'planner' && (
          <TripPlannerPanel
            allData={ALL_DATA}
            stops={rp.stops}
            routeGeometry={rp.routeGeometry}
            legDurations={rp.legDurations}
            formattedDistance={rp.formattedDistance}
            formattedDuration={rp.formattedDuration}
            isLoadingRoute={rp.isLoadingRoute}
            routeError={rp.routeError}
            nearbyPlaces={rp.nearbyPlaces}
            activeStopIndex={rp.activeStopIndex}
            itinerary={rp.itinerary}
            onAddStop={rp.addStop}
            onRemoveStop={rp.removeStop}
            onClearStops={rp.clearStops}
            onReorderStops={rp.reorderStop}
            onLoadPreset={handlePresetLoadAndGenerate}
            onOptimize={rp.optimizeStops}
            onGenerateRoute={rp.generateRoute}
            onStopClick={handleRouteStopClick}
            onAddNearbyToRoute={handleAddNearbyToRoute}
            onSelectPlaceOnMap={handleSelectPlaceOnMap}
          />
        )}

        {/* Detail Content */}
        {selectedItem && (
          <MapSidePanel item={selectedItem} onClose={handleClosePanel} plannerProps={plannerProps} />
        )}
      </DraggableBottomSheet>


      {/* Navigation Mode */}
      <NavigationMode
        isActive={rp.isNavigating}
        navPosition={rp.navPosition}
        stops={rp.stops}
        legs={rp.routeLegs}
        onStopNav={rp.stopNavigation}
        currentTurnInstruction={rp.currentTurnInstruction}
        onReroute={handleReroute}
      />
    </div>
  </div>
  )
}

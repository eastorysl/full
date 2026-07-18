import { useState, useCallback } from 'react'
import { FiX, FiMapPin, FiClock, FiDollarSign, FiSun, FiPhone, FiGlobe, FiNavigation, FiExternalLink, FiChevronRight, FiMap, FiList, FiPlay } from 'react-icons/fi'
import { getDetailPath, getCategoryLabel, getCategoryStyle } from '../../utils/mapHelpers'
import { Link } from 'react-router-dom'
import { handleImgError } from '../../utils/fallback'
import { SearchInput } from './RoadTripPlanner'
import RouteTimeline from './RouteTimeline'
import RouteSummary from './RouteSummary'
import NearbyPlaces from './NearbyPlaces'
import PresetTrips from './PresetTrips'
import { presetTrips } from '../../data/presetTrips'

const infoFields = [
  { key: 'bestTime', icon: FiSun, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Best Time' },
  { key: 'entryFee', icon: FiDollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Entry Fee' },
  { key: 'duration', icon: FiClock, color: 'text-teal-500', bg: 'bg-teal-50', label: 'Duration' },
  { key: 'phone', icon: FiPhone, color: 'text-teal-500', bg: 'bg-teal-50', label: 'Phone', isLink: true },
]

function PlaceTab({ item }) {
  const visibleInfo = infoFields.filter((f) => item[f.key])

  return (
    <div className="p-5 sm:p-6 space-y-5 pb-8">
      <div>
        <h3 className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-widest mb-2">About</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {item.description}
        </p>
      </div>

      {item.location && (
        <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm shrink-0">
            <FiMapPin className="text-white text-sm" />
          </div>
          <span className="text-slate-700 font-medium">{item.location}</span>
        </div>
      )}

      {visibleInfo.length > 0 && (
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {visibleInfo.map((field) => {
            const Icon = field.icon
            const val = item[field.key]
            return (
              <div key={field.key} className="flex items-center gap-1.5">
                <Icon className={`${field.color} text-xs shrink-0`} />
                {field.isLink ? (
                  <a href={`tel:${val}`} className="text-xs text-slate-700 hover:text-teal-600 truncate">{val}</a>
                ) : (
                  <span className="text-xs text-slate-700 truncate">{val}</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {item.website && item._source !== 'businesses' && (
        <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm shrink-0">
            <FiGlobe className="text-white text-sm" />
          </div>
          <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-medium truncate">
            {item.website.replace(/https?:\/\//, '')}
          </a>
        </div>
      )}

      {item._source !== 'businesses' && (
        <div className="flex flex-col gap-3 pt-2">
          {item.coordinates && (
            <a
              href={item.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${item.coordinates[0]},${item.coordinates[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-manipulation group flex items-center justify-center gap-3 w-full min-h-[48px] rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300"
            >
              <FiNavigation className="text-base group-hover:animate-pulse" />
              Get Directions
            </a>
          )}
          {item._source !== 'businesses' && (
            <Link
              to={getDetailPath(item)}
              className="touch-manipulation group flex items-center justify-center gap-3 w-full min-h-[48px] rounded-xl bg-white text-slate-700 border-2 border-slate-200 text-sm font-bold hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50/50 active:scale-[0.97] transition-all duration-300"
            >
              <FiExternalLink className="text-base" />
              View Full Page
              <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      )}

      {item.social && typeof item.social === 'object' && Object.keys(item.social).length > 0 && (
        <div>
          <h3 className="text-[11px] font-heading font-semibold text-slate-400 uppercase tracking-widest mb-2.5">Connect</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(item.social).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-sm font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-teal-600 border border-slate-200 hover:border-teal-300 px-3.5 py-2.5 min-h-[44px] rounded-lg capitalize transition-all duration-200"
              >
                {platform}
              </a>
            ))}
          </div>
        </div>
      )}

      {item._source === 'businesses' && (
        <div className="flex flex-col gap-3 pt-2">
          {item.website && (
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-manipulation group flex items-center justify-center gap-3 w-full min-h-[48px] rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300"
            >
              <FiGlobe className="text-base group-hover:animate-pulse" />
              Visit Website
            </a>
          )}
          {item.coordinates && (
            <a
              href={item.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${item.coordinates[0]},${item.coordinates[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-manipulation group flex items-center justify-center gap-3 w-full min-h-[48px] rounded-xl bg-white text-slate-700 border-2 border-slate-200 text-sm font-bold hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50/50 active:scale-[0.97] transition-all duration-300"
            >
              <FiNavigation className="text-base" />
              Get Directions
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function TripPlannerTab({
  allData, stops, routeGeometry, legDurations, formattedDistance, formattedDuration,
  isLoadingRoute, routeError, nearbyPlaces, activeStopIndex, itinerary,
  onAddStop, onRemoveStop, onReorderStops, onLoadPreset,
  onOptimize, onGenerateRoute, onStopClick, onAddNearbyToRoute, onSelectPlaceOnMap
}) {
  const [plannerTab, setPlannerTab] = useState('plan')
  const [searchVal, setSearchVal] = useState('')

  const handleSearchSelect = useCallback((item) => {
    onAddStop(item)
  }, [onAddStop])

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-slate-100">
        {[
          { id: 'plan', icon: <FiMap className="text-xs" />, label: 'Plan' },
          { id: 'presets', icon: <FiList className="text-xs" />, label: 'Presets' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setPlannerTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all ${
              plannerTab === tab.id
                ? 'text-teal-600 border-b-2 border-teal-500 bg-teal-50/50'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {plannerTab === 'plan' && (
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
              />
            )}
          </>
        )}

        {plannerTab === 'presets' && (
          <PresetTrips
            presets={presetTrips}
            onSelectPreset={onLoadPreset}
          />
        )}
      </div>
    </div>
  )
}

export default function MapSidePanel({ item, onClose, plannerProps }) {
  const [activeTab, setActiveTab] = useState('places')
  if (!item) return null

  const hasPlanner = !!plannerProps

  return (
    <div className="h-full bg-white overflow-y-auto custom-scrollbar flex flex-col">
      <div className="relative h-44 sm:h-56 overflow-hidden shrink-0">
        <img
          src={item.image}
          alt={item.name}
          onError={handleImgError}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="touch-manipulation absolute top-3 left-3 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
        >
          <FiX className="text-sm" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full mb-2 text-white shadow-lg ${getCategoryStyle(item)}`}>
            {getCategoryLabel(item)}
          </span>
          <h2 className="text-white font-heading font-bold text-xl sm:text-2xl leading-tight drop-shadow-sm">
            {item.name}
          </h2>
          <div className="flex items-center gap-3 mt-1.5">
            {item.district && (
              <span className="flex items-center gap-1 text-xs text-white/80">
                <FiMapPin className="text-white/80" />
                {item.district}
              </span>
            )}
          </div>
        </div>
      </div>

      {hasPlanner && (
        <div className="flex border-b border-slate-100 shrink-0">
          {[
            { id: 'places', icon: <FiMapPin className="text-xs" />, label: 'Places' },
            { id: 'trip-planner', icon: <FiMap className="text-xs" />, label: 'Trip Planner' },
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
      )}

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'places' && <PlaceTab item={item} />}
        {activeTab === 'trip-planner' && hasPlanner && (
          <TripPlannerTab {...plannerProps} />
        )}
      </div>
    </div>
  )
}

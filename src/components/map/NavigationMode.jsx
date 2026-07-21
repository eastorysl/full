import { useMemo } from 'react'
import { FiNavigation, FiClock, FiMapPin, FiX, FiAlertTriangle, FiRefreshCw, FiChevronRight } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistance, haversineDistance } from '../../services/routingService'

function remainingInfo(navPosition, stops, legs) {
  if (!navPosition || !stops || stops.length === 0) return null

  let closestIdx = 0
  let closestDist = Infinity
  stops.forEach((stop, i) => {
    const coord = Array.isArray(stop.coordinates) ? stop.coordinates : null
    if (!coord) return
    const d = haversineDistance(navPosition[0], navPosition[1], coord[0], coord[1])
    if (d < closestDist) {
      closestDist = d
      closestIdx = i
    }
  })

  const remainingStops = stops.length - closestIdx - 1
  let remDist = 0
  let remDur = 0
  for (let i = closestIdx; i < legs.length; i++) {
    remDist += legs[i].distance
    remDur += legs[i].duration
  }

  return { remainingStops, remDist, remDur, currentStop: closestIdx }
}

function isOffRoute(navPosition, legs, activeStopIndex, thresholdMeters = 200) {
  if (!navPosition || !legs?.length) return false

  const legIdx = Math.min(activeStopIndex || 0, legs.length - 1)
  const leg = legs[legIdx]
  if (!leg?.steps?.length) return false

  let minDist = Infinity
  for (const step of leg.steps) {
    const loc = step.maneuver?.location
    if (!loc) continue
    const dist = haversineDistance(navPosition[0], navPosition[1], loc[1], loc[0])
    if (dist < minDist) minDist = dist
  }

  return minDist > thresholdMeters
}

export default function NavigationMode({ isActive, navPosition, stops, legs, onStopNav, currentTurnInstruction, onReroute }) {
  const info = remainingInfo(navPosition, stops, legs)

  const offRoute = useMemo(
    () => isOffRoute(navPosition, legs, info?.currentStop),
    [navPosition, legs, info?.currentStop]
  )

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:bottom-4 lg:left-4 lg:right-auto lg:w-80"
        >
          <div className="bg-slate-900 text-white rounded-t-2xl lg:rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <FiNavigation className="text-sm animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold">Navigating</p>
                  <p className="text-[10px] text-white/70">Follow the blue route</p>
                </div>
              </div>
              <button
                onClick={onStopNav}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Stop navigation"
              >
                <FiX className="text-sm" />
              </button>
            </div>

            {/* Off-route warning */}
            {offRoute && (
              <div className="px-4 py-2.5 bg-amber-500/20 border-b border-amber-500/30">
                <div className="flex items-center gap-2">
                  <FiAlertTriangle className="text-amber-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-amber-300">You seem off route</p>
                  </div>
                  {onReroute && (
                    <button
                      onClick={onReroute}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors min-h-[44px]"
                    >
                      <FiRefreshCw className="text-[10px]" />
                      Reroute
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Next turn instruction */}
            {currentTurnInstruction && (
              <div className="px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-xl flex-shrink-0">
                    {currentTurnInstruction.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight truncate">{currentTurnInstruction.instruction}</p>
                    {currentTurnInstruction.formattedDistance && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <FiChevronRight className="text-[10px] text-blue-400" />
                        <p className="text-[10px] text-blue-400 font-medium">{currentTurnInstruction.formattedDistance}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* GPS waiting — shown when info is not yet available */}
            {!navPosition && !info && (
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 bg-amber-500/20 rounded-lg p-2.5 text-xs text-amber-300">
                  <FiAlertTriangle />
                  <span>Waiting for GPS signal...</span>
                </div>
              </div>
            )}

            {/* Info */}
            {info && (
              <div className="px-4 py-3 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <FiMapPin className="text-blue-400 mx-auto mb-0.5 text-xs" />
                    <p className="text-base font-bold">{info.remainingStops}</p>
                    <p className="text-[8px] text-white/50">Stops Left</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <FiNavigation className="text-blue-400 mx-auto mb-0.5 text-xs" />
                    <p className="text-base font-bold">{formatDistance(info.remDist)}</p>
                    <p className="text-[8px] text-white/50">Distance</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <FiClock className="text-blue-400 mx-auto mb-0.5 text-xs" />
                    <p className="text-base font-bold">
                      {info.remDur > 3600
                        ? `${Math.floor(info.remDur / 3600)}h ${Math.floor((info.remDur % 3600) / 60)}m`
                        : `${Math.floor(info.remDur / 60)}m`}
                    </p>
                    <p className="text-[8px] text-white/50">ETA</p>
                  </div>
                </div>

                {/* Next stop */}
                {info.currentStop < stops.length - 1 && (
                  <div className="bg-white/10 rounded-lg p-2.5">
                    <p className="text-[9px] text-white/50 mb-0.5">Next Stop</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold truncate">{stops[info.currentStop + 1]?.name}</p>
                      {info.currentStop + 1 < stops.length - 1 && (
                        <span className="text-[9px] text-white/40 ml-2 flex-shrink-0">
                          then {stops[info.currentStop + 2]?.name || `+${stops.length - info.currentStop - 2} more`}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

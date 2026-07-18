import { useState, useCallback, useMemo } from 'react'
import { FiClock, FiMapPin, FiNavigation, FiChevronDown, FiChevronRight, FiFlag } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistance } from '../../services/routingService'

function getStopLabel(index) {
  if (index < 26) return String.fromCharCode(65 + index)
  return String.fromCharCode(64 + Math.floor(index / 26)) + String.fromCharCode(65 + (index % 26))
}

function TurnStep({ step }) {
  const maneuverType = step.maneuver?.type || ''
  const modifier = step.maneuver?.modifier || ''
  let icon = '→'
  if (maneuverType === 'turn' || maneuverType === 'end of road') {
    if (modifier.includes('left')) icon = '↰'
    else if (modifier.includes('right')) icon = '↱'
    else if (modifier.includes('sharp')) icon = modifier.includes('left') ? '↲' : '↳'
    else if (modifier.includes('slight')) icon = modifier.includes('left') ? '↖' : '↗'
  } else if (maneuverType === 'depart') icon = '▶'
  else if (maneuverType === 'arrive') icon = '🏁'
  else if (maneuverType === 'roundabout' || maneuverType === 'rotary') icon = '⟳'
  else if (maneuverType === 'merge') icon = '⤵'
  else if (maneuverType === 'fork') icon = modifier.includes('left') ? '↰' : '↱'
  else if (maneuverType === 'new name' || maneuverType === 'continue') icon = '↑'

  const road = step.name
  const dist = step.distance > 0 ? formatDistance(step.distance) : null
  const isArrival = maneuverType === 'arrive'

  let text = ''
  if (maneuverType === 'arrive') text = 'Arrive at destination'
  else if (maneuverType === 'depart') text = road ? `Head ${modifier || 'straight'} on ${road}` : `Head ${modifier || 'straight'}`
  else {
    const action = maneuverType === 'turn' ? `Turn ${modifier}`
      : maneuverType === 'roundabout' || maneuverType === 'rotary' ? 'At roundabout'
      : maneuverType === 'merge' ? `Merge ${modifier}`
      : maneuverType === 'fork' ? `At fork, keep ${modifier}`
      : `Continue ${modifier || 'straight'}`
    text = road ? `${action} onto ${road}` : action
  }

  return (
    <div className={`flex items-start gap-2 py-1 pl-1 ${isArrival ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
      <span className="text-xs mt-0.5 w-4 text-center flex-shrink-0">{icon}</span>
      <span className="text-[10px] leading-tight flex-1">{text}</span>
      {dist && <span className="text-[9px] text-slate-400 flex-shrink-0 mt-0.5">{dist}</span>}
    </div>
  )
}

function LegSection({ leg, isExpanded, onToggle }) {
  if (!leg) return null
  const steps = leg.steps || []
  const hasSteps = steps.length > 1

  return (
    <div className="ml-4">
      <div className="flex items-center gap-2 py-1">
        <div className="w-0.5 h-6 bg-gradient-to-b from-teal-300 to-teal-500 rounded-full" />
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <FiNavigation className="text-[8px] text-teal-500" />
          <span>{leg.distance}</span>
          <span className="text-slate-300">|</span>
          <FiClock className="text-[8px] text-teal-500" />
          <span>{leg.duration}</span>
          {hasSteps && (
            <>
              <span className="text-slate-300">|</span>
              {isExpanded ? <FiChevronDown className="text-[8px]" /> : <FiChevronRight className="text-[8px]" />}
            </>
          )}
        </button>
      </div>
      <AnimatePresence>
        {isExpanded && hasSteps && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-4 border-l border-slate-200 pl-2 mb-1"
          >
            {steps.slice(0, -1).map((step, si) => (
              <TurnStep key={si} step={step} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DayMarker({ dayNumber, stopCount }) {
  return (
    <div className="flex items-center gap-2 py-2 px-2 ml-9">
      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
        <FiFlag className="text-amber-500 text-[10px]" />
        <span className="text-[10px] font-bold text-amber-700">Day {dayNumber}</span>
        <span className="text-[9px] text-amber-500">({stopCount} {stopCount === 1 ? 'stop' : 'stops'})</span>
      </div>
    </div>
  )
}

export default function RouteTimeline({ stops, legDurations, activeStopIndex, onStopClick, onRemoveStop, onReorderStops, itinerary }) {
  const [expandedLegs, setExpandedLegs] = useState({})
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const toggleLeg = useCallback((legIdx) => {
    setExpandedLegs(prev => ({ ...prev, [legIdx]: !prev[legIdx] }))
  }, [])

  const handleDragStart = useCallback((e, index) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }, [])

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }, [])

  const handleDragEnd = useCallback(() => {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      onReorderStops?.(dragIndex, dragOverIndex)
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }, [dragIndex, dragOverIndex, onReorderStops])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    handleDragEnd()
  }, [handleDragEnd])

  const dayGroups = useMemo(() => {
    const days = itinerary || [stops]
    const result = []
    let globalIdx = 0
    for (let d = 0; d < days.length; d++) {
      const dayStops = days[d].map(stop => {
        const idx = globalIdx
        globalIdx++
        return { stop, globalIndex: idx }
      })
      result.push({ dayNumber: d + 1, stops: dayStops })
    }
    return result
  }, [itinerary, stops])

  if (!stops || stops.length === 0) return null

  return (
    <div className="space-y-0">
      <AnimatePresence mode="popLayout">
        {dayGroups.map((day) => (
          <div key={`day-${day.dayNumber}`}>
            {dayGroups.length > 1 && (
              <DayMarker dayNumber={day.dayNumber} stopCount={day.stops.length} />
            )}
            {day.stops.map(({ stop, globalIndex }) => {
              const leg = legDurations[globalIndex]
              const isActive = globalIndex === activeStopIndex
              const isStart = globalIndex === 0
              const isEnd = globalIndex === stops.length - 1
              const isDragging = globalIndex === dragIndex
              const isDragOver = globalIndex === dragOverIndex && dragIndex !== null && globalIndex !== dragIndex

              return (
                <motion.div
                  key={stop.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isDragging ? 0.5 : 1,
                    x: 0,
                    scale: isDragOver ? 1.02 : 1,
                  }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25, delay: globalIndex * 0.03 }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, globalIndex)}
                  onDragOver={(e) => handleDragOver(e, globalIndex)}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                >
                  <div
                    className={`flex items-start gap-2 cursor-pointer group px-2 py-1.5 rounded-lg transition-all duration-200 ${
                      isActive ? 'bg-teal-50' : 'hover:bg-slate-50'
                    } ${isDragOver ? 'border-t-2 border-teal-400' : ''}`}
                    onClick={() => onStopClick?.(globalIndex)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') onStopClick?.(globalIndex) }}
                  >
                    <div
                      className="flex-shrink-0 mt-1.5 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors flex flex-col gap-[2px] px-0.5"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-[2px]">
                        <span className="w-[3px] h-[3px] rounded-full bg-current" />
                        <span className="w-[3px] h-[3px] rounded-full bg-current" />
                      </div>
                      <div className="flex gap-[2px]">
                        <span className="w-[3px] h-[3px] rounded-full bg-current" />
                        <span className="w-[3px] h-[3px] rounded-full bg-current" />
                      </div>
                      <div className="flex gap-[2px]">
                        <span className="w-[3px] h-[3px] rounded-full bg-current" />
                        <span className="w-[3px] h-[3px] rounded-full bg-current" />
                      </div>
                    </div>

                    <div className="relative flex-shrink-0 mt-0.5">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold
                        transition-all duration-300 shadow-sm
                        ${isStart ? 'bg-red-500 text-white' : isEnd ? 'bg-emerald-500 text-white' : 'bg-teal-500 text-white'}
                        ${isActive ? 'ring-2 ring-teal-300 ring-offset-1 scale-110' : ''}
                      `}>
                        {getStopLabel(globalIndex)}
                      </div>
                      {isActive && (
                        <div className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-30" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {isStart && (
                          <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Start</span>
                        )}
                        {isEnd && (
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">End</span>
                        )}
                      </div>
                      <p className={`text-sm font-semibold truncate mt-0.5 ${isActive ? 'text-teal-700' : 'text-slate-700'}`}>
                        {stop.name}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <FiMapPin className="text-[8px] text-teal-400" />
                        <span className="truncate">{stop.location || stop.district || ''}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveStop?.(stop.id)
                      }}
                      className="sm:opacity-0 sm:group-hover:opacity-100 opacity-60 transition-opacity duration-200 w-11 h-11 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-[10px] flex-shrink-0 self-center"
                      aria-label={`Remove ${stop.name}`}
                    >
                      {'\u00D7'}
                    </button>
                  </div>

                  {leg && (
                    <LegSection
                      leg={leg}
                      isExpanded={!!expandedLegs[globalIndex]}
                      onToggle={() => toggleLeg(globalIndex)}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

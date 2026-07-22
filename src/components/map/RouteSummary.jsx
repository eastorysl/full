import { useState, useRef, useEffect } from 'react'
import { FiMapPin, FiClock, FiNavigation, FiRefreshCw, FiCalendar, FiShare2, FiChevronDown, FiSend, FiCopy, FiDownload, FiCheck } from 'react-icons/fi'

function buildTripText({ stops, formattedDistance, formattedDuration, itinerary, url }) {
  const lines = []
  lines.push('Sri Lanka Road Trip Plan')
  lines.push('========================')
  lines.push('')

  if (formattedDistance) lines.push(`Distance: ${formattedDistance}`)
  if (formattedDuration) lines.push(`Drive Time: ${formattedDuration}`)
  if (itinerary?.length > 1) lines.push(`Duration: ${itinerary.length} day${itinerary.length > 1 ? 's' : ''}`)
  lines.push(`Stops: ${stops?.length || 0}`)
  lines.push('')

  if (itinerary?.length > 1) {
    itinerary.forEach((dayStops, i) => {
      lines.push(`--- Day ${i + 1} ---`)
      dayStops?.forEach((s, j) => {
        lines.push(`  ${j + 1}. ${s.name}${s.location ? ` - ${s.location}` : ''}`)
      })
      lines.push('')
    })
  } else {
    stops?.forEach((s, i) => {
      lines.push(`${i + 1}. ${s.name}${s.location ? ` - ${s.location}` : ''}`)
    })
    lines.push('')
  }

  if (url) {
    lines.push(`Plan this trip: ${url}`)
  }
  lines.push('')
  lines.push('Planned with Eastory SL - eastorysl.netlify.app')

  return lines.join('\n')
}

export default function RouteSummary({ formattedDistance, formattedDuration, stops, isLoading, onOptimize, itinerary }) {
  const days = itinerary?.length || 1
  const [menuOpen, setMenuOpen] = useState(false)
  const [actionStatus, setActionStatus] = useState(null)
  const menuRef = useRef(null)
  const statusTimerRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const showStatus = (type) => {
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current)
    setActionStatus(type)
    statusTimerRef.current = setTimeout(() => setActionStatus(null), 2000)
  }

  useEffect(() => {
    return () => { if (statusTimerRef.current) clearTimeout(statusTimerRef.current) }
  }, [])

  const getTripUrl = () => {
    if (!stops || stops.length < 2) return ''
    const ids = stops.map(s => s.id).filter(Boolean)
    if (ids.length < 2) return ''
    const base = window.location.origin
    const params = new URLSearchParams()
    params.set('trip', ids.join(','))
    return `${base}/map?${params.toString()}`
  }

  const getTripText = () => buildTripText({
    stops,
    formattedDistance,
    formattedDuration,
    itinerary,
    url: getTripUrl(),
  })

  const handleCopy = async () => {
    setMenuOpen(false)
    try {
      await navigator.clipboard.writeText(getTripText())
      showStatus('copied')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = getTripText()
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      showStatus('copied')
    }
  }

  const handleSend = () => {
    setMenuOpen(false)
    const text = getTripText()
    if (navigator.share) {
      navigator.share({ title: 'Sri Lanka Road Trip Plan', text }).catch(() => {})
    } else {
      const mailto = `mailto:?subject=${encodeURIComponent('Sri Lanka Road Trip Plan')}&body=${encodeURIComponent(text)}`
      window.open(mailto, '_blank')
    }
    showStatus('sent')
  }

  const handleDownload = () => {
    setMenuOpen(false)
    const blob = new Blob([getTripText()], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sri-lanka-road-trip.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showStatus('downloaded')
  }

  if (!formattedDistance && !isLoading) return null

  const getStatusLabel = () => {
    if (actionStatus === 'copied') return 'Copied!'
    if (actionStatus === 'sent') return 'Sent!'
    if (actionStatus === 'downloaded') return 'Saved!'
    return null
  }

  const statusLabel = getStatusLabel()

  return (
    <div className="bg-gradient-to-br from-teal-50 via-white to-ocean-50 rounded-xl border border-teal-100 p-4">
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 mx-auto mb-1.5">
            <FiNavigation className="text-teal-600 text-sm" />
          </div>
          <p className="text-lg font-bold text-slate-800 leading-tight">{formattedDistance || '\u2014'}</p>
          <p className="text-[10px] text-slate-400 font-medium">Distance</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-ocean-100 mx-auto mb-1.5">
            <FiClock className="text-ocean-600 text-sm" />
          </div>
          <p className="text-lg font-bold text-slate-800 leading-tight">{formattedDuration || '\u2014'}</p>
          <p className="text-[10px] text-slate-400 font-medium">Drive Time</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 mx-auto mb-1.5">
            <FiMapPin className="text-amber-600 text-sm" />
          </div>
          <p className="text-lg font-bold text-slate-800 leading-tight">{stops?.length || 0}</p>
          <p className="text-[10px] text-slate-400 font-medium">Stops</p>
        </div>
      </div>

      {days > 1 && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
            <FiCalendar className="text-amber-500 text-[10px]" />
            <span className="text-[10px] font-semibold text-amber-700">{days} day{days > 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {stops && stops.length > 2 && (
          <button
            onClick={onOptimize}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 min-h-[44px] rounded-lg bg-white border border-teal-200 text-teal-600 text-xs font-semibold hover:bg-teal-50 hover:border-teal-300 transition-all duration-200"
          >
            <FiRefreshCw className="text-[10px]" />
            Optimize places
          </button>
        )}

        {statusLabel ? (
          <div className="flex items-center justify-center gap-2 px-3 py-2 min-h-[44px] rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
            <FiCheck className="text-[10px]" />
            {statusLabel}
          </div>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              title="Share route"
            >
              <FiShare2 className="text-[10px]" />
              Share
              <FiChevronDown className={`text-[8px] transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
                <button
                  onClick={handleSend}
                  className="w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] text-left text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  <FiSend className="text-[11px] text-teal-500 flex-shrink-0" />
                  Send trip plan
                </button>
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] text-left text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  <FiCopy className="text-[11px] text-teal-500 flex-shrink-0" />
                  Copy trip plan
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] text-left text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  <FiDownload className="text-[11px] text-teal-500 flex-shrink-0" />
                  Download as .txt
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

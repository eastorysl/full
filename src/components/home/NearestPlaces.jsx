import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMapPin, FiCrosshair, FiNavigation, FiSun, FiClock, FiDollarSign, FiAward } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import Badge from '../ui/Badge'
import { destinations } from '../../data/destinations'
import { handleImgError } from '../../utils/fallback'
import { fetchRoute, haversineDistance } from '../../services/routingService'
import useGeolocation from '../../hooks/useGeolocation'

function formatRoadDistance(meters) {
  if (!meters && meters !== 0) return ''
  if (meters < 1000) return `${Math.round(meters)} m`
  if (meters < 10000) return `${(meters / 1000).toFixed(1)} km`
  return `${Math.round(meters / 1000)} km`
}

const catEmoji = {
  beaches: '\u{1F3D6}\u{FE0F}', nature: '\u{1F33F}', wildlife: '\u{1F981}', historical: '\u{1F3DB}\u{FE0F}',
  waterfalls: '\u{1F4A7}', cultural: '\u{1F3AD}', 'adventure-activities': '\u{1F9D7}',
  religious: '\u{1F6D5}', parks: '\u{1F3DE}\u{FE0F}', mountains: '\u{26F0}\u{FE0F}', forts: '\u{1F3F0}',
  'lakes & rivers': '\u{1F30A}', islands: '\u{1F3DD}\u{FE0F}', 'botanical gardens': '\u{1F33A}',
  'scenic train journeys': '\u{1F682}', viewpoints: '\u{1F441}\u{FE0F}', 'marine attractions': '\u{1F420}',
  'festivals & events': '\u{1F389}',
}

const tierConfig = {
  premium: { badge: 'premium', label: 'Premium Pick' },
  featured: { badge: 'featured', label: 'Featured' },
  free: { badge: 'free', label: '' },
}

function NearestCard({ dest, i, distance }) {
  const navigate = useNavigate()
  const tier = tierConfig[dest.tier] || tierConfig.free

  function handleClick(e) {
    if (e.target.closest('button')) return
    navigate(`/destinations/${encodeURIComponent(dest.category)}/${dest.id}`)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      navigate(`/destinations/${encodeURIComponent(dest.category)}/${dest.id}`)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3) }}
      viewport={{ once: true, margin: '-50px' }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${dest.name}`}
      className="cursor-pointer h-full"
    >
      <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 h-full flex flex-col">
        <div className="relative overflow-hidden h-48 sm:h-56">
          <img
            src={dest.image}
            alt={dest.name}
            loading="lazy"
            onError={handleImgError}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 flex gap-2">
            {dest.tier && tier.label && (
              <Badge variant={tier.badge}>
                <FiAward className="text-[10px]" />
                {tier.label}
              </Badge>
            )}
            <Badge variant="free">
              {catEmoji[dest.category] || ''} {dest.category}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-1 text-white text-xs mb-1">
              <FiMapPin className="text-teal-400" />
              <span className="text-white/80">{dest.location}</span>
            </div>
            <h3 className="text-white font-heading font-bold text-lg leading-tight truncate">
              {dest.name}
            </h3>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">
            {dest.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-2">
            {dest.district && (
              <span className="flex items-center gap-1 text-slate-500">
                <FiMapPin className="text-teal-500" />
                {dest.district} District
              </span>
            )}
            {distance != null && (
              <span className="flex items-center gap-1 text-teal-600 font-semibold">
                <FiCrosshair className="text-[10px]" />
                {formatRoadDistance(distance)} away
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
            {dest.duration && (
              <span className="flex items-center gap-1">
                <FiClock className="text-teal-500" />
                {dest.duration}
              </span>
            )}
            {dest.entryFee && (
              <span className="flex items-center gap-1">
                <FiDollarSign className="text-teal-500" />
                {dest.entryFee}
              </span>
            )}
            {dest.bestTime && (
              <span className="flex items-center gap-1 ml-auto text-amber-600">
                <FiSun className="text-amber-500" />
                {dest.bestTime}
              </span>
            )}
          </div>
          {dest.coordinates && (
            <div className="pt-2 border-t border-slate-100 mt-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(dest.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${dest.coordinates.lat},${dest.coordinates.lng}`, '_blank', 'noopener,noreferrer')
                }}
                className="inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-ocean-600 text-white text-sm font-semibold shadow-md shadow-teal-500/20 hover:shadow-teal-500/40 active:scale-[0.98] transition-all duration-300"
              >
                <FiNavigation className="text-sm" />
                Get Directions
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function NearestPlaces() {
  const [nearestPlaces, setNearestPlaces] = useState([])
  const { location: userLocation, loading: locating, error: locateError, refetch } = useGeolocation()

  useEffect(() => {
    if (!userLocation) return
    let cancelled = false

    async function loadRoadDistances() {
      const candidates = destinations
        .filter((d) => d.coordinates)
        .map((d) => ({
          ...d,
          _haversine: haversineDistance(userLocation.lat, userLocation.lng, d.coordinates.lat, d.coordinates.lng),
        }))
        .sort((a, b) => a._haversine - b._haversine)
        .slice(0, 10)

      const results = await Promise.allSettled(
        candidates.map(async (d) => {
          const route = await fetchRoute([
            [userLocation.lat, userLocation.lng],
            [d.coordinates.lat, d.coordinates.lng],
          ])
          return { ...d, distance: route ? route.distance : d._haversine * 1000 }
        })
      )

      if (cancelled) return

      const places = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)

      setNearestPlaces(places)
    }

    loadRoadDistances()
    return () => { cancelled = true }
  }, [userLocation])

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #0d9488 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0284c7 0%, transparent 50%)',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-200/40 to-transparent" />

      <div className="container-custom relative z-10">
        <SectionTitle
          subtitle="Near You"
          title="Nearest Places to Visit"
          description="Closest destinations based on your current location."
        />

        {nearestPlaces.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            <AnimatePresence mode="popLayout">
              {nearestPlaces.map((dest, i) => (
                <NearestCard key={dest.id} dest={dest} i={i} distance={dest.distance} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {nearestPlaces.length === 0 && locating && (
          <div className="text-center py-10">
            <div className="inline-flex items-center gap-2 text-teal-600 text-sm font-semibold" role="status" aria-label="Finding your location">
              <span className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              Finding your location...
            </div>
          </div>
        )}

        {nearestPlaces.length === 0 && locateError && (
          <div className="text-center py-10">
            <p className="text-slate-500 text-sm mb-3">{locateError}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-teal-50 text-teal-700 text-sm font-semibold hover:bg-teal-100 transition-colors duration-200"
            >
              <FiCrosshair className="text-sm" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

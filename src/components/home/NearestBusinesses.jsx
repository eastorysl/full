import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiPhone, FiCrosshair, FiArrowRight, FiNavigation } from 'react-icons/fi'
import SectionTitle from '../ui/SectionTitle'
import Badge from '../ui/Badge'
import { businesses } from '../../data/businesses'
import { handleImgError } from '../../utils/fallback'
import { fetchRoute, haversineDistance } from '../../services/routingService'

function formatRoadDistance(meters) {
  if (!meters && meters !== 0) return ''
  if (meters < 1000) return `${Math.round(meters)} m`
  if (meters < 10000) return `${(meters / 1000).toFixed(1)} km`
  return `${Math.round(meters / 1000)} km`
}

function NearbyCard({ business, index, distance }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col"
    >
      <div className="relative overflow-hidden h-36 sm:h-40">
        <img
          src={business.image}
          alt={business.name}
          loading="lazy"
          onError={handleImgError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        {distance != null && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/90 text-white text-[11px] font-bold backdrop-blur-sm">
            <FiCrosshair className="text-[9px]" />
            {formatRoadDistance(distance)}
          </span>
        )}
        <Badge variant="new" className="absolute top-2 right-2">
          {business.subCategory || business.type}
        </Badge>
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-white font-heading font-bold text-sm sm:text-base leading-tight truncate">
            {business.name}
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-white/70 mt-0.5">
            <FiMapPin className="text-coral-400 shrink-0" />
            <span className="truncate">{business.location}</span>
          </div>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2 mt-auto">
        {business.coordinates && (
          <div className="flex gap-2">
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 rounded-lg bg-coral-50 text-coral-700 text-xs font-semibold hover:bg-coral-100 transition-colors duration-200 shrink-0"
              >
                <FiPhone className="text-[10px]" />
                Call
              </a>
            )}
            <Link
              to={`/map?item=${business.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg bg-teal-50 text-teal-700 text-xs font-semibold hover:bg-teal-100 transition-colors duration-200"
            >
              <FiNavigation className="text-[10px]" />
              Map
            </Link>
            <a
              href={business.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${business.coordinates.lat},${business.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg bg-gradient-to-r from-teal-500 to-ocean-600 text-white text-xs font-semibold shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
            >
              <FiNavigation className="text-[10px]" />
              Directions
            </a>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function NearestBusinesses() {
  const [nearestBusinesses, setNearestBusinesses] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState(null)
  const hasLocated = useRef(false)

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocateError('Geolocation not supported')
      return
    }
    setLocating(true)
    setLocateError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        setLocateError(
          err.code === 1 ? 'Location access denied'
          : err.code === 2 ? 'Location unavailable'
          : 'Location timed out'
        )
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  useEffect(() => {
    if (!hasLocated.current) {
      hasLocated.current = true
      fetchLocation()
    }
  }, [fetchLocation])

  useEffect(() => {
    if (!userLocation) return
    let cancelled = false

    async function loadRoadDistances() {
      const candidates = businesses
        .filter((b) => b.coordinates)
        .map((b) => ({
          ...b,
          _haversine: haversineDistance(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng),
        }))
        .sort((a, b) => a._haversine - b._haversine)
        .slice(0, 12)

      const results = await Promise.allSettled(
        candidates.map(async (b) => {
          const route = await fetchRoute([
            [userLocation.lat, userLocation.lng],
            [b.coordinates.lat, b.coordinates.lng],
          ])
          return { ...b, distance: route ? route.distance : b._haversine * 1000 }
        })
      )

      if (cancelled) return

      const near = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4)

      setNearestBusinesses(near)
    }

    loadRoadDistances()
    return () => { cancelled = true }
  }, [userLocation])

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #0d9488 0%, transparent 50%)',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-coral-200/40 to-transparent" />

      <div className="container-custom relative z-10">
        <SectionTitle
          subtitle="Closest to You"
          title="Popular Near You"
          description="Top-rated hotels, tours, and services just around the corner."
        />

        {nearestBusinesses.length === 0 && locating && (
          <div className="text-center py-10">
            <div className="inline-flex items-center gap-2 text-teal-600 text-sm font-semibold" role="status" aria-label="Finding nearby businesses">
              <span className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              Finding businesses near you...
            </div>
          </div>
        )}

        {nearestBusinesses.length === 0 && locateError && (
          <div className="text-center py-10">
            <p className="text-slate-500 text-sm mb-3">{locateError}</p>
            <button
              onClick={fetchLocation}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-teal-50 text-teal-700 text-sm font-semibold hover:bg-teal-100 transition-colors duration-200"
            >
              <FiCrosshair className="text-sm" />
              Try Again
            </button>
          </div>
        )}

        {nearestBusinesses.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto">
              <AnimatePresence mode="popLayout">
                {nearestBusinesses.map((biz, i) => (
                  <NearbyCard key={biz.id} business={biz} index={i} distance={biz.distance} />
                ))}
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-8">
              <Link
                to="/discover-more"
                className="group inline-flex items-center gap-2 px-7 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-teal-600 to-ocean-500 text-white font-heading font-semibold italic text-sm shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 active:scale-[0.98] transition-all duration-300"
              >
                Discover More Businesses
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

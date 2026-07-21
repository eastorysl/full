import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiMapPin, FiPhone, FiStar, FiMap, FiCrosshair, FiNavigation } from 'react-icons/fi'
import { FaBed, FaShoppingBag, FaWater, FaHiking } from 'react-icons/fa'
import { motion } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import Badge from '../ui/Badge'
import { businesses } from '../../data/businesses'
import { handleImgError } from '../../utils/fallback'

const categoryMeta = {
  Accommodation: { icon: FaBed, color: 'text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
  Shopping: { icon: FaShoppingBag, color: 'text-pink-400', gradient: 'from-pink-500 to-rose-500' },
  'Water Sports': { icon: FaWater, color: 'text-cyan-400', gradient: 'from-cyan-500 to-teal-500' },
  Tours: { icon: FaHiking, color: 'text-emerald-400', gradient: 'from-emerald-500 to-green-500' },
}

const tierConfig = {
  premium: { badge: 'premium', label: 'Premium' },
  featured: { badge: 'featured', label: 'Featured' },
  standard: { badge: 'free', label: '' },
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

function shuffleArray(arr) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled
}

export default function Businesses() {
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

  const displayedBusinesses = useMemo(() => {
    if (userLocation) {
      const withDist = businesses
        .filter((b) => b.coordinates)
        .map((b) => ({
          ...b,
          distance: haversineDistance(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng),
        }))
      withDist.sort((a, b) => a.distance - b.distance)
      return withDist.slice(0, 4)
    }
    return shuffleArray(businesses).slice(0, 4)
  }, [userLocation])

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105" style={{ backgroundImage: 'url(/images/home/Sri_Lanka_Pride.png)' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-teal-950/80 to-slate-900/90" />
      <div className="absolute inset-0 opacity-10 bg-grid" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="container-custom relative z-10">
        <SectionTitle
          light
          subtitle={userLocation ? 'Nearest to You' : 'Local Businesses'}
          title="Support Local, Discover More"
          description={userLocation ? 'Closest businesses based on your current location.' : 'From beachfront stays to surf schools, find trusted local businesses across Eastern Sri Lanka.'}
        />

        {locating && (
          <div className="text-center py-4 sm:py-6 mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 text-white/70 text-xs sm:text-sm font-semibold">
              <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
              Finding your location...
            </div>
          </div>
        )}

        {locateError && !userLocation && (
          <div className="text-center py-4 sm:py-6 mb-4 sm:mb-6">
            <p className="text-white/50 text-xs sm:text-sm mb-3">{locateError}</p>
            <button
              onClick={fetchLocation}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/10 text-white text-xs sm:text-sm font-semibold hover:bg-white/20 transition-colors duration-200"
            >
              <FiCrosshair className="text-xs sm:text-sm" />
              Try Again
            </button>
          </div>
        )}

        {/* Mobile: 1 col, sm: 2 col, lg: 4 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto">
          {displayedBusinesses.map((biz, i) => {
            const meta = categoryMeta[biz.category] || categoryMeta.Tours
            const tier = tierConfig[biz.tier] || tierConfig.standard
            const Icon = meta.icon

            return (
              <motion.div
                key={biz.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-500 italic h-full flex flex-col"
              >
                <div className="relative overflow-hidden h-40 sm:h-44">
                  <img
                    src={biz.image}
                    alt={biz.name}
                    loading="lazy"
                    onError={handleImgError}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1.5 sm:gap-2">
                    {tier.label && (
                      <Badge variant={tier.badge}>{tier.label}</Badge>
                    )}
                    <Badge variant="free">
                      <Icon className="text-[10px] mr-1" />
                      {biz.subCategory || biz.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 sm:bottom-3 sm:left-4 sm:right-4">
                    <h3 className="text-white font-heading font-bold text-sm sm:text-base leading-tight truncate">
                      {biz.name}
                    </h3>
                  </div>
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-xs text-white/50 mb-2">
                    <FiMapPin className="text-teal-400 shrink-0" />
                    <span className="truncate">{biz.location}</span>
                    {biz.distance != null && (
                      <span className="ml-auto text-teal-300 font-semibold whitespace-nowrap">
                        <FiCrosshair className="inline text-[10px] mr-0.5" />
                        {formatDistance(biz.distance)}
                      </span>
                    )}
                  </div>

                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                    {biz.description}
                  </p>

                  {biz.rating && (
                    <div className="flex items-center gap-1 text-xs mb-2 sm:mb-3">
                      <FiStar className="text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-white">{biz.rating}</span>
                      <span className="text-white/50">rating</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-auto pt-2.5 sm:pt-3 border-t border-white/10">
                    {biz.phone && (
                      <a
                        href={`tel:${biz.phone}`}
                        className="inline-flex items-center justify-center gap-1 min-h-[44px] px-2.5 sm:px-3 rounded-lg bg-white/10 text-white text-[11px] sm:text-xs font-semibold hover:bg-white/20 transition-colors duration-200"
                      >
                        <FiPhone className="text-[10px]" />
                        Call
                      </a>
                    )}
                    {biz.coordinates && (
                      <Link
                        to={`/map?item=${biz.id}`}
                        className="inline-flex items-center justify-center gap-1 min-h-[44px] px-2.5 sm:px-3 rounded-lg bg-white/10 text-white text-[11px] sm:text-xs font-semibold hover:bg-white/20 transition-colors duration-200"
                      >
                        <FiMap className="text-[10px]" />
                        Map
                      </Link>
                    )}
                    {biz.coordinates && (
                      <a
                        href={biz.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${biz.coordinates.lat},${biz.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 min-h-[44px] px-2.5 sm:px-3 rounded-lg bg-gradient-to-r from-teal-500 to-ocean-500 text-white text-[11px] sm:text-xs font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                      >
                        <FiNavigation className="text-[10px]" />
                        Directions
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 sm:mt-10">
          <Link
            to="/discover"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-teal-500 to-ocean-500 text-white font-heading font-semibold italic text-sm shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            View All Businesses
            <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            to="/advertise"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 min-h-[44px] rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-heading font-semibold italic text-sm hover:bg-white/20 transition-all duration-300"
          >
            List Your Business
            <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
}

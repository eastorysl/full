import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiClock, FiDollarSign, FiSun, FiAward, FiNavigation } from 'react-icons/fi'
import Badge from '../ui/Badge'
import { handleImgError } from '../../utils/fallback'

export default function DestinationCard({ destination, index }) {
  const navigate = useNavigate()

  const categoryColors = {
    religious: { badge: 'featured' },
    historical: { badge: 'premium' },
    nature: { badge: 'new' },
    beaches: { badge: 'free' },
    cultural: { badge: 'featured' },
  }

  const tierConfig = {
    premium: { badge: 'premium', label: 'Premium Pick' },
    featured: { badge: 'featured', label: 'Featured' },
    standard: { badge: 'free', label: '' },
    free: { badge: 'free', label: '' },
  }

  const tier = tierConfig[destination.tier] || tierConfig.free

  function handleCardClick(e) {
    if (e.target.closest('button')) return
    navigate(`/destinations/${encodeURIComponent(destination.category)}/${destination.id}`)
  }

  function handleCardKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      navigate(`/destinations/${encodeURIComponent(destination.category)}/${destination.id}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${destination.name}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 italic cursor-pointer"
    >
      <div className="relative overflow-hidden h-48 sm:h-56">
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          onError={handleImgError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          {destination.tier && tier.label && (
            <Badge variant={tier.badge}>
              <FiAward className="text-[10px]" />
              {tier.label}
            </Badge>
          )}
          <Badge variant={categoryColors[destination.category]?.badge || 'free'}>
            {destination.category}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-1 text-white text-xs mb-1">
            <FiMapPin className="text-teal-400" />
            <span className="text-white/80">{destination.location}</span>
          </div>
          <h3 className="text-white font-heading font-bold text-lg leading-tight truncate">
            {destination.name}
          </h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-slate-600 text-sm leading-relaxed mb-4 truncate">
          {destination.description}
        </p>
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-3">
            {destination.district && (
              <span className="flex items-center gap-1 text-slate-400">
                <FiMapPin className="text-teal-500" />
                {destination.district} District
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {destination.duration && (
              <span className="flex items-center gap-1">
                <FiClock className="text-teal-500" />
                {destination.duration}
              </span>
            )}
            {destination.entryFee && (
              <span className="flex items-center gap-1">
                <FiDollarSign className="text-teal-500" />
                {destination.entryFee}
              </span>
            )}
          </div>
        </div>
        {(destination.bestTime || destination.coordinates) && (
          <div className="pt-3 border-t border-slate-100 space-y-3">
            {destination.bestTime && (
              <div className="flex items-center gap-2 text-xs">
                <FiSun className="text-amber-500" />
                <span className="text-slate-400">Best time: </span>
                <span className="font-medium text-teal-700">{destination.bestTime}</span>
              </div>
            )}
            {destination.coordinates && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const clat = destination.coordinates?.lat; const clng = destination.coordinates?.lng
                  window.open(destination.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${clat},${clng}`, '_blank', 'noopener,noreferrer')
                }}
                className="inline-flex items-center justify-center gap-2 w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-ocean-600 text-white text-sm font-semibold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <FiNavigation className="text-sm" />
                Get Directions
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

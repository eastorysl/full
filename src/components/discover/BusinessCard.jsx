import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiGlobe, FiAward, FiNavigation, FiMap } from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import Badge from '../ui/Badge'
import { handleImgError } from '../../utils/fallback'

const subBadge = {
  Hotels: 'premium', Resorts: 'premium', Villas: 'premium',
  'Eco Lodges': 'featured', 'Local Markets': 'free',
  Handicrafts: 'free', 'Souvenir Shops': 'free',
  'Gems & Jewellery': 'featured', 'Batik & Clothing': 'free',
  Surfing: 'new', Diving: 'new', Snorkeling: 'new',
  'Whale Watching': 'featured', Hiking: 'new', Cycling: 'new',
  Fishing: 'free', 'Boat Tours': 'featured', Safari: 'premium',
  'Photography Spots': 'new', Dining: 'free',
}

const tierConfig = {
  premium: { badge: 'premium', label: 'Premium Pick' },
  featured: { badge: 'featured', label: 'Featured' },
  free: { badge: 'free', label: '' },
}

export default function BusinessCard({ business, index }) {
  const tier = tierConfig[business.tier] || tierConfig.free
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100"
    >
      <div className="relative overflow-hidden h-52 sm:h-56">
        <img
          src={business.image}
          alt={business.name}
          loading="lazy"
          onError={handleImgError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          {business.tier && tier.label && (
            <Badge variant={tier.badge}>
              <FiAward className="text-[10px]" />
              {tier.label}
            </Badge>
          )}
          <Badge variant={subBadge[business.subCategory] || 'free'}>
            {business.subCategory || business.type}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-1 text-white text-xs mb-1">
            <FiMapPin className="text-coral-400" />
            <span className="text-white/80">{business.location}</span>
          </div>
          <h3 className="text-white font-heading font-bold text-lg leading-tight truncate">
            {business.name}
          </h3>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-slate-400">{business.subCategory || business.category}</span>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed mb-4 truncate">
          {business.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
          {business.district && (
            <span className="flex items-center gap-1 text-slate-400">
              <FiMapPin className="text-coral-500" />
              {business.district} District
            </span>
          )}

        </div>
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-full bg-coral-50 text-coral-700 text-xs font-semibold shadow-sm hover:bg-coral-100 hover:shadow-md transition-all duration-300"
            >
              <FiPhone className="text-xs" />
              {business.phone}
            </a>
          )}
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-full bg-slate-100 text-slate-700 text-xs font-semibold shadow-sm hover:bg-slate-200 hover:shadow-md transition-all duration-300"
            >
              <FiGlobe className="text-xs" />
              Website
            </a>
          )}
          {business.social?.facebook && (
            <a
              href={business.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-[44px] h-[44px] rounded-full bg-blue-50 text-blue-600 shadow-sm hover:bg-blue-100 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Facebook"
            >
              <FaFacebook className="text-lg" />
            </a>
          )}
          {business.social?.instagram && (
            <a
              href={business.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-[44px] h-[44px] rounded-full bg-pink-50 text-pink-600 shadow-sm hover:bg-pink-100 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Instagram"
            >
              <FaInstagram className="text-lg" />
            </a>
          )}
          {business.social?.youtube && (
            <a
              href={business.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-[44px] h-[44px] rounded-full bg-red-50 text-red-600 shadow-sm hover:bg-red-100 hover:shadow-md hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="YouTube"
            >
              <FaYoutube className="text-lg" />
            </a>
          )}
        </div>
        {business.coordinates && (
          <div className="flex gap-2 mt-2">
            <Link
              to={`/map?item=${business.id}`}
              className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-teal-50 text-teal-700 text-sm font-semibold shadow-sm hover:bg-teal-100 hover:shadow-md transition-all duration-300"
            >
              <FiMap className="text-base" />
              Show on Map
            </Link>
            <a
              href={business.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${business.coordinates.lat},${business.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-coral-50 text-coral-700 text-sm font-semibold shadow-sm hover:bg-coral-100 hover:shadow-md transition-all duration-300"
            >
              <FiNavigation className="text-base" />
              Get Directions
            </a>
          </div>
        )}
      </div>
    </motion.div>
  )
}

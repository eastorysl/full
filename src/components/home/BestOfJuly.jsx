import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiMapPin, FiSun, FiClock, FiDollarSign, FiAward, FiCalendar, FiNavigation } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import Badge from '../ui/Badge'
import { destinations } from '../../data/destinations'
import { prideItems } from '../../data/sriLankaPride'
import { getSeasonalDestinations, getSeasonalFoods, monthName } from '../../utils/season'
import { handleImgError } from '../../utils/fallback'
import { shuffle } from '../../utils/mapHelpers'

function getRandomItems(arr, count) {
  return shuffle(arr).slice(0, count)
}

const popularCategories = [
  'All', 'Beaches', 'Nature', 'Wildlife', 'Historical', 'Waterfalls', 'Cultural', 'Adventure Activities'
]

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

function SeasonalCard({ dest, i }) {
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
      exit={{ opacity: 0, y: -20 }}
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

function SeasonalFoodCard({ food, i }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3) }}
      viewport={{ once: true, margin: '-50px' }}
    >
      <Link to={`/sri-lanka-pride/${food.category}/${food.id}`} className="block cursor-pointer h-full">
        <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-teal-200 h-full flex flex-col bg-white">
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src={food.image}
              alt={food.name}
              loading="lazy"
              onError={handleImgError}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <h3 className="text-white font-heading font-bold text-lg leading-tight truncate">
                {food.name}
              </h3>
            </div>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-3">
              {food.description}
            </p>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-2">
              {food.seasonMonths ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-semibold">
                  <FiCalendar className="text-[10px]" />
                  {food.seasonMonths}
                </span>
              ) : food.period ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-semibold">
                  <FiCalendar className="text-[10px]" />
                  {food.period}
                </span>
              ) : null}
              {food.seasonName && (
                <span>
                  {food.seasonName}
                </span>
              )}
            </div>
            {food.location && (
              <div className="flex items-center gap-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <FiMapPin className="text-teal-500" />
                <span className="truncate">{food.location}</span>
              </div>
            )}
            <div className="mt-auto pt-3">
              <span className="flex items-center justify-center gap-2 w-full min-h-[44px] rounded-xl bg-gradient-to-r from-teal-500 to-ocean-600 text-white text-sm font-semibold shadow-md shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all duration-300">
                View Details
                <FiArrowRight className="text-sm" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function BestOfJuly() {
  const [activeCategory, setActiveCategory] = useState('All')
  const now = new Date()
  const currentMonth = monthName(now.getMonth() + 1)
  const monthLabel = currentMonth

  const { places, foods, isDestFallback, isFoodFallback } = useMemo(() => {
    let dests = getSeasonalDestinations(destinations, currentMonth, activeCategory).slice(0, 2)
    let isDestFallback = false
    if (dests.length === 0) {
      const fallbackPool = activeCategory === 'All'
        ? destinations
        : destinations.filter(d => d.category === activeCategory.toLowerCase())
      dests = getRandomItems(fallbackPool.length > 0 ? fallbackPool : destinations, 2)
      isDestFallback = true
    }

    let seasonalFoods = getSeasonalFoods(prideItems, currentMonth).slice(0, 1)
    let isFoodFallback = false
    if (seasonalFoods.length === 0) {
      seasonalFoods = getRandomItems(prideItems, 1)
      isFoodFallback = true
    }

    return { places: dests, foods: seasonalFoods, isDestFallback, isFoodFallback }
  }, [currentMonth, activeCategory])

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-slate-50">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #0d9488 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0284c7 0%, transparent 50%)',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-200/40 to-transparent" />

      <div className="container-custom relative z-10">
        <SectionTitle
          subtitle={isDestFallback && isFoodFallback ? 'Curated for You' : `Seasonal Picks — ${monthLabel}`}
          title={isDestFallback && isFoodFallback ? 'Explore Sri Lanka' : `Best of ${monthLabel}`}
          description={isDestFallback && isFoodFallback ? 'Handpicked destinations and highlights to inspire your next trip.' : `Top-rated destinations and seasonal treats at their peak in ${monthLabel}.`}
        />

        {/* Filter bar */}
        <div className="flex gap-2 mb-8 overflow-x-auto scroll-smooth no-scrollbar justify-start lg:flex-wrap lg:justify-center lg:overflow-visible">
          {popularCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-bold font-body transition-all duration-300 whitespace-nowrap shrink-0 lg:whitespace-normal lg:shrink ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-600 hover:shadow-md'
              }`}
            >
              {cat !== 'All' && <span className="mr-1.5">{catEmoji[cat.toLowerCase().replace(/\s+/g, '-')]}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Seasonal destinations + food */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto mb-10">
          <AnimatePresence mode="popLayout">
            {places.map((dest, i) => (
              <SeasonalCard key={dest.id} dest={dest} i={i} />
            ))}
            {!isFoodFallback && foods.map((f, i) => (
              <SeasonalFoodCard key={f.id} food={f} i={places.length + i} />
            ))}
          </AnimatePresence>
        </div>

        {places.length === 0 && foods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">No seasonal picks found for {monthLabel}.</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to={isDestFallback ? '/destinations' : `/destinations?month=${currentMonth}`}
            className="group inline-flex items-center gap-2 px-7 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-teal-600 to-ocean-500 text-white font-heading font-semibold italic text-sm shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 active:scale-[0.98] transition-all duration-300"
          >
            {isDestFallback ? 'Explore All Destinations' : 'View Seasonal Destinations'}
            <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          {!isFoodFallback && (
            <Link
              to="/sri-lanka-pride?category=Seasonal+Foods"
              className="group inline-flex items-center gap-2 px-7 py-3 min-h-[44px] rounded-xl bg-white text-slate-700 font-heading font-semibold italic text-sm border border-slate-200 shadow-sm hover:border-teal-300 hover:text-teal-700 hover:shadow-md active:scale-[0.98] transition-all duration-300"
            >
              Explore Seasonal Foods
              <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

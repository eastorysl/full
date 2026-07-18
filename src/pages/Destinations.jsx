import { useMemo, useState, useRef, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SectionTitle from '../components/ui/SectionTitle'
import { destinations } from '../data/destinations'
import SearchBar from '../components/ui/SearchBar'
import SEO from '../components/seo/SEO'
import DestinationGrid from '../components/tourism/DestinationGrid'
import { handleImgError } from '../utils/fallback'
import { getSeasonalDestinations } from '../utils/season'
import { shuffle } from '../utils/mapHelpers'
import { FiSearch, FiChevronLeft, FiChevronRight, FiMap, FiHome } from 'react-icons/fi'
import { GiBeachBall, GiTreeBranch, GiWaterfall, GiMountainCave, GiElephantHead, GiForest, GiCastle, GiIsland, GiFlowerPot, GiBinoculars, GiDolphin, GiParachute, GiPartyPopper } from 'react-icons/gi'
import { FaLandmark, FaChurch, FaMusic, FaTrain } from 'react-icons/fa'

const categories = ['All', 'Beaches', 'Nature', 'Waterfalls', 'Mountains', 'Wildlife', 'Parks', 'Historical', 'Religious', 'Forts', 'Lakes & Rivers', 'Islands', 'Botanical Gardens', 'Culture', 'Scenic Train Journeys', 'Viewpoints', 'Marine Attractions', 'Adventure Activities', 'Festivals & Events']

const catIcons = {
  'Beaches': GiBeachBall, 'Nature': GiTreeBranch, 'Waterfalls': GiWaterfall,
  'Mountains': GiMountainCave, 'Wildlife': GiElephantHead, 'Parks': GiForest,
  'Historical': FaLandmark, 'Religious': FaChurch, 'Forts': GiCastle,
  'Lakes & Rivers': FiMap, 'Islands': GiIsland, 'Botanical Gardens': GiFlowerPot,
  'Culture': FaMusic, 'Scenic Train Journeys': FaTrain, 'Viewpoints': GiBinoculars,
  'Marine Attractions': GiDolphin, 'Adventure Activities': GiParachute,
  'Festivals & Events': GiPartyPopper,
}

const categoryMap = {
  beaches: 'Beaches', nature: 'Nature', waterfalls: 'Waterfalls',
  mountains: 'Mountains', wildlife: 'Wildlife', parks: 'Parks',
  historical: 'Historical', religious: 'Religious', forts: 'Forts',
  'lakes & rivers': 'Lakes & Rivers', islands: 'Islands',
  'botanical gardens': 'Botanical Gardens', cultural: 'Culture',
  'scenic train journeys': 'Scenic Train Journeys', viewpoints: 'Viewpoints',
  'marine attractions': 'Marine Attractions',
  'adventure activities': 'Adventure Activities',
  'festivals & events': 'Festivals & Events',
}

const reverseMap = Object.fromEntries(Object.entries(categoryMap).map(([k, v]) => [v, k]))

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const seasonMonth = searchParams.get('month')
  const [activeCategory, setActiveCategory] = useState(seasonMonth ? '' : 'All')

  const clearSeason = () => {
    if (seasonMonth) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete('month')
        return next
      }, { replace: true })
    }
  }
  const [showSearch, setShowSearch] = useState(false)
  const [scrollStart, setScrollStart] = useState(true)
  const [scrollEnd, setScrollEnd] = useState(false)
  const scrollRef = useRef(null)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setScrollStart(el.scrollLeft <= 2)
    setScrollEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    updateScrollState()
    const onResize = () => updateScrollState()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      const btn = scrollRef.current.querySelector('[data-active="true"]')
      if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeCategory])

  const shuffled = useMemo(() => shuffle(destinations), [])

  const handleCategoryChange = (cat) => {
    clearSeason()
    setActiveCategory(cat)
  }

  const handleSearchChange = (val) => {
    clearSeason()
    setSearch(val)
  }

  const filtered = useMemo(() => {
    let result = shuffled
    if (seasonMonth) {
      const cat = !activeCategory || activeCategory === 'All' ? 'All' : reverseMap[activeCategory]
      result = getSeasonalDestinations(result, seasonMonth, cat)
    } else {
      const dataCat = reverseMap[activeCategory]
      if (activeCategory && activeCategory !== 'All') result = result.filter((d) => d.category === dataCat)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          (d.district && d.district.toLowerCase().includes(q)) ||
          d.category.toLowerCase().includes(q)
      )
    }
    return result
  }, [search, activeCategory, shuffled, seasonMonth])

  return (
    <div>
      <SEO
        title="Sri Lanka Destinations — Top Places to Visit"
        description="Explore the best destinations in Sri Lanka — beaches, mountains, wildlife sanctuaries, historical sites, and cultural landmarks across the island."
        keywords="Sri Lanka destinations, Sri Lanka attractions, best places to visit Sri Lanka, Sri Lanka beaches, Sri Lanka nature, Sri Lanka waterfalls, Sri Lanka national parks, Sri Lanka historical sites"
        ogImage="/images/home/Destinations.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/destinations`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Sri Lanka Destinations — Top Places to Visit',
          description: 'Explore the best destinations in Sri Lanka — beaches, mountains, wildlife sanctuaries, historical sites, and cultural landmarks.',
          url: `${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/destinations`,
        }}
      />
      <section className="relative pt-28 md:pt-32 pb-10 md:pb-12 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <img src="/images/home/Destinations.png" alt="" onError={handleImgError} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-teal-950/75 to-slate-900/85" />
        </div>
        <div className="container-custom relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <SectionTitle
            as="h1"
            subtitle="Explore Sri Lanka"
            title="Destinations"
            description="From ancient temples and colonial forts to national parks and natural wonders — discover the rich heritage and beauty of Sri Lanka."
            light
          />
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] bg-white/10 hover:bg-white/20 text-white text-sm font-medium mt-6 rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
          >
            <FiHome /> Home
          </Link>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-bold font-['Poppins'] items-center gap-2 shrink-0 transition-all duration-300 hidden lg:flex ${
                showSearch
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                  : 'bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 border border-slate-200'
              }`}
              aria-label="Toggle search"
            >
              <FiSearch />
              Search
            </button>
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <button
                onClick={() => scroll(-1)}
                disabled={scrollStart}
                className={`hidden lg:flex min-h-[44px] w-12 items-center justify-center rounded-full border transition-all duration-300 shrink-0 ${
                  scrollStart
                    ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                    : 'bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 border-slate-200'
                }`}
                aria-label="Scroll left"
              >
                <FiChevronLeft />
              </button>
              <div ref={scrollRef} onScroll={updateScrollState} className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar">
                {categories.map((cat) => {
                  const Icon = catIcons[cat]
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      data-active={activeCategory === cat || undefined}
                       className={`min-h-[44px] px-4 py-2 rounded-full text-sm font-bold font-['Poppins'] transition-all duration-300 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                        activeCategory === cat
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                          : 'bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 border border-slate-200'
                      }`}
                    >
                      {Icon && <Icon className="text-sm" />}
                      {cat}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => scroll(1)}
                disabled={scrollEnd}
                className={`hidden lg:flex min-h-[44px] w-12 items-center justify-center rounded-full border transition-all duration-300 shrink-0 ${
                  scrollEnd
                    ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                    : 'bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 border-slate-200'
                }`}
                aria-label="Scroll right"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
          <div className={`mb-6 ${showSearch ? '' : 'lg:hidden'}`}>
            <SearchBar value={search} onChange={handleSearchChange} placeholder="Search destinations..." />
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg mb-2">No destinations found</p>
              <p className="text-slate-400 text-sm">Try adjusting your search or filter</p>
            </div>
          ) : (
            <DestinationGrid destinations={filtered} />
          )}
        </div>
      </section>
    </div>
  )
}

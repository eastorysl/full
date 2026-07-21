import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../components/ui/SectionTitle'
import { businesses } from '../data/businesses'
import SearchBar from '../components/ui/SearchBar'
import SEO from '../components/seo/SEO'
import BusinessGrid from '../components/discover/BusinessGrid'
import { FiSearch, FiChevronLeft, FiChevronRight, FiHome } from 'react-icons/fi'
import { shuffle } from '../utils/mapHelpers'
import { GiVillage, GiShop, GiSurfBoard, GiDivingHelmet, GiSnorkel, GiWhaleTail, GiHiking, GiFishing, GiSailboat, GiPhotoCamera, GiCompass } from 'react-icons/gi'
import { FaBicycle } from 'react-icons/fa'

const categories = ['All', 'Hotels', 'Resorts', 'Guest Houses', 'Souvenir Shops', 'Surfing', 'Diving', 'Snorkeling', 'Whale Watching', 'Hiking', 'Cycling', 'Fishing', 'Boat Tours', 'Safari', 'Photography Spots']

const catIcons = {
  'Hotels': FiHome, 'Resorts': GiVillage, 'Guest Houses': GiVillage, 'Souvenir Shops': GiShop,
  'Surfing': GiSurfBoard, 'Diving': GiDivingHelmet, 'Snorkeling': GiSnorkel,
  'Whale Watching': GiWhaleTail, 'Hiking': GiHiking, 'Cycling': FaBicycle,
  'Fishing': GiFishing, 'Boat Tours': GiSailboat, 'Safari': GiCompass,
  'Photography Spots': GiPhotoCamera,
}

export default function DiscoverMore() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
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

  const shuffled = useMemo(() => shuffle(businesses), [])

  const filtered = useMemo(() => {
    let result = activeCategory === 'All' ? shuffled : shuffled.filter((b) => b.subCategory === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          (b.district && b.district.toLowerCase().includes(q)) ||
          (b.subCategory && b.subCategory.toLowerCase().includes(q))
      )
    }
    return result
  }, [activeCategory, search, shuffled])

  return (
    <div>
      <SEO
        title="Discover Sri Lanka — Local Businesses"
        description="Discover local businesses, shops, and services across Eastern Sri Lanka — from hotels and restaurants to adventure tours and cultural experiences."
        keywords="Sri Lanka businesses, Eastern Sri Lanka shops, hotels Sri Lanka, restaurants Sri Lanka, local services Sri Lanka, Sri Lanka tour operators, Sri Lanka activities"
        ogImage="/images/discover/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/discover-more`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Discover Sri Lanka — Local Businesses, Hotels & Activities',
          description: 'Discover local businesses, shops, and services across Eastern Sri Lanka.',
          url: `${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/discover-more`,
        }}
      />
      <section className="relative pt-28 md:pt-32 pb-10 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/discover/hero.png)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-teal-950/85 to-slate-900/85">
          <div className="absolute inset-0 opacity-10 bg-grid" />
        </div>
        <div className="container-custom relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <SectionTitle
            as="h1"
            subtitle="Stay, Shop & Activities"
        title="Discover more"
            description="Find accommodations, local shopping, and adventure activities across Sri Lanka."
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
                      onClick={() => setActiveCategory(cat)}
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
                    : 'bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 border border-slate-200'
                }`}
                aria-label="Scroll right"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
          <div className={`mb-6 ${showSearch ? '' : 'lg:hidden'}`}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search discover more..." />
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg mb-2">No results found</p>
              <p className="text-slate-500 text-sm">Try adjusting your search or filter</p>
            </div>
          ) : (
            <BusinessGrid businesses={filtered} />
          )}
        </div>
      </section>
    </div>
  )
}

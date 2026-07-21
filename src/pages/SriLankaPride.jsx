import { useMemo, useState, useRef, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiGrid, FiSearch, FiChevronLeft, FiChevronRight, FiHome } from 'react-icons/fi'
import { GiCrown, GiCaveEntrance, GiTeapotLeaves, GiFruitTree } from 'react-icons/gi'
import { FaLandmark, FaCity, FaUtensils, FaUsers } from 'react-icons/fa'
import SectionTitle from '../components/ui/SectionTitle'
import SEO from '../components/seo/SEO'
import SearchBar from '../components/ui/SearchBar'
import PrideCard from '../components/pride/PrideCard'
import { prideItems } from '../data/sriLankaPride'
import { handleImgError } from '../utils/fallback'
import { shuffle } from '../utils/mapHelpers'

const prideCategoryMap = {
  'ancient-kingdoms': 'Ancient Kingdoms',
  'caves-geological-wonders': 'Caves & Geology',
  'museums': 'Museums',
  'cities-urban': 'Cities & Urban',
  'food-culinary': 'Food & Culinary',
  'seasonal-foods': 'Seasonal Foods',
  'tea-spice-trails': 'Tea & Spice Trails',
  'famous-people': 'Famous People',
}

const reverseMap = Object.fromEntries(Object.entries(prideCategoryMap).map(([k, v]) => [v, k]))
const categories = ['All', ...Object.values(prideCategoryMap)]

const catIcons = {
  'Ancient Kingdoms': GiCrown, 'Caves & Geology': GiCaveEntrance,
  'Museums': FaLandmark, 'Cities & Urban': FaCity,
  'Food & Culinary': FaUtensils, 'Seasonal Foods': GiFruitTree,
  'Tea & Spice Trails': GiTeapotLeaves,
  'Famous People': FaUsers,
}

const subCategories = [
  { key: 'all', label: 'All' },
  { key: 'national-heroes', label: 'National Heroes' },
  { key: 'sports-legends', label: 'Sports Legends' },
  { key: 'arts-entertainment', label: 'Arts & Entertainment' },
  { key: 'science-tech', label: 'Science & Tech' },
  { key: 'writers-literature', label: 'Writers & Literature' },
  { key: 'global-achievers', label: 'Global Achievers' },
]

export default function SriLankaPride() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [showSearch, setShowSearch] = useState(false)
  const [activeSub, setActiveSub] = useState('all')
  const [scrollStart, setScrollStart] = useState(true)
  const [scrollEnd, setScrollEnd] = useState(false)
  const scrollRef = useRef(null)
  const prevCategoryParam = useRef(searchParams.get('category'))

  useEffect(() => {
    const param = searchParams.get('category')
    if (param && param !== prevCategoryParam.current) {
      prevCategoryParam.current = param
      setActiveCategory(param)
      setActiveSub('all')
    }
  }, [searchParams])

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

  const subScrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      const btn = scrollRef.current.querySelector('[data-active="true"]')
      if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeCategory])

  useEffect(() => {
    if (subScrollRef.current) {
      const btn = subScrollRef.current.querySelector('[data-active-sub="true"]')
      if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeSub])

  const shuffled = useMemo(() => shuffle(prideItems), [])

  const filtered = useMemo(() => {
    const dataCat = reverseMap[activeCategory]
    let result = activeCategory === 'All' ? shuffled : shuffled.filter((d) => d.category === dataCat)
    if (activeCategory === 'Famous People' && activeSub !== 'all') {
      result = result.filter((d) => d.subCategory === activeSub)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.location && d.location.toLowerCase().includes(q)) ||
          (d.district && d.district.toLowerCase().includes(q)) ||
          (d.origin && d.origin.toLowerCase().includes(q)) ||
          (d.birthPlace && d.birthPlace.toLowerCase().includes(q)) ||
          (d.seasonMonths && d.seasonMonths.toLowerCase().includes(q)) ||
          (d.seasonName && d.seasonName.toLowerCase().includes(q))
      )
    }
    return result
  }, [search, activeCategory, activeSub, shuffled])

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setActiveSub('all')
  }

  return (
    <div>
      <SEO
        title="Sri Lanka Pride — Culture & Heritage"
        description="Discover Sri Lanka's proudest achievements — ancient kingdoms, UNESCO sites, cultural treasures, and natural wonders that make the island unique."
        keywords="Sri Lanka pride, Sri Lanka heritage, UNESCO Sri Lanka, ancient kingdoms Sri Lanka, Sri Lanka culture, Sri Lanka famous people, Sri Lanka culinary heritage"
        ogImage="/images/home/Sri_Lanka_Pride.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/sri-lanka-pride`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Sri Lanka Pride — Heritage, Culture & Achievements',
          description: 'Discover Sri Lanka proudest achievements — ancient kingdoms, UNESCO sites, cultural treasures, and natural wonders.',
          url: `${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/sri-lanka-pride`,
        }}
      />
      <section className="relative pt-28 md:pt-32 pb-10 md:pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/home/Sri_Lanka_Pride.png" alt="" onError={handleImgError} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-teal-950/75 to-slate-900/85" />
        </div>
        <div className="container-custom relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <SectionTitle
            as="h1"
            subtitle="Our Heritage"
            title="Sri Lanka Pride"
            description="Explore the people, food, heritage sites, and festivals that make Sri Lanka unforgettable."
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
                  const Icon = cat === 'All' ? FiGrid : catIcons[cat]
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
                    : 'bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 border border-slate-200'
                }`}
                aria-label="Scroll right"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
          {activeCategory === 'Famous People' && (
            <div ref={subScrollRef} className="flex gap-2 mb-6 overflow-x-auto scroll-smooth no-scrollbar">
              {subCategories.map((sub) => {
                const isActive = activeSub === sub.key
                return (
                  <button
                    key={sub.key}
                    onClick={() => setActiveSub(sub.key)}
                    data-active-sub={isActive || undefined}
                    className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bold font-['Poppins'] transition-all duration-300 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                        : 'bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 border border-slate-200'
                    }`}
                  >
                    {sub.label}
                  </button>
                )
              })}
            </div>
          )}
          <div className={`mb-6 ${showSearch ? '' : 'lg:hidden'}`}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search pride content..." />
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg mb-2">No results found</p>
              <p className="text-slate-500 text-sm">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filtered.map((item, i) => (
                <PrideCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

import { useParams, Link, useLocation } from 'react-router-dom'
import { FiArrowLeft, FiMapPin, FiCalendar, FiNavigation, FiAward, FiCamera, FiMap, FiShare2, FiHome } from 'react-icons/fi'
import { GiCrown, GiCaveEntrance, GiTeapotLeaves, GiFruitTree } from 'react-icons/gi'
import { FaLandmark, FaCity, FaUtensils, FaUsers } from 'react-icons/fa'
import { prideItems } from '../data/sriLankaPride'
import { distanceFromColombo } from '../utils/distance'
import SEO from '../components/seo/SEO'
import { handleImgError } from '../utils/fallback'
import SimilarPlaces from '../components/ui/SimilarPlaces'
import EmailFeedback from '../components/ui/EmailFeedback'

const catMeta = {
  'ancient-kingdoms': { icon: GiCrown, label: 'Ancient Kingdom', gradient: 'from-amber-950 to-yellow-900', color: 'amber' },
  'caves-geological-wonders': { icon: GiCaveEntrance, label: 'Cave & Geology', gradient: 'from-stone-900 to-neutral-800', color: 'stone' },
  'museums': { icon: FaLandmark, label: 'Museum', gradient: 'from-indigo-950 to-purple-900', color: 'indigo' },
  'cities-urban': { icon: FaCity, label: 'City & Urban', gradient: 'from-blue-950 to-cyan-900', color: 'blue' },
  'food-culinary': { icon: FaUtensils, label: 'Food & Culinary', gradient: 'from-rose-950 to-red-900', color: 'red' },
  'seasonal-foods': { icon: GiFruitTree, label: 'Seasonal Food', gradient: 'from-orange-950 to-amber-900', color: 'orange' },
  'tea-spice-trails': { icon: GiTeapotLeaves, label: 'Tea & Spice Trail', gradient: 'from-emerald-950 to-green-900', color: 'green' },
  'famous-people': { icon: FaUsers, label: 'Famous Person', gradient: 'from-pink-950 to-rose-900', color: 'rose' },
}

const subLabelMap = {
  'national-heroes': 'National Hero',
  'sports-legends': 'Sports Legend',
  'arts-entertainment': 'Arts & Entertainment',
  'science-tech': 'Science & Technology',
  'writers-literature': 'Writer & Literature',
  'global-achievers': 'Global Achiever',
}

export default function PrideDetail() {
  const { category, id } = useParams()
  const location = useLocation()
  const item = prideItems.find((p) => p.id === id && p.category === category)
  const meta = catMeta[category] || catMeta['ancient-kingdoms']
  const Icon = meta.icon
  const isFamous = category === 'famous-people'
  const isSeasonal = category === 'seasonal-foods'

  const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'
  const shareUrl = `${SITE_URL}${location.pathname}`
  const shareTitle = `Discover ${item?.name} in Sri Lanka`
  const shareText = item?.description || ''

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl })
      } catch {}
    } else {
      try { await navigator.clipboard.writeText(shareUrl) } catch {}
    }
  }

  if (!item) {
    return (
      <div className="min-h-screen pt-28 px-4">
        <div className="container-custom text-center py-20">
          <p className="text-slate-400 text-lg mb-4">Item not found</p>
          <Link to="/sri-lanka-pride" className="text-teal-600 hover:underline">Back to Sri Lanka Pride</Link>
        </div>
      </div>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': isFamous ? 'Person' : 'TouristAttraction',
    name: item.name,
    description: item.description,
    image: item.image?.startsWith('http') ? item.image : `${SITE_URL}${item.image}`,
    url: `${SITE_URL}/sri-lanka-pride/${category}/${id}`,
    ...(item.period && !isFamous && { about: `${item.description} Period: ${item.period}` }),
    ...(isFamous && item.birthYear && { birthDate: item.birthYear, birthPlace: item.birthPlace }),
    ...(item.coordinates && { geo: { '@type': 'GeoCoordinates', latitude: item.coordinates.lat, longitude: item.coordinates.lng } }),
  }

  return (
    <div>
      <SEO
        title={item.name}
        description={`${item.description} ${item.period ? 'Period: ' + item.period : ''} ${item.location || item.origin || ''}`}
        ogType="article"
        ogImage={item.image}
        ogUrl={`${SITE_URL}/sri-lanka-pride/${category}/${id}`}
        keywords={`${item.name}, ${meta.label}, ${item.location || item.origin || ''}, Sri Lanka heritage, Sri Lanka culture, Sri Lanka pride`}
        jsonLd={jsonLd}
      />
      <section className={`relative pt-28 md:pt-32 pb-16 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-90`}>
          <div className="absolute inset-0 opacity-10 bg-grid" />
        </div>
        <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
            >
              <FiHome /> Home
            </Link>
            <Link
              to="/sri-lanka-pride"
              className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
            >
              <FiArrowLeft /> Back to Sri Lanka Pride
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
            <div className="w-full md:w-80 lg:w-96 shrink-0">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img src={item.image} alt={item.name} onError={handleImgError} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm`}>
                  <Icon className="text-sm" />
                  {meta.label}
                </span>
                {isFamous && item.subCategory && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                    <FiAward className="text-sm" />
                    {subLabelMap[item.subCategory] || item.subCategory}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-3">{item.name}</h1>
              {(item.location || item.origin || item.birthPlace) && (
                <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                  <FiMapPin className="text-white/60" />
                  <span>{item.location || item.origin || item.birthPlace}</span>
                </div>
              )}
              <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed">{item.description}</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5">
                <Link
                  to={`/gallery?item=${item.id}`}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-3 sm:py-3.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white text-sm sm:text-base font-semibold transition-all shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40"
                >
                  <FiCamera /> View Gallery
                </Link>
                {item.coordinates && (
                  <Link
                    to={`/map?item=${item.id}`}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm sm:text-base font-semibold transition-all border border-white/30 backdrop-blur-sm"
                  >
                    <FiMap /> View on Map
                  </Link>
                )}
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center w-[44px] h-[44px] sm:w-[46px] sm:h-[46px] rounded-full bg-white/20 hover:bg-white/30 text-white text-sm sm:text-base transition-all border border-white/30 backdrop-blur-sm cursor-pointer shrink-0"
                  title="Share"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">

                {isFamous && item.birthYear && (
                  <div className="pb-4 border-b border-slate-100 mb-4">
                    <h3 className="text-sm font-heading font-semibold text-slate-700 mb-2">Born</h3>
                    <div className="flex items-center gap-2 text-slate-600">
                      <FiCalendar className="text-rose-500" />
                      <span>{item.birthYear} · {item.birthPlace}</span>
                    </div>
                  </div>
                )}
                {isSeasonal && item.seasonMonths && (
                  <div className="pb-4 border-b border-slate-100 mb-4">
                    <h3 className="text-sm font-heading font-semibold text-slate-700 mb-2">Season</h3>
                    <div className="flex items-center gap-2 text-slate-600">
                      <FiCalendar className="text-orange-500" />
                      <span className="font-semibold text-orange-600">{item.seasonMonths}</span>
                      {item.seasonName && (
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.seasonName}</span>
                      )}
                    </div>
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-4">{item.name}</h2>
                <div
                  className="destination-content prose prose-slate max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{ __html: item.detail || item.description }}
                />
              </div>
            </div>

            <div className="space-y-6 self-start">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-heading font-semibold text-slate-700 mb-3">Category</h3>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-br ${meta.gradient} text-white`}>
                    <Icon className="text-sm" />
                    {meta.label}
                  </span>
                </div>
                {item.coordinates && (
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-heading font-semibold text-slate-700 mb-3">Location</h3>
                    <div className="text-xs text-slate-500 mb-3">
                      {item.coordinates.lat.toFixed(4)}°N, {item.coordinates.lng.toFixed(4)}°E
                      <div className="mt-1 text-teal-600 font-medium">
                        {item.name} in {distanceFromColombo(item)} km from Colombo
                      </div>
                    </div>
                    <a
                      href={item.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${item.coordinates.lat},${item.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full min-h-[44px] rounded-xl bg-teal-50 text-teal-700 text-sm font-semibold hover:bg-teal-100 transition-all"
                    >
                      <FiNavigation /> Get Directions
                    </a>
                  </div>
                )}
              </div>

              {prideItems.some((p) => p.category === item.category && p.id !== item.id) && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <SimilarPlaces
                  items={prideItems}
                  currentItem={item}
                  basePath="sri-lanka-pride"
                  category={item.category}
                />
              </div>
              )}

              <EmailFeedback placeName={item.name} category={meta.label} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCamera, FiMapPin } from 'react-icons/fi'
import { GiCrown, GiCaveEntrance, GiTeapotLeaves, GiFruitTree } from 'react-icons/gi'
import { FaLandmark, FaCity, FaUtensils, FaUsers } from 'react-icons/fa'
import AnimatedSection from '../ui/AnimatedSection'
import { prideItems } from '../../data/sriLankaPride'
import { handleImgError } from '../../utils/fallback'
import { shuffle } from '../../utils/mapHelpers'

const meta = {
  'ancient-kingdoms': { icon: GiCrown, label: 'Ancient', iconColor: 'text-amber-400', gradient: 'from-amber-950 to-yellow-900' },
  'caves-geological-wonders': { icon: GiCaveEntrance, label: 'Geology', iconColor: 'text-stone-400', gradient: 'from-stone-900 to-neutral-800' },
  'museums': { icon: FaLandmark, label: 'Museum', iconColor: 'text-indigo-400', gradient: 'from-indigo-950 to-purple-900' },
  'cities-urban': { icon: FaCity, label: 'Urban', iconColor: 'text-blue-400', gradient: 'from-blue-950 to-cyan-900' },
  'food-culinary': { icon: FaUtensils, label: 'Food', iconColor: 'text-red-400', gradient: 'from-rose-950 to-red-900' },
  'seasonal-foods': { icon: GiFruitTree, label: 'Seasonal', iconColor: 'text-orange-400', gradient: 'from-orange-950 to-amber-900' },
  'tea-spice-trails': { icon: GiTeapotLeaves, label: 'Tea & Spice', iconColor: 'text-green-400', gradient: 'from-emerald-950 to-green-900' },
  'famous-people': { icon: FaUsers, label: 'Famous', iconColor: 'text-rose-400', gradient: 'from-pink-950 to-rose-900' },
}

export default function CTA() {
  const randomPride = useMemo(() => {
    return shuffle(prideItems).slice(0, 3)
  }, [])

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-105" style={{ backgroundImage: 'url(/images/home/mirrissa.jpg)', backgroundPosition: 'left bottom' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-teal-950/80 to-slate-900/90" />
      <div className="absolute inset-0 opacity-10 bg-grid" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="container-custom relative z-10 text-center">
        <AnimatedSection className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">Discover the <span className="bg-gradient-to-r from-sunset-400 via-rose-500 to-sunset-600 bg-clip-text text-transparent">Pride</span> of Sri Lanka</h2>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto">
            Golden beaches, misty mountains, ancient ruins, and warm smiles — experience an island like no other.
          </p>
        </AnimatedSection>

        {randomPride.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {randomPride.map((item, i) => {
              const m = meta[item.category] || meta['ancient-kingdoms']
              const Icon = m.icon
              return (
                <AnimatedSection key={item.id} delay={i * 0.1}>
                  <Link
                    to={`/sri-lanka-pride/${encodeURIComponent(item.category)}/${item.id}`}
                    className="group block bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-500"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        onError={handleImgError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gradient-to-br ${m.gradient} text-white shadow-lg`}>
                          <Icon className="text-[10px]" />
                          {m.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-heading font-bold text-base leading-tight truncate text-left">
                        {item.name}
                      </h3>
                      {(item.location || item.origin || item.birthPlace) && (
                        <div className="flex items-center gap-1 text-xs text-white/50 mt-2">
                          <FiMapPin className={m.iconColor} />
                          <span>{item.location || item.origin || item.birthPlace}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </AnimatedSection>
              )
            })}
          </div>
        )}

        <AnimatedSection className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link
            to="/sri-lanka-pride"
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-teal-500 to-ocean-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
          >
            Explore Sri Lanka's Pride
            <FiArrowRight />
          </Link>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all duration-300"
          >
            <FiCamera />
            View Gallery
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

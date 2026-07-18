import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiArrowRight, FiSun } from 'react-icons/fi'
import { FaTree, FaWater } from 'react-icons/fa'
import { handleImgError } from '../../utils/fallback'

export default function Hero() {
  const stats = [
    { icon: FiMapPin, value: '500+', label: 'Destinations', sub: 'Amazing places to explore' },
    { icon: FiSun, value: '100+', label: 'Beaches', sub: 'Pristine beaches to relax' },
    { icon: FaTree, value: '25', label: 'National Parks', sub: 'Protected natural wonders' },
    { icon: FaWater, value: '380+', label: 'Waterfalls', sub: 'Majestic waterfalls to visit' },
  ]

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-no-repeat bg-center max-[768px]:bg-[right_top]" style={{ backgroundImage: 'url(/images/home/hero.png)' }} />
      <img src="/images/home/hero.png" alt="Sri Lanka travel hero" onError={handleImgError} className="sr-only" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/20" />

      <div className="relative z-20 w-full pt-0 md:pt-20 pb-32 md:pb-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-teal-400 font-['Dynalight'] not-italic text-3xl sm:text-3xl md:text-4xl mb-2">
              Welcome to
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-['Poppins'] font-extrabold not-italic text-white leading-tight mb-4">
              Sri Lanka
            </h1>
            <p className="text-white/70 text-base sm:text-lg md:text-xl max-w-lg leading-relaxed mb-8 font-['Averia_Serif_Libre'] italic">
              Explore pristine beaches, ancient temples, and vibrant culture across the Pearl of the Indian Ocean.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-teal-500 to-ocean-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
              >
                <span className="italic">Explore Destinations</span>
                <FiArrowRight />
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all duration-300"
              >
                <FiMapPin />
                <span className="italic">View Map</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 z-20 pb-6 sm:pb-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-4 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-7">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="text-teal-400 text-sm sm:text-lg lg:text-xl" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm sm:text-base lg:text-lg leading-tight font-['Inter'] not-italic">{stat.value} {stat.label}</p>
                    {stat.sub && <p className="text-white/50 text-xs sm:text-xs lg:text-sm leading-tight mt-0.5 font-['Inter'] not-italic">{stat.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

    </section>
    </>
  )
}

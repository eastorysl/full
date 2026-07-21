import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiArrowRight, FiPlus } from 'react-icons/fi'
import BusinessCard from './BusinessCard'

const tierOrder = { premium: 0, featured: 1, free: 2 }

function CtaCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 col-span-1"
    >
      <Link to="/advertise" className="block">
        <div className="relative h-52 sm:h-56 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/discover/hero.png)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
              <FiTrendingUp className="text-[10px]" />
              Promote
            </span>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-white font-heading font-bold text-lg leading-tight">
              List Your Business
            </h3>
            <p className="text-teal-100 text-xs mt-0.5">Free listing available</p>
          </div>
        </div>
        <div className="p-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-ocean-600 flex items-center justify-center mb-3 shadow-lg shadow-teal-500/20">
            <FiPlus className="text-white text-lg" />
          </div>
          <h4 className="font-heading font-bold text-slate-900 text-base mb-2">
            Get Discovered by Travelers
          </h4>
          <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
            Reach thousands of travelers exploring Sri Lanka. Stand out with featured placement and connect with a global audience.
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 w-full min-h-[44px] rounded-xl bg-gradient-to-r from-teal-500 to-ocean-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300">
            <span>List Your Business Free</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function BusinessGrid({ businesses }) {
  const sorted = useMemo(() => {
    if (!businesses) return []
    return [...businesses].sort((a, b) => (tierOrder[a.tier] ?? 2) - (tierOrder[b.tier] ?? 2))
  }, [businesses])

  const items = []
  let ctaCount = 0
  sorted.forEach((biz, i) => {
    if (sorted.length >= 12 && i > 0 && i % 12 === 0 && i < sorted.length) {
      items.push(<CtaCard key={`cta-${ctaCount++}`} />)
    } else if (ctaCount === 0 && sorted.length < 12 && sorted.length >= 3 && i === Math.floor(sorted.length / 2)) {
      items.push(<CtaCard key={`cta-${ctaCount++}`} />)
    }
    items.push(<BusinessCard key={biz.id} business={biz} index={i} />)
  })
  if (ctaCount === 0 && sorted.length < 12 && sorted.length >= 6) items.push(<CtaCard key={`cta-${ctaCount++}`} />)
  if (ctaCount === 0 && sorted.length < 6) items.push(<CtaCard key={`cta-${ctaCount++}`} />)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {items}
    </div>
  )
}

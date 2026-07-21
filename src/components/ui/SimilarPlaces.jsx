import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'
import { handleImgError } from '../../utils/fallback'
import { shuffle } from '../../utils/mapHelpers'

export default function SimilarPlaces({ items, currentItem, basePath, category }) {
  const similar = useMemo(() => {
    if (!items || !currentItem) return []
    const seen = new Set([currentItem.id])
    const sameCategory = items.filter((item) => {
      if (item.category !== category) return false
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
    const shuffled = shuffle(sameCategory)
    return shuffled.slice(0, 5)
  }, [items, currentItem, category])

  if (similar.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-heading font-semibold text-slate-700 mb-3">Similar Places</h3>
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scroll-smooth no-scrollbar">
        {similar.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="shrink-0 w-[160px] lg:w-full"
          >
            <Link
              to={`/${basePath}/${item.category}/${item.id}`}
              className="group flex lg:flex-row items-center gap-3 bg-slate-50 hover:bg-teal-50 rounded-xl p-2.5 min-h-[44px] transition-all duration-300 border border-slate-200/60 hover:border-teal-200"
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={handleImgError}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-heading font-semibold text-xs text-slate-800 leading-snug line-clamp-1 group-hover:text-teal-600 transition-colors">
                  {item.name}
                </h4>
                {(item.location || item.district) && (
                  <p className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                    <FiMapPin className="shrink-0 text-teal-500" size={9} />
                    <span className="truncate">{item.location || item.district}</span>
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

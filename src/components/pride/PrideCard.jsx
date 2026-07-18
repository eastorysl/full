import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'
import { GiCrown, GiCaveEntrance, GiTeapotLeaves, GiFruitTree } from 'react-icons/gi'
import { FaLandmark, FaCity, FaUtensils, FaUsers } from 'react-icons/fa'
import { handleImgError } from '../../utils/fallback'

const meta = {
  'ancient-kingdoms': { icon: GiCrown, label: 'Ancient', border: 'hover:border-amber-200', iconColor: 'text-amber-500' },
  'caves-geological-wonders': { icon: GiCaveEntrance, label: 'Geology', border: 'hover:border-stone-200', iconColor: 'text-stone-500' },
  'museums': { icon: FaLandmark, label: 'Museum', border: 'hover:border-indigo-200', iconColor: 'text-indigo-500' },
  'cities-urban': { icon: FaCity, label: 'Urban', border: 'hover:border-blue-200', iconColor: 'text-blue-500' },
  'food-culinary': { icon: FaUtensils, label: 'Food', border: 'hover:border-red-200', iconColor: 'text-red-500' },
  'seasonal-foods': { icon: GiFruitTree, label: 'Seasonal', border: 'hover:border-orange-200', iconColor: 'text-orange-500' },
  'tea-spice-trails': { icon: GiTeapotLeaves, label: 'Tea & Spice', border: 'hover:border-green-200', iconColor: 'text-green-500' },
  'famous-people': { icon: FaUsers, label: 'Famous', border: 'hover:border-rose-200', iconColor: 'text-rose-500' },
}

const accentGradients = {
  'ancient-kingdoms': 'from-amber-950 to-yellow-900',
  'caves-geological-wonders': 'from-stone-900 to-neutral-800',
  'museums': 'from-indigo-950 to-purple-900',
  'cities-urban': 'from-blue-950 to-cyan-900',
  'food-culinary': 'from-rose-950 to-red-900',
  'seasonal-foods': 'from-orange-950 to-amber-900',
  'tea-spice-trails': 'from-emerald-950 to-green-900',
  'famous-people': 'from-pink-950 to-rose-900',
}



export default function PrideCard({ item, index }) {
  const m = meta[item.category] || meta['ancient-kingdoms']
  const Icon = m.icon
  const isFamous = item.category === 'famous-people'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link
        to={`/sri-lanka-pride/${encodeURIComponent(item.category)}/${item.id}`}
        className={`group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 ${m.border}`}
      >
        <div className={`relative h-48 sm:h-56 overflow-hidden ${isFamous ? 'flex items-center justify-center bg-slate-100' : ''}`}>
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={handleImgError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
          <div className="absolute top-3 right-3 flex gap-2">

            <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gradient-to-br ${accentGradients[item.category] || accentGradients['ancient-kingdoms']} text-white shadow-lg`}>
              <span className="flex items-center gap-1">
                <Icon className="text-[10px]" />
                {m.label}
              </span>
            </div>
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-white font-heading font-bold text-lg leading-tight truncate">
              {item.name}
            </h3>
          </div>
        </div>
        <div className="p-5">
          <p className="text-slate-600 text-sm leading-relaxed truncate">
            {item.description}
          </p>
          {(item.location || item.origin || item.birthPlace) && (
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
              <FiMapPin className={m.iconColor} />
              <span>{item.location || item.origin || item.birthPlace}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

import { FiEye, FiEyeOff, FiSun } from 'react-icons/fi'
import { HiOutlineLocationMarker, HiOutlineOfficeBuilding, HiOutlineCollection } from 'react-icons/hi'
import { FaRoute } from 'react-icons/fa'
import { motion } from 'framer-motion'

const layers = [
  { id: 'destinations', label: 'Destinations', icon: HiOutlineLocationMarker },
  { id: 'beaches', label: 'Beaches', icon: FiSun },
  { id: 'businesses', label: 'Discover more', icon: HiOutlineOfficeBuilding },
  { id: 'cultural', label: 'Cultural', icon: HiOutlineCollection },
    { id: 'presetRoutes', label: 'Trip plan', icon: FaRoute },
]

export default function MapLayers({ activeLayers, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/10 border border-white/40 overflow-hidden max-h-[280px]"
    >
      {layers.map((layer) => {
        const active = activeLayers[layer.id]
        const Icon = layer.icon
        return (
          <button
            key={layer.id}
            onClick={() => onToggle(layer.id)}
            aria-pressed={active}
            className={`touch-manipulation flex items-center gap-2 w-full px-3 py-3 min-h-[44px] text-xs font-medium transition-all duration-200 cursor-pointer ${
              active
                ? 'bg-teal-50 text-slate-800'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
            } ${layer !== layers[layers.length - 1] ? 'border-b border-slate-100/80' : ''}`}
          >
            <Icon className={`text-sm ${active ? 'text-teal-500' : 'text-slate-400'}`} />
            <span className="flex-1 text-left italic">{layer.label}</span>
            {active ? (
              <FiEye className="text-teal-500 text-xs shrink-0" />
            ) : (
              <FiEyeOff className="text-slate-300 text-xs shrink-0" />
            )}
          </button>
        )
      })}
    </motion.div>
  )
}

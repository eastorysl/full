import { FiClock, FiNavigation, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function PresetTrips({ presets, onSelectPreset }) {
  if (!presets || presets.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">🧭</span>
        <h3 className="text-sm font-bold text-slate-700">Road Trip Presets</h3>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {presets.map((preset, i) => (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            onClick={() => onSelectPreset?.(preset)}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all duration-300 text-left group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${preset.color} flex items-center justify-center text-lg flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              {preset.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">{preset.name}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{preset.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-0.5 text-[9px] text-slate-400">
                  <FiClock className="text-[8px]" /> {preset.duration}
                </span>
                <span className="flex items-center gap-0.5 text-[9px] text-slate-400">
                  <FiNavigation className="text-[8px]" /> {preset.distance}
                </span>
              </div>
            </div>
            <FiArrowRight className="text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

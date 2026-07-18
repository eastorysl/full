import { FiSearch } from 'react-icons/fi'

export default function SearchBar({ value, onChange, placeholder = '', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 min-h-[44px] rounded-xl border border-slate-200 bg-white/90
                   focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20
                   outline-none transition-all duration-300 shadow-sm
                   placeholder:text-slate-400 italic text-slate-700"
      />
    </div>
  )
}

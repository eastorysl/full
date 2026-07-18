export default function Badge({ children, variant = 'featured', className = '' }) {
  const variants = {
    featured: 'bg-sunset-100 text-sunset-700 border-sunset-200',
    premium: 'bg-palm-100 text-palm-700 border-palm-200',
    free: 'bg-slate-100 text-slate-600 border-slate-200',
    new: 'bg-ocean-100 text-ocean-700 border-ocean-200',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant] || variants.free} ${className}`}>
      {children}
    </span>
  )
}

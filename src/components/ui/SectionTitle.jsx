import AnimatedSection from './AnimatedSection'

export default function SectionTitle({ subtitle, title, description, align = 'center', light = false, as = 'h2' }) {
  const Tag = as
  const alignClass = align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right'

  return (
    <AnimatedSection className={`max-w-3xl mx-auto mb-12 md:mb-16 ${alignClass}`}>
      {subtitle && (
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${
          light
            ? 'bg-white/10 text-white'
            : 'bg-teal-50 text-teal-700'
        }`}>
          {subtitle}
        </span>
      )}
      <Tag className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold ${light ? 'text-white' : 'text-slate-900'} mb-4`}>
        {title}
      </Tag>
      {description && (
        <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-body ${light ? 'text-white/80' : 'text-slate-600'}`}>
          {description}
        </p>
      )}
    </AnimatedSection>
  )
}

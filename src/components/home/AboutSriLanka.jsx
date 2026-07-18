import { useRef, useState, useEffect, useCallback } from 'react'
import { FiSun } from 'react-icons/fi'
import { GiElephantHead } from 'react-icons/gi'
import { FaLandmark } from 'react-icons/fa'
import AnimatedSection from '../ui/AnimatedSection'

const cards = [
  {
    icon: FiSun,
    title: 'Natural Paradise',
    items: [
      { icon: '🏖️', text: 'Golden sandy tropical beaches' },
      { icon: '🌊', text: 'Crystal-clear turquoise waters' },
      { icon: '🌅', text: 'Breathtaking sunsets & scenic mountains' },
      { icon: '🌴', text: 'Warm tropical atmosphere year-round' },
    ],
    gradient: 'from-amber-500 to-orange-500',
    iconBg: 'from-amber-500/20 to-orange-500/20',
  },
  {
    icon: GiElephantHead,
    title: 'Wildlife & Adventure',
    items: [
      { icon: '🐘', text: 'World-famous elephant & leopard safaris' },
      { icon: '🐋', text: 'Blue whale & dolphin watching' },
      { icon: '🏄', text: 'Excellent surfing, snorkeling & diving' },
      { icon: '🚂', text: 'Scenic train rides & nature walks' },
    ],
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    icon: FaLandmark,
    title: 'Culture & Heritage',
    items: [
      { icon: '🏯', text: 'Sigiriya Rock Fortress & ancient ruins' },
      { icon: '🛕', text: 'Temple of the Sacred Tooth Relic' },
      { icon: '🏛️', text: 'UNESCO World Heritage Sites' },
      { icon: '🍛', text: 'Rich cuisine & cooking classes' },
    ],
    gradient: 'from-purple-500 to-pink-500',
    iconBg: 'from-purple-500/20 to-pink-500/20',
  },
]

export default function AboutSriLanka() {
  const scrollRef = useRef(null)
  const [activeDot, setActiveDot] = useState(0)

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / cards.length
    const idx = Math.round(el.scrollLeft / cardWidth)
    setActiveDot(Math.min(idx, cards.length - 1))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <section className="section-padding pt-10 md:pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/home/slfleg.png)' }} />
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-teal-950/70 to-slate-900/80" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
      <div className="container-custom relative z-10">
        <AnimatedSection className="text-center mb-12">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Pearl of the Indian Ocean</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mt-3 mb-3">Why Sri Lanka?</h2>
          <p className="text-white/70 max-w-xl mx-auto">
            A tropical island paradise offering unforgettable experiences for every traveler.
          </p>
        </AnimatedSection>
        <div ref={scrollRef} className="flex md:hidden gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="w-[70vw] max-w-[320px] shrink-0 snap-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 flex flex-col">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="text-2xl text-white" />
                </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-4">{card.title}</h3>
                <ul className="space-y-2.5 flex-1">
                  {card.items.map((item) => (
                    <li key={item.text} className="flex items-start gap-2.5 text-white/70 text-sm leading-relaxed">
                      <span className="text-teal-400 shrink-0">&#10003;</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <AnimatedSection key={card.title} delay={i * 0.1}>
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 h-full flex flex-col">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-4">{card.title}</h3>
                  <ul className="space-y-2.5 flex-1">
                    {card.items.map((item) => (
                      <li key={item.text} className="flex items-start gap-2.5 text-white/70 text-sm leading-relaxed">
                      <span className="text-teal-400 shrink-0">&#10003;</span>
                      <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
        <div className="flex items-center justify-center gap-2 mt-6 md:hidden">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current
                if (el) {
                  const cardWidth = el.scrollWidth / cards.length
                  el.scrollTo({ left: cardWidth * i, behavior: 'smooth' })
                }
              }}
              aria-label={`Go to card ${i + 1}`}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all duration-300 ${
                i === activeDot ? 'w-16 h-6' : 'w-11 h-11'
              }`}
            >
              <span className={`block rounded-full transition-all duration-300 ${
                i === activeDot ? 'w-6 h-2 bg-teal-400' : 'w-2 h-2 bg-white/30'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

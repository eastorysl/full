import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiMapPin, FiMail, FiArrowUp, FiSend, FiChevronRight, FiCheck, FiLoader, FiPhone } from 'react-icons/fi'
import { FaFacebook, FaWhatsapp, FaInstagram, FaUmbrellaBeach } from 'react-icons/fa'
import { GiLion, GiElephantHead } from 'react-icons/gi'
import Logo from '../ui/Logo'
import { destinations as allDestinations } from '../../data/destinations'
import { prideItems } from '../../data/sriLankaPride'
import { businesses } from '../../data/businesses'
import { shuffle } from '../../utils/mapHelpers'

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxuKmf_1LxhGlKRnbkXGJpW7XQ6sLw7q2I07xFCFb14bWEcz7yb9aMNrr_w2j3t8pgBAQ/exec'

const quickLinks = [
  { name: 'Destinations', path: '/destinations' },
  { name: 'Discover more', path: '/discover-more' },
  { name: 'Sri Lanka Pride', path: '/sri-lanka-pride' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Map', path: '/map' },
  { name: 'Advertise', path: '/advertise' },
]

function getRandomDestinations(count = 6) {
  const shuffledItems = shuffle(allDestinations)
  return shuffledItems.slice(0, count).map((d) => ({
    name: d.name,
    path: `/destinations/${encodeURIComponent(d.category)}/${d.id}`,
  }))
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState(null)
  const [randomDestinations] = useState(() => getRandomDestinations(6))
  const timerRef = useRef(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubStatus('loading')
    if (timerRef.current) clearTimeout(timerRef.current)

    fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        email: email,
        pageUrl: window.location.href
      })
    }).then((res) => {
      if (!res.ok) throw new Error('Server error')
      setSubStatus('success')
      setEmail('')
      timerRef.current = setTimeout(() => setSubStatus(null), 3500)
    }).catch(() => {
      setSubStatus('error')
      timerRef.current = setTimeout(() => setSubStatus(null), 3500)
    })
  }

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #0d9488 1px, transparent 1px), radial-gradient(circle at 75% 75%, #0d9488 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 py-12 lg:py-16">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center mb-5 group hover:opacity-80 transition-opacity">
              <Logo color="#FFFFFF" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your guide to exploring Sri Lanka — pristine beaches, ancient temples, vibrant culture, and unforgettable adventures.
            </p>
            <div className="flex items-center gap-2.5 mb-6">
              {[
                { icon: FaWhatsapp, href: 'https://wa.me/94724362001', label: 'WhatsApp' },
                { icon: FaFacebook, href: 'https://www.facebook.com/profile.php?id=61591629429221', label: 'Facebook' },
                { icon: FaInstagram, href: 'https://www.instagram.com/eastory.sl', label: 'Instagram' },
                { icon: FiPhone, href: 'tel:+94724362001', label: 'Call' },
              ].map((s) => (
                <a key={s.label} href={s.href} {...(s.href.startsWith('tel:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="w-11 h-11 rounded-full bg-slate-800 hover:bg-teal-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5"
                  aria-label={s.label}>
                  <s.icon className="text-sm" />
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><FaUmbrellaBeach className="text-teal-500" /> {allDestinations.length}+ Destinations</span>
              <span className="flex items-center gap-1.5"><GiLion className="text-teal-500" /> {prideItems.length}+ Pride Entries</span>
              <span className="flex items-center gap-1.5"><GiElephantHead className="text-teal-500" /> {businesses.length}+ Discover more</span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-sm text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-px bg-teal-500 inline-block" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="group/link text-slate-400 hover:text-teal-400 text-sm transition-all duration-200 inline-flex items-center gap-1.5"
                  >
                    <FiChevronRight className="text-[10px] text-teal-500/0 group-hover/link:text-teal-500 -ml-4 group-hover/link:ml-0 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-heading font-bold text-sm text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-px bg-teal-500 inline-block" />
              Top Destinations
            </h4>
            <ul className="space-y-3">
              {randomDestinations.map((d) => (
                <li key={d.name}>
                  <Link
                    to={d.path}
                    onClick={scrollToTop}
                    className="group/link text-slate-400 hover:text-teal-400 text-sm transition-all duration-200 inline-flex items-center gap-1.5"
                  >
                    <FiChevronRight className="text-[10px] text-teal-500/0 group-hover/link:text-teal-500 -ml-4 group-hover/link:ml-0 transition-all duration-200" />
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-heading font-bold text-sm text-white mb-5 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-px bg-teal-500 inline-block" />
              Stay Updated
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Get the latest travel tips and destination guides delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="mb-5">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <div className="relative group">
                <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-teal-500/20 to-ocean-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                <div className="relative flex items-center bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden transition-all duration-300">
                  <FiMail className="ml-3.5 text-slate-500 text-sm shrink-0 transition-colors duration-200 group-focus-within:text-teal-400" />
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={subStatus === 'loading'}
                    autoComplete="email"
                    className="flex-1 bg-transparent px-3 py-2.5 min-h-[44px] text-sm text-white placeholder:text-slate-500 italic focus:outline-none focus:ring-0 disabled:opacity-50"
                    required
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'loading' || subStatus === 'success'}
                    aria-label="Subscribe"
                    className={`mr-1.5 w-11 h-11 rounded-lg flex items-center justify-center text-white transition-all duration-300 shrink-0 ${
                      subStatus === 'success'
                        ? 'bg-emerald-500 scale-100'
                        : subStatus === 'error'
                          ? 'bg-red-500 scale-100'
                          : subStatus === 'loading'
                            ? 'bg-teal-600/60 cursor-wait'
                            : 'bg-teal-600 hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/25 active:scale-95'
                    }`}
                  >
                    {subStatus === 'success' ? (
                      <FiCheck className="text-sm animate-scale-in" />
                    ) : subStatus === 'error' ? (
                      <FiMail className="text-sm" />
                    ) : subStatus === 'loading' ? (
                      <FiLoader className="text-sm animate-spin" />
                    ) : (
                      <FiSend className="text-xs" />
                    )}
                  </button>
                </div>
              </div>
              <div className="h-5 mt-1">
                {subStatus === 'success' && (
                  <p className="text-emerald-400 text-xs flex items-center gap-1 animate-fade-in">
                    <FiCheck className="text-[10px]" /> Thanks for subscribing!
                  </p>
                )}
                {subStatus === 'error' && (
                  <p className="text-red-400 text-xs flex items-center gap-1 animate-fade-in">
                    Something went wrong. Try again.
                  </p>
                )}
              </div>
            </form>
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-ocean-600 flex items-center justify-center">
                  <FiMapPin className="text-white text-xs" />
                </div>
                <span className="text-sm font-semibold text-white">List Your Business</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Get discovered by thousands of travelers.</p>
              <Link
                to="/advertise"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors group"
              >
                Get Listed Free
                <FiArrowUp className="text-xs rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
          </div>
        </div>
      </div>

      <div className="relative border-t border-slate-800">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} <span className="text-teal-400">EastorySL</span>. All rights reserved. Pearl of the Indian Ocean.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <Link to="/privacy-policy" className="text-slate-500 hover:text-teal-400 text-xs transition-colors">Privacy Policy</Link>
                <span className="text-slate-700 text-xs hidden sm:inline">|</span>
                <Link to="/terms-of-service" className="text-slate-500 hover:text-teal-400 text-xs transition-colors">Terms of Service</Link>
                <span className="text-slate-700 text-xs hidden sm:inline">|</span>
                <Link to="/business-terms" className="text-slate-500 hover:text-teal-400 text-xs transition-colors">Business Terms</Link>
                <span className="text-slate-700 text-xs hidden sm:inline">|</span>
                <Link to="/cookie-policy" className="text-slate-500 hover:text-teal-400 text-xs transition-colors">Cookie Policy</Link>
                <span className="text-slate-700 text-xs hidden sm:inline">|</span>
                <Link to="/disclaimer" className="text-slate-500 hover:text-teal-400 text-xs transition-colors">Disclaimer</Link>
              </div>
              <button
                onClick={scrollToTop}
                className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-teal-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5"
                aria-label="Scroll to top"
              >
                <FiArrowUp />
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

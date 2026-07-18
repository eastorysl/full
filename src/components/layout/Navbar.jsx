import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'
import Logo from '../ui/Logo'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Discover more', path: '/discover-more' },
  { name: 'Sri Lanka Pride', path: '/sri-lanka-pride' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Map', path: '/map' },
]

export default function Navbar({ onInstallClick, isInstalled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)
  const { pathname } = useLocation()
  const isMapPage = pathname === '/map'
  const noBannerRoutes = ['/map', '/privacy-policy', '/terms-of-service']
  const hasBanner = noBannerRoutes.includes(pathname)
    ? false
    : pathname === '/' || pathname.startsWith('/destinations') || pathname.startsWith('/discover-more') || pathname.startsWith('/sri-lanka-pride') || pathname.startsWith('/gallery') || pathname.startsWith('/advertise')
  const isTransparent = hasBanner && !scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMenuKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      return
    }
    if (e.key !== 'Tab' || !menuRef.current) return
    const focusable = menuRef.current.querySelectorAll('a[href], button')
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstLink = menuRef.current.querySelector('a[href], button')
      if (firstLink) firstLink.focus()
    }
  }, [isOpen])

  return (
    <nav aria-label="Main navigation" className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isMapPage || scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/50'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2 group">
            <Link to="/" className="flex items-center">
              <Logo color={isTransparent ? '#FFFFFF' : '#000000'} />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1 ml-auto">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                   `px-3 py-2 rounded-lg text-base font-heading font-bold italic transition-all duration-300 ${
                    isActive
                      ? 'text-[#2DD4BF] bg-[#2DD4BF]/10'
                      : isTransparent
                        ? 'text-white hover:bg-white/10'
                        : 'text-slate-600 hover:text-[#2DD4BF] hover:bg-[#2DD4BF]/10'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {!isInstalled && (
              <button
                onClick={onInstallClick}
                aria-label="Install app"
                className={`md:hidden p-3 min-h-[44px] min-w-[44px] rounded-lg transition-all duration-300 ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FiDownload className="text-lg" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className={`md:hidden p-3 rounded-lg transition-all duration-300 ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-10 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: '70vh' }}
              exit={{ opacity: 0, maxHeight: 0 }}
              className="md:hidden relative overflow-hidden border-t border-white/10 shadow-xl z-20 rounded-b-2xl"
              onKeyDown={handleMenuKeyDown}
            >
              <div className="absolute inset-0 bg-cover bg-no-repeat bg-center" style={{ backgroundImage: 'url(/images/home/hero.png)' }} />
              <div className="absolute inset-0 backdrop-blur-md bg-slate-900/70" />
              <div className="relative px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <NavLink
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-base font-heading font-bold italic transition-all duration-200 ${
                          isActive
                            ? 'text-[#2DD4BF] bg-[#2DD4BF]/10 border-l-4 border-[#2DD4BF]'
                            : 'text-white/80 hover:text-[#2DD4BF] hover:bg-white/10'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

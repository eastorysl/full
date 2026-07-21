import { Link } from 'react-router-dom'
import { FiHome, FiArrowLeft } from 'react-icons/fi'
import SEO from '../components/seo/SEO'

export default function NotFound() {
  return (
    <div>
      <SEO title="Page Not Found" description="The page you are looking for doesn't exist or has been moved." noindex />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #0d9488 1px, transparent 1px), radial-gradient(circle at 75% 75%, #0d9488 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ocean-200/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-4 max-w-lg mx-auto">
          <div className="text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-heading font-bold leading-none mb-4">
            <span className="bg-gradient-to-r from-teal-500 via-ocean-500 to-teal-600 bg-clip-text text-transparent">404</span>
          </div>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent mx-auto mb-6" />

          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 mb-3">
            Looks like you're lost
          </h1>
          <p className="text-slate-500 text-base md:text-lg mb-8 leading-relaxed">
            The page you were looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-teal-200"
            >
              <FiHome className="text-lg" />
              Back to Home
            </Link>
            <button
              onClick={() => { if (window.history.length > 1) window.history.back(); else window.location.href = '/' }}
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all duration-300 shadow-sm"
            >
              <FiArrowLeft className="text-lg" />
              Go Back
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

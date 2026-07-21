import { useSearchParams, Link } from 'react-router-dom'
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi'
import SEO from '../components/seo/SEO'

export default function Unsubscribe() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="pt-24 md:pt-28 min-h-screen">
      <SEO
        title="Unsubscribe"
        description="Unsubscribe from Eastory SL newsletter."
        ogImage="/images/home/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/unsubscribe`}
        noindex
      />
      <div className="section-padding container-custom max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-12">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-emerald-500 text-3xl" />
          </div>

          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-4">
            You Have Been Unsubscribed
          </h1>

          {email && (
            <p className="text-slate-500 mb-2">
              <span className="font-medium text-slate-700">{email}</span> has been removed from our newsletter.
            </p>
          )}

          <p className="text-slate-500 mb-8">
            You will no longer receive travel tips and destination guides from Eastory SL.
            We are sorry to see you go!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all"
            >
              <FiArrowLeft /> Back to Home
            </Link>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all"
            >
              Explore Destinations
            </Link>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-6">
          If this was a mistake, you can re-subscribe by entering your email in the footer of any page.
        </p>
      </div>
    </div>
  )
}

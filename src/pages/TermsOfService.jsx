import SEO from '../components/seo/SEO'

export default function TermsOfService() {
  return (
    <div className="pt-24 md:pt-28 min-h-screen">
      <SEO
        title="Terms of Service"
        description="Terms of Service for Eastory SL. Read the rules and guidelines for using our platform."
        ogImage="/images/home/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/terms-of-service`}
        noindex
      />
      <div className="section-padding container-custom max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">Terms of Service</h1>
        <p className="text-slate-600">Page under construction.</p>
      </div>
    </div>
  )
}

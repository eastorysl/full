import SEO from '../components/seo/SEO'

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 md:pt-28 min-h-screen">
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for Eastory SL. Learn how we collect, use, and protect your personal information."
        ogImage="/images/home/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/privacy-policy`}
        noindex
      />
      <div className="section-padding container-custom max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
        <p className="text-slate-600">Page under construction.</p>
      </div>
    </div>
  )
}

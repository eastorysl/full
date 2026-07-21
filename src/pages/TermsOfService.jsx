import SEO from '../components/seo/SEO'
import { Link } from 'react-router-dom'

const lastUpdated = 'July 21, 2026'

const sections = [
  {
    title: 'Acceptance of Terms',
    content: `By accessing and using EastorySL ("the Website"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website. We reserve the right to modify these terms at any time, and your continued use of the site constitutes acceptance of any changes.`
  },
  {
    title: 'About EastorySL',
    content: `EastorySL is a Sri Lanka travel and tourism information platform that provides destination guides, cultural content, interactive maps, business listings, and a curated photo gallery. Our goal is to help travellers discover the beauty of Sri Lanka — the Pearl of the Indian Ocean.`
  },
  {
    title: 'Use of the Website',
    content: `You may use EastorySL for personal, non-commercial purposes. You agree to use the site lawfully and respectfully. Specifically, you agree to:`,
    list: [
      { text: 'Use the website only for lawful purposes related to travel planning and information gathering.' },
      { text: 'Not attempt to gain unauthorised access to any part of the website, its servers, or connected systems.' },
      { text: 'Not use automated tools (bots, scrapers) to extract content from the site without written permission.' },
      { text: 'Not reproduce, duplicate, or redistribute content from EastorySL for commercial purposes without attribution and permission.' },
      { text: 'Not misrepresent yourself or impersonate any person or entity when using the site or contacting us.' },
    ]
  },
  {
    title: 'Content Accuracy',
    content: `We strive to provide accurate and up-to-date information about destinations, businesses, and travel services across Sri Lanka. However:`,
    list: [
      { subtitle: 'No Guarantees', text: 'All information is provided for general informational purposes. We make no warranties about the completeness, reliability, or accuracy of the content.' },
      { subtitle: 'Travel Conditions', text: 'Prices, availability, opening hours, and travel conditions can change without notice. Always verify critical details directly with businesses, attractions, or official sources before travelling.' },
      { subtitle: 'External Links', text: 'Our site may contain links to external websites. We are not responsible for the content, privacy practices, or availability of third-party sites.' },
    ]
  },
  {
    title: 'Business Listings',
    content: `EastorySL offers free business listings for tourism-related businesses in Sri Lanka. By submitting a listing, you agree to:`,
    list: [
      { text: 'Provide accurate and truthful information about your business.' },
      { text: 'You are authorised to submit this information on behalf of the business.' },
      { text: 'You are responsible for keeping your listing information current and accurate.' },
      { text: 'EastorySL reserves the right to edit, modify, or remove any listing at our discretion, including listings that contain inaccurate, misleading, or inappropriate content.' },
      { text: 'Listing a business does not constitute an endorsement or guarantee by EastorySL.' },
    ]
  },
  {
    title: 'Newsletter and Communications',
    content: `When you subscribe to our newsletter, you agree to receive periodic emails containing travel tips, destination guides, and site updates from EastorySL. You may unsubscribe at any time by clicking the unsubscribe link included in every email. We will never spam you or share your email address with third parties for marketing purposes.`
  },
  {
    title: 'Intellectual Property',
    content: `All content on EastorySL — including text, graphics, logos, images, data compilations, and site design — is the property of EastorySL or its content creators and is protected by applicable intellectual property laws. You may:`,
    list: [
      { text: 'View and read content for personal use.' },
      { text: 'Share links to our pages on social media.' },
      { text: 'Quote small excerpts with proper attribution and a link back to the original page.' },
    ],
    postList: `You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit any content for commercial purposes without prior written permission from EastorySL.`
  },
  {
    title: 'User-Generated Content',
    content: `If you submit content to EastorySL (such as business listing details, feedback, or other contributions), you grant us a non-exclusive, royalty-free, perpetual licence to use, modify, and display that content on our platform. You represent that your submissions do not violate any third-party rights.`
  },
  {
    title: 'Limitation of Liability',
    content: `EastorySL and its operators shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from:`,
    list: [
      { text: 'Your use of or inability to use the website.' },
      { text: 'Any errors or omissions in the content.' },
      { text: 'Decisions made based on information found on the site.' },
      { text: 'Unauthorised access to or alteration of your data.' },
    ],
    postList: `The website is provided "as is" without warranties of any kind. Your use of EastorySL is at your sole risk.`
  },
  {
    title: 'Indemnification',
    content: `You agree to indemnify and hold EastorySL harmless from any claims, losses, or damages (including legal fees) arising from your use of the website, your violation of these terms, or your violation of any rights of a third party.`
  },
  {
    title: 'Termination',
    content:       `We reserve the right to suspend or terminate your access to EastorySL at any time, without notice, for conduct that we believe violates these terms or is harmful to EastorySL or third parties, or for any other reason.`
  },
  {
    title: 'Governing Law',
    content: `These Terms of Service are governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.`
  },
  {
    title: 'Changes to These Terms',
    content:       `We may update these Terms of Service from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this page periodically. Material changes will be communicated through a notice on our website.`
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about these Terms of Service, please contact us:`,
    list: [
      { subtitle: 'WhatsApp', text: '+94 72 436 2001' },
      { subtitle: 'Facebook', text: 'facebook.com/eastory.sl' },
      { subtitle: 'Instagram', text: 'instagram.com/eastory.sl' },
    ]
  },
]

export default function TermsOfService() {
  return (
    <div className="pt-24 md:pt-28 min-h-screen bg-slate-50">
      <SEO
        title="Terms of Service"
        description="Terms of Service for Eastory SL. Read the rules and guidelines for using our platform."
        ogImage="/images/home/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/terms-of-service`}
        noindex
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-teal-600 font-semibold uppercase tracking-wider mb-3">
            <span className="w-8 h-px bg-teal-500 inline-block" />
            Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Terms of Service</h1>
          <p className="text-slate-500 text-sm">
            Last updated: <time dateTime="2026-07-21">{lastUpdated}</time>
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            Welcome to <strong className="text-slate-800">EastorySL</strong>. These Terms of Service outline the rules and guidelines for using our website and services. Please read them carefully before using the site.
          </p>
        </div>

        <nav className="mb-10 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Contents</p>
          <ol className="space-y-1.5">
            {sections.map((s, i) => (
              <li key={i} className="text-sm">
                <a href={`#section-${i}`} className="text-slate-600 hover:text-teal-600 transition-colors">
                  <span className="text-teal-500 font-semibold mr-2">{i + 1}.</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12">
          {sections.map((s, i) => (
            <section key={i} id={`section-${i}`}>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-teal-500 rounded-full shrink-0" />
                {s.title}
              </h2>
              {s.content && (
                <p className="text-slate-600 leading-relaxed mb-4">{s.content}</p>
              )}
              {s.list && (
                <ul className="space-y-3 mb-4">
                  {s.list.map((item, j) => (
                    <li key={j} className="pl-4 border-l-2 border-teal-200">
                      {item.subtitle && (
                        <p className="text-sm font-semibold text-slate-700 mb-1">{item.subtitle}</p>
                      )}
                      <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                    </li>
                  ))}
                </ul>
              )}
              {s.postList && (
                <p className="text-slate-600 leading-relaxed text-sm">{s.postList}</p>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EastorySL. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy-policy" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Privacy Policy</Link>
            <Link to="/business-terms" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Business Terms</Link>
            <Link to="/cookie-policy" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Cookie Policy</Link>
            <Link to="/disclaimer" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

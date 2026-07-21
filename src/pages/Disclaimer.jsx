import SEO from '../components/seo/SEO'
import { Link } from 'react-router-dom'

const lastUpdated = 'July 21, 2026'

const sections = [
  {
    title: 'General Information',
    content: `The information provided on EastorySL ("the Website") is for general informational purposes only. All content is published in good faith and for general information purposes. While we strive to keep our information current and accurate, we make no representations or warranties of any kind about the completeness, reliability, or suitability of the information, graphics, or other content published on this site.`,
  },
  {
    title: 'Travel Advice',
    content: `EastorySL provides destination guides, travel suggestions, and cultural information for Sri Lanka. This content is not a substitute for professional travel advice. Before travelling, you should:`,
    list: [
      { text: 'Verify current travel requirements, visa regulations, and entry conditions with the Sri Lanka Department of Immigration or your local embassy.' },
      { text: 'Check current health and safety advisories from your government\'s travel advisory service.' },
      { text: 'Confirm availability, prices, opening hours, and travel conditions directly with businesses, attractions, and official sources.' },
      { text: 'Obtain comprehensive travel insurance appropriate for your trip.' },
      { text: 'Consult a healthcare professional for any medical advice related to travel in Sri Lanka.' },
    ],
    postList: `Conditions in Sri Lanka can change rapidly due to weather, seasonal factors, policy changes, or other unforeseen circumstances. Information accurate at the time of publication may become outdated.`,
  },
  {
    title: 'Business Listings',
    content: `EastorySL hosts business listings submitted by tourism-related businesses in Sri Lanka. Please note:`,
    list: [
      { subtitle: 'No Endorsement', text: 'The inclusion of any business listing on EastorySL does not constitute an endorsement, recommendation, or guarantee by EastorySL. We do not verify the accuracy of all listing information.' },
      { subtitle: 'Business Responsibility', text: 'Businesses are responsible for the accuracy of their own listings. EastorySL is not liable for any claims, losses, or damages arising from the information provided in business listings.' },
      { subtitle: 'No Warranty', text: 'We do not warrant that listed businesses will provide the quality of service they claim, nor that their listed prices, hours, or availability are current or accurate.' },
      { subtitle: 'Transactions', text: 'Any transactions, bookings, or agreements between you and a listed business are solely between you and that business. EastorySL is not a party to any such transaction.' },
    ],
  },
  {
    title: 'External Links',
    content: `Our website contains links to external websites and services that are not operated or controlled by EastorySL, including but not limited to:`,
    list: [
      { text: 'Google Maps (navigation and directions)' },
      { text: 'Social media platforms (Facebook, Instagram, WhatsApp)' },
      { text: 'Third-party websites linked in business listings' },
      { text: 'Third-party image hosts (GitHub, Booking.com)' },
    ],
    postList: `We have no control over the content and practices of these external sites and cannot accept responsibility for their privacy policies, content, or practices. The inclusion of any link does not imply endorsement or recommendation. You access third-party links entirely at your own risk.`,
  },
  {
    title: 'Photos and Images',
    content: `The photographs and images displayed on EastorySL are used for illustrative and reference purposes. Please be aware that:`,
    list: [
      { text: 'Images may not reflect the current appearance, condition, or state of the depicted locations.' },
      { text: 'Seasonal changes, weather conditions, development, and natural erosion may alter the appearance of destinations over time.' },
      { text: 'Some images are sourced from third-party hosts and may be subject to their own terms of use.' },
      { text: 'Actual experiences may differ from what is depicted in photographs.' },
    ],
  },
  {
    title: 'Map Information',
    content: `The interactive map on EastorySL uses data from OpenStreetMap and CARTO tile services. Please note:`,
    list: [
      { text: 'Pin locations and boundaries are approximate and may not be precise.' },
      { text: 'Road conditions, accessibility, and routes shown on the map may change over time.' },
      { text: 'The map is intended as a general reference tool and should not be used as the sole source for navigation or route planning.' },
      { text: 'Always verify directions and accessibility with local sources before travelling.' },
    ],
  },
  {
    title: 'Professional Advice',
    content: `EastorySL does not provide professional advice of any kind, including but not limited to:`,
    list: [
      { text: 'Legal advice' },
      { text: 'Medical or health advice' },
      { text: 'Financial or investment advice' },
      { text: 'Insurance advice' },
      { text: 'Technical or engineering advice' },
    ],
    postList: `You should always consult with a qualified professional before making decisions based on information found on this website. Reliance on any information provided by EastorySL is solely at your own risk.`,
  },
  {
    title: 'User Responsibility',
    content: `By using EastorySL, you acknowledge and agree that:`,
    list: [
      { text: 'You are responsible for your own travel decisions and arrangements.' },
      { text: 'You will independently verify critical information before acting on it.' },
      { text: 'You use the website and any information obtained from it at your own risk.' },
      { text: 'EastorySL shall not be liable for any loss or damage arising from your reliance on the information provided on this website.' },
    ],
  },
  {
    title: 'Accuracy and Corrections',
    content: `We are committed to providing accurate information. However, errors may occur. If you find inaccurate or outdated information on our website, we encourage you to let us know via WhatsApp at +94 72 436 2001. We will review corrections promptly and update the information where appropriate.`,
  },
  {
    title: 'Limitation of Liability',
    content: `To the fullest extent permitted by applicable law, EastorySL and its operators shall not be held liable for any direct, indirect, incidental, consequential, or punitive damages arising from:`,
    list: [
      { text: 'Your use of or inability to use the website.' },
      { text: 'Any errors, omissions, or inaccuracies in the content.' },
      { text: 'Decisions made based on information found on the site.' },
      { text: 'Any interactions with third-party services or websites linked from our site.' },
      { text: 'Any travel-related losses, including but not limited to financial loss, injury, or inconvenience.' },
    ],
    postList: `The website is provided "as is" without warranties of any kind. Your use of EastorySL is at your sole risk.`,
  },
  {
    title: 'Changes to This Disclaimer',
    content: `We may update this Disclaimer from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this page periodically.`,
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about this Disclaimer, please contact us:`,
    list: [
      { subtitle: 'WhatsApp', text: '+94 72 436 2001' },
      { subtitle: 'Facebook', text: 'facebook.com/eastory.sl' },
      { subtitle: 'Instagram', text: 'instagram.com/eastory.sl' },
    ],
  },
]

export default function Disclaimer() {
  return (
    <div className="pt-24 md:pt-28 min-h-screen bg-slate-50">
      <SEO
        title="Disclaimer"
        description="Disclaimer for Eastory SL. Important information about the accuracy of content and limitations of our website."
        ogImage="/images/home/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/disclaimer`}
        noindex
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-teal-600 font-semibold uppercase tracking-wider mb-3">
            <span className="w-8 h-px bg-teal-500 inline-block" />
            Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Disclaimer</h1>
          <p className="text-slate-500 text-sm">
            Last updated: <time dateTime="2026-07-21">{lastUpdated}</time>
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            The information provided on <strong className="text-slate-800">EastorySL</strong> is for general informational purposes only. Please read this disclaimer carefully before using our website.
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
            <Link to="/terms-of-service" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Terms of Service</Link>
            <Link to="/business-terms" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Business Terms</Link>
            <Link to="/cookie-policy" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

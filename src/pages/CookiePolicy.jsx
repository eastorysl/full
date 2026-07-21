import SEO from '../components/seo/SEO'
import { Link } from 'react-router-dom'

const lastUpdated = 'July 21, 2026'

const essentialCookies = [
  {
    name: 'eastorysl_pwa_dismissed',
    provider: 'EastorySL',
    purpose: 'Remembers whether you have dismissed the PWA (Progressive Web App) install prompt so it does not reappear.',
    duration: 'Until cleared manually',
    type: 'localStorage',
  },
]

const analyticsCookies = [
  {
    name: '_ga',
    provider: 'Google Analytics',
    purpose: 'Distinguishes unique users by assigning a randomly generated number as a client identifier.',
    duration: '2 years',
  },
  {
    name: '_ga_*',
    provider: 'Google Analytics',
    purpose: 'Used to maintain session state and persist session information across page loads.',
    duration: '2 years',
  },
]

const functionalityCookies = [
  {
    name: 'NID',
    provider: 'Google Fonts',
    purpose: 'Set by Google when loading services such as Google Fonts. Stores preferences like preferred language and security settings.',
    duration: '6 months',
  },
]

const cdnCookies = [
  {
    name: '__cf_bm',
    provider: 'Cloudflare',
    purpose: 'General Cloudflare Bot Management cookie. Set on any request to a Cloudflare-served CDN resource (including Font Awesome CSS from cdnjs.cloudflare.com). Helps identify and mitigate automated traffic.',
    duration: '30 minutes',
  },
]

const sections = [
  {
    title: 'What Are Cookies',
    content: `Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to website owners. Cookies can be "first-party" (set by the website you are visiting) or "third-party" (set by other services embedded in the page).`,
  },
  {
    title: 'How We Use Cookies',
    content: `EastorySL uses cookies and similar technologies (such as local storage) for the following purposes:`,
    list: [
      { subtitle: 'Essential Cookies', text: 'Required for core site functionality, such as remembering your preferences. These cannot be disabled.' },
      { subtitle: 'Analytics Cookies', text: 'Help us understand how visitors interact with our website by collecting anonymous usage data. This helps us improve the site.' },
      { subtitle: 'Functionality Cookies', text: 'Allow the site to remember choices you make, such as language and region preferences set via third-party services.' },
      { subtitle: 'CDN Cookies', text: 'Set by our content delivery networks when loading third-party resources (fonts, icons, map libraries). These are operational cookies required to deliver those resources.' },
    ],
  },
  {
    title: 'Cookies We Set',
    content: `The table below lists the specific cookies and local storage items used by EastorySL:`,
  },
  {
    title: 'Third-Party Services',
    content: `Some cookies are set by third-party services embedded in our pages. We do not control these cookies. The third-party services we use include:`,
    list: [
      { subtitle: 'Google Analytics', text: 'Set by Google to collect anonymous usage data. Google may process this data in the United States. You can opt out by installing the Google Analytics Opt-out Browser Add-on.' },
      { subtitle: 'Google Fonts', text: 'When our site loads fonts from fonts.googleapis.com, Google may set the NID cookie. Your IP address is also sent to Google\'s servers. To learn more, see the Google Privacy Policy.' },
      { subtitle: 'Cloudflare CDN', text: 'Font Awesome CSS is loaded from cdnjs.cloudflare.com, which is served by Cloudflare. Cloudflare may set operational cookies such as __cf_bm for bot management on all CDN requests.' },
      { subtitle: 'CARTO (Map Tiles)', text: 'Our interactive map loads map tiles from CARTO\'s servers (cartocdn.com). CARTO may process your IP address and viewport coordinates when tiles are loaded.' },
      { subtitle: 'unpkg.com', text: 'The Leaflet map library CSS is loaded from unpkg.com, a CDN. This may transfer your IP address to the CDN servers.' },
      { subtitle: 'Netlify', text: 'Our website is hosted on Netlify. Netlify may set operational cookies for its CDN and edge network.' },
      { subtitle: 'EmailJS', text: 'Our place feedback form uses EmailJS to send emails. EmailJS uses browser storage (localStorage) for internal state.' },
    ],
  },
  {
    title: 'Local Storage',
    content: `In addition to cookies, our website uses the browser's localStorage feature:`,
    list: [
      { subtitle: 'eastorysl_pwa_dismissed', text: 'Stores a boolean value indicating whether you have dismissed the PWA install prompt. This prevents the prompt from reappearing. This data never leaves your device and is not shared with any third party.' },
    ],
    postList: `Our PWA service worker (powered by Workbox) caches website assets in your browser for offline access. This cached data is stored locally and does not transmit any information to third parties.`,
  },
  {
    title: 'Data Collected by Third Parties',
    content: `When third-party resources are loaded, the following data may be transferred to third-party servers:`,
    list: [
      { text: 'Your IP address (sent to Google, Cloudflare, CARTO, unpkg, and Netlify)' },
      { text: 'Your browser type and User-Agent string (sent to all third-party servers)' },
      { text: 'Pages visited and time on page (sent to Google Analytics)' },
      { text: 'Approximate geographic region (country/city level, derived from IP by Google Analytics)' },
      { text: 'Referral source (how you arrived at our site, tracked by Google Analytics)' },
      { text: 'Map viewport coordinates and zoom level (sent to CARTO when tiles are loaded)' },
    ],
    postList: `We do not sell, rent, or share this data with third parties for advertising purposes. Google Analytics data is used solely for website improvement and is retained for up to 14 months.`,
  },
  {
    title: 'Managing Cookies',
    content: `You can control and manage cookies in several ways:`,
    list: [
      { subtitle: 'Browser Settings', text: 'Most browsers allow you to block or delete cookies. Refer to your browser\'s help documentation for instructions. Note that blocking essential cookies may affect site functionality.' },
      { subtitle: 'Google Analytics Opt-out', text: 'You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on, available at https://tools.google.com/dlpage/gaoptout.' },
      { subtitle: 'Private Browsing', text: 'Using your browser\'s private or incognito mode limits cookie storage. Cookies are deleted when you close the private window.' },
      { subtitle: 'Clearing Local Data', text: 'You can clear localStorage and service worker caches through your browser\'s developer tools or by clearing your browsing data.' },
    ],
    postList: `Please note that we do not currently display a cookie consent banner. If you are located in the European Union or another jurisdiction that requires prior consent for non-essential cookies, please contact us and we will implement appropriate consent mechanisms.`,
  },
  {
    title: 'Service Worker',
    content: `EastorySL is a Progressive Web App (PWA) that uses a Workbox-based service worker. The service worker caches website assets (HTML, JavaScript, CSS, images, fonts) in your browser for offline access and faster loading. It also enables offline analytics tracking via Google Analytics.`,
    list: [
      { text: 'The service worker is registered automatically when you visit our site.' },
      { text: 'It caches resources from Google Fonts, unpkg.com, Cloudflare CDN, and GitHub.' },
      { text: 'Cached data is stored locally on your device and is not transmitted to any server.' },
      { text: 'You can unregister the service worker and clear cached data through your browser settings.' },
    ],
  },
  {
    title: 'Changes to This Cookie Policy',
    content: `We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. Changes will be posted on this page with an updated revision date. We encourage you to review this page periodically.`,
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about our use of cookies, please contact us:`,
    list: [
      { subtitle: 'WhatsApp', text: '+94 72 436 2001' },
      { subtitle: 'Facebook', text: 'facebook.com/eastory.sl' },
      { subtitle: 'Instagram', text: 'instagram.com/eastory.sl' },
    ],
  },
]

function CookieTable({ title, cookies }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Cookie</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Provider</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Purpose</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-700">Duration</th>
            </tr>
          </thead>
          <tbody>
            {cookies.map((c, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="px-4 py-3 font-mono text-xs text-teal-700 whitespace-nowrap">{c.name}</td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.provider}</td>
                <td className="px-4 py-3 text-slate-600">{c.purpose}</td>
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function CookiePolicy() {
  return (
    <div className="pt-24 md:pt-28 min-h-screen bg-slate-50">
      <SEO
        title="Cookie Policy"
        description="Cookie Policy for Eastory SL. Learn about the cookies and tracking technologies used on our website."
        ogImage="/images/home/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/cookie-policy`}
        noindex
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-teal-600 font-semibold uppercase tracking-wider mb-3">
            <span className="w-8 h-px bg-teal-500 inline-block" />
            Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Cookie Policy</h1>
          <p className="text-slate-500 text-sm">
            Last updated: <time dateTime="2026-07-21">{lastUpdated}</time>
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            This Cookie Policy explains how <strong className="text-slate-800">EastorySL</strong> uses cookies and similar technologies when you visit our website. It describes what cookies are, how we use them, and how you can manage them.
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
              {i === 2 && (
                <>
                  <CookieTable title="Essential Cookies" cookies={essentialCookies} />
                  <CookieTable title="Analytics Cookies" cookies={analyticsCookies} />
                  <CookieTable title="Functionality Cookies" cookies={functionalityCookies} />
                  <CookieTable title="CDN Cookies" cookies={cdnCookies} />
                </>
              )}
              {s.list && i !== 2 && (
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
            <Link to="/disclaimer" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

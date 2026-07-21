import SEO from '../components/seo/SEO'
import { Link } from 'react-router-dom'

const lastUpdated = 'July 21, 2026'

const sections = [
  {
    title: 'Data Controller',
    content: `EastorySL is the data controller responsible for personal information collected through this website. If you have any questions about how we handle your data, please contact us using the details provided at the end of this policy.`
  },
  {
    title: 'Information We Collect',
    content: `When you use EastorySL, we may collect the following types of information:`,
    list: [
      { subtitle: 'Email Address', text: 'Collected when you subscribe to our newsletter via the footer subscription form. Your email is transmitted over HTTPS to Google Apps Script and stored in a Google Sheet. No additional encryption is applied by EastorySL beyond the HTTPS transport.' },
      { subtitle: 'Business Listing Information', text: 'When you submit a business listing through our Advertise page, we collect your name, business name, email, phone number, business category, and optional website and description. This information is sent via WhatsApp (Meta Platforms) and is subject to WhatsApp\'s own Privacy Policy.' },
      { subtitle: 'Server Logs', text: 'Our hosting provider (Netlify) automatically records server logs including IP addresses, browser type, and access times for security and operational purposes.' },
      { subtitle: 'Feedback Submissions', text: 'When you submit feedback on a place page, we collect your name, email, and message. This data is sent via EmailJS and processed by EmailJS according to their Privacy Policy.' },
      { subtitle: 'Location Data', text: 'Our interactive map feature may access your approximate location (with your permission) to show nearby places and destinations. This data is processed locally in your browser and is never stored on our servers.' },
      { subtitle: 'Analytics Data', text: 'We use Google Analytics 4 to understand how visitors interact with our site. Google Analytics collects information such as pages visited, time spent on pages, browser type, device information, and approximate geographic region. This data is collected anonymously and processed by Google. You can opt out by using the Google Analytics Opt-Out Browser Add-on.' },
    ]
  },
  {
    title: 'Legal Basis for Processing',
    content: `We process personal information only where permitted under applicable law:`,
    list: [
      { subtitle: 'Consent', text: 'Where you have given explicit consent, such as subscribing to our newsletter or granting location access on the map.' },
      { subtitle: 'Legitimate Interests', text: 'Where we have a legitimate interest in operating and maintaining our website, such as responding to your enquiries via WhatsApp or content feedback submissions on place pages.' },
    ]
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect for the following purposes:`,
    list: [
      { subtitle: 'Service Delivery', text: 'To provide you with destination guides, travel content, interactive maps, and business listings.' },
      { subtitle: 'Newsletter Communications', text: 'To send periodic emails with travel tips, destination highlights, seasonal guides, and site updates. You can unsubscribe at any time using the link provided in every email.' },
      { subtitle: 'Business Listings', text: 'To display your business information on our platform and help travellers discover your services across Sri Lanka.' },
      { subtitle: 'Communication', text: 'To respond to your enquiries when you contact us via WhatsApp or submit content feedback on place pages.' },
      { subtitle: 'Analytics', text: 'To understand how visitors use our site and improve our content and features through anonymised Google Analytics data.' },
    ]
  },
  {
    title: 'Data Retention',
    content: `We retain personal information only as long as necessary for the purposes described in this policy:`,
    list: [
      { subtitle: 'Newsletter Subscriptions', text: 'Retained until you unsubscribe. Unsubscribe requests are processed promptly.' },
      { subtitle: 'Business Listing Information', text: 'Retained while the listing remains active or until you request removal. You may request removal at any time by contacting us via WhatsApp at +94 72 436 2001.' },
      { subtitle: 'Server Logs', text: 'Managed by Netlify and retained for a limited period per their default configuration, after which they are automatically deleted.' },
      { subtitle: 'Analytics Data', text: 'Google Analytics data is retained per Google\'s default retention settings (typically 14 months). You may opt out of Google Analytics tracking at any time.' },
      { subtitle: 'WhatsApp Communications', text: 'Messages sent via WhatsApp are retained by WhatsApp (Meta Platforms) subject to their own data retention policies. We do not separately store WhatsApp message content.' },
    ]
  },
  {
    title: 'International Data Transfers',
    content: `Your information may be processed and stored on servers located outside Sri Lanka by our third-party service providers. These providers include:`,
    list: [
      { subtitle: 'Google', text: 'Google Apps Script processes newsletter subscription data. Google Analytics collects anonymised usage data. Google\'s servers may be located in various countries. Google\'s Privacy Policy applies to this data.' },
      { subtitle: 'Netlify', text: 'Our website is hosted on Netlify, which may process data in the United States. Netlify\'s Privacy Policy applies to server log data.' },
      { subtitle: 'Meta Platforms', text: 'Business listing submissions sent via WhatsApp and links to our Facebook and Instagram pages are processed by Meta. Meta\'s Privacy Policy applies.' },
      { subtitle: 'OpenStreetMap', text: 'Our interactive map uses tile services from OpenStreetMap and CARTO. These services may collect anonymised usage data per their own privacy policies.' },
      { subtitle: 'OSRM', text: 'Our trip planner sends route coordinates to OSRM (Open Source Routing Machine) servers for route calculation. OSRM\'s privacy policy applies to this data.' },
      { subtitle: 'EmailJS', text: 'Our place feedback form uses EmailJS to send emails. EmailJS processes your name, email, and message. EmailJS\'s Privacy Policy applies.' },
      { subtitle: 'GitHub / Microsoft', text: 'Some images on our site are hosted on raw.githubusercontent.com. Loading these images transfers your IP address to Microsoft\'s servers.' },
    ],
    postList: `We do not control the privacy practices of third-party providers and encourage users to review their respective privacy policies.`
  },
  {
    title: 'Cookies and Local Storage',
    content: `EastorySL uses the following cookies and local storage:`,
    list: [
      { subtitle: 'Google Analytics', text: 'Google Analytics uses cookies (such as `_ga` and `_ga_*`) to distinguish unique users and track page views. These are set by Google and are subject to Google\'s cookie policy.' },
      { subtitle: 'Service Worker', text: 'Our Progressive Web App (PWA) uses a service worker to enable offline access and caching for faster page loads. This does not track your activity.' },
      { subtitle: 'PWA Install Prompt', text: 'We use local storage to remember whether you have dismissed the PWA install prompt, so it does not reappear repeatedly.' },
    ],
    postList: `You can control or delete cookies through your browser settings. Disabling Google Analytics cookies will not affect site functionality. If we introduce additional cookies in the future, we will update this policy and obtain consent where required by law.`
  },
  {
    title: 'Data Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties. Your data may only be shared in the following limited circumstances:`,
    list: [
      { subtitle: 'Business Listings', text: 'Information you submit for a business listing is publicly displayed on our platform as intended. Visible information includes your business name, phone number, website, and description. You may request modifications or removal at any time.' },
      { subtitle: 'Service Providers', text: 'We share data with third-party services (Google, Netlify, Meta) solely to operate the features described in this policy. These services process data according to their own privacy policies.' },
      { subtitle: 'Legal Requirements', text: 'We may disclose information if required by law, regulation, or legal process.' },
    ]
  },
  {
    title: 'Your Rights',
    content: `You have the following rights regarding your personal data:`,
    list: [
      { subtitle: 'Access', text: 'You may contact us to request confirmation of what personal data we hold about you. Given the limited types of data we collect, we will respond manually via WhatsApp or email.' },
      { subtitle: 'Correction', text: 'You may request corrections if the data we hold about you is inaccurate or incomplete.' },
      { subtitle: 'Deletion', text: 'You may request that we delete your personal data, subject to any legal obligations we may have to retain certain records.' },
      { subtitle: 'Withdraw Consent', text: 'Where processing is based on your consent, you may withdraw that consent at any time without affecting the lawfulness of processing prior to withdrawal.' },
      { subtitle: 'Unsubscribe', text: 'You can unsubscribe from our newsletter at any time by clicking the unsubscribe link in any email or by contacting us directly.' },
      { subtitle: 'Business Listing Removal', text: 'If you have a business listing on our platform, you may request its removal by contacting us via WhatsApp at +94 72 436 2001.' },
      { subtitle: 'Google Analytics Opt-Out', text: 'You can opt out of Google Analytics tracking by installing the Google Analytics Opt-Out Browser Add-on or by disabling JavaScript in your browser.' },
    ],
    postList: `To exercise any of these rights, please contact us using the details at the end of this policy.`
  },
  {
    title: 'Data Breach',
    content: `If we become aware of a security incident that may have affected your personal information, we will take reasonable steps to investigate and address the issue. Given the limited types of data we collect, we will notify affected individuals where feasible and where required by applicable law.`
  },
  {
    title: 'Automated Decision-Making',
    content: `EastorySL does not use automated decision-making or profiling that produces legal or similarly significant effects on our users.`
  },
  {
    title: "Children's Privacy",
    content: `EastorySL is not directed at children under the age of 13. We do not knowingly collect personal information from children. If a parent or guardian believes that a child has submitted personal information to us, please contact us immediately so we can remove that information.`
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date. We encourage you to review this policy periodically.`
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about this Privacy Policy or how we handle your data, please reach out:`,
    list: [
      { subtitle: 'WhatsApp', text: '+94 72 436 2001' },
      { subtitle: 'Facebook', text: 'facebook.com/eastory.sl' },
      { subtitle: 'Instagram', text: 'instagram.com/eastory.sl' },
    ]
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 md:pt-28 min-h-screen bg-slate-50">
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for Eastory SL. Learn how we collect, use, and protect your personal information."
        ogImage="/images/home/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/privacy-policy`}
        noindex
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-teal-600 font-semibold uppercase tracking-wider mb-3">
            <span className="w-8 h-px bg-teal-500 inline-block" />
            Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">
            Last updated: <time dateTime="2026-07-21">{lastUpdated}</time>
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            At <strong className="text-slate-800">EastorySL</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website and use our services. It also explains your rights under applicable data protection laws, including Sri Lanka&apos;s Personal Data Protection Act (PDPA). By using our platform, you agree to the practices described in this policy.
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
                <ul className="space-y-4">
                  {s.list.map((item, j) => (
                    <li key={j} className="pl-4 border-l-2 border-teal-200">
                      <p className="text-sm font-semibold text-slate-700 mb-1">{item.subtitle}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                    </li>
                  ))}
                </ul>
              )}
              {s.postList && (
                <p className="text-slate-600 leading-relaxed text-sm mt-4">{s.postList}</p>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EastorySL. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/terms-of-service" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Terms of Service</Link>
            <Link to="/business-terms" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Business Terms</Link>
            <Link to="/cookie-policy" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Cookie Policy</Link>
            <Link to="/disclaimer" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

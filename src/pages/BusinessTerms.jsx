import SEO from '../components/seo/SEO'
import { Link } from 'react-router-dom'

const lastUpdated = 'July 21, 2026'

const sections = [
  {
    title: 'Eligibility',
    content: `To list a business on EastorySL, you must:`,
    list: [
      'Be the business owner or an authorised representative with permission to submit the listing.',
      'Operate a legitimate tourism-related business located in Sri Lanka.',
      'Provide accurate and verifiable contact information.',
    ]
  },
  {
    title: 'Listing Standards',
    content: `All business listings on EastorySL must meet the following standards:`,
    list: [
      { subtitle: 'Accuracy', text: 'All information submitted — including business name, contact details, and description — must be truthful and accurate. Misleading or deceptive listings will be rejected or removed.' },
      { subtitle: 'Appropriate Content', text: 'Listings must not contain offensive, discriminatory, illegal, or inappropriate material. All photos and descriptions must be suitable for a general audience.' },
      { subtitle: 'One Listing Per Business', text: 'Each physical business location should have only one listing. If you believe a duplicate listing exists, please contact us and we will review it.' },
      { subtitle: 'Category Correctness', text: 'Your business must be listed under the most appropriate category. Misleading categorisation may result in reassignment or removal.' },
    ]
  },
  {
    title: 'Plans and Pricing',
    content: `EastorySL offers the following listing plans:`,
    list: [
      { subtitle: 'Free Plan', text: 'A basic listing at no cost. Free listings include contact information and map integration.' },
      { subtitle: 'Featured Plan', text: 'A paid annual plan (Rs 3,500/year) that includes a Featured Badge, a dedicated single page website linked from your listing (without SEO optimisation), and a custom WhatsApp message. Payment is arranged manually via WhatsApp and is non-refundable once the listing has been published.' },
      { subtitle: 'Premium Plan', text: 'A custom-priced plan with full service including social media promotion, dedicated website, and SEO optimisation. Terms are agreed separately for each Premium client.' },
    ],
    postList: `All prices are in Sri Lankan Rupees (LKR) and are exclusive of applicable taxes unless stated otherwise. EastorySL reserves the right to modify pricing at any time, though existing paid listings will honour their original terms until renewal.`
  },
  {
    title: 'Curated Free Listings',
    content: `As an official feature of the EastorySL platform, we curate and publish free plan listings for tourism-related businesses in Sri Lanka using publicly available information, including but not limited to business names, locations, contact details, ratings, and reviews sourced from third-party platforms such as Google. This service is provided at no cost to the listed business and generates no revenue for EastorySL. The purpose is to offer travellers a comprehensive and reliable directory of tourism services across Sri Lanka.`,
    list: [
      { subtitle: 'Traveller Benefit', text: 'Curated free listings ensure that travellers have full flexibility to discover, compare, and directly reach tourism businesses across Sri Lanka without restriction. Listings include essential contact information, location, and map integration to facilitate direct communication between travellers and businesses.' },
      { subtitle: 'No Prior Consent Required', text: 'EastorySL operates in accordance with fair use and directory listing principles that allow the curation of publicly available business information for the creation of a travel directory. We respect the rights of all business owners and do not require explicit consent prior to inclusion in free curated listings. However, we fully honour any request to claim, modify, or remove a listing at any time.' },
      { subtitle: 'Claim or Remove', text: 'Any business owner who wishes to claim, update, or remove a curated listing may contact us at any time via WhatsApp at +94 72 436 2001. All removal requests are processed promptly and without charge.' },
    ],
  },
  {
    title: 'Content and Ownership',
    content: `By submitting a listing, you grant EastorySL a non-exclusive, royalty-free, worldwide licence to use, display, reproduce, and modify the content you provide for the purpose of operating and promoting the platform. You retain ownership of your content and may request removal at any time.`,
    postList: `You confirm that all submitted content (text, images, logos) does not infringe upon the intellectual property rights of any third party. EastorySL is not responsible for any copyright violations in user-submitted content.`
  },
  {
    title: 'Listing Modifications and Removal',
    content: `EastorySL reserves the right to:`,
    list: [
      'Edit listings to correct formatting, fix errors, or improve readability without prior notice.',
      'Reassign listings to more appropriate categories.',
      'Remove listings that violate these terms, contain misleading information, or are otherwise deemed inappropriate.',
      'Suspend or permanently remove any listing at our sole discretion, with or without cause.',
    ],
    postList: `You may request modifications or removal of your listing at any time by contacting us via WhatsApp at +94 72 436 2001. Removal requests are typically processed within 48 hours.`
  },
  {
    title: 'Payments and Refunds',
    content: `For Featured and Premium plans:`,
    list: [
      { subtitle: 'Payment', text: 'Payment for paid plans is arranged manually via WhatsApp. Your listing goes live once payment has been confirmed by our team.' },
      { subtitle: 'Refund Policy', text: 'Paid listings are non-refundable once the listing has been published. If your listing is rejected before publication due to a violation of these terms, we will inform you via WhatsApp and arrange a refund.' },
      { subtitle: 'Renewals', text: 'Featured plans renew annually. You will be notified before your plan expires. If you choose not to renew, your listing will revert to Free plan status or be removed.' },
    ]
  },
  {
    title: 'Prohibited Activities',
    content: `You must not:`,
    list: [
      'Submit false, misleading, or fraudulent business information.',
      'Use the listing service to promote illegal activities or services.',
      'Impersonate another business or person when creating a listing.',
      'Submit content that contains malware, spam, or malicious links.',
    ]
  },
  {
    title: 'Limitation of Liability',
    content: `EastorySL acts as a platform to connect travellers with businesses. We are not a party to any transaction between a business and its customers. EastorySL shall not be liable for:`,
    list: [
      'Any loss of revenue, customers, or business opportunities resulting from a listing.',
      'The accuracy of information provided by listed businesses.',
      'Disputes between businesses and their customers.',
      'Any indirect, incidental, or consequential damages arising from the use of our listing service.',
    ],
    postList: `The listing service is provided "as is" without warranties of any kind. Your use of the service is at your sole risk.`
  },
  {
    title: 'Termination',
    content:       `EastorySL may remove or modify your listing at any time if you breach these terms. You may also request removal of your listing at any time by contacting us. Upon removal, your listing data may be retained for a reasonable period for backup and legal compliance purposes before being deleted.`
  },
  {
    title: 'Changes to These Terms',
    content: `We may update these Business Listing Terms from time to time. Changes will be reflected on this page with an updated revision date. Continued submission or maintenance of a listing after changes are posted constitutes acceptance of the updated terms. For material changes, we will make reasonable efforts to notify existing listers.`
  },
  {
    title: 'Contact Us',
    content: `If you have questions about these Business Listing Terms, or need to manage your listing:`,
    list: [
      { subtitle: 'WhatsApp', text: '+94 72 436 2001 (preferred)' },
      { subtitle: 'Facebook', text: 'facebook.com/eastory.sl' },
      { subtitle: 'Instagram', text: 'instagram.com/eastory.sl' },
    ]
  },
]

export default function BusinessTerms() {
  return (
    <div className="pt-24 md:pt-28 min-h-screen bg-slate-50">
      <SEO
        title="Business Listing Terms & Conditions"
        description="Terms and conditions for listing your business on Eastory SL. Read the rules for submitting and maintaining a business listing."
        ogImage="/images/home/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/business-terms`}
        noindex
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-teal-600 font-semibold uppercase tracking-wider mb-3">
            <span className="w-8 h-px bg-teal-500 inline-block" />
            Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Business Listing Terms &amp; Conditions</h1>
          <p className="text-slate-500 text-sm">
            Last updated: <time dateTime="2026-07-21">{lastUpdated}</time>
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            These terms govern the submission, management, and display of business listings on <strong className="text-slate-800">EastorySL</strong>. By submitting a business listing, you agree to comply with all terms outlined on this page.
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
                      {typeof item === 'string' ? (
                        <p className="text-sm text-slate-600 leading-relaxed">{item}</p>
                      ) : (
                        <>
                          {item.subtitle && (
                            <p className="text-sm font-semibold text-slate-700 mb-1">{item.subtitle}</p>
                          )}
                          <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                        </>
                      )}
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
            <Link to="/cookie-policy" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Cookie Policy</Link>
            <Link to="/disclaimer" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

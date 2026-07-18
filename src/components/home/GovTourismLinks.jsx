import { FiExternalLink, FiPhone } from 'react-icons/fi'
import { FaAmbulance } from 'react-icons/fa'
import AnimatedSection from '../ui/AnimatedSection'

const links = [
  {
    name: 'Sri Lanka Tourism Official',
    url: 'https://www.srilanka.travel/',
    description: 'Official travel guide by Sri Lanka Tourism Promotion Bureau',
  },
  {
    name: 'Ministry of Tourism',
    url: 'https://tourismmin.gov.lk/web/index.php/en',
    description: 'Official ministry overseeing tourism policy and development',
  },
  {
    name: 'Sri Lanka Tourism Development Authority',
    url: 'https://www.sltda.gov.lk/en',
    description: 'Government authority for tourism regulation and development',
  },
  {
    name: 'Sri Lanka Convention Bureau',
    url: 'https://meetinsrilanka.com/',
    description: 'Official site for MICE tourism and business events',
  },
]

export default function GovTourismLinks() {
  return (
    <section className="section-padding bg-gradient-to-br from-teal-50 via-white to-ocean-50">
      <div className="container-custom">
        <AnimatedSection className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">
              Official Resources
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-slate-900">
              Sri Lanka Government Tourism Websites
            </h2>
            <p className="text-slate-500 mt-2 max-w-lg mx-auto">
              Plan your trip with trusted information from official tourism authorities.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-5 min-h-[44px] rounded-2xl bg-white border border-slate-200 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">
                      {link.name}
                    </span>
                    <FiExternalLink className="text-slate-400 group-hover:text-teal-500 text-sm flex-shrink-0 transition-colors" />
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{link.description}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <a
              href="tel:1912"
              className="block p-5 rounded-2xl bg-gradient-to-br from-teal-500 to-ocean-500 text-white text-center shadow-lg hover:opacity-90 transition-opacity"
            >
              <FiPhone className="text-2xl mx-auto mb-2" />
              <p className="text-xs font-semibold uppercase tracking-wider mb-1">Tourism Hotline</p>
              <span className="text-2xl sm:text-3xl font-heading font-extrabold">1912</span>
            </a>
            <a
              href="tel:1990"
              className="block p-5 rounded-2xl bg-gradient-to-br from-rose-500 to-red-500 text-white text-center shadow-lg hover:opacity-90 transition-opacity"
            >
              <FaAmbulance className="text-2xl mx-auto mb-2" />
              <p className="text-xs font-semibold uppercase tracking-wider mb-1">Ambulance Service</p>
              <span className="text-2xl sm:text-3xl font-heading font-extrabold">1990</span>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

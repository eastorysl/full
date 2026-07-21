import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiCheck, FiX, FiMinus, FiHome, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import SEO from '../components/seo/SEO'
import SectionTitle from '../components/ui/SectionTitle'

const steps = [
  { id: 1, label: 'Choose Plan', title: 'Choose Your Plan', subtitle: 'Stand out from the crowd — boost your business visibility and attract more travelers to your doorstep.' },
  { id: 2, label: 'Business Details', title: 'Business Details', subtitle: 'Tell us about your business so we can set up your listing.' },
  { id: 3, label: 'Review & Submit', title: 'Review Your Listing', subtitle: 'Please review your details before submitting.' },
]

const plans = [
  { id: 'free', name: 'Free', price: 'Rs 0', period: '' },
  { id: 'featured', name: 'Featured', price: 'Rs 3,500', period: '/Year' },
  { id: 'premium', name: 'Premium', price: 'Custom', period: '' },
]

const categoryLabels = {
  hotel: 'Hotel / Accommodation',
  restaurant: 'Restaurant / Cafe',
  tour: 'Tour Operator',
  transport: 'Transport / Taxi',
  spa: 'Spa / Wellness',
  shopping: 'Shopping / Retail',
  attraction: 'Attraction / Activity',
  other: 'Other',
}

const features = [
  { label: 'Contact Information', free: true, featured: true, premium: true },
  { label: 'Social Media Links', free: true, featured: true, premium: true },
  { label: 'Location', free: true, featured: true, premium: true },
  { label: 'Interactive Map Highlight', free: true, featured: true, premium: true },
  { label: 'Google Map Directions', free: true, featured: true, premium: true },
  { label: 'Photos', free: true, featured: true, premium: true },
  { label: 'Featured Badge', free: false, featured: true, premium: true },
  { label: 'Single Page Website', free: false, featured: true, premium: true },
  { label: 'WhatsApp Custom Message', free: false, featured: true, premium: true },
  { label: 'Social Media Takeover', free: false, featured: false, premium: true },
  { label: 'Dedicated Website', free: false, featured: false, premium: true },
  { label: 'SEO Optimization', free: false, featured: false, premium: true },
]

function StepIndicator({ current }) {
  const currentStep = steps.find((s) => s.id === current)
  return (
    <div className="mb-10">
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 mb-3 text-center">
        {currentStep.title}
      </h2>
      <p className="text-slate-500 text-center mb-8 max-w-2xl mx-auto">
        {currentStep.subtitle}
      </p>
      <div className="flex items-center justify-center gap-0">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  current > s.id
                    ? 'bg-teal-500 text-white'
                    : current === s.id
                    ? 'bg-slate-900 text-white ring-4 ring-teal-500/30'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {current > s.id ? <FiCheck className="w-5 h-5" /> : s.id}
              </div>
              <span
                className={`mt-2 text-xs font-medium hidden sm:block ${
                  current >= s.id ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 sm:mb-0 transition-colors duration-300 ${
                  current > s.id ? 'bg-teal-500' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Step1({ selected, onSelect, onNext }) {
  const handleSelect = (planId) => {
    onSelect(selected === planId ? null : planId)
  }

  return (
    <div>
      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {plans.map((p) => {
          const isActive = selected === p.id
          return (
            <div
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border-teal-400 shadow-lg shadow-teal-500/20 bg-white'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`px-5 py-4 ${isActive ? 'bg-teal-600' : 'bg-slate-900'}`}>
                <h3 className="font-heading font-bold text-white text-lg">{p.name}</h3>
                <p className="text-white/80 text-sm">{p.price}{p.id === 'free' ? ' — Free forever' : p.period}</p>
              </div>
              <div className="px-5 py-4 space-y-3">
                {features.map((f) => {
                  const val = f[p.id]
                  return (
                    <div key={f.label} className="flex items-center gap-3">
                      {val === true ? (
                        <FiCheck className="w-5 h-5 text-teal-500 shrink-0" />
                      ) : val === false ? (
                        <FiMinus className="w-5 h-5 text-slate-300 shrink-0" />
                      ) : (
                        <span className="text-xs font-semibold text-teal-600 min-w-[50px] shrink-0">{val}</span>
                      )}
                      <span className={`text-sm ${val === false ? 'text-slate-400' : 'text-slate-700'}`}>{f.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-separate border-spacing-0" aria-label="Plan comparison">
            <thead>
              <tr className="bg-slate-900">
                <th scope="col" className="text-left py-4 px-6 bg-slate-900 text-white font-heading font-semibold text-base w-2/5">Feature</th>
                {plans.map((p) => {
                  const isActive = selected === p.id
                  return (
                    <th
                      key={p.id}
                      scope="col"
                      onClick={() => handleSelect(p.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(p.id) } }}
                      className={`relative py-4 px-4 text-center font-heading font-semibold text-base cursor-pointer transition-colors duration-200 select-none ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-[inset_0_0_0_2px_#2dd4bf]'
                          : 'bg-slate-900 text-white hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{p.name}</span>
                        <span className="text-sm font-normal opacity-80">
                          {p.price}{p.period}
                        </span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => {
                const isOdd = i % 2 === 1
                const isLast = i === features.length - 1
                return (
                  <tr
                    key={f.label}
                    className={`${
                      !isLast ? 'border-b border-slate-100' : ''
                    } ${isOdd ? 'bg-slate-50' : 'bg-white'}`}
                  >
                    <td className="py-3 px-6 text-base font-medium text-slate-700 whitespace-nowrap">{f.label}</td>
                    {plans.map((p) => {
                      const val = f[p.id]
                      const isActive = selected === p.id
                      return (
                        <td
                          key={p.id}
                          onClick={() => handleSelect(p.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(p.id) } }}
                          role="button"
                          tabIndex={0}
                          className={`py-3 px-4 text-center cursor-pointer transition-colors duration-150 ${
                            isActive
                              ? `bg-teal-50 shadow-[inset_2px_0_0_0_#2dd4bf,inset_-2px_0_0_0_#2dd4bf${isLast ? ',inset_0_-2px_0_0_#2dd4bf' : ''}]`
                              : isOdd
                              ? 'bg-slate-50 hover:bg-teal-50/50'
                              : 'bg-white hover:bg-teal-50/50'
                          }`}
                        >
                          {val === true ? (
                            <FiCheck className={`w-5 h-5 mx-auto ${isActive ? 'text-teal-600' : 'text-teal-500'}`} />
                          ) : val === false ? (
                            <FiX className={`w-5 h-5 mx-auto ${isActive ? 'text-slate-400' : 'text-slate-300'}`} />
                          ) : (
                            <span className={`text-sm font-semibold ${isActive ? 'text-teal-700' : 'text-teal-600'}`}>{val}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <p className="text-sm text-slate-400 hidden sm:block">
          {selected ? (
            <>Selected: <span className="font-semibold text-teal-600">{plans.find((p) => p.id === selected)?.name}</span> — <button onClick={() => onSelect(null)} className="underline hover:text-slate-600">clear</button></>
          ) : (
            'Select a plan to continue'
          )}
        </p>
        <button
          onClick={onNext}
          disabled={!selected}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 w-full sm:w-auto justify-center ${
            selected
              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/25'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Continue <FiArrowRight />
        </button>
      </div>
    </div>
  )
}

function Step2({ formData, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!formData.businessName.trim()) e.businessName = 'Required'
    if (!formData.ownerName.trim()) e.ownerName = 'Required'
    if (!formData.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email'
    if (!formData.phone.trim()) e.phone = 'Required'
    if (!formData.category) e.category = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  const handleChange = (field, value) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    onChange(field, value)
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all duration-200 ${
      errors[field] ? 'border-red-400 bg-red-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
    }`

  return (
    <div>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Name *</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              placeholder="e.g. Ceylon Tea House"
              className={inputClass('businessName')}
            />
            {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Owner Name *</label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => handleChange('ownerName', e.target.value)}
              placeholder="e.g. John Perera"
              className={inputClass('ownerName')}
            />
            {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@business.com"
              className={inputClass('email')}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+94 7X XXX XXXX"
              className={inputClass('phone')}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Category *</label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`w-full px-4 py-3 min-h-[44px] pr-10 rounded-xl border text-sm text-slate-900 appearance-none bg-no-repeat focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all duration-200 cursor-pointer ${
                  errors.category
                    ? 'border-red-400 bg-red-50/50'
                    : formData.category
                    ? 'border-teal-300 bg-teal-50/30 hover:border-teal-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '18px',
                }}
              >
                <option value="">Select a category</option>
                <option value="hotel">Hotel / Accommodation</option>
                <option value="restaurant">Restaurant / Cafe</option>
                <option value="tour">Tour Operator</option>
                <option value="transport">Transport / Taxi</option>
                <option value="spa">Spa / Wellness</option>
                <option value="shopping">Shopping / Retail</option>
                <option value="attraction">Attraction / Activity</option>
                <option value="other">Other</option>
              </select>
            </div>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Website (optional)</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://yourbusiness.com"
              className={inputClass('website')}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Brief Description (optional)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Tell travelers what makes your business special..."
              className={inputClass('description')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-100 transition-all duration-200"
        >
          <FiArrowLeft /> Back
        </button>
        <button
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl font-semibold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/25 transition-all duration-300"
        >
          Review <FiArrowRight />
        </button>
      </div>
    </div>
  )
}

function Step3({ selected, formData, onBack, onSubmit }) {
  const plan = plans.find((p) => p.id === selected)
  const [agreed, setAgreed] = useState(false)

  if (!plan) return null

  return (
    <div>
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-heading font-bold text-slate-900 mb-4">Selected Plan</h3>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-teal-50 border border-teal-200">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-ocean-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">{plan.name[0]}</span>
            </div>
            <div>
              <p className="font-heading font-bold text-slate-900">{plan.name} Listing</p>
              <p className="text-sm text-slate-500">
                {plan.price}{plan.id === 'free' ? ' — Free forever' : plan.period ? ` ${plan.period}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-heading font-bold text-slate-900 mb-4">Business Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['Business Name', formData.businessName],
              ['Owner', formData.ownerName],
              ['Email', formData.email],
              ['Phone', formData.phone],
              ['Category', categoryLabels[formData.category] || formData.category],
              ['Website', formData.website || '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
              </div>
            ))}
            {formData.description && (
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Description</p>
                <p className="text-sm font-medium text-slate-800 mt-0.5">{formData.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-heading font-bold text-slate-900 mb-4">Included Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {features.map((f) => {
              const val = f[selected]
              return (
                <div key={f.label} className="flex items-center gap-2 text-sm">
                  {val === true ? (
                    <FiCheck className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  ) : val === false ? (
                    <FiX className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  ) : (
                    <span className="text-xs font-semibold text-teal-600 min-w-[60px]">{val}</span>
                  )}
                  <span className={val === false ? 'text-slate-400' : 'text-slate-700'}>{f.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-6">
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border-2 border-dashed border-teal-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shrink-0">
              <FiCheck className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-heading font-bold text-slate-900">Terms &amp; Conditions</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">By submitting this listing, you agree to the following:</p>
          <ol className="space-y-2.5 mb-5">
            {[
              'All information provided is accurate, current, and belongs to the business owner or an authorised representative.',
              'The listing is for a legitimate tourism-related business operating in Sri Lanka.',
              'You understand that EastorySL reserves the right to edit, modify, or remove any listing that contains misleading, offensive, or inappropriate content.',
              'Your listing may be publicly visible on the EastorySL platform, including your business name, contact details, and location.',
              'Featured and Premium listings are active for the paid period.',
              'You will not hold EastorySL liable for any business outcomes resulting from the listing, including loss of revenue or customer disputes.',
              'You may request removal of your listing at any time by contacting us via WhatsApp at +94 72 436 2001.',
            ].map((term, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                {term}
              </li>
            ))}
          </ol>
          <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${agreed ? 'border-teal-500 bg-white shadow-sm' : 'border-white bg-white/60 hover:border-teal-300'}`}>
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${agreed ? 'bg-teal-500 border-teal-500' : 'border-slate-300 bg-white peer-hover:border-slate-400'}`}>
                {agreed && <FiCheck className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>
            <span className="text-sm text-slate-700 leading-snug">
              I have read and agree to the <Link to="/business-terms" target="_blank" className="text-teal-600 hover:underline font-medium">Business Listing Terms</Link>, <Link to="/terms-of-service" target="_blank" className="text-teal-600 hover:underline font-medium">Terms of Service</Link> and <Link to="/privacy-policy" target="_blank" className="text-teal-600 hover:underline font-medium">Privacy Policy</Link> of EastorySL.
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-100 transition-all duration-200"
        >
          <FiArrowLeft /> Back
        </button>
        <SubmitButton onSubmit={onSubmit} disabled={!agreed} />
      </div>
    </div>
  )
}

function SubmitButton({ onSubmit, disabled }) {
  return (
    <button
      onClick={onSubmit}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-xl font-semibold text-sm transition-all duration-300 ${
        disabled
          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25'
      }`}
    >
      <FaWhatsapp /> Send via WhatsApp
    </button>
  )
}

export default function Advertise() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState('featured')
  const topRef = useRef(null)
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    category: '',
    website: '',
    description: '',
  })

  const goNext = () => {
    setStep((s) => s + 1)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const goBack = () => {
    setStep((s) => s - 1)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }))

  const handleWhatsAppSubmit = () => {
    const plan = plans.find((p) => p.id === selected)
    const msg = [
      `*New Listing Request — ${plan?.name || selected} Plan*`,
      '',
      `*Business:* ${formData.businessName}`,
      `*Owner:* ${formData.ownerName}`,
      `*Email:* ${formData.email}`,
      `*Phone:* ${formData.phone}`,
      `*Category:* ${categoryLabels[formData.category] || formData.category}`,
      formData.website ? `*Website:* ${formData.website}` : '',
      formData.description ? `*Description:* ${formData.description}` : '',
    ].filter(Boolean).join('\n')

    window.open(`https://wa.me/94724362001?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <SEO
        title="Advertise With Us"
        description="Promote your business on Eastory SL. Reach thousands of travelers exploring Sri Lanka with our affordable advertising packages."
        keywords="advertise Sri Lanka, Sri Lanka business promotion, Sri Lanka travel advertising, promote tourism business Sri Lanka, business listing Sri Lanka, Sri Lanka advertising"
        ogImage="/images/discover/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/advertise`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Eastory SL Business Listings',
          description: 'Promote your business on Eastory SL. Reach thousands of travelers exploring Sri Lanka.',
          url: `${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/advertise`,
          provider: {
            '@type': 'Organization',
            name: 'Eastory SL',
            url: import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app',
          },
          areaServed: { '@type': 'Country', name: 'Sri Lanka' },
        }}
      />

      <section className="relative pt-28 md:pt-32 pb-10 md:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/discover/hero.png)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-teal-950/85 to-slate-900/85">
          <div className="absolute inset-0 opacity-10 bg-grid" />
        </div>
        <div className="container-custom relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Grow Your Business"
            title="Advertise With Us"
            description="Get your business in front of thousands of travelers exploring Sri Lanka. Choose the package that suits your needs."
            light
            as="h1"
          />
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] bg-white/10 hover:bg-white/20 text-white text-sm font-medium mt-6 rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
          >
            <FiHome /> Home
          </Link>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-custom max-w-5xl" ref={topRef}>
          <StepIndicator current={step} />

          {step === 1 && (
            <Step1 selected={selected} onSelect={setSelected} onNext={goNext} />
          )}
          {step === 2 && (
            <Step2
              formData={formData}
              onChange={handleChange}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === 3 && (
            <Step3
              selected={selected}
              formData={formData}
              onBack={goBack}
              onSubmit={handleWhatsAppSubmit}
            />
          )}
        </div>
      </section>
    </div>
  )
}
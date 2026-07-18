import { useState, useRef, useEffect } from 'react'
import { FiMail, FiSend, FiCheck, FiLoader, FiAlertCircle } from 'react-icons/fi'
import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_h9sxah5'
const PUBLIC_KEY = 'fmonLpjER1DiruPGW'

const FEEDBACK_TEMPLATE_ID = 'template_k2dt9hb'

const feedbackTypes = [
  { value: 'add-details', label: 'Add more details' },
  { value: 'correction', label: 'Suggest a correction' },
]

export default function EmailFeedback({ placeName, category }) {
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    feedback_type: 'add-details',
    message: '',
  })
  const [status, setStatus] = useState(null)
  const timerRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.from_name || !formData.from_email || !formData.message) return

    setStatus('loading')
    if (timerRef.current) clearTimeout(timerRef.current)

    const templateParams = {
      from_name: formData.from_name,
      from_email: formData.from_email,
      feedback_type: feedbackTypes.find((f) => f.value === formData.feedback_type)?.label || formData.feedback_type,
      place_name: placeName,
      place_category: category,
      message: formData.message,
      page_url: window.location.href,
    }

    emailjs.send(SERVICE_ID, FEEDBACK_TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        setStatus('success')
        setFormData({ from_name: '', from_email: '', feedback_type: 'add-details', message: '' })
        timerRef.current = setTimeout(() => setStatus(null), 4000)
      })
      .catch(() => {
        setStatus('error')
        timerRef.current = setTimeout(() => setStatus(null), 4000)
      })
  }

  const inputBase = 'w-full px-4 py-3 min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 placeholder:italic focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all italic'

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
          <FiMail className="text-teal-600 text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-bold text-slate-900 italic">Help us improve</h3>
          <p className="text-xs text-slate-500 italic">Suggest additions or corrections for this place</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <FiCheck className="text-emerald-600 text-lg shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Thank you!</p>
            <p className="text-xs text-emerald-600">Your feedback has been sent. We appreciate your contribution.</p>
          </div>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
          <input type="hidden" name="place_name" value={placeName} />
          <input type="hidden" name="place_category" value={category} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="from_name"
              value={formData.from_name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className={inputBase}
            />
            <input
              type="email"
              name="from_email"
              value={formData.from_email}
              onChange={handleChange}
              placeholder="Your email"
              required
              className={inputBase}
            />
          </div>

          <label htmlFor="feedback-type" className="sr-only">Feedback type</label>
          <select
            id="feedback-type"
            name="feedback_type"
            value={formData.feedback_type}
            onChange={handleChange}
            className={`${inputBase} cursor-pointer`}
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M4.5 6l3.5 3.5L11.5 6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', appearance: 'none' }}
          >
            {feedbackTypes.map((ft) => (
              <option key={ft.value} value={ft.value} style={{ fontStyle: 'italic' }}>{ft.label}</option>
            ))}
          </select>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us what details to add or what needs correction..."
            required
            rows={3}
            className={`${inputBase} resize-none`}
          />

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white text-sm font-semibold italic transition-all cursor-pointer"
          >
            {status === 'loading' ? (
              <><FiLoader className="animate-spin" /> Sending...</>
            ) : (
              <><FiSend /> Send Feedback</>
            )}
          </button>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 text-xs mt-1">
              <FiAlertCircle /> Failed to send. Please try again or email us directly.
            </div>
          )}
        </form>
      )}
    </div>
  )
}

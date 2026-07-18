const GA_ID = import.meta.env.VITE_GA4_ID || 'G-9N173V8EG4'

export function trackPageView(path, title) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: title || document.title,
    send_to: GA_ID,
  })
}

export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, { send_to: GA_ID, ...params })
}

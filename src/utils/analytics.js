const GA_ID = import.meta.env.VITE_GA4_ID

export function trackPageView(path, title) {
  if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: title || document.title,
    send_to: GA_ID,
  })
}

export function trackEvent(eventName, params = {}) {
  if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', eventName, { send_to: GA_ID, ...params })
}

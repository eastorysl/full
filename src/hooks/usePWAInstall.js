import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'eastorysl_pwa_dismissed'

// Capture beforeinstallprompt at module level (before React mounts)
// to avoid missing the event during early page load.
let _globalDeferredPrompt = null

if (typeof window !== 'undefined') {
  const handler = (e) => {
    e.preventDefault()
    _globalDeferredPrompt = e
    window.removeEventListener('beforeinstallprompt', handler)
  }
  window.addEventListener('beforeinstallprompt', handler)
}

export default function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      setDismissed(true)
      return
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    const iOS = /iphone|ipad|ipod/i.test(navigator.userAgent)

    // If the global listener already caught the event, adopt it
    if (_globalDeferredPrompt) {
      setDeferredPrompt(_globalDeferredPrompt)
      setShowPopup(true)
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPopup(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    if (iOS) {
      setIsIOS(true)
      setShowPopup(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handleInstall = useCallback(async () => {
    // Use state first, fall back to the module-level capture
    const prompt = deferredPrompt || _globalDeferredPrompt
    if (!prompt) return
    try {
      prompt.prompt()
      const { outcome } = await prompt.userChoice
      if (outcome === 'accepted') {
        setShowPopup(false)
        setIsInstalled(true)
      }
    } catch (err) {
      console.warn('PWA install prompt failed:', err)
    }
    setDeferredPrompt(null)
    _globalDeferredPrompt = null
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    setShowPopup(false)
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, 'true')
  }, [])

  const triggerInstall = useCallback(() => {
    if (isInstalled) return
    setShowPopup(true)
  }, [isInstalled])

  return {
    showPopup,
    isIOS,
    isInstalled,
    dismissed,
    deferredPrompt,
    handleInstall,
    handleDismiss,
    triggerInstall,
  }
}

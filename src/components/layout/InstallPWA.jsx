import { useEffect, useRef } from 'react'
import { FiX, FiDownload, FiShare2, FiSmartphone } from 'react-icons/fi'

export default function InstallPWA({ show, isIOS, onInstall, onDismiss }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!show) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onDismiss?.()
    }
    document.addEventListener('keydown', handleKey)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKey)
  }, [show, onDismiss])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onDismiss}
      />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-teal-500/10 border border-slate-100 overflow-hidden animate-slide-up">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-ocean-500 to-teal-600" />
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
          aria-label="Close"
        >
          <FiX className="text-sm" />
        </button>
        <div className="p-6 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-ocean-600 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
              <FiSmartphone className="text-white text-2xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 id="pwa-title" className="text-lg font-heading font-bold text-slate-900">
                Install Eastory SL
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {isIOS ? 'Add to your home screen for the best experience' : 'Get the app for a faster, offline-ready experience'}
              </p>
            </div>
          </div>
          {isIOS ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              <p className="text-sm text-amber-800 font-medium mb-2 flex items-center gap-2">
                <FiShare2 className="text-amber-600" />
                How to install on iOS:
              </p>
              <ol className="text-sm text-amber-700 space-y-1.5 ml-5 list-decimal">
                <li>Tap the <strong>Share</strong> button <FiShare2 className="inline text-xs" /> in Safari</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                <li>Tap <strong>Add</strong> in the top-right corner</li>
              </ol>
            </div>
          ) : null}
          <div className="flex items-center gap-3">
            {!isIOS ? (
              <button
                onClick={onInstall}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-ocean-600 hover:from-teal-500 hover:to-ocean-500 text-white font-semibold py-3 px-5 min-h-[44px] rounded-xl transition-all duration-300 shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 cursor-pointer"
              >
                <FiDownload className="text-sm" />
                Install App
              </button>
            ) : null}
            <button
              onClick={onDismiss}
              className={`${isIOS ? 'flex-1' : ''} py-3 px-5 min-h-[44px] rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-medium transition-all cursor-pointer`}
            >
              {isIOS ? 'Got it' : 'Not now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

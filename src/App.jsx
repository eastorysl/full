import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Layout from './components/layout/Layout'

const Home = lazy(() => import('./pages/Home'))
const Map = lazy(() => import('./pages/Map'))
const Destinations = lazy(() => import('./pages/Destinations'))
const DiscoverMore = lazy(() => import('./pages/DiscoverMore'))
const SriLankaPride = lazy(() => import('./pages/SriLankaPride'))
const PrideDetail = lazy(() => import('./pages/PrideDetail'))
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Advertise = lazy(() => import('./pages/Advertise'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="map" element={<Map />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="discover-more" element={<DiscoverMore />} />
            <Route path="sri-lanka-pride" element={<SriLankaPride />} />
            <Route path="sri-lanka-pride/:category/:id" element={<PrideDetail />} />
            <Route path="destinations/:category/:id" element={<DestinationDetail />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="advertise" element={<Advertise />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="unsubscribe" element={<Unsubscribe />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

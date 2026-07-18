import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import InstallPWA from './InstallPWA'
import usePWAInstall from '../../hooks/usePWAInstall'
import usePageTracking from '../../hooks/usePageTracking'

export default function Layout() {
  usePageTracking()
  const { pathname } = useLocation()
  const isMapPage = pathname === '/map'
  const {
    showPopup,
    isIOS,
    isInstalled,
    handleInstall,
    handleDismiss,
    triggerInstall,
  } = usePWAInstall()

  return (
    <div className={`${isMapPage ? 'h-screen flex flex-col overflow-hidden' : 'min-h-screen'}`}>
      <InstallPWA
        show={showPopup}
        isIOS={isIOS}
        onInstall={handleInstall}
        onDismiss={handleDismiss}
      />
      <Navbar onInstallClick={triggerInstall} isInstalled={isInstalled} />
      <main className={`${isMapPage ? 'flex-1 overflow-hidden' : ''}`}>
        <Outlet />
      </main>
      {!isMapPage && <Footer />}
    </div>
  )
}

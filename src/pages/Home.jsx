import Hero from '../components/home/Hero'
import NearestPlaces from '../components/home/NearestPlaces'
import BestOfJuly from '../components/home/BestOfJuly'
import NearestBusinesses from '../components/home/NearestBusinesses'
import CTA from '../components/home/CTA'
import TripFinder from '../components/home/TripFinder'
import AboutSriLanka from '../components/home/AboutSriLanka'
import GovTourismLinks from '../components/home/GovTourismLinks'
import SEO from '../components/seo/SEO'

export default function Home() {
  return (
    <>
      <SEO
        title="Explore Sri Lanka — Travel Guide"
        description="Discover the beauty of Sri Lanka — pristine beaches, rich cultural heritage, local businesses, and unforgettable travel experiences all in one place."
        keywords="Sri Lanka travel, Eastern Sri Lanka, Sri Lanka tourism, travel guide, Sri Lanka beaches, Sri Lanka nature, Sri Lanka wildlife, Sri Lanka cultural heritage, Sri Lanka map, things to do in Sri Lanka"
        ogImage="/images/home/hero.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/`}
      />
      <Hero />
      <NearestPlaces />
      <BestOfJuly />
      <NearestBusinesses />
      <CTA />
      <TripFinder />
      <AboutSriLanka />
      <GovTourismLinks />
    </>
  )
}

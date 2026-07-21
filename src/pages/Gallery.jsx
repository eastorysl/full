import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SectionTitle from '../components/ui/SectionTitle'
import { buildGalleryImages } from '../data/gallery'
import { destinations } from '../data/destinations'
import { businesses } from '../data/businesses'
import SEO from '../components/seo/SEO'
import { prideItems } from '../data/sriLankaPride'
import GalleryGrid from '../components/gallery/GalleryGrid'
import { handleImgError } from '../utils/fallback'
import { FiHome } from 'react-icons/fi'

export default function Gallery() {
  const [searchParams] = useSearchParams()
  const itemParam = searchParams.get('item')

  const galleryImages = useMemo(
    () => buildGalleryImages(destinations, businesses, prideItems),
    []
  )

  return (
    <div>
      <SEO
        title="Sri Lanka Photo Gallery — Travel Photography"
        description="Browse stunning photos of Sri Lanka's landscapes, beaches, wildlife, cultural sites, and local businesses curated by Eastory SL."
        keywords="Sri Lanka photos, Sri Lanka gallery, Sri Lanka images, Sri Lanka pictures, Sri Lanka travel photography, Sri Lanka tourist photos, Sri Lanka landscapes"
        ogImage="/images/home/Gallery.png"
        ogUrl={`${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/gallery`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: 'Sri Lanka Photo Gallery — Travel Photography',
          description: 'Browse stunning photos of Sri Lanka landscapes, beaches, wildlife, and cultural sites.',
          url: `${import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'}/gallery`,
        }}
      />
      <section className="relative pt-28 md:pt-32 pb-10 md:pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/home/Gallery.png" alt="" onError={handleImgError} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-teal-950/75 to-slate-900/85" />
        </div>
        <div className="container-custom relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <SectionTitle
            as="h1"
            subtitle="Visual Journey"
            title="Gallery"
            description="Explore Sri Lanka through stunning photographs capturing its beaches, nature, culture, and heritage."
            light
          />
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] bg-white/10 hover:bg-white/20 text-white text-sm font-medium mt-6 rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
          >
            <FiHome /> Home
          </Link>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <GalleryGrid
            key={itemParam || 'all'}
            images={galleryImages}
            initialItem={itemParam}
            showAllLink={!!itemParam}
          />
        </div>
      </section>
    </div>
  )
}

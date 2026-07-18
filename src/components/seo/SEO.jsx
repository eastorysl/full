import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Eastory SL'
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'
const DEFAULT_OG = `${SITE_URL}/images/home/hero.png`

function ogImageType(url) {
  if (!url) return 'image/png'
  const ext = url.split('?')[0].split('.').pop().toLowerCase()
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'avif') return 'image/avif'
  return 'image/png'
}

export default function SEO({ title, description, ogImage, ogUrl, ogType, keywords, jsonLd, noindex, ogImageWidth = 1200, ogImageHeight = 630 }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Travel Guide`
  const url = ogUrl || `${SITE_URL}${typeof window !== 'undefined' ? window.location.pathname : ''}`
  const image = ogImage ? (ogImage.startsWith('/') ? `${SITE_URL}${ogImage}` : ogImage) : DEFAULT_OG
  const imageAlt = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Travel Guide`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:type" content={ogType || 'website'} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={ogImageWidth} />
      <meta property="og:image:height" content={ogImageHeight} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:type" content={ogImageType(image)} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@eslhub" />
      <meta name="twitter:creator" content="@eslhub" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
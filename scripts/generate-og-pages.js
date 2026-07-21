import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SITE_URL = process.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'
const DIST = resolve(__dirname, '..', 'dist')

function ogImageType(url) {
  if (!url) return 'image/png'
  const ext = url.split('?')[0].split('.').pop().toLowerCase()
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'avif') return 'image/avif'
  return 'image/png'
}

function ensureDir(filePath) {
  const dir = dirname(filePath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeReplacement(str) {
  return str.replace(/\$/g, '$$')
}

function generatePage(path, ogTitle, ogDesc, ogImage, indexHtml) {
  const imageUrl = ogImage.startsWith('/') ? `${SITE_URL}${ogImage}` : ogImage
  const pageUrl = `${SITE_URL}${path}`
  const imgType = ogImageType(imageUrl)
  const safeTitle = escapeReplacement(ogTitle)
  const safeDesc = escapeReplacement(ogDesc)
  const safeImageUrl = escapeReplacement(imageUrl)
  const safePageUrl = escapeReplacement(pageUrl)

  let html = indexHtml

    .replace(/<title>.*?<\/title>/, `<title>${escapeAttr(safeTitle)} | Eastory SL</title>`)
    .replace(
      /<meta name="description"[^>]*\/?>/,
      `<meta name="description" content="${escapeAttr(safeDesc)}" />`
    )
    .replace(
      /<meta property="og:title"[^>]*\/?>/,
      `<meta property="og:title" content="${escapeAttr(safeTitle)} | Eastory SL" />`
    )
    .replace(
      /<meta property="og:description"[^>]*\/?>/,
      `<meta property="og:description" content="${escapeAttr(safeDesc)}" />`
    )
    .replace(
      /<meta property="og:url"[^>]*\/?>/,
      `<meta property="og:url" content="${escapeAttr(safePageUrl)}" />`
    )
    .replace(
      /<meta property="og:image"[^>]*\/?>/,
      `<meta property="og:image" content="${escapeAttr(safeImageUrl)}" />`
    )
    .replace(
      /<meta property="og:image:type"[^>]*\/?>/,
      `<meta property="og:image:type" content="${imgType}" />`
    )
    .replace(
      /<meta property="og:image:alt"[^>]*\/?>/,
      `<meta property="og:image:alt" content="${escapeAttr(safeTitle)} | Eastory SL" />`
    )
    .replace(
      /<meta name="twitter:title"[^>]*\/?>/,
      `<meta name="twitter:title" content="${escapeAttr(safeTitle)} | Eastory SL" />`
    )
    .replace(
      /<meta name="twitter:description"[^>]*\/?>/,
      `<meta name="twitter:description" content="${escapeAttr(safeDesc)}" />`
    )
    .replace(
      /<meta name="twitter:image"[^>]*\/?>/,
      `<meta name="twitter:image" content="${escapeAttr(safeImageUrl)}" />`
    )
    .replace(
      /<meta name="twitter:image:alt"[^>]*\/?>/,
      `<meta name="twitter:image:alt" content="${escapeAttr(safeTitle)} | Eastory SL" />`
    )
    .replace(
      /<meta name="keywords"[^>]*\/?>/,
      `<meta name="keywords" content="${escapeAttr(safeTitle)}, Sri Lanka, travel, tourism" />`
    )
    .replace(
      /<meta name="twitter:url"[^>]*\/?>/,
      `<meta name="twitter:url" content="${escapeAttr(safePageUrl)}" />`
    )
    .replace(
      /<link rel="canonical"[^>]*\/?>/,
      `<link rel="canonical" href="${escapeAttr(safePageUrl)}" />`
    )

  const filePath = join(DIST, path, 'index.html')
  ensureDir(filePath)
  writeFileSync(filePath, html, 'utf-8')
  console.log(`  ✓ ${path}`)
}

async function main() {
  const { destinations } = await import(
    pathToFileURL(resolve(__dirname, '../src/data/destinations.js'))
  )
  const { prideItems } = await import(
    pathToFileURL(resolve(__dirname, '../src/data/sriLankaPride.js'))
  )

  const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8')

  console.log('Generating OG pages for list routes...')
  const listRoutes = [
    { path: '/destinations', title: 'Sri Lanka Destinations — Top Places to Visit', desc: 'Explore the best destinations in Sri Lanka — beaches, mountains, wildlife sanctuaries, historical sites, and cultural landmarks across the island.', image: '/images/home/Destinations.png' },
    { path: '/sri-lanka-pride', title: 'Sri Lanka Pride — Culture & Heritage', desc: "Discover Sri Lanka's proudest achievements — ancient kingdoms, UNESCO sites, cultural treasures, and natural wonders that make the island unique.", image: '/images/home/Sri_Lanka_Pride.png' },
    { path: '/discover-more', title: 'Discover Sri Lanka — Local Businesses', desc: 'Discover local businesses, shops, and services across Eastern Sri Lanka — from hotels and restaurants to adventure tours and cultural experiences.', image: '/images/discover/hero.png' },
    { path: '/gallery', title: 'Sri Lanka Photo Gallery — Travel Photography', desc: "Browse stunning photos of Sri Lanka's landscapes, beaches, wildlife, cultural sites, and local businesses curated by Eastory SL.", image: '/images/home/Gallery.png' },
    { path: '/advertise', title: 'Advertise With Us', desc: 'Promote your business on Eastory SL. Reach thousands of travelers exploring Sri Lanka with our affordable advertising packages.', image: '/images/discover/hero.png' },
    { path: '/map', title: 'Sri Lanka Interactive Map', desc: 'Explore Sri Lanka with our interactive map — find destinations, hotels, restaurants, and points of interest across the island.', image: '/images/home/hero.png' },
    { path: '/privacy-policy', title: 'Privacy Policy', desc: 'Privacy Policy for Eastory SL. Learn how we collect, use, and protect your personal information.', image: '/images/home/hero.png' },
    { path: '/terms-of-service', title: 'Terms of Service', desc: 'Terms of Service for Eastory SL. Read the rules and guidelines for using our platform.', image: '/images/home/hero.png' },
    { path: '/business-terms', title: 'Business Terms', desc: 'Business Terms for Eastory SL. Learn about listing policies, claims, and removal procedures.', image: '/images/home/hero.png' },
    { path: '/cookie-policy', title: 'Cookie Policy', desc: 'Cookie Policy for Eastory SL. Learn about the cookies and tracking technologies we use.', image: '/images/home/hero.png' },
    { path: '/disclaimer', title: 'Disclaimer', desc: 'Disclaimer for Eastory SL. Important information about our content, listings, and liability.', image: '/images/home/hero.png' },
    { path: '/unsubscribe', title: 'Unsubscribe', desc: 'Unsubscribe from Eastory SL newsletter. Manage your email preferences.', image: '/images/home/hero.png' },
  ]
  listRoutes.forEach((r) => {
    generatePage(r.path, r.title, r.desc, r.image, indexHtml)
  })

  console.log('\nGenerating OG-tagged pages for destinations...')
  destinations.forEach((d) => {
    const path = `/destinations/${d.category}/${d.id}`
    generatePage(
      path,
      d.name,
      `${d.description} Located in ${d.location || d.district || 'Sri Lanka'}.`,
      d.image,
      indexHtml
    )
  })

  console.log('\nGenerating OG-tagged pages for pride items...')
  prideItems.forEach((p) => {
    const path = `/sri-lanka-pride/${p.category}/${p.id}`
    const desc = `${p.description}${p.period ? ' Period: ' + p.period : ''} ${p.location || p.origin || ''}`
    generatePage(path, p.name, desc, p.image, indexHtml)
  })

  console.log('\nDone! OG-tagged pages generated.')
}

main().catch(console.error)

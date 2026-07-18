import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SITE_URL = process.env.VITE_SITE_URL || 'https://eastorysl.netlify.app'

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/destinations', priority: '0.9', changefreq: 'weekly' },
  { loc: '/discover-more', priority: '0.8', changefreq: 'weekly' },
  { loc: '/sri-lanka-pride', priority: '0.8', changefreq: 'weekly' },
  { loc: '/gallery', priority: '0.7', changefreq: 'monthly' },
  { loc: '/map', priority: '0.7', changefreq: 'monthly' },
  { loc: '/advertise', priority: '0.6', changefreq: 'monthly' },
]

async function main() {
  const { destinations } = await import(pathToFileURL(resolve(__dirname, '../src/data/destinations.js')))
  const { prideItems } = await import(pathToFileURL(resolve(__dirname, '../src/data/sriLankaPride.js')))

  const destUrls = destinations.map((d) => ({
    loc: `/destinations/${d.category}/${d.id}`,
    priority: d.tier === 'premium' ? '0.8' : d.tier === 'featured' ? '0.7' : '0.5',
    changefreq: 'monthly',
  }))

  const prideUrls = prideItems.map((p) => ({
    loc: `/sri-lanka-pride/${p.category}/${p.id}`,
    priority: '0.5',
    changefreq: 'monthly',
  }))

  const today = new Date().toISOString().split('T')[0]

  const all = [...staticPages, ...destUrls, ...prideUrls]

  function encodeLoc(path) {
    const segs = path.split('/')
    return segs.map((s, i) => i <= 1 ? s : encodeURIComponent(s)).join('/')
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((p) => {
  const loc = SITE_URL + encodeLoc(p.loc)
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
}).join('\n')}
</urlset>`

  writeFileSync(resolve(__dirname, '../public/sitemap.xml'), xml, 'utf-8')
  console.log(`Sitemap generated: ${all.length} URLs`)
}

main().catch(console.error)

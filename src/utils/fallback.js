function fallbackSVG(name) {
  const safe = name ? name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').substring(0, 60) : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect fill="#e2e8f0" width="400" height="300"/>
  ${safe ? `<text x="200" y="155" text-anchor="middle" fill="#94a3b8" font-family="Sansita,system-ui,sans-serif" font-size="18" font-weight="600" font-style="italic">${safe}</text>` : ''}
</svg>`
}

export function handleImgError(e) {
  if (e.target.dataset.fb) return
  e.target.dataset.fb = '1'
  e.target.src = `data:image/svg+xml,${encodeURIComponent(fallbackSVG(e.target.alt))}`
}

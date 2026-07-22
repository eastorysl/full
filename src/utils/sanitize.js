const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
  'a', 'img', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'figure', 'figcaption', 'sup', 'sub', 'del', 's',
])

const ALLOWED_ATTRS = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height'],
  span: ['class'],
  div: ['class'],
}

export function sanitizeHTML(html) {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const body = doc.body

  function clean(node) {
    const children = [...node.childNodes]
    for (const child of children) {
      if (child.nodeType === 1) {
        const tag = child.tagName.toLowerCase()
        if (!ALLOWED_TAGS.has(tag)) {
          while (child.firstChild) {
            node.insertBefore(child.firstChild, child)
          }
          node.removeChild(child)
          continue
        }
        const allowed = ALLOWED_ATTRS[tag] || []
        for (const attr of [...child.attributes]) {
          if (!allowed.includes(attr.name)) {
            child.removeAttribute(attr.name)
          }
        }
        if (tag === 'a') {
          child.setAttribute('rel', 'noopener noreferrer')
          if (!child.getAttribute('target')) {
            child.setAttribute('target', '_blank')
          }
          const href = child.getAttribute('href') || ''
          if (/^(javascript|data|vbscript):/i.test(href)) {
            child.setAttribute('href', '#')
          }
        }
        clean(child)
      }
    }
  }

  clean(body)
  return body.innerHTML
}

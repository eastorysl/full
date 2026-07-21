const ENTITY_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function escapeHTML(str) {
  if (!str) return ''
  return String(str).replace(/[&<>"']/g, (c) => ENTITY_MAP[c])
}

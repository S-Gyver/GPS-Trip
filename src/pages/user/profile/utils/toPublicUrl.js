const API_BASE = 'http://localhost/tripsync_api'

export function toPublicUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const clean = String(path).replace(/^\/+/, '')
  return `${API_BASE}/${clean}`
}

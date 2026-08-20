/**
 * Converts a string into a URL-friendly slug.
 * E.g., "3D/2N Singapore Free and Easy Package Test" -> "3d-2n-singapore-free-and-easy-package-test"
 */
export function slugify(text) {
  if (!text) return 'package'
  return text
    .toString()
    .toLowerCase()
    .replace(/[/s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Returns full media URL prefixed with VITE_MEDIA_BASE_URL if relative.
 */
export function formatMediaUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'https://smartdestinations-media.s3.ap-southeast-1.amazonaws.com/'
  const cleanBase = mediaBaseUrl.endsWith('/') ? mediaBaseUrl : `${mediaBaseUrl}/`
  return `${cleanBase}${path.replace(/^\//, '')}`
}

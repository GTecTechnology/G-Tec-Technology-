/**
 * Helper to dynamically resolve asset URLs against Vite's base path
 * Supports GitHub Pages subpaths, custom domains, and local development.
 */
export function resolveAssetUrl(path: string): string {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }
  const cleanPath = path.replace(/^\.?\//, '');
  const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
    ? import.meta.env.BASE_URL
    : '/';
  const cleanBase = base.endsWith('/') ? base : base + '/';
  return cleanBase + cleanPath;
}

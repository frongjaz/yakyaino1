/** Fallback when image fails to load */
export const IMAGE_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3Eไม่มีรูปภาพ%3C/text%3E%3C/svg%3E";

/** Fallback when logo fails to load */
export const LOGO_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='72' viewBox='0 0 180 72'%3E%3Crect fill='%23EF4444' width='180' height='72' rx='4'/%3E%3Ctext fill='white' font-family='sans-serif' font-size='24' font-weight='bold' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ECheckKub%3C/text%3E%3C/svg%3E";

/**
 * Get the correct image path based on the environment
 * @param imagePath - The image path starting with /images/
 * @returns The full image path with base path if needed
 */
export function getImagePath(imagePath: string): string {
  if (!imagePath) return "/images/placeholder.jpg";

  // Strip our own domain origins (localhost or checkkub.com) so images are
  // served as relative paths. This prevents Next.js image optimizer from making
  // external HTTP requests back to the same server (which appeared in hosting
  // logs as 203.170.129.6 requesting its own images thousands of times).
  const ownOriginMatch = imagePath.match(
    /^https?:\/\/(localhost(:\d+)?|(?:www\.)?checkkub\.com)(\/.*)?$/
  );
  if (ownOriginMatch) {
    imagePath = ownOriginMatch[3] || "/";
  }

  // Third-party CDN / external URL — return as-is
  if (imagePath.startsWith("http")) return imagePath;

  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
}

/**
 * Get the base path for the application
 * @returns The base path string
 */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

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

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http")) return imagePath;

  // Ensure path starts with a slash for internal processing
  const pathWithSlash = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  // In production, use full URL to checkkub.com
  if (process.env.NODE_ENV === 'production') {
    return `https://checkkub.com${pathWithSlash}`;
  }

  // Local development: use relative path so images load from public folder
  return pathWithSlash;
}

/**
 * Get the base path for the application
 * @returns The base path string
 */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

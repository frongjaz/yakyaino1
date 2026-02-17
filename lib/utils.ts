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

  // In production, images are hosted on HostAtom (checkkub.com)
  // Even if the API is on Vercel, we want to point to the images on the main domain
  if (process.env.NODE_ENV === 'production' || !imagePath.includes('localhost')) {
    return `https://checkkub.com${pathWithSlash}`;
  }

  // Local development fallback
  return pathWithSlash;
}

/**
 * Get the base path for the application
 * @returns The base path string
 */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

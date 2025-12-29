/**
 * Utility functions for encoding/decoding car IDs in URLs
 * Uses base64url encoding with "checkkub" salt to make IDs URL-safe and secure
 */

const SALT = 'checkkub';

/**
 * Encode a numeric ID to a base64url string with salt
 * @param id - The numeric car ID
 * @returns Encoded string (e.g., "Y2hlY2trdWJNQQ" for ID 1)
 */
export function encodeCarId(id: number | string): string {
  const idStr = typeof id === 'number' ? id.toString() : id;
  // Combine salt + ID for encoding
  const combined = SALT + idStr;
  // Convert to base64url (URL-safe base64)
  const base64 = Buffer.from(combined).toString('base64');
  // Replace characters that are not URL-safe
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Decode a base64url string back to numeric ID
 * @param encodedId - The encoded car ID string
 * @returns Decoded numeric ID string, or null if invalid
 */
export function decodeCarId(encodedId: string): string | null {
  try {
    // Restore base64 characters
    let base64 = encodedId
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Decode from base64
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    
    // Remove salt prefix
    if (!decoded.startsWith(SALT)) {
      return null;
    }
    
    const idStr = decoded.substring(SALT.length);
    
    // Validate that it's a valid number
    if (!/^\d+$/.test(idStr)) {
      return null;
    }
    
    return idStr;
  } catch (error) {
    console.error('Error decoding car ID:', error);
    return null;
  }
}

/**
 * Check if a string is an encoded ID (not a plain number)
 * @param id - The ID string to check
 * @returns true if it looks like an encoded ID
 */
export function isEncodedId(id: string): boolean {
  // Encoded IDs typically don't contain only digits
  // They contain base64url characters: A-Z, a-z, 0-9, -, _
  return !/^\d+$/.test(id) && /^[A-Za-z0-9_-]+$/.test(id);
}


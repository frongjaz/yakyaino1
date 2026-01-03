/**
 * API Helper สำหรับเรียก External API
 * ใช้เมื่อ deploy เป็น Static Export และ API อยู่ที่ external service
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * สร้าง API endpoint URL
 * ถ้ามี NEXT_PUBLIC_API_URL จะใช้ external API
 * ถ้าไม่มี จะใช้ relative path (สำหรับ local development)
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  if (API_URL) {
    // Use external API
    // Remove trailing slash from API_URL if present
    const cleanApiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return `${cleanApiUrl}/${cleanEndpoint}`;
  }
  
  // Use relative path (local development or same domain)
  return `/${cleanEndpoint}`;
}

/**
 * Get session token from localStorage
 * Exported for use in components that need to send Authorization header directly
 */
export function getSessionToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const sessionStr = localStorage.getItem('admin_session');
    if (!sessionStr) {
      return null;
    }
    
    // Encode session as token for Authorization header
    return encodeURIComponent(sessionStr);
  } catch {
    return null;
  }
}

/**
 * Fetch API helper
 */
export async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const url = getApiUrl(endpoint);
  
  // Get session token for Authorization header (cross-domain support)
  const sessionToken = getSessionToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
  
  // Add Authorization header if session exists
  if (sessionToken) {
    headers['Authorization'] = `Bearer ${sessionToken}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'include', // Still include credentials for cookies (if same-domain)
      headers,
    });
    
    return response;
  } catch (error: any) {
    // Log error for debugging
    console.error('API Fetch Error:', {
      url,
      endpoint,
      error: error.message,
    });
    throw error;
  }
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(endpoint: string): Promise<T> {
  const response = await apiFetch(endpoint, { method: 'GET' });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(
  endpoint: string,
  data?: any
): Promise<T> {
  const response = await apiFetch(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    // Try to parse error message from response
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // If can't parse JSON, use default message
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
}

/**
 * PUT request helper
 */
export async function apiPut<T = any>(
  endpoint: string,
  data?: any
): Promise<T> {
  const response = await apiFetch(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = any>(endpoint: string): Promise<T> {
  const response = await apiFetch(endpoint, { method: 'DELETE' });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}


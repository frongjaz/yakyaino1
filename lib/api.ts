/**
 * API Helper สำหรับเรียก External API
 * ใช้เมื่อ deploy เป็น Static Export และ API อยู่ที่ external service
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * สร้าง API endpoint URL
 * ถ้ามี NEXT_PUBLIC_API_URL จะใช้ external API
 * ถ้าไม่มี จะใช้ relative path (สำหรับ local development)
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  // Final API URL to use
  let finalUrl = '';

  if (API_URL) {
    // Use external API
    const cleanApiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    finalUrl = `${cleanApiUrl}/${cleanEndpoint}`;
  } else if (typeof window !== 'undefined') {
    // Fallback: If no API_URL set, use current domain origin
    // This handles cases where NEXT_PUBLIC_API_URL was empty during build
    const origin = window.location.origin;
    const cleanBasePath = BASE_PATH ? (BASE_PATH.startsWith('/') ? BASE_PATH : `/${BASE_PATH}`) : '';
    const finalBasePath = cleanBasePath.endsWith('/') ? cleanBasePath.slice(0, -1) : cleanBasePath;

    finalUrl = `${origin}${finalBasePath}/${cleanEndpoint}`;
  } else {
    // Server-side fallback or relative path
    const cleanBasePath = BASE_PATH ? (BASE_PATH.startsWith('/') ? BASE_PATH : `/${BASE_PATH}`) : '';
    const finalBasePath = cleanBasePath.endsWith('/') ? cleanBasePath.slice(0, -1) : cleanBasePath;
    finalUrl = `${finalBasePath}/${cleanEndpoint}`;
  }

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`[API] Target URL: ${finalUrl} (from ${endpoint})`);
  }

  return finalUrl;
}

/**
 * Fetch API helper
 */
export async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const url = getApiUrl(endpoint);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'include', // send httpOnly cookie automatically
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

    // Check if it's a network error (often CORS or server down)
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      const isCrossDomain = url.startsWith('http') && !url.includes(typeof window !== 'undefined' ? window.location.hostname : '');
      if (isCrossDomain) {
        throw new Error(`ไม่สามารถเชื่อมต่อกับ API ข้ามโดเมนได้ (${url}) เป็นไปได้ว่าติดปัญหา CORS หรือเซิร์ฟเวอร์ปลายทางไม่อนุญาต`);
      }
      throw new Error(`ไม่สามารถเชื่อมต่อกับ API ได้ (${url}) กรุณาตรวจสอบว่าเซิร์ฟเวอร์เปิดอยู่หรือ URL ถูกต้อง`);
    }

    throw error;
  }
}

/**
 * Parses response as JSON and handles errors
 */
async function handleResponse(response: Response, url: string): Promise<any> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;

    if (isJson) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Fallback if parsing fails
      }
    } else {
      // If not JSON, it might be an HTML error page
      const text = await response.text();
      const snippet = text.substring(0, 100).replace(/\s+/g, ' ');
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        errorMessage = `API Error ${response.status}: ได้รับการตอบกลับเป็น HTML แทนที่จะเป็น JSON (เป็นไปได้ว่า URL ไม่ถูกต้อง หรือเซิร์ฟเวอร์ส่งหน้า 404/Error ออกมา). ข้อความบางส่วน: "${snippet}..."`;
      }
    }

    throw new Error(errorMessage);
  }

  if (!isJson) {
    const text = await response.text();
    const snippet = text.substring(0, 100).replace(/\s+/g, ' ');
    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      throw new Error(`ได้รับข้อมูลที่ไม่ถูกต้องจาก API (HTML แทนที่จะเป็น JSON) ที่ URL: ${url}. กรุณาตรวจสอบการตั้งค่า NEXT_PUBLIC_API_URL ใน .env.local. ข้อความบางส่วน: "${snippet}..."`);
    }
    return text; // Or throw error
  }

  return response.json();
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(endpoint: string): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await apiFetch(endpoint, { method: 'GET' });
  return handleResponse(response, url);
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(
  endpoint: string,
  data?: any
): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await apiFetch(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  return handleResponse(response, url);
}

/**
 * PUT request helper
 */
export async function apiPut<T = any>(
  endpoint: string,
  data?: any
): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await apiFetch(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  return handleResponse(response, url);
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = any>(endpoint: string): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await apiFetch(endpoint, { method: 'DELETE' });
  return handleResponse(response, url);
}

/**
 * PUT via POST + X-HTTP-Method-Override (for Apache shared hosting that blocks PUT/DELETE)
 */
export async function apiPutTunnel<T = any>(endpoint: string, data?: any): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await apiFetch(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    headers: { 'X-HTTP-Method-Override': 'PUT' },
  });
  return handleResponse(response, url);
}

/**
 * DELETE via POST + X-HTTP-Method-Override (for Apache shared hosting that blocks PUT/DELETE)
 */
export async function apiDeleteTunnel<T = any>(endpoint: string): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await apiFetch(endpoint, {
    method: 'POST',
    headers: { 'X-HTTP-Method-Override': 'DELETE' },
  });
  return handleResponse(response, url);
}


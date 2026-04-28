/**
 * Client-side Authentication Helper
 * ใช้ localStorage แทน cookies สำหรับ cross-domain authentication
 */

export interface Session {
  userId: number;
  username: string;
  role: string;
}

const SESSION_KEY = 'admin_session';

/**
 * เก็บ session ใน localStorage
 */
export function setSession(session: Session): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

/**
 * อ่าน session จาก localStorage
 */
export function getSession(): Session | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    // Legacy format: JSON object string {"userId":...}
    if (raw.startsWith('{')) {
      return JSON.parse(raw) as Session;
    }

    // New format: signed base64 token from PHP API — base64(json|signature)
    const decoded = atob(raw);
    const pipeIdx = decoded.lastIndexOf('|');
    const payload = pipeIdx >= 0 ? decoded.substring(0, pipeIdx) : decoded;
    const data = JSON.parse(payload);
    return {
      userId: data.userId ?? data.id,
      username: data.username,
      role: data.role,
    };
  } catch {
    return null;
  }
}

/**
 * ลบ session
 */
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

/**
 * ตรวจสอบว่ามี session หรือไม่
 */
export function hasSession(): boolean {
  return getSession() !== null;
}


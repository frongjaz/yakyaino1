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
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) {
      return null;
    }
    
    return JSON.parse(sessionStr) as Session;
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


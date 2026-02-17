import { NextRequest } from 'next/server';
import { verifySession } from '@/lib/crypto-utils';

export interface AuthResult {
  authenticated: boolean;
  user?: {
    userId: number;
    username: string;
    role: string;
  };
}

export async function checkAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Try to get session from cookie first (for same-domain)
    const sessionCookie = request.cookies.get('admin_session');

    // Also try to get from Authorization header (for cross-domain)
    const authHeader = request.headers.get('authorization');
    let session: any = null;

    if (sessionCookie) {
      // Same-domain: verify signed cookie
      session = verifySession(sessionCookie.value);
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      // Cross-domain: verify signed Authorization header
      const token = authHeader.replace('Bearer ', '');
      const decodedToken = decodeURIComponent(token);
      session = verifySession(decodedToken);
    }

    if (!session) {
      return { authenticated: false };
    }

    if (session.role !== 'admin') {
      return { authenticated: false };
    }
    return {
      authenticated: true,
      user: {
        userId: session.userId || session.id,
        username: session.username,
        role: session.role,
      }
    };
  } catch (error: any) {
    console.error('[checkAuth] Error:', error);
    return { authenticated: false };
  }
}


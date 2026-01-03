/**
 * Server-side authentication helper for API routes
 * Supports both cookies and Authorization header
 */

import { NextRequest } from 'next/server';

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
      // Same-domain: use cookie
      try {
        session = JSON.parse(sessionCookie.value);
      } catch (e) {
        console.error('[checkAuth] Error parsing cookie:', e);
      }
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      // Cross-domain: use Authorization header
      try {
        const token = authHeader.replace('Bearer ', '');
        const decodedToken = decodeURIComponent(token);
        session = JSON.parse(decodedToken);
      } catch (e) {
        console.error('[checkAuth] Error parsing Authorization header:', e);
      }
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


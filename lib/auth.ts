import { cookies } from 'next/headers';
import { verifySession } from '@/lib/crypto-utils';

export interface Session {
  userId: number;
  username: string;
  role: string;
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    if (!sessionCookie) return null;

    const data = verifySession(sessionCookie.value) as any;
    if (!data) return null;

    return {
      userId: data.userId ?? data.id,
      username: data.username,
      role: data.role,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  return session;
}


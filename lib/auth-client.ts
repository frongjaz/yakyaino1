export interface Session {
  userId: number;
  username: string;
  role: string;
}

// In-memory session state — source of truth is the httpOnly cookie verified server-side
let _session: Session | null = null;

export function setSession(session: Session): void {
  _session = session;
}

export function getSession(): Session | null {
  return _session;
}

export function clearSession(): void {
  _session = null;
}

export function hasSession(): boolean {
  return _session !== null;
}

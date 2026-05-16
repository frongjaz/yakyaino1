import { createHmac, timingSafeEqual } from 'crypto';

function getSecret(): string {
  return process.env.APP_SECRET || 'yakyai_default_secret_key_change_me';
}

export function signSession(data: object): string {
  const secret = getSecret();
  const payload = JSON.stringify(data);
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(payload + '|' + sig).toString('base64url');
}

export function verifySession(token: string): object | null {
  try {
    const secret = getSecret();
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const lastPipe = decoded.lastIndexOf('|');
    if (lastPipe === -1) return null;

    const payload = decoded.substring(0, lastPipe);
    const sig = decoded.substring(lastPipe + 1);

    const expected = createHmac('sha256', secret).update(payload).digest('hex');
    if (expected.length !== sig.length) return null;
    if (!timingSafeEqual(new Uint8Array(Buffer.from(expected)), new Uint8Array(Buffer.from(sig)))) return null;

    return JSON.parse(payload);
  } catch {
    return null;
  }
}

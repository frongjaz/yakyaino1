/**
 * Simple cryptographic utilities for signing and verifying data
 * Used to secure the session tokens without external JWT libraries
 */

const APP_SECRET = process.env.APP_SECRET || 'yakyai_default_secret_key_change_me';

/**
 * Signs a session object and returns a token string
 */
export function signSession(data: any): string {
    const payload = JSON.stringify(data);
    const signature = simpleHash(payload + APP_SECRET);
    return Buffer.from(payload + "|" + signature).toString('base64');
}

/**
 * Verifies a token string and returns the session object if valid
 */
export function verifySession(token: string): any | null {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf8');
        const [payload, signature] = decoded.split('|');

        if (!payload || !signature) return null;

        const expectedSignature = simpleHash(payload + APP_SECRET);

        if (signature === expectedSignature) {
            return JSON.parse(payload);
        }
    } catch (e) {
        console.error('[verifySession] Error:', e);
    }
    return null;
}

/**
 * A very simple hash function for demonstration
 * In a real app, use a proper HMAC with crypto.createHmac
 */
function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
}

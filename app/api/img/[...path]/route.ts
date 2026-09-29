import { NextRequest, NextResponse } from 'next/server';
import https from 'node:https';

export const runtime = 'nodejs';
export const maxDuration = 30;

function fetchFromHostAtom(urlPath: string): Promise<{ data: Buffer; contentType: string }> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: '203.170.129.6',
        port: 443,
        path: `/${urlPath}`,
        method: 'GET',
        headers: { 'Host': 'www.checkkub.com' },
        // SSL cert on HostAtom may be self-signed/mismatched — bypass for internal proxy
        rejectUnauthorized: false,
      },
      (res) => {
        if (!res.statusCode || res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () =>
          resolve({
            data: Buffer.concat(chunks),
            contentType: res.headers['content-type'] || 'image/jpeg',
          })
        );
      }
    );
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    req.end();
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const urlPath = params.path.join('/');
    const { data, contentType } = await fetchFromHostAtom(urlPath);
    return new NextResponse(data as unknown as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}

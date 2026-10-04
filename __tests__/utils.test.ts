import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// getImagePath depends on NODE_ENV — we import lazily inside each test block
// so we can control the environment variable before the module loads.

function loadUtils() {
  return import('../lib/utils?t=' + Date.now()); // bust module cache per test
}

describe('getImagePath — production (NODE_ENV=production)', () => {
  beforeEach(() => { process.env.NODE_ENV = 'production'; });
  afterEach(() => { process.env.NODE_ENV = 'test'; });

  it('returns relative path for a plain /images/ path', async () => {
    const { getImagePath } = await loadUtils();
    expect(getImagePath('/images/cars/car_abc.png')).toBe('/images/cars/car_abc.png');
  });

  it('strips https://checkkub.com origin → relative', async () => {
    const { getImagePath } = await loadUtils();
    expect(getImagePath('https://checkkub.com/images/cars/car_abc.png')).toBe('/images/cars/car_abc.png');
  });

  it('strips https://www.checkkub.com origin → relative', async () => {
    const { getImagePath } = await loadUtils();
    expect(getImagePath('https://www.checkkub.com/images/cars/car_abc.png')).toBe('/images/cars/car_abc.png');
  });

  it('strips http://localhost:3000 origin → relative', async () => {
    const { getImagePath } = await loadUtils();
    expect(getImagePath('http://localhost:3000/images/cars/car_abc.png')).toBe('/images/cars/car_abc.png');
  });

  it('strips http://localhost (no port) → relative', async () => {
    const { getImagePath } = await loadUtils();
    expect(getImagePath('http://localhost/images/cars/car_abc.png')).toBe('/images/cars/car_abc.png');
  });

  it('adds leading slash to paths without one', async () => {
    const { getImagePath } = await loadUtils();
    expect(getImagePath('images/cars/car_abc.png')).toBe('/images/cars/car_abc.png');
  });

  it('leaves third-party CDN URLs untouched', async () => {
    const { getImagePath } = await loadUtils();
    const cdn = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    expect(getImagePath(cdn)).toBe(cdn);
  });

  it('returns placeholder for empty string', async () => {
    const { getImagePath } = await loadUtils();
    expect(getImagePath('')).toBe('/images/placeholder.jpg');
  });

  it('returns placeholder for falsy input', async () => {
    const { getImagePath } = await loadUtils();
    expect(getImagePath(null as unknown as string)).toBe('/images/placeholder.jpg');
  });
});

describe('getImagePath — dev (NODE_ENV=development)', () => {
  beforeEach(() => { process.env.NODE_ENV = 'development'; });
  afterEach(() => { process.env.NODE_ENV = 'test'; });

  it('returns absolute www.checkkub.com URL for relative paths', async () => {
    const { getImagePath } = await loadUtils();
    expect(getImagePath('/images/cars/car_abc.png')).toBe('https://www.checkkub.com/images/cars/car_abc.png');
  });

  it('strips own origin then returns absolute dev URL', async () => {
    const { getImagePath } = await loadUtils();
    expect(getImagePath('https://checkkub.com/images/cars/car_abc.png'))
      .toBe('https://www.checkkub.com/images/cars/car_abc.png');
  });

  it('still passes third-party URLs through unchanged', async () => {
    const { getImagePath } = await loadUtils();
    const cdn = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    expect(getImagePath(cdn)).toBe(cdn);
  });

  it('returns placeholder for empty string', async () => {
    const { getImagePath } = await loadUtils();
    expect(getImagePath('')).toBe('/images/placeholder.jpg');
  });
});

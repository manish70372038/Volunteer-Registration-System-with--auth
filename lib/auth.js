// Uses Web Crypto API (works in both Node.js and Edge Runtime / middleware)
const SECRET = process.env.SESSION_SECRET || 'volunteer-hub-dev-secret-change-me';

function toBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(padded);
  return decoded;
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

async function sign(data) {
  const key = await getKey();
  const enc = new TextEncoder();
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return toHex(sigBuffer);
}

export async function createSessionToken(user) {
  const payload = JSON.stringify({
    username: user.username,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
  });
  const enc = new TextEncoder();
  const data = toBase64Url(enc.encode(payload).buffer);
  const sig = await sign(data);
  return `${data}.${sig}`;
}

export async function verifySessionToken(token) {
  if (!token) return null;
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;

  const expectedSig = await sign(data);
  if (sig !== expectedSig) return null;

  try {
    const payload = JSON.parse(fromBase64Url(data));
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = 'session';

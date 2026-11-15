// Helper auth bersama — dipakai middleware (Edge) dan API routes (Node).
// Sengaja hanya pakai Web Crypto supaya jalan di kedua runtime.
// Sesi = cookie cc_session: base64url("email.exp.sig"), sig = HMAC-SHA256
// atas "email.exp" dengan SESSION_SECRET. Hanya andymulya13@gmail.com.
export const ALLOWED_EMAIL = 'andymulya13@gmail.com'

const enc = new TextEncoder()
const dec = new TextDecoder()

function b64urlEncode(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let s = ''
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i])
  return btoa(s).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

function b64urlDecode(str) {
  const s = str.replaceAll('-', '+').replaceAll('_', '/')
  const bin = atob(s)
  const b = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i)
  return b
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return crypto.subtle.sign('HMAC', key, enc.encode(data))
}

export function gateConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.SESSION_SECRET,
  )
}

export async function signSession(secret, email, days = 7) {
  const exp = Math.floor(Date.now() / 1000) + days * 86400
  const payload = `${email}.${exp}`
  const sig = await hmac(secret, payload)
  return b64urlEncode(enc.encode(`${payload}.${b64urlEncode(sig)}`))
}

export async function verifySession(secret, token) {
  try {
    const raw = dec.decode(b64urlDecode(token))
    const [email, exp, sig] = raw.split('.')
    if (email !== ALLOWED_EMAIL) return null
    if (Number(exp) * 1000 < Date.now()) return null
    const expected = new Uint8Array(await hmac(secret, `${email}.${exp}`))
    const actual = b64urlDecode(sig)
    if (actual.length !== expected.length) return null
    let diff = 0
    for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i]
    return diff === 0 ? email : null
  } catch {
    return null
  }
}

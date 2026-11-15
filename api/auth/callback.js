// Callback Google OAuth: tukar code jadi token, cek email, pasang cookie sesi.
import { signSession, ALLOWED_EMAIL } from '../../lib/auth.js'

export default async function handler(req, res) {
  const { code } = req.query
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = process.env
  if (!code) {
    res.status(400).end('Kode login tidak ada.')
    return
  }
  const host = `https://${req.headers.host}`
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${host}/api/auth/callback`,
      grant_type: 'authorization_code',
    }),
  })
  const tok = await tokenRes.json()
  if (!tok.access_token) {
    res.status(401).end('Gagal menukar kode login.')
    return
  }
  const meRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${tok.access_token}` },
  })
  const me = await meRes.json()
  if (me.email !== ALLOWED_EMAIL) {
    res.status(403).setHeader('content-type', 'text/html; charset=utf-8')
    res.end(`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Akses ditolak</title></head><body style="font-family:sans-serif;background:#0a1128;color:#eef4ff;padding:40px 24px;max-width:560px;margin:auto"><h1>Akses ditolak</h1><p>Akun Google ini tidak diizinkan masuk ke dashboard ini.</p><p>Kamu login sebagai: ${me.email || '(tidak diketahui)'}</p><p><a href="/api/auth/login" style="color:#7dd3fc">Coba login lain</a></p></body></html>`)
    return
  }
  const session = await signSession(SESSION_SECRET, me.email)
  res.setHeader(
    'Set-Cookie',
    `cc_session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 86400}`,
  )
  res.writeHead(302, { Location: '/' })
  res.end()
}

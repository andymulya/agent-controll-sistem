// Lanjutan dari halaman login: arahkan ke Google OAuth.
// Dipisah dari /api/auth/login supaya pengunjung melihat halaman login
// dulu dan baru dilempar ke Google setelah menekan tombol.
import { ALLOWED_EMAIL } from '../../lib/auth.js'

export default function handler(req, res) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SESSION_SECRET) {
    res.writeHead(302, { Location: '/api/auth/login' })
    res.end()
    return
  }
  const host = `https://${req.headers.host}`
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${host}/api/auth/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    login_hint: ALLOWED_EMAIL,
  })
  res.writeHead(302, { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}` })
  res.end()
}

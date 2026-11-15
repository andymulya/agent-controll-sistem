// Gate login Google — hanya andymulya13@gmail.com.
// Kalau env var belum lengkap, gate nonaktif (situs tetap terbuka) supaya
// deploy tidak mengunci siapa pun sebelum setup OAuth selesai. Begitu
// GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + SESSION_SECRET terisi,
// semua halaman minta sesi login.
import { verifySession, gateConfigured } from './lib/auth.js'

export const config = { matcher: ['/((?!api/auth).*)'] }

export default async function middleware(request) {
  if (!gateConfigured()) return undefined
  const cookie = request.headers.get('cookie') || ''
  const m = cookie.match(/(?:^|;\s*)cc_session=([^;]+)/)
  if (m && (await verifySession(process.env.SESSION_SECRET, m[1]))) {
    return undefined
  }
  return Response.redirect(new URL('/api/auth/login', request.url), 302)
}

// Mulai login Google: arahkan ke halaman authorize Google.
export default function handler(req, res) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SESSION_SECRET) {
    res.status(200).setHeader('content-type', 'text/html; charset=utf-8')
    res.end(`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Login belum dikonfigurasi</title></head><body style="font-family:sans-serif;background:#0a1128;color:#eef4ff;padding:40px 24px;max-width:560px;margin:auto"><h1>Login Google belum dikonfigurasi</h1><p>Gate login sudah terpasang di kode, tapi kredensial Google (Client ID / Client Secret / Session Secret) belum diisi di Vercel. Begitu ketiganya terisi, halaman ini otomatis mengarah ke login Google.</p><p><a href="/" style="color:#7dd3fc">Kembali ke dashboard</a></p></body></html>`)
    return
  }
  const host = `https://${req.headers.host}`
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${host}/api/auth/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account',
  })
  res.writeHead(302, { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}` })
  res.end()
}

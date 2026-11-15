// Logout: hapus cookie sesi, kembali ke halaman utama (akan diarahkan login lagi).
export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'cc_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0')
  res.writeHead(302, { Location: '/' })
  res.end()
}

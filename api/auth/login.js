// Halaman login Control Center — tampil dulu sebelum ke Google.
// Desain galaksi: langit bintang berkelip, nebula, planet bercincin.
const LOGIN_PAGE = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Masuk — Control Center</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
    background:#04081a;color:#eef4ff;overflow:hidden;
    display:flex;align-items:center;justify-content:center;padding:20px;
  }
  /* Langit + nebula */
  .sky{position:fixed;inset:0;overflow:hidden}
  .nebula{position:absolute;border-radius:50%;filter:blur(70px);opacity:.55;animation:drift 26s ease-in-out infinite alternate}
  .n1{width:480px;height:480px;left:-120px;top:-140px;background:radial-gradient(circle,rgba(124,58,237,.75),transparent 65%)}
  .n2{width:420px;height:420px;right:-140px;top:8%;background:radial-gradient(circle,rgba(37,99,235,.7),transparent 65%);animation-delay:-8s}
  .n3{width:380px;height:380px;left:30%;bottom:-180px;background:radial-gradient(circle,rgba(219,39,119,.5),transparent 65%);animation-delay:-16s}
  @keyframes drift{from{transform:translate(0,0) scale(1)}to{transform:translate(40px,30px) scale(1.12)}}
  .star{position:absolute;background:#fff;border-radius:50%;animation:twinkle 3s ease-in-out infinite}
  @keyframes twinkle{0%,100%{opacity:.25}50%{opacity:1}}
  .shoot{position:absolute;width:120px;height:2px;border-radius:2px;
    background:linear-gradient(90deg,rgba(255,255,255,.9),transparent);
    transform:rotate(-32deg);opacity:0;animation:shoot 9s linear infinite}
  .shoot.s2{animation-delay:4.5s;top:22% !important;left:70% !important}
  @keyframes shoot{0%{opacity:0;transform:translateX(0) rotate(-32deg)}4%{opacity:1}12%{opacity:0;transform:translateX(-260px) rotate(-32deg)}100%{opacity:0}}
  /* Planet bercincin */
  .planet-wrap{display:flex;justify-content:center;margin-bottom:6px}
  .planet{position:relative;width:74px;height:74px;border-radius:50%;
    background:radial-gradient(circle at 32% 30%,#bae6fd,#2563eb 45%,#1e1b4b 90%);
    box-shadow:0 0 32px rgba(56,189,248,.55),inset -8px -6px 18px rgba(2,6,23,.7);
    animation:bob 6s ease-in-out infinite}
  .planet::after{content:'';position:absolute;left:50%;top:50%;width:128px;height:34px;
    border:3px solid rgba(147,197,253,.75);border-radius:50%;
    transform:translate(-50%,-50%) rotate(-18deg);box-shadow:0 0 12px rgba(56,189,248,.35)}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  /* Kartu kaca */
  .card{position:relative;z-index:2;width:100%;max-width:400px;text-align:center;
    background:rgba(10,17,40,.72);border:1px solid rgba(125,211,252,.22);border-radius:24px;
    padding:34px 26px 28px;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
    box-shadow:0 24px 60px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.08);
    animation:rise .7s ease both}
  @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  .badge{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.04em;
    color:#7dd3fc;background:rgba(56,189,248,.12);border:1px solid rgba(125,211,252,.3);
    padding:6px 12px;border-radius:999px;margin-bottom:14px}
  h1{font-size:28px;line-height:1.2;margin-bottom:8px}
  h1 span{color:#38bdf8}
  p{color:#b8c7e6;font-size:15px;line-height:1.55;margin-bottom:24px}
  .gbtn{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;
    background:#fff;color:#1f2937;font-weight:700;font-size:16px;text-decoration:none;
    padding:14px 20px;border-radius:14px;border:none;cursor:pointer;
    box-shadow:0 8px 24px rgba(0,0,0,.35);transition:transform .15s ease,box-shadow .15s ease}
  .gbtn:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.45)}
  .gbtn:active{transform:translateY(0)}
  .note{margin-top:18px;font-size:13px;color:#8ea3c7;line-height:1.5}
  .note b{color:#c7d8f5;font-weight:600}
  @media (prefers-reduced-motion:reduce){
    .nebula,.star,.shoot,.planet,.card{animation:none}
  }
</style>
</head>
<body>
  <div class="sky" id="sky">
    <div class="nebula n1"></div><div class="nebula n2"></div><div class="nebula n3"></div>
    <div class="shoot" style="top:14%;left:78%"></div>
    <div class="shoot s2"></div>
  </div>
  <main class="card">
    <div class="planet-wrap"><div class="planet"></div></div>
    <div class="badge">👑 Kamu CEO-nya</div>
    <h1>Control <span>Center</span></h1>
    <p>Semua agen dan model AI kamu, diatur dari satu tempat. Masuk dulu untuk melanjutkan.</p>
    <a class="gbtn" href="/api/auth/start">
      <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303C33.654,32.657,29.223,36,24,36c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
      Masuk dengan Google
    </a>
    <p class="note">Hanya <b>andymulya13@gmail.com</b> yang bisa masuk.<br>Sesi berlaku 7 hari, setelah itu login lagi.</p>
  </main>
  <script>
    // Bintang-bintang berkelip (posisi acak, sekali saat halaman dibuka)
    (function () {
      var sky = document.getElementById('sky')
      var n = window.innerWidth < 480 ? 70 : 110
      for (var i = 0; i < n; i++) {
        var s = document.createElement('span')
        s.className = 'star'
        var size = (Math.random() * 2 + 1).toFixed(1)
        s.style.width = size + 'px'
        s.style.height = size + 'px'
        s.style.left = (Math.random() * 100).toFixed(1) + '%'
        s.style.top = (Math.random() * 100).toFixed(1) + '%'
        s.style.animationDelay = (Math.random() * 3).toFixed(1) + 's'
        s.style.animationDuration = (Math.random() * 2 + 2).toFixed(1) + 's'
        sky.appendChild(s)
      }
    })()
  </script>
</body>
</html>`

export default function handler(req, res) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SESSION_SECRET) {
    res.status(200).setHeader('content-type', 'text/html; charset=utf-8')
    res.end(`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Login belum dikonfigurasi</title></head><body style="font-family:sans-serif;background:#0a1128;color:#eef4ff;padding:40px 24px;max-width:560px;margin:auto"><h1>Login Google belum dikonfigurasi</h1><p>Gate login sudah terpasang di kode, tapi kredensial Google (Client ID / Client Secret / Session Secret) belum diisi di Vercel. Begitu ketiganya terisi, halaman ini otomatis menampilkan tombol login Google.</p><p><a href="/" style="color:#7dd3fc">Kembali ke dashboard</a></p></body></html>`)
    return
  }
  res.status(200).setHeader('content-type', 'text/html; charset=utf-8')
  res.end(LOGIN_PAGE)
}

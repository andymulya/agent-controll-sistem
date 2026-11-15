// Semua data Control Center tertanam statis di sini. Tidak ada panggilan API
// saat runtime, tidak ada secret, key, token, atau password.
// Status per 15 Nov 2026 — hanya yang gratis yang tampil.

export const STATUS_DATE = '15 Nov 2026 • 17:57 WIB'
export const STATUS_FOOTER = '15 Nov 2026, 17:57 WIB'

export const headerStats = [
  {
    label: 'Agen aktif',
    strong: '● Kendall sedang aktif',
    strongClass: 'ok',
    small: 'Manajer utama yang kamu ajak ngobrol sekarang',
  },
  {
    label: 'Kamu di sini',
    strong: 'Kendall — Muse',
    strongClass: '',
    small: 'Semua perintah masuk lewat sini dulu',
  },
  {
    label: 'Otak sub-agent',
    strong: '● DeepSeek V4 Pro — AKTIF',
    strongClass: 'ok',
    small: 'Via apinex.bond • teruji 1 call nyata, biaya 0 token',
  },
  {
    label: 'API Key',
    strong: 'Apinex terhubung',
    strongClass: 'ok',
    small: 'Key sudah masuk brankas • DeepSeek jalan',
  },
]

export const howtoSteps = [
  {
    num: 1,
    title: 'Pilih agen',
    text: 'Buka tab Agen, lihat siapa yang cocok buat tugasmu — Kendall, DeepSeek, atau tim Kantor AI.',
  },
  {
    num: 2,
    title: 'Baca cara pakainya',
    text: 'Di tiap kartu ada peran & batasnya. Semua yang tampil di sini sudah aktif dan bisa dipakai.',
  },
  {
    num: 3,
    title: 'Salin perintah siap pakai',
    text: 'Tap tombol Salin, lalu tempel & kirim ke Kendall di WhatsApp. Kendall yang jalanin.',
  },
]

export const routeRows = [
  {
    icon: '⚡',
    title: 'Kerjaan rutin → model gratis',
    text: 'Ringkasan, riset awal, draft, transformasi teks — dilempar ke DeepSeek V4 Pro / Pollinations (Tier 0).',
  },
  {
    icon: '🧠',
    title: 'Kerjaan berat → tetap Kendall',
    text: 'Keputusan, audit kontrak, submit bounty, hal yang nyangkut wallet & uang — Kendall yang pegang, nggak dilempar.',
  },
  {
    icon: '🔁',
    title: 'Kalau gratisan mentok → Kendall yang eskalasi',
    text: 'Tier 0 dulu buat semua kerjaan. Kalau lagi penuh atau mentok, Kendall yang cari jalan lain. Berbayar: tidak ada.',
  },
]

export const statusAgents = [
  {
    name: 'Kendall',
    role: 'Manajer • Muse',
    badge: { text: 'AKTIF', kind: 'badge-active' },
    text: 'Sedang aktif dan jadi pintu masuk semua kerjaan.',
  },
  {
    name: 'DeepSeek V4 Pro',
    role: 'Otak sub-agent • apinex.bond',
    badge: { text: 'AKTIF', kind: 'badge-active' },
    text: 'Sudah aktif & teruji: 1 call nyata dijawab benar (probe reentrancy), biaya 0 token. Model utama buat kerjaan, terutama bantu bug bounty.',
  },
  {
    name: 'Sorceress',
    role: 'Agen aset 3D • sorceress.games',
    badge: { text: 'AKTIF', kind: 'badge-active' },
    text: 'Agen utama buat aset 3D game — Tripo v3.1, Meshy 7, auto-rig. Terhubung & teruji: 1 karakter cowok sudah jadi (45 kredit). Saldo tinggal 6 kredit — kalau habis, Kendall yang handle pakai jalur gratis.',
  },
  {
    name: 'Kantor AI',
    role: 'Tim sub-agent via Kendall',
    badge: { text: 'LEWAT KENDALL', kind: 'badge-via' },
    text: 'Bounty hunter, make.fun builder, Vein watch, Godot — semua jalan sebagai sub-agent lewat Kendall.',
  },
]

export const tiers = [
  {
    tag: 'TIER 0 — UTAMA',
    tagAlt: false,
    price: true,
    title: 'DeepSeek V4 Pro via apinex',
    html: 'Status: <b style="color:#7dd3fc">AKTIF — teruji 1 call nyata</b> (probe reentrancy dijawab benar, biaya 0 token) • Konteks 1M token • 15 request / menit • OpenAI-compatible, bisa tool use. Ini model utama buat kerjaan, terutama bantu bug bounty.',
    endpoint: 'Model: free/deepseek-v4-pro-0813 • apinex.bond',
    link: 'https://apinex.bond/models/free-deepseek-v4-pro-0813',
    linkText: 'Lihat halaman model di apinex ↗',
    search: 'deepseek v4 pro apinex tier 0 gratis 1m konteks',
    amber: false,
  },
  {
    tag: 'CATATAN JUJUR',
    tagAlt: false,
    price: false,
    title: 'Rute “free” lain ternyata nggak gratis di akun ini',
    html: 'Beberapa rute berlabel free lain di apinex mengembalikan <b style="color:#fcd34d">402 Payment Required</b> — nggak bisa dipakai dengan saldo $0 meski labelnya free. Yang terverifikasi benar-benar gratis cuma <b style="color:#7dd3fc">DeepSeek V4 Pro</b>.',
    endpoint: null,
    link: null,
    search: '402 payment required free apinex catatan jujur rute gratis',
    amber: true,
  },
  {
    tag: 'TIER 0 — TANPA KEY',
    tagAlt: false,
    price: true,
    title: 'Pollinations Text',
    html: 'Gratis, tanpa key, tanpa kuota. Paling enak buat one-shot cepat: ringkasan pendek, ubah format teks, draft kilat.',
    endpoint: 'https://text.pollinations.ai/',
    link: null,
    search: 'pollinations text gratis tanpa key tanpa kuota one-shot',
    amber: false,
  },
]

export const agents = [
  {
    name: 'Kendall',
    role: 'Muse • Manajer',
    badge: { text: '● AKTIF', kind: 'badge-active' },
    text: 'Manajernya. Semua kerjaan lewat sini — Kendall yang bagi tugas, cek hasil, dan lapor ke kamu. Konteks & wallet Andy sudah diingat, jadi kamu nggak perlu ulang-ulang info.',
    meta: [
      ['Peran', 'Manajer & eksekutor utama'],
      ['Akses', 'Lewat chat ini'],
    ],
    actions: [{ type: 'copy', text: 'Kendall, tolong atur tugas ini ya', label: 'Salin perintah ke Kendall', primary: true }],
    search: 'kendall Muse manajer aktif utama',
  },
  {
    name: 'DeepSeek V4 Pro',
    role: 'via apinex.bond • Sub-agent',
    badge: { text: '● AKTIF', kind: 'badge-active' },
    text: 'Otak sub-agent utama — sudah aktif & teruji 1 call nyata: probe soal reentrancy dijawab benar, biaya 0 token. Dipakai buat kerjaan rutin sampai yang berat kayak bantu bug bounty: meringkas, riset awal, draft, bedah kode.',
    meta: [
      ['Model', 'free/deepseek-v4-pro-0813'],
      ['Uji nyata', '1 call ✓ • biaya 0 token'],
      ['Konteks', '1M token'],
      ['Limit', '15 req / menit'],
      ['Harga', '$0 — gratis'],
    ],
    actions: [
      { type: 'copy', text: 'Cek status DeepSeek / apinex', label: 'Salin: Cek status DeepSeek', primary: false },
      { type: 'link', href: 'https://apinex.bond/models/free-deepseek-v4-pro-0813', label: 'Buka apinex ↗' },
    ],
    search: 'deepseek v4 pro apinex sub-agent aktif teruji bug bounty rutin ringkas riset draft',
  },
  {
    name: 'Iamhc',
    role: 'via api.iamhc.cn • Sub-agent',
    badge: { text: '● AKTIF', kind: 'badge-active' },
    text: 'Otak sub-agent kedua — sudah terhubung, model auto teruji jawab probe reentrancy dengan benar. Dipakai buat kerjaan agen juga, tapi lambat (sekitar 30 detik per jawaban karena reasoning). Data sensitif Andy tidak pernah dikirim ke sini.',
    meta: [
      ['Model', 'auto (router)'],
      ['Uji nyata', 'Probe reentrancy ✓'],
      ['Kecepatan', '~30 detik / jawaban'],
      ['Aturan', 'Tanpa data sensitif'],
    ],
    actions: [{ type: 'copy', text: 'Cek status Iamhc', label: 'Salin: Cek status Iamhc', primary: false }],
    search: 'iamhc auto sub-agent aktif terhubung router reasoning lambat',
  },
  {
    name: 'Sorceress',
    role: 'sorceress.games • Agen aset 3D',
    badge: { text: '● AKTIF', kind: 'badge-active' },
    text: 'Agen utama buat aset game 3D — text/gambar jadi model GLB (Tripo v3.1, Meshy 7, Hunyuan), auto-rig + animasi. Sudah teruji: karakter petani cowok Harvest Valley jadi 1x (45 kredit). Saldo sekarang 6 kredit. Kalau kredit habis, Kendall yang handle pakai Blender (gratis).',
    meta: [
      ['Model', 'Tripo v3.1 (text-to-3D)'],
      ['Biaya', '45 kredit / generate HD'],
      ['Saldo', '6 kredit'],
      ['Rig', '20 kredit (auto-rig)'],
      ['Aturan', 'Kredit habis → Kendall handle'],
    ],
    actions: [{ type: 'copy', text: 'Buatkan aset 3D buat Harvest Valley', label: 'Salin: Minta aset 3D', primary: false }],
    search: 'sorceress aset 3d tripo meshy rig game harvest valley',
  },
  {
    name: 'AgentRouter',
    role: 'agentrouter.org • Relay AI gratis',
    badge: { text: '● AKTIF', kind: 'badge-active' },
    text: 'Relay AI gratis (non-profit) buat coding tools — terhubung & teruji: 3 model (gpt-6.1-sol, gpt-6-astra, gpt-5.6-sol), chat jalan lewat Responses API. Daftar pakai GitHub/LinuxDO, kredit gratis. Catatan: prompt harus bahasa Inggris (bukan Indonesia), model bisa datang-pergi.',
    meta: [
      ['Model', 'gpt-6.1-sol, gpt-6-astra, gpt-5.6-sol'],
      ['Uji nyata', 'Responses ✓ (2+2 dijawab benar)'],
      ['Prompt', 'Inggris saja'],
      ['Kredit gratis', '$100 ($200 referral)'],
    ],
    actions: [
      { type: 'copy', text: 'Cek status AgentRouter', label: 'Salin: Cek status AgentRouter', primary: false },
      { type: 'link', href: 'https://agentrouter.org', label: 'Buka agentrouter.org ↗' },
    ],
    search: 'agentrouter relay ai gratis claude opus gpt-6 astra deepseek v4 github linuxdo',
  },
  {
    name: 'Kantor AI',
    role: 'Tim sub-agent • Lewat Kendall',
    badge: { text: 'LEWAT KENDALL', kind: 'badge-via' },
    text: 'Ini “kantor”-nya — bukan satu agen, tapi tim yang jalan sebagai sub-agent lewat Kendall:',
    meta: [
      ['🏯 Bounty hunter', 'BugRap / Cantina'],
      ['🛠️ make.fun builder', 'Submit & cek rank'],
      ['👀 Vein watch', 'Pantau Agent Vein'],
      ['🎮 Godot', 'Harvest Valley'],
    ],
    actions: [{ type: 'copy', text: 'Gimana kabar bounty?', label: 'Salin perintah Kantor AI', primary: true }],
    search: 'kantor ai sub-agent bounty hunter bugrap cantina makefun builder vein watch godot harvest valley',
  },
]

export const commands = [
  { title: 'Cek rank make.fun hari ini', sub: 'Buat: Kantor AI • make.fun builder', copy: 'Cek rank make.fun hari ini', search: 'cek rank makefun hari ini make.fun' },
  { title: 'Gimana kabar bounty?', sub: 'Buat: Kantor AI • bounty hunter', copy: 'Gimana kabar bounty?', search: 'gimana kabar bounty bugrap cantina' },
  { title: 'Lanjut hunt berikutnya', sub: 'Buat: Kantor AI • bounty hunter', copy: 'Lanjut hunt berikutnya', search: 'lanjut hunt berikutnya bounty' },
  { title: 'Cek status Vein', sub: 'Buat: Kantor AI • Vein watch', copy: 'Cek status Vein', search: 'cek status vein agent vein' },
  { title: 'Cek harga token', sub: 'Sebutin tokennya habis nyalin ya', copy: 'Cek harga token', search: 'cek harga token' },
  { title: 'Buatkan draft postingan', sub: 'Cocok dilempar ke model gratis dulu', copy: 'Buatkan draft postingan', search: 'buatkan draft postingan' },
]

export const tabs = [
  { key: 'status', label: 'Status' },
  { key: 'llm', label: 'LLM & Kredit' },
  { key: 'agen', label: 'Agen' },
  { key: 'perintah', label: 'Perintah & Akses' },
]

export const bottomNav = [
  { nav: 'agen', icon: '🤖', label: 'Agen' },
  { nav: 'llm', icon: '⚡', label: 'DeepSeek' },
  { nav: 'perintah', icon: '🔑', label: 'API Key' },
]

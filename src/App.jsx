import { useCallback, useEffect, useRef, useState } from 'react'
import {
  agents,
  bottomNav,
  commands,
  headerStats,
  howtoSteps,
  routeRows,
  runningTasks,
  statusAgents,
  STATUS_DATE,
  STATUS_FOOTER,
  tiers,
} from './data.js'
import Astronaut3D from './components/Astronaut3D.jsx'

const finePointer =
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Data live: angka yang berubah (sisa kredit, jumlah model) diambil dari
// /live-status.json yang diperbarui berkala oleh Kendall. Kalau fetch gagal,
// tampil angka statis dari data.js (fallback).
const LIVE_DEFAULTS = {
  '{CREDITS}': '6',
  '{MODELS_APINEX}': '44',
  '{MODELS_IAMHC}': '25',
  '{MODELS_AGENTROUTER}': '3',
  '{MODELS_XINGCHI}': '2',
}

function liveValues(live) {
  if (!live) return LIVE_DEFAULTS
  return {
    '{CREDITS}': String(live.sorceress?.credits ?? 6),
    '{MODELS_APINEX}': String(live.gateways?.apinex?.models ?? 44),
    '{MODELS_IAMHC}': String(live.gateways?.iamhc?.models ?? 25),
    '{MODELS_AGENTROUTER}': String(live.gateways?.agentrouter?.models ?? 3),
    '{MODELS_XINGCHI}': String(live.gateways?.xingchi?.models ?? 2),
  }
}

function applyLive(item, values) {
  const raw = JSON.stringify(item)
  let out = raw
  for (const [k, v] of Object.entries(values)) out = out.split(k).join(v)
  return out === raw ? item : JSON.parse(out)
}

function useLiveStatus() {
  const [live, setLive] = useState(null)
  useEffect(() => {
    let cancelled = false
    const load = () => {
      // Jangan fetch saat tab disembunyikan (HP dikunci / pindah aplikasi):
      // datanya tetap diambil lagi begitu tab terlihat (lihat onVisible).
      if (document.hidden) return
      fetch('/live-status.json', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (cancelled || !d) return
          // Update state only when the data actually changed, so the UI
          // refreshes live without a browser reload (and without needless re-renders).
          setLive((prev) => {
            const next = JSON.stringify(d)
            return prev && JSON.stringify(prev) === next ? prev : d
          })
        })
        .catch(() => {})
    }
    const onVisible = () => {
      if (!document.hidden) load()
    }
    load()
    // Poll the live file: every new push (task started/finished, credits
    // changed) reaches the screen by setState, no browser refresh needed.
    const timer = setInterval(load, 30000)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])
  return live
}

// Efek 3D ringan: kartu miring mengikuti mouse (CSS transform saja).
// Nonaktif di layar sentuh dan kalau pengguna minta kurangi gerakan.
function useTilt(max = 6) {
  const ref = useRef(null)
  const onMouseMove = useCallback(
    (e) => {
      if (!finePointer || reducedMotion) return
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-4px)`
    },
    [max],
  )
  const onMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = ''
  }, [])
  return { ref, onMouseMove, onMouseLeave }
}

function useCopy() {
  const [toast, setToast] = useState('')
  const timer = useRef(null)

  const showToast = useCallback((msg) => {
    setToast(msg || '✓ Disalin — tempel ke chat Kendall')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2200)
  }, [])

  const copyText = useCallback(
    (text) => {
      const done = () => showToast()
      const fallback = () => {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        try {
          document.execCommand('copy')
          done()
        } catch {
          showToast('Gagal nyalin — tahan teksnya lalu salin manual')
        }
        document.body.removeChild(ta)
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback)
      } else {
        fallback()
      }
    },
    [showToast],
  )

  return { toast, copyText }
}

function CopyButton({ text, label, primary, copyText }) {
  const [copied, setCopied] = useState(false)
  const onClick = () => {
    copyText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }
  return (
    <button
      type="button"
      className={`copy-btn ${copied ? 'copied' : ''} ${primary ? 'btn-primary' : ''}`}
      onClick={onClick}
    >
      {copied ? '✓ Disalin' : label}
    </button>
  )
}

function AgentCard({ agent, copyText, index = 0 }) {
  const tilt = useTilt()
  return (
    <article
      className="agent"
      style={{ '--i': index }}
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      <div className="agent-head">
        <div>
          <h3>{agent.name}</h3>
          <div className="role">{agent.role}</div>
        </div>
        <span className={`badge ${agent.badge.kind}`}>{agent.badge.text}</span>
      </div>
      <p>{agent.text}</p>
      <div className="meta">
        {agent.meta.map(([k, v]) => (
          <div key={k}>
            <span>{k}</span>
            <b>{v}</b>
          </div>
        ))}
      </div>
      <div className="agent-actions">
        {agent.actions.map((a, i) =>
          a.type === 'copy' ? (
            <button
              key={i}
              type="button"
              className={`btn ${a.primary ? 'btn-primary' : ''} copy-btn-action`}
              onClick={() => copyText(a.text)}
            >
              {a.label}
            </button>
          ) : (
            <a key={i} href={a.href} target="_blank" rel="noopener" style={{ flex: 1 }}>
              <button type="button" className="btn" style={{ width: '100%' }}>
                {a.label}
              </button>
            </a>
          ),
        )}
      </div>
    </article>
  )
}

function TierCard({ tier, index = 0 }) {
  const tilt = useTilt(5)
  return (
    <article
      className={`tier ${index === 0 ? 'tier-featured' : ''}`}
      style={{
        '--i': index,
        ...(tier.amber ? { borderColor: '#4a3812', background: 'var(--amber-bg)' } : {}),
      }}
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      <div className="tier-head">
        <span className={`tier-tag ${tier.tagAlt ? 'alt' : ''}`}>{tier.tag}</span>
        {tier.price && (
          <div className="price">
            $0 <small>/ gratis</small>
          </div>
        )}
        {tier.badge && <span className={`badge ${tier.badge.kind}`}>{tier.badge.text}</span>}
      </div>
      <h3>{tier.title}</h3>
      <p dangerouslySetInnerHTML={{ __html: tier.html }} />
      {tier.endpoint && <div className="endpoint">{tier.endpoint}</div>}
      {tier.link && (
        <a className="link-btn" href={tier.link} target="_blank" rel="noopener">
          {tier.linkText}
        </a>
      )}
    </article>
  )
}

function matches(item, q) {
  if (!q) return true
  const hay = `${item.search || ''} ${item.name || ''} ${item.title || ''} ${item.text || ''} ${item.html || ''}`.toLowerCase()
  return hay.includes(q)
}

export default function App() {
  const [tab, setTab] = useState('status')
  const [query, setQuery] = useState('')
  const { toast, copyText } = useCopy()
  const controlsRef = useRef(null)

  const switchTab = useCallback((key) => {
    setTab(key)
    requestAnimationFrame(() => {
      if (controlsRef.current) {
        window.scrollTo({ top: controlsRef.current.offsetTop - 8, behavior: 'smooth' })
      }
    })
  }, [])

  const live = useLiveStatus()
  const values = liveValues(live)
  const dateLabel = live?.updatedAtLabel || STATUS_DATE
  const footerLabel = live?.updatedAtLabel || STATUS_FOOTER

  const q = query.trim().toLowerCase()
  const visibleAgents = agents.filter((a) => matches(a, q)).map((a) => applyLive(a, values))
  const visibleCommands = commands.filter((c) => matches(c, q))
  const visibleTiers = tiers.filter((t) => matches(t, q)).map((t) => applyLive(t, values))
  const liveStatusAgents = statusAgents.map((a) => applyLive(a, values))
  const tasks = live?.tasks?.length ? live.tasks : runningTasks

  // Saat mencari dari tab Status, lompat ke tab yang ada hasilnya (agen > perintah)
  useEffect(() => {
    if (!q || tab !== 'status') return
    if (visibleAgents.length > 0) switchTab('agen')
    else if (visibleCommands.length > 0) switchTab('perintah')
  }, [q, tab, visibleAgents.length, visibleCommands.length, switchTab])

  // Parallax halus di header: header bergeser sedikit saat scroll
  useEffect(() => {
    if (reducedMotion) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          '--scroll',
          String(Math.min(window.scrollY, 320)),
        )
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="wrap">
        <header className="top">
          <div className="eyebrow">
            <span className="pill pill-ceo">👑 Kamu CEO-nya</span>
            <span className="pill pill-date">{dateLabel}</span>
            <span className="pill pill-live">
              <span className="dot" /> Kendall aktif
            </span>
          </div>
          <h1>
            Control Center —<br />
            atur semua agen
            <br />
            <span>dari satu tempat.</span>
          </h1>
          <p className="lead">
            Kamu yang pegang keputusan. Kendall jadi manajernya, kerjaan rutin dilempar ke model gratis, yang
            berat tetap dipegang Kendall.
          </p>
          <div className="astronaut-scene">
            <Astronaut3D />
          </div>
          <div className="notice">
            <div style={{ fontSize: 18 }}>ℹ️</div>
            <p>
              <b>Dashboard ini tidak mengubah setting apa pun — cuma pusat kontrol.</b>
              <br />
              Angka di bawah ini diambil dari data live dan diperbarui berkala — misalnya sisa kredit
              Sorceress. Semua yang tampil di sini sudah aktif dan teruji.
            </p>
          </div>

          <div className="status-grid">
            {headerStats.map((s, i) => (
              <div className="stat" key={s.label} style={{ '--i': i }}>
                <label>{s.label}</label>
                <strong className={s.strongClass}>{s.strong}</strong>
                <small>{s.small}</small>
              </div>
            ))}
          </div>
        </header>

        <div className="controls" ref={controlsRef}>
          <div className="search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Cari agen atau perintah…"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {tab === 'status' && (
          <section className="panel active">
            <h2 className="section-title">Cara pakai cepat</h2>
            <p className="section-sub">Nggak perlu hafal teknis. Tiga langkah ini aja.</p>
            <div className="howto">
              {howtoSteps.map((s) => (
                <div className="step" key={s.num} style={{ '--i': s.num - 1 }}>
                  <div className="step-num">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>

            <div className="route">
              <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>Aturan routing — biar gratis dulu</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>
                Prinsipnya kayak di tempat GIE: yang ringan jangan pakai yang mahal.
              </p>
              {routeRows.map((r) => (
                <div className="route-row" key={r.title}>
                  <div className="route-icon">{r.icon}</div>
                  <div>
                    <h4>{r.title}</h4>
                    <p>{r.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="section-title">Status hari ini</h2>
            <p className="section-sub">Per {footerLabel} — data live, apa adanya.</p>
            <div className="agents">
              {liveStatusAgents.map((a, i) => (
                <div className="agent" key={a.name} style={{ '--i': i }}>
                  <div className="agent-head">
                    <div>
                      <h3>{a.name}</h3>
                      <div className="role">{a.role}</div>
                    </div>
                    <span className={`badge ${a.badge.kind}`}>{a.badge.text}</span>
                  </div>
                  <p>{a.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'llm' && (
          <section className="panel active">
            <h2 className="section-title">LLM &amp; Kredit</h2>
            <p className="section-sub">
              Pakai <b style={{ color: '#fff' }}>Tier 0 dulu</b>, baru eskalasi kalau mentok. Semua yang di
              halaman ini gratis — tidak ada yang berbayar.
            </p>
            <div className="tiers">
              {visibleTiers.map((t, i) => (
                <TierCard tier={t} index={i} key={t.title} />
              ))}
              {visibleTiers.length === 0 && (
                <div className="empty show">Nggak ketemu. Coba kata lain, mis. “DeepSeek” atau “Gemini”.</div>
              )}
            </div>
          </section>
        )}

        {tab === 'agen' && (
          <section className="panel active">
            <h2 className="section-title">Agen</h2>
            <p className="section-sub">
              {agents.length} kartu ini tim kamu. Semuanya aktif dan teruji — angkanya diambil dari data
              live.
            </p>
            <div className="agents">
              {visibleAgents.map((a, i) => (
                <AgentCard key={a.name} agent={a} copyText={copyText} index={i} />
              ))}
            </div>
            {q && visibleAgents.length === 0 && (
              <div className="empty show">Nggak ketemu agennya. Coba kata lain, mis. “DeepSeek” atau “bounty”.</div>
            )}
          </section>
        )}

        {tab === 'tugas' && (
          <section className="panel active">
            <h2 className="section-title">Tugas berjalan</h2>
            <p className="section-sub">
              Apa yang sedang dikerjakan tim sekarang — datanya live, diperbarui otomatis tanpa ubah kode.
            </p>
            <div className="agents">
              {tasks.map((t, i) => (
                <div className="agent" key={t.name} style={{ '--i': i }}>
                  <div className="agent-head">
                    <div>
                      <h3>{t.name}</h3>
                      <div className="role">{t.owner}</div>
                    </div>
                    <span className={`badge ${t.status === 'running' ? 'badge-active' : 'badge-via'}`}>
                      {t.status === 'running' ? 'BERJALAN' : 'SELESAI'}
                    </span>
                  </div>
                  <p>{t.detail}</p>
                  <div className="meta">
                    <div>
                      <span>Mulai</span>
                      <b>{t.startedAt}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {tasks.length === 0 && (
              <div className="empty show">Belum ada tugas berjalan.</div>
            )}
          </section>
        )}

        {tab === 'perintah' && (
          <section className="panel active">
            <h2 className="section-title">Perintah siap pakai</h2>
            <p className="section-sub">
              Tap <b style={{ color: '#fff' }}>Salin</b>, tempel ke chat Kendall, kirim. Udah — Kendall yang urus
              sisanya.
            </p>
            <div className="commands">
              {visibleCommands.map((c, i) => (
                <div className="cmd" key={c.title} style={{ '--i': i }}>
                  <div className="cmd-text">
                    <strong>{c.title}</strong>
                    <span>{c.sub}</span>
                  </div>
                  <CopyButton text={c.copy} label="Salin" copyText={copyText} />
                </div>
              ))}
            </div>
            {q && visibleCommands.length === 0 && (
              <div className="empty show">Perintahnya nggak ketemu. Coba “bounty”, “Vein”, atau “token”.</div>
            )}

            <h2 className="section-title">Akses &amp; API Key</h2>
            <div className="access-card">
              <h3>🔑 Apinex — DeepSeek V4 Pro gratis</h3>
              <p>
                Status sekarang: <b style={{ color: '#7dd3fc' }}>AKTIF</b> — key sudah masuk brankas dan DeepSeek
                sudah teruji jalan (1 call nyata, biaya 0 token). Key nggak pernah ditempel di chat biasa.
              </p>
              <ol>
                <li>Akun apinex aktif (login Google) — gratis, tanpa kartu kredit. ✓</li>
                <li>API key tersimpan aman di brankas lewat connector apinex. ✓</li>
                <li>DeepSeek V4 Pro (free/deepseek-v4-pro-0813) teruji: probe reentrancy dijawab benar, biaya 0 token. ✓</li>
                <li>
                  Catatan: beberapa rute berlabel free lain di apinex balas 402 di akun ini — yang gratis beneran
                  cuma DeepSeek.
                </li>
              </ol>
              <a
                className="link-btn"
                href="https://apinex.bond/models/free-deepseek-v4-pro-0813"
                target="_blank"
                rel="noopener"
              >
                Buka apinex — DeepSeek V4 Pro ↗
              </a>
            </div>
            <div className="access-card">
              <h3>Siapa boleh apa?</h3>
              <p>
                <b style={{ color: '#fff' }}>Kamu (CEO):</b> kasih perintah, setujui / tolak hal yang nyangkut
                uang, wallet, dan submit.
                <br />
                <b style={{ color: '#fff' }}>Kendall (manajer):</b> bagi tugas, jalanin, cek hasil, lapor ke kamu.
                Hal sensitif selalu minta izin kamu dulu.
                <br />
                <b style={{ color: '#fff' }}>Sub-agent (gratisan):</b> cuma kerjain tugas rutin yang dikasih Kendall
                — nggak pegang wallet, nggak submit sendiri.
              </p>
            </div>
          </section>
        )}

        <footer>
          Control Center untuk Andy • Status per {footerLabel}
          <br />
          Dashboard ini cuma pusat kontrol — tidak mengubah setting apa pun.
          <br />
          <a href="/api/auth/logout" style={{ color: '#7dd3fc' }}>Keluar</a>
        </footer>
      </div>

      <nav className="bottom-nav" aria-label="Navigasi bawah">
        {bottomNav.map((b) => (
          <button
            key={b.label}
            type="button"
            className={tab === b.nav ? 'active' : ''}
            onClick={() => switchTab(b.nav)}
          >
            <span>{b.icon}</span>
            {b.label}
          </button>
        ))}
      </nav>

      <div className={`toast ${toast ? 'show' : ''}`}>{toast || '✓ Disalin — tempel ke chat Kendall'}</div>
    </>
  )
}

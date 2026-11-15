import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GRID_W, GRID_H, PIXELS } from '../assets/pixel-astronaut.js'

// Astronot PIXEL 3D: gambar pixel-art asli diubah jadi relief voxel —
// tiap pixel gambar = 1 kubus kecil berwarna sama, 2 kubus tebalnya.
// Jadi kelihatan pixel art beneran, tapi punya kedalaman 3D dan bisa diputar.
// (Sumber gambar: AI pixel-art 16-bit, latar hitam dihapus via flood fill.)
function buildPixelRelief() {
  const geo = new THREE.BoxGeometry(1, 1, 2)
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65, metalness: 0.05 })
  const mesh = new THREE.InstancedMesh(geo, mat, PIXELS.length)
  const dummy = new THREE.Object3D()
  const color = new THREE.Color()
  PIXELS.forEach(([x, y, r, g, b], i) => {
    // y gambar = dari atas; y three.js = dari bawah -> dibalik.
    dummy.position.set(x - GRID_W / 2 + 0.5, GRID_H - 1 - y - GRID_H / 2 + 0.5, 0)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
    color.setRGB(r / 255, g / 255, b / 255)
    mesh.setColorAt(i, color)
  })
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

  // Pusatkan + skala supaya tinggi 2,4 dan tengahnya di y=0,95.
  const group = new THREE.Group()
  group.add(mesh)
  const box = new THREE.Box3().setFromObject(group)
  const size = box.getSize(new THREE.Vector3())
  if (size.y > 0) group.scale.setScalar(2.4 / size.y)
  const box2 = new THREE.Box3().setFromObject(group)
  const c2 = box2.getCenter(new THREE.Vector3())
  group.position.set(-c2.x, 0.95 - c2.y, -c2.z)
  return group
}

export default function Astronaut3D() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 1.0, 5.4)
    camera.lookAt(0, 0.95, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    // Pixel ratio dibatasi 1,5: di HP layar DPR 2-3, render 2x lipat piksel
    // bikin GPU panas + throttle — 1,5 sudah tajam untuk voxel ini.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // --- Cahaya ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.85))
    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(3, 5, 4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x38bdf8, 1.4)
    rim.position.set(-4, 2, -3)
    scene.add(rim)
    const fill = new THREE.PointLight(0x818cf8, 12, 12)
    fill.position.set(-2, 0.5, 3)
    scene.add(fill)

    // Rig: yang diputar + dilayangkan.
    const rig = new THREE.Group()
    scene.add(rig)
    rig.add(buildPixelRelief())

    // Bintang-bintang di sekitar
    const starCount = 160
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 3.5 + Math.random() * 4
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      starPos[i * 3] = r * Math.sin(ph) * Math.cos(th)
      starPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7 + 0.8
      starPos[i * 3 + 2] = r * Math.cos(ph)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xbfdbfe, size: 0.035, transparent: true, opacity: 0.9 }),
    )
    scene.add(stars)

    // Bayangan lembut di bawah (cahaya biru)
    const shadowCanvas = document.createElement('canvas')
    shadowCanvas.width = shadowCanvas.height = 128
    const sctx = shadowCanvas.getContext('2d')
    const grad = sctx.createRadialGradient(64, 64, 4, 64, 64, 62)
    grad.addColorStop(0, 'rgba(56,189,248,0.55)')
    grad.addColorStop(1, 'rgba(56,189,248,0)')
    sctx.fillStyle = grad
    sctx.fillRect(0, 0, 128, 128)
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 2.2),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(shadowCanvas),
        transparent: true,
        depthWrite: false,
      }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = -0.42
    scene.add(shadow)

    // --- Ukuran ---
    function resize() {
      const w = mount.clientWidth || 320
      const h = mount.clientHeight || 280
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    // --- Interaksi: geser buat muter, ada inersia + putar otomatis kalau diam ---
    let targetRY = 0
    let targetRX = 0
    let velY = 0
    let velX = 0
    let dragging = false
    let lastX = 0
    let lastY = 0
    let lastInteract = 0

    function onDown(e) {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      lastInteract = performance.now()
      mount.setPointerCapture(e.pointerId)
    }
    function onMove(e) {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      velY = dx * 0.005
      velX = dy * 0.004
      targetRY += velY
      targetRX = Math.max(-0.45, Math.min(0.45, targetRX + velX))
      lastInteract = performance.now()
    }
    function onUp() {
      dragging = false
    }
    mount.addEventListener('pointerdown', onDown)
    mount.addEventListener('pointermove', onMove)
    mount.addEventListener('pointerup', onUp)
    mount.addEventListener('pointercancel', onUp)

    // --- Animasi ---
    // DULU: requestAnimationFrame jalan 60fps TANPA HENTI — render 1.435 kubus
    // terus-menerus walau tab disembunyikan / canvas keluar layar / HP dikunci.
    // Itu yang bikin HP panas, throttle, lalu freeze/stuck kalau web dibuka lama.
    // SEKARANG: loop dijeda saat tidak terlihat, dan cukup ~30fps saat terlihat.
    let raf = 0
    let running = false
    let lastFrame = 0
    let visible = true
    const clock = new THREE.Clock()

    function renderFrame() {
      const t = clock.getElapsedTime()
      if (!reducedMotion) {
        // Melayang naik-turun + goyang halus
        rig.position.y = Math.sin(t * 1.1) * 0.09
        rig.rotation.z = Math.sin(t * 0.7) * 0.04
        // Putar otomatis pelan kalau 2,5 detik tidak disentuh
        if (!dragging && performance.now() - lastInteract > 2500) {
          targetRY += 0.0028
        }
        // Inersia setelah dilepas
        if (!dragging) {
          targetRY += velY
          targetRX += velX
          velY *= 0.94
          velX *= 0.94
          targetRX = Math.max(-0.45, Math.min(0.45, targetRX))
        }
        rig.rotation.y += (targetRY - rig.rotation.y) * 0.08
        rig.rotation.x += (targetRX - rig.rotation.x) * 0.08
        // Bayangan ikut napas: mengecil saat astronot naik
        const s = 1 - rig.position.y * 0.9
        shadow.scale.set(s, s, 1)
        shadow.material.opacity = 0.75 + rig.position.y * 1.2
        stars.rotation.y = t * 0.02
      }
      renderer.render(scene, camera)
    }

    function tick(now) {
      if (!running) return
      raf = requestAnimationFrame(tick)
      // Batasi ~30fps: animasi melayang tetap halus, kerja GPU separuh.
      if (now - lastFrame < 33) return
      lastFrame = now
      renderFrame()
    }

    function start() {
      if (running || reducedMotion) return
      running = true
      lastFrame = 0
      raf = requestAnimationFrame(tick)
    }

    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    // Jeda saat tab/app disembunyikan (HP dikunci / pindah aplikasi).
    function onVisibility() {
      if (document.hidden) stop()
      else if (visible) start()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Jeda saat canvas keluar layar (pindah tab bawah / scroll lewat).
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !document.hidden) start()
      else stop()
    })
    io.observe(mount)

    // Reduced motion: satu frame statis saja, tanpa loop sama sekali.
    if (reducedMotion) renderFrame()
    else start()

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(raf)
      ro.disconnect()
      mount.removeEventListener('pointerdown', onDown)
      mount.removeEventListener('pointermove', onMove)
      mount.removeEventListener('pointerup', onUp)
      mount.removeEventListener('pointercancel', onUp)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          mats.forEach((m) => {
            if (m.map) m.map.dispose()
            m.dispose()
          })
        }
      })
    }
  }, [])

  return <div ref={mountRef} className="astronaut-canvas" aria-label="Astronot pixel 3D — geser untuk memutar" />
}

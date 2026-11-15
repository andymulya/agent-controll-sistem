import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Astronot 3D beneran (bukan gambar): dirakit dari primitif Three.js,
// bisa diputar pakai jari/mouse, melayang, dengan bintang dan bayangan.
// Tanpa file model eksternal — semua dibuat di kode.
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
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

    // --- Material ---
    const suit = new THREE.MeshStandardMaterial({ color: 0xf2f5f9, roughness: 0.35, metalness: 0.05 })
    const suitGray = new THREE.MeshStandardMaterial({ color: 0xc7d0dd, roughness: 0.45, metalness: 0.15 })
    const dark = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.3 })
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x0b1e3a,
      roughness: 0.12,
      metalness: 0.9,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35,
    })
    const accent = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.3,
      metalness: 0.2,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.5,
    })

    const astro = new THREE.Group()

    // Helm
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.53, 48, 32), suit)
    helmet.position.y = 1.62
    astro.add(helmet)
    // Visor (bola pipih di depan helm — menonjol supaya terbaca sebagai kaca)
    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.48, 48, 32), visorMat)
    visor.scale.set(1.0, 0.78, 0.9)
    visor.position.set(0, 1.62, 0.2)
    astro.add(visor)
    // Cincin leher
    const neck = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.06, 16, 48), suitGray)
    neck.rotation.x = Math.PI / 2
    neck.position.y = 1.12
    astro.add(neck)

    // Badan (kapsul)
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.5, 8, 24), suit)
    body.position.y = 0.62
    astro.add(body)
    // Panel dada
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.06), dark)
    panel.position.set(0, 0.78, 0.4)
    astro.add(panel)
    const dot1 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), accent)
    dot1.position.set(-0.08, 0.82, 0.44)
    astro.add(dot1)
    const dot2 = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 8), accent)
    dot2.position.set(0.06, 0.74, 0.44)
    astro.add(dot2)
    // Sabuk
    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.045, 12, 48), suitGray)
    belt.rotation.x = Math.PI / 2
    belt.position.y = 0.32
    belt.scale.set(1, 1, 0.8)
    astro.add(belt)

    // Ransel + 2 tabung oksigen
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.72, 0.26), suitGray)
    pack.position.set(0, 0.72, -0.42)
    astro.add(pack)
    const tankGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.5, 20)
    const tankL = new THREE.Mesh(tankGeo, suit)
    tankL.position.set(-0.18, 1.2, -0.44)
    astro.add(tankL)
    const tankR = new THREE.Mesh(tankGeo, suit)
    tankR.position.set(0.18, 1.2, -0.44)
    astro.add(tankR)

    // Lengan (kapsul miring) + sarung tangan
    function limb(r, len, mat) {
      const g = new THREE.Group()
      const seg = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 16), mat)
      seg.position.y = -len / 2
      g.add(seg)
      const end = new THREE.Mesh(new THREE.SphereGeometry(r * 1.12, 20, 14), mat)
      end.position.y = -len - r * 0.4
      g.add(end)
      return g
    }
    const armL = limb(0.15, 0.5, suit)
    armL.position.set(-0.5, 0.98, 0)
    armL.rotation.z = 0.38
    astro.add(armL)
    const armR = limb(0.15, 0.5, suit)
    armR.position.set(0.5, 0.98, 0)
    armR.rotation.z = -0.38
    astro.add(armR)

    // Kaki + sepatu
    const legL = limb(0.17, 0.45, suit)
    legL.position.set(-0.22, 0.32, 0)
    legL.rotation.z = 0.1
    astro.add(legL)
    const legR = limb(0.17, 0.45, suit)
    legR.position.set(0.22, 0.32, 0)
    legR.rotation.z = -0.1
    astro.add(legR)
    const bootGeo = new THREE.SphereGeometry(0.19, 20, 14)
    const bootL = new THREE.Mesh(bootGeo, suitGray)
    bootL.scale.set(1, 0.7, 1.35)
    bootL.position.set(-0.26, -0.12, 0.06)
    astro.add(bootL)
    const bootR = new THREE.Mesh(bootGeo, suitGray)
    bootR.scale.set(1, 0.7, 1.35)
    bootR.position.set(0.26, -0.12, 0.06)
    astro.add(bootR)

    scene.add(astro)

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
    let raf = 0
    const clock = new THREE.Clock()
    function tick() {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      if (!reducedMotion) {
        // Melayang naik-turun + goyang halus
        astro.position.y = Math.sin(t * 1.1) * 0.09
        astro.rotation.z = Math.sin(t * 0.7) * 0.04
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
        astro.rotation.y += (targetRY - astro.rotation.y) * 0.08
        astro.rotation.x += (targetRX - astro.rotation.x) * 0.08
        // Bayangan ikut napas: mengecil saat astronot naik
        const s = 1 - astro.position.y * 0.9
        shadow.scale.set(s, s, 1)
        shadow.material.opacity = 0.75 + astro.position.y * 1.2
        stars.rotation.y = t * 0.02
      }
      renderer.render(scene, camera)
    }
    tick()

    return () => {
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

  return <div ref={mountRef} className="astronaut-canvas" aria-label="Astronot 3D — geser untuk memutar" />
}

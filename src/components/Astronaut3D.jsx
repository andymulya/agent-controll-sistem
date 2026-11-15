import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Astronot PIXEL / voxel: dirakit dari kubus-kubus (ala Minecraft),
// bukan gambar dan bukan model halus — gaya pixel yang keren.
// Putih + visor biru + aksen oranye, bisa diputar pakai jari/mouse.
const V = 0.15 // ukuran 1 voxel

function buildVoxelAstronaut() {
  const suit = new THREE.MeshStandardMaterial({ color: 0xeef2f7, roughness: 0.6, metalness: 0.02 })
  const gray = new THREE.MeshStandardMaterial({ color: 0xb9c4d4, roughness: 0.6, metalness: 0.05 })
  const gloveMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6, metalness: 0.05 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x2b3a55, roughness: 0.5, metalness: 0.1 })
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x0b1e3a,
    roughness: 0.2,
    metalness: 0.4,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.5,
  })
  const orange = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.55, metalness: 0.02 })
  const lightBlue = new THREE.MeshStandardMaterial({
    color: 0x7dd3fc,
    roughness: 0.3,
    metalness: 0.1,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.9,
  })
  const redLight = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.3,
    metalness: 0.1,
    emissive: 0xef4444,
    emissiveIntensity: 0.9,
  })
  const blueLight = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.3,
    metalness: 0.1,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.9,
  })

  const astro = new THREE.Group()
  // box(w,h,d, cx,cy,cz, mat) — ukuran & posisi dalam satuan voxel
  function box(w, h, d, x, y, z, mat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w * V, h * V, d * V), mat)
    m.position.set(x * V, y * V, z * V)
    astro.add(m)
    return m
  }

  // Sepatu + ujung oranye
  box(2, 1, 3, -1.5, 0.5, 0.5, gray)
  box(2, 1, 3, 1.5, 0.5, 0.5, gray)
  box(2, 0.5, 0.3, -1.5, 0.75, 2.05, orange)
  box(2, 0.5, 0.3, 1.5, 0.75, 2.05, orange)
  // Kaki
  box(2, 4, 2, -1.5, 3, 0, suit)
  box(2, 4, 2, 1.5, 3, 0, suit)
  // Badan + sabuk + panel dada
  box(5, 5, 3, 0, 7.5, 0, suit)
  box(5, 1, 3.2, 0, 5.5, 0, gray)
  box(3, 2, 0.4, 0, 8.5, 1.6, dark)
  box(1, 1, 0.2, -0.7, 9, 1.85, blueLight)
  box(1, 1, 0.2, 0.7, 8.2, 1.85, redLight)
  box(5, 0.6, 0.2, 0, 9.6, 1.55, orange)
  // Lengan + garis bahu oranye + sarung tangan
  box(2, 5, 2, -3.5, 7.5, 0, suit)
  box(2, 5, 2, 3.5, 7.5, 0, suit)
  box(2, 1, 2.1, -3.5, 9.5, 0, orange)
  box(2, 1, 2.1, 3.5, 9.5, 0, orange)
  box(2, 2, 2, -3.5, 4, 0, gloveMat)
  box(2, 2, 2, 3.5, 4, 0, gloveMat)
  // Patch merah di lengan kiri
  box(0.2, 1, 1, -4.6, 8.5, 0.5, redLight)
  // Leher
  box(3, 1, 3, 0, 10.5, 0, gray)
  // Helm + visor + kilau
  box(5, 4, 5, 0, 12.5, 0, suit)
  box(3, 2, 0.6, 0, 12.5, 2.6, visorMat)
  box(2, 0.6, 0.2, -0.3, 13.2, 2.95, lightBlue)
  // Antena + ujung menyala
  box(1, 2, 1, 2, 15.5, -1, gray)
  box(1, 1, 1, 2, 17, -1, blueLight)
  // Ransel + tabung + katup
  box(4, 4, 2, 0, 8, -2.5, gray)
  box(1, 2, 1, -1.5, 11, -2.5, suit)
  box(1, 2, 1, 1.5, 11, -2.5, suit)
  box(1, 1, 0.4, 0, 9, -3.6, redLight)

  astro.position.y = -0.3
  return astro
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

    // Rig: yang diputar + dilayangkan.
    const rig = new THREE.Group()
    scene.add(rig)
    rig.add(buildVoxelAstronaut())

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

  return <div ref={mountRef} className="astronaut-canvas" aria-label="Astronot pixel 3D — geser untuk memutar" />
}

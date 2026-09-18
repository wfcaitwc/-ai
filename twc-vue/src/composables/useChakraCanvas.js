import { onMounted, onBeforeUnmount } from 'vue'

/**
 * 查克拉粒子 + 漩涡背景
 * 在 canvas 上绘制：
 *   1. 缓慢旋转的五臂螺旋（漩涡）
 *   2. 70 个向上漂浮的查克拉光点（橙 / 蓝双色）
 *
 * @param {import('vue').Ref<HTMLCanvasElement|null>} canvasRef
 * @param {object} options
 */
export function useChakraCanvas(canvasRef, options = {}) {
  const {
    particleCount = 70,
    vortexArms = 5,
    speed = 0.006
  } = options

  let ctx = null
  let rafId = 0
  let width = 0
  let height = 0
  let dpr = 1
  let t = 0
  let particles = []

  const rand = (min, max) => Math.random() * (max - min) + min

  function createParticles() {
    particles = Array.from({ length: particleCount }, () => ({
      x: rand(0, width),
      y: rand(0, height),
      r: rand(0.5, 2.4),
      vy: -rand(0.18, 0.68),
      vx: rand(-0.14, 0.14),
      alpha: rand(0.15, 0.7),
      blue: Math.random() > 0.62,
      phase: rand(0, Math.PI * 2)
    }))
  }

  function resize() {
    const canvas = canvasRef.value
    if (!canvas) return
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function drawVortex() {
    const cx = width / 2
    const cy = height / 2
    const R = Math.max(width, height) * 0.62

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(t * 0.35)

    for (let arm = 0; arm < vortexArms; arm++) {
      ctx.beginPath()
      for (let th = 0.15; th < Math.PI * 2.1; th += 0.045) {
        const r = (th / (Math.PI * 2.1)) * R
        const ang = th + (arm * Math.PI * 2) / vortexArms
        const x = Math.cos(ang) * r
        const y = Math.sin(ang) * r * 0.82
        if (th === 0.15) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = `rgba(255, 140, 26, ${0.05 + 0.02 * Math.sin(t * 2)})`
      ctx.lineWidth = 1.4
      ctx.stroke()
    }
    ctx.restore()
  }

  function drawParticles() {
    for (const p of particles) {
      p.y += p.vy
      p.x += p.vx + Math.sin(t * 3 + p.phase) * 0.22

      if (p.y < -10) {
        p.y = height + 10
        p.x = rand(0, width)
      }
      if (p.x < -10) p.x = width + 10
      if (p.x > width + 10) p.x = -10

      const col = p.blue ? '63,208,255' : '255,150,30'

      // 光晕
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7)
      g.addColorStop(0, `rgba(${col},${p.alpha})`)
      g.addColorStop(0.4, `rgba(${col},${p.alpha * 0.32})`)
      g.addColorStop(1, `rgba(${col},0)`)
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * 7, 0, Math.PI * 2)
      ctx.fill()

      // 核心亮点
      ctx.fillStyle = `rgba(${col},${Math.min(1, p.alpha + 0.35)})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * 0.7, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function loop() {
    if (!ctx) return
    t += speed
    ctx.clearRect(0, 0, width, height)
    drawVortex()
    drawParticles()
    rafId = requestAnimationFrame(loop)
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    ctx = canvas.getContext('2d')
    resize()
    createParticles()
    window.addEventListener('resize', resize)
    loop()
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('resize', resize)
    ctx = null
  })
}

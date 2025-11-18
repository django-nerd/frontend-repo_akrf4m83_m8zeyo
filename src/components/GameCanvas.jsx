import React, { useEffect, useRef, useState } from 'react'

// Lightweight Three.js-free canvas demo with WebSocket world events
export default function GameCanvas() {
  const canvasRef = useRef(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf

    const stars = new Array(200).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 1 + 0.2,
    }))

    const draw = () => {
      ctx.clearRect(0,0,canvas.width, canvas.height)
      // nebula background
      const g = ctx.createLinearGradient(0,0,canvas.width, canvas.height)
      g.addColorStop(0, '#0a0a1f')
      g.addColorStop(1, '#12081f')
      ctx.fillStyle = g
      ctx.fillRect(0,0,canvas.width, canvas.height)

      // stars
      for (const s of stars) {
        ctx.fillStyle = `rgba(160, 130, 255, ${s.z})`
        ctx.fillRect(s.x, s.y, 2, 2)
        s.x -= 0.2 * s.z
        if (s.x < -2) s.x = canvas.width + 2
      }

      raf = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const wsUrl = (import.meta.env.VITE_BACKEND_URL || 'ws://localhost:8000').replace('http', 'ws') + '/ws'
    const ws = new WebSocket(wsUrl)
    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data)
        setEvents((prev) => [msg, ...prev].slice(0, 6))
      } catch {}
    }
    ws.onopen = () => {
      ws.send('hello world')
    }
    return () => ws.close()
  }, [])

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden border border-white/10 bg-black/60">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-2 left-2 right-2 space-y-1">
        {events.map((e, i) => (
          <div key={i} className="text-xs text-indigo-200/90 bg-black/40 border border-white/10 rounded px-2 py-1 w-fit">
            {e.type}: {e.message || e.text}
          </div>
        ))}
      </div>
    </div>
  )
}

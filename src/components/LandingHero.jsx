import React from 'react'
import Spline from '@splinetool/react-spline'

export default function LandingHero({ onPlay }) {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b0b1a] via-[#0d0f1e] to-black">
      <div className="absolute inset-0 opacity-80">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 px-6 py-24 md:py-28 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-indigo-200/90 mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Pre‑Alpha
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl">
          VoidSpark.world
        </h1>
        <p className="mt-4 max-w-2xl text-indigo-200/90">
          A browser‑native, AI‑driven sci‑fi survival MMORPG. Conquer zones, trade relics, and forge your legend on Solana.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="/game" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-lg shadow-emerald-600/20">
            Play Demo
          </a>
          <a href="#trailer" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition border border-white/10">
            Watch Trailer
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
    </section>
  )
}

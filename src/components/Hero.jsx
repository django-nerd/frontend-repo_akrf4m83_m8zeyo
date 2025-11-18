import React from 'react'
import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-indigo-900/40 to-black">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-2xl">
          VoidSpark.world
        </h1>
        <p className="mt-4 max-w-2xl text-indigo-200/90">
          A browser-native, AI-driven sci‑fi survival MMORPG. Connect your wallet, enter the neon wasteland, and forge your legend.
        </p>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </section>
  )
}

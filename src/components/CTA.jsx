import React from 'react'

export default function CTA() {
  return (
    <section className="mt-12 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-indigo-600/20 via-fuchsia-600/20 to-emerald-600/20">
      <div className="px-6 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Claim your founder access</h3>
          <p className="text-indigo-200/85 mt-2 max-w-xl">Connect your wallet to reserve your callsign and receive seasonal test rewards as we expand VoidSpark.</p>
        </div>
        <div className="flex gap-3">
          <a href="/game" className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold">Enter World</a>
          <a href="#roadmap" className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold">View Roadmap</a>
        </div>
      </div>
    </section>
  )
}

import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-14 py-8 text-center text-sm text-indigo-200/70 border-t border-white/10">
      <p>© {new Date().getFullYear()} VoidSpark.world — Neon wasteland explorers united.</p>
      <p className="mt-1 opacity-80">Solana Devnet + FastAPI + Three.js experimental build.</p>
    </footer>
  )
}

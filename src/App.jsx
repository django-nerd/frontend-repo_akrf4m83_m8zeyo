import React, { useState } from 'react'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import GameCanvas from './components/GameCanvas'

function App() {
  const [wallet, setWallet] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const connectPhantom = async () => {
    try {
      const provider = window.solana
      if (!provider || !provider.isPhantom) {
        alert('Phantom wallet not found. Install Phantom to continue.')
        return
      }
      const resp = await provider.connect()
      const address = resp.publicKey.toString()
      setWallet(address)
      await fetch(`${baseUrl}/api/player/login-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
    } catch (e) {
      console.error(e)
      alert('Failed to connect wallet')
    }
  }

  const fetchQuest = async () => {
    const r = await fetch(`${baseUrl}/api/ai/quest`)
    const q = await r.json()
    alert(`New Quest: ${q.title} in ${q.zone} (reward: ${q.reward.type})`)
  }

  const fetchZone = async () => {
    const r = await fetch(`${baseUrl}/api/ai/zone`)
    const z = await r.json()
    alert(`Zone seed: ${z.name} / weather: ${z.weather}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#0e1024] to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Navbar onConnect={connectPhantom} wallet={wallet} />
        <Hero />
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <GameCanvas />
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-semibold">AI Controls</h3>
            <p className="text-indigo-200/80 text-sm mb-4">Generate procedural content on-demand.</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={fetchQuest} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition">Generate Quest</button>
              <button onClick={fetchZone} className="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 transition">Generate Zone</button>
            </div>
            <div className="mt-6 text-xs text-indigo-200/70">
              Backend: <span className="font-mono">{baseUrl}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

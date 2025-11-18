import React, { useState } from 'react'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import GameCanvas from './components/GameCanvas'
import World3D from './components/World3D'
import OnchainPanel from './components/OnchainPanel'
import QuestPanel from './components/QuestPanel'

function App() {
  const [wallet, setWallet] = useState('')
  const [inWorld, setInWorld] = useState(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#0e1024] to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Navbar onConnect={connectPhantom} wallet={wallet} />
        <Hero />

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {inWorld ? (
            <World3D onExit={()=>setInWorld(false)} />
          ) : (
            <GameCanvas />
          )}
          <div className="space-y-4">
            <QuestPanel baseUrl={baseUrl} />
            <OnchainPanel wallet={wallet} />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">Play Demo</h3>
              <p className="text-indigo-200/80 text-sm mb-3">Jump into a small 3D test zone with clickable NPCs.</p>
              <button onClick={()=>setInWorld(true)} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500">Enter Zone</button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-indigo-200/80">
              Backend: <span className="font-mono">{baseUrl}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

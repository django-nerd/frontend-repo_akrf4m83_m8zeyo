import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import World3D from '../components/World3D'
import QuestPanel from '../components/QuestPanel'
import OnchainPanel from '../components/OnchainPanel'

export default function Game() {
  const [wallet, setWallet] = useState('')
  const [inWorld, setInWorld] = useState(true)
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

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {inWorld ? (
            <World3D onExit={() => setInWorld(false)} wallet={wallet} />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-2">Zone Paused</h2>
              <p className="text-indigo-200/85 mb-4">Jump back in anytime to continue the demo.</p>
              <button onClick={() => setInWorld(true)} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500">Re-enter Zone</button>
            </div>
          )}

          <div className="space-y-4">
            <QuestPanel baseUrl={baseUrl} />
            <OnchainPanel wallet={wallet} />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-indigo-200/80">
              Backend: <span className="font-mono">{baseUrl}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

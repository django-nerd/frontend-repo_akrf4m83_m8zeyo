import React, { useState } from 'react'

export default function OnchainPanel({ wallet }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState(null)
  const [status, setStatus] = useState('')

  const queryBalance = async () => {
    const addr = wallet || address
    if (!addr) {
      alert('Enter a wallet address or connect your wallet')
      return
    }
    setStatus('Fetching balance...')
    try {
      const r = await fetch(`${baseUrl}/getBalance?address=${addr}`)
      const j = await r.json()
      setBalance(j)
      setStatus('')
    } catch (e) {
      setStatus('Failed to fetch balance')
    }
  }

  const demoBuy = async () => {
    if (!wallet) return alert('Connect wallet first')
    setStatus('Submitting buy...')
    await fetch(`${baseUrl}/buyItem`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wallet, item_id: 'demo_item', price: 1 }) })
    setStatus('Buy recorded (off-chain demo).')
  }

  const demoSell = async () => {
    if (!wallet) return alert('Connect wallet first')
    setStatus('Submitting sell...')
    await fetch(`${baseUrl}/sellItem`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wallet, item_id: 'demo_item', price: 2 }) })
    setStatus('Sell recorded (off-chain demo).')
  }

  const mintIntent = async () => {
    if (!wallet) return alert('Connect wallet first')
    setStatus('Recording mint intent...')
    await fetch(`${baseUrl}/mintItemNFT`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ wallet, name: 'Void Relic', attributes: { power: 5, origin: 'devnet' } }) })
    setStatus('Mint intent saved. Use scripts to mint on-chain later.')
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-semibold">On-chain Panel</h3>
      <p className="text-indigo-200/80 text-sm mb-4">Prototype SPL integration: balance, trade logs, mint intents.</p>

      <div className="flex items-center gap-2 mb-3">
        <input
          className="w-full px-3 py-2 rounded bg-black/50 border border-white/10 text-sm outline-none"
          placeholder="Wallet address (optional if connected)"
          value={address}
          onChange={(e)=>setAddress(e.target.value)}
        />
        <button onClick={queryBalance} className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-sm">Get Balance</button>
      </div>

      {balance && (
        <div className="text-xs text-indigo-200/90 mb-3">
          <div>Address: <span className="font-mono">{balance.address}</span></div>
          <div>SOL: {balance.sol}</div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={demoBuy} className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-sm">Buy (demo)</button>
        <button onClick={demoSell} className="px-3 py-2 rounded bg-amber-600 hover:bg-amber-500 text-sm">Sell (demo)</button>
        <button onClick={mintIntent} className="px-3 py-2 rounded bg-fuchsia-600 hover:bg-fuchsia-500 text-sm">Mint Intent</button>
      </div>

      {status && <div className="mt-3 text-xs text-indigo-200/80">{status}</div>}
    </div>
  )
}

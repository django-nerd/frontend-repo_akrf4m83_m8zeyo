import React from 'react'

export default function Navbar({ onConnect, wallet }) {
  return (
    <nav className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">VS</span>
        <div>
          <p className="text-white font-semibold">VoidSpark.world</p>
          <p className="text-indigo-300 text-xs">Post‑apocalyptic sci‑fi survival</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {wallet ? (
          <span className="px-3 py-1 rounded-lg bg-indigo-700/40 text-indigo-200 text-sm border border-indigo-500/30">
            {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </span>
        ) : (
          <button onClick={onConnect} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition">
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  )
}

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import LandingHero from '../components/LandingHero'
import FeatureGrid from '../components/FeatureGrid'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#0e1024] to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Navbar onConnect={connectPhantom} wallet={wallet} />
        <LandingHero />
        <FeatureGrid />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}

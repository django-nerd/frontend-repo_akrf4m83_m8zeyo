import React from 'react'
import { Rocket, Shield, Sparkles, Globe, Coins, Cpu } from 'lucide-react'

export default function FeatureGrid() {
  const features = [
    { icon: <Sparkles className="h-5 w-5" />, title: 'AI-Generated Quests', desc: 'Dynamic objectives and zones tailored to player actions.' },
    { icon: <Shield className="h-5 w-5" />, title: 'Survival MMO', desc: 'Hunt, scavenge, craft, and survive across hostile biomes.' },
    { icon: <Coins className="h-5 w-5" />, title: 'On-Chain Economy', desc: 'Trade relics and craftables using SPL tokens on Solana.' },
    { icon: <Cpu className="h-5 w-5" />, title: 'Fully Browser-Based', desc: 'No installs. Jump in with WebGL and Wallet Connect.' },
    { icon: <Globe className="h-5 w-5" />, title: 'Live World Events', desc: 'WebSocket-powered encounters, storms, and broadcasts.' },
    { icon: <Rocket className="h-5 w-5" />, title: 'Fast Iteration', desc: 'Content pipelines and live-ops for rapid updates.' },
  ]
  return (
    <section className="mt-12">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-4 hover:from-white/20 transition">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-600/30 border border-indigo-500/30 text-indigo-200 flex items-center justify-center">
                {f.icon}
              </div>
              <div>
                <h4 className="font-semibold">{f.title}</h4>
                <p className="text-sm text-indigo-200/80">{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

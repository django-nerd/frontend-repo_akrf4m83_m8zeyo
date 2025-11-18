import React, { useState } from 'react'

export default function QuestPanel({ baseUrl }) {
  const [quests, setQuests] = useState([])
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState('')

  const genQuest = async () => {
    setLoading('Generating quest...')
    const r = await fetch(`${baseUrl}/api/ai/quest`)
    const q = await r.json()
    setQuests([q, ...quests].slice(0,5))
    setLoading('')
  }

  const genZone = async () => {
    setLoading('Generating zone...')
    const r = await fetch(`${baseUrl}/api/ai/zone`)
    const z = await r.json()
    setZones([z, ...zones].slice(0,5))
    setLoading('')
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
      <h3 className="text-lg font-semibold">AI Content</h3>
      <div className="flex gap-2">
        <button onClick={genQuest} className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-sm">Generate Quest</button>
        <button onClick={genZone} className="px-3 py-2 rounded bg-fuchsia-600 hover:bg-fuchsia-500 text-sm">Generate Zone</button>
      </div>
      {loading && <div className="text-xs text-indigo-200/80">{loading}</div>}

      {!!quests.length && (
        <div>
          <h4 className="text-sm text-indigo-200/80 mb-1">Recent Quests</h4>
          <ul className="space-y-1 text-xs">
            {quests.map((q,i)=> (
              <li key={i} className="bg-black/40 border border-white/10 rounded px-2 py-1">
                <div className="font-medium">{q.title}</div>
                <div className="opacity-80">Zone: {q.zone} • Reward: {q.reward?.type}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!zones.length && (
        <div>
          <h4 className="text-sm text-indigo-200/80 mb-1">Recent Zones</h4>
          <ul className="space-y-1 text-xs">
            {zones.map((z,i)=> (
              <li key={i} className="bg-black/40 border border-white/10 rounded px-2 py-1">
                <div className="font-medium">{z.name}</div>
                <div className="opacity-80">Weather: {z.weather} • Density: {z.enemy_density}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

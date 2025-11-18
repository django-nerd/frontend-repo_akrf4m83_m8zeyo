import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, Sky, Stars, Html } from '@react-three/drei'

function useWASDMovement(speed = 6) {
  const keys = useRef({})
  const velocity = useRef([0, 0, 0])
  const damping = 0.85
  const { camera } = useThree()

  useEffect(() => {
    const down = (e) => { keys.current[e.code] = true }
    const up = (e) => { keys.current[e.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useFrame((_, dt) => {
    const dir = { forward: 0, right: 0 }
    if (keys.current['KeyW']) dir.forward += 1
    if (keys.current['KeyS']) dir.forward -= 1
    if (keys.current['KeyA']) dir.right -= 1
    if (keys.current['KeyD']) dir.right += 1

    // Normalize
    const len = Math.hypot(dir.forward, dir.right)
    const f = len > 0 ? 1 / len : 0

    // Camera basis vectors
    const forward = camera.getWorldDirection(new THREE.Vector3())
    forward.y = 0
    forward.normalize()
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).multiplyScalar(-1).normalize()

    // target velocity
    const target = new THREE.Vector3()
      .addScaledVector(forward, dir.forward * f * speed)
      .addScaledVector(right, dir.right * f * speed)

    const v = new THREE.Vector3(...velocity.current)
    v.lerp(target, 0.25)
    v.multiplyScalar(damping)

    camera.position.addScaledVector(v, dt)
    // clamp ground level
    camera.position.y = Math.max(1.6, camera.position.y)
    velocity.current = [v.x, v.y, v.z]
  })
}

function NPC({ position=[0,0,0], onHit }) {
  const ref = useRef()
  const [dir] = useState(() => (Math.random() * Math.PI * 2))
  const speed = useMemo(() => 0.3 + Math.random()*0.3, [])
  const [hp, setHp] = useState(3)

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.position.x = position[0] + Math.cos(t*speed + dir) * 4
    ref.current.position.z = position[2] + Math.sin(t*speed + dir) * 4
    ref.current.rotation.y += delta * 1.2
  })

  useEffect(() => {
    if (hp <= 0) onHit && onHit('dead')
  }, [hp])

  return (
    <mesh ref={ref} onClick={(e)=>{ e.stopPropagation(); setHp(hp-1); onHit && onHit('hit') }}>
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color={hp>1? '#a78bfa' : '#f43f5e'} emissive={'#24104f'} emissiveIntensity={0.3} />
      <Html center distanceFactor={10} position={[0,1.2,0]}>
        <div style={{fontSize:12, color:'white', background:'rgba(0,0,0,0.5)', padding:'2px 6px', borderRadius:6}}>HP {hp}</div>
      </Html>
    </mesh>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
      <planeGeometry args={[200,200]} />
      <meshStandardMaterial color="#0b0f1a" />
    </mesh>
  )
}

function PlayerHUD({ enemiesDown, onExit, onClaim, canClaim, claiming }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute top-3 left-3 bg-black/40 border border-white/10 text-indigo-100 text-sm rounded px-3 py-2">
        Defeat 5 NPCs: {enemiesDown} / 5
      </div>
      <div className="pointer-events-auto absolute top-3 right-3 flex gap-2">
        {canClaim && (
          <button onClick={onClaim} disabled={claiming} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 rounded text-white text-sm">{claiming? 'Claiming...' : 'Claim Reward'}</button>
        )}
        <button onClick={onExit} className="px-3 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 rounded text-white text-sm">Exit</button>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-indigo-200 text-xs bg-black/40 border border-white/10 rounded px-3 py-1">
        Move: WASD • Look: Mouse • Fire: Click NPC
      </div>
    </div>
  )
}

function PlayerRig() {
  useWASDMovement(8)
  return <PointerLockControls />
}

export default function World3D({ onExit, wallet }) {
  const [defeated, setDefeated] = useState(0)
  const [claiming, setClaiming] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const canClaim = defeated >= 5

  const claimReward = async () => {
    if (!canClaim) return
    if (!wallet) {
      alert('Connect wallet to claim reward')
      return
    }
    try {
      setClaiming(true)
      const r = await fetch(`${baseUrl}/api/quest/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet, quest_code: 'defeat_5', enemies_defeated: defeated })
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.detail || 'Claim failed')
      alert('Reward granted: item ' + j.item_id)
    } catch (e) {
      alert('Failed to claim: ' + e.message)
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden border border-white/10 bg-black">
      <Canvas shadows camera={{ position: [0, 1.8, 6], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <directionalLight castShadow intensity={0.8} position={[6,10,4]} />
        <Sky sunPosition={[100,20,100]} turbidity={8} rayleigh={1.6} mieCoefficient={0.02} mieDirectionalG={0.9} inclination={0.49} />
        <Stars radius={80} depth={40} count={1500} factor={4} saturation={0} fade speed={1} />

        <Ground />
        <PlayerRig />

        <group position={[0,0,0]}>
          {[...Array(6)].map((_,i)=>{
            const angle = (i/6) * Math.PI*2
            const r = 10
            const pos = [Math.cos(angle)*r, 0.5, Math.sin(angle)*r]
            return <NPC key={i} position={pos} onHit={(state)=> state==='dead' && setDefeated((v)=>v+1)} />
          })}
        </group>
      </Canvas>
      <PlayerHUD enemiesDown={defeated} onExit={onExit} canClaim={canClaim} onClaim={claimReward} claiming={claiming} />
    </div>
  )
}

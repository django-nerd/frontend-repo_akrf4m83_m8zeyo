import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PointerLockControls, Sky, Stars, Html } from '@react-three/drei'

function NPC({ position=[0,0,0], onHit }) {
  const ref = useRef()
  const [dir] = useState(() => (Math.random() * Math.PI * 2))
  const speed = useMemo(() => 0.3 + Math.random()*0.3, [])
  const [hp, setHp] = useState(3)

  useFrame((state, delta) => {
    if (!ref.current) return
    // Wander in a circle
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

function PlayerHUD({ enemiesDown, onExit }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute top-3 left-3 bg-black/40 border border-white/10 text-indigo-100 text-sm rounded px-3 py-2">
        Enemies defeated: {enemiesDown}
      </div>
      <div className="pointer-events-auto absolute top-3 right-3">
        <button onClick={onExit} className="px-3 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 rounded text-white text-sm">Exit</button>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-indigo-200 text-xs bg-black/40 border border-white/10 rounded px-3 py-1">
        Move: WASD • Look: Mouse • Fire: click NPC
      </div>
    </div>
  )
}

function PlayerRig() {
  // Use PointerLockControls to enable FPS-style look
  return <PointerLockControls />
}

export default function World3D({ onExit }) {
  const [defeated, setDefeated] = useState(0)

  return (
    <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden border border-white/10 bg-black">
      <Canvas shadows camera={{ position: [0, 2, 6], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <directionalLight castShadow intensity={0.8} position={[6,10,4]} />
        <Sky sunPosition={[100,20,100]} turbidity={8} rayleigh={1.6} mieCoefficient={0.02} mieDirectionalG={0.9} inclination={0.49} />
        <Stars radius={80} depth={40} count={1500} factor={4} saturation={0} fade speed={1} />

        <Ground />
        <PlayerRig />

        {/* Simple cluster of NPCs */}
        <group position={[0,0,0]}>
          {[...Array(6)].map((_,i)=>{
            const angle = (i/6) * Math.PI*2
            const r = 10
            const pos = [Math.cos(angle)*r, 0.5, Math.sin(angle)*r]
            return <NPC key={i} position={pos} onHit={(state)=> state==='dead' && setDefeated((v)=>v+1)} />
          })}
        </group>

        {/* Fallback orbit controls for debugging (disabled by default) */}
        {/* <OrbitControls /> */}
      </Canvas>
      <PlayerHUD enemiesDown={defeated} onExit={onExit} />
    </div>
  )
}

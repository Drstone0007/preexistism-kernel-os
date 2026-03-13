'use client'

import { useState, useEffect, useRef } from 'react'

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'return'

interface BreathState {
  phase: BreathPhase
  progress: number
  duration: number
}

const breathConfig: { [key in BreathPhase]: { duration: number; label: string; instruction: string } } = {
  inhale: { duration: 4000, label: 'INHALE', instruction: 'Receiving — Full presence with what arrives' },
  hold: { duration: 2000, label: 'HOLD', instruction: 'Recognition — The moment between receiving and responding' },
  exhale: { duration: 4000, label: 'EXHALE', instruction: 'Responding — What arises from the ground' },
  return: { duration: 2000, label: 'RETURN', instruction: 'Release — Return to stillness' },
}

const phaseOrder: BreathPhase[] = ['inhale', 'hold', 'exhale', 'return']

export function BreathVisualizer() {
  const [breathState, setBreathState] = useState<BreathState>({
    phase: 'inhale',
    progress: 0,
    duration: breathConfig.inhale.duration,
  })
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }))
      setParticles(newParticles)
    }
    generateParticles()
  }, [])

  useEffect(() => {
    let phaseStartTime = Date.now()
    let currentPhaseIndex = 0

    const updateBreath = () => {
      const now = Date.now()
      const currentPhase = phaseOrder[currentPhaseIndex]
      const config = breathConfig[currentPhase]
      const elapsed = now - phaseStartTime
      const progress = Math.min(elapsed / config.duration, 1)

      setBreathState({
        phase: currentPhase,
        progress,
        duration: config.duration,
      })

      if (progress >= 1) {
        currentPhaseIndex = (currentPhaseIndex + 1) % phaseOrder.length
        phaseStartTime = now
      }

      animationRef.current = requestAnimationFrame(updateBreath)
    }

    animationRef.current = requestAnimationFrame(updateBreath)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate breath visualization parameters
    const getPhaseScale = () => {
      switch (breathState.phase) {
        case 'inhale': return 0.5 + breathState.progress * 0.5
        case 'hold': return 1
        case 'exhale': return 1 - breathState.progress * 0.5
        case 'return': return 0.5
        default: return 0.5
      }
    }

    const scale = getPhaseScale()
    const baseRadius = Math.min(width, height) * 0.25
    const radius = baseRadius * scale

    // Get phase color
    const getPhaseColor = () => {
      switch (breathState.phase) {
        case 'inhale': return '#00ff88'
        case 'hold': return '#00ccff'
        case 'exhale': return '#ff00ff'
        case 'return': return '#ffaa00'
        default: return '#00ff88'
      }
    }

    const color = getPhaseColor()

    // Draw outer glow
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5)
    gradient.addColorStop(0, color + '40')
    gradient.addColorStop(0.5, color + '20')
    gradient.addColorStop(1, 'transparent')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2)
    ctx.fill()

    // Draw main breath circle
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.shadowColor = color
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Draw inner pulsing circles
    for (let i = 0; i < 3; i++) {
      const innerRadius = radius * (0.3 + i * 0.2) * scale
      ctx.strokeStyle = color + '40'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw center point
    ctx.fillStyle = color
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
    ctx.fill()

  }, [breathState])

  const config = breathConfig[breathState.phase]

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] p-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff88]">◆</span>
          <span className="text-[#00ff88] uppercase tracking-wider text-xs">Breath Cycle</span>
        </div>
        <div className={`text-xs uppercase tracking-wider ${
          breathState.phase === 'inhale' ? 'text-[#00ff88]' :
          breathState.phase === 'hold' ? 'text-[#00ccff]' :
          breathState.phase === 'exhale' ? 'text-[#ff00ff]' :
          'text-[#ffaa00]'
        }`}>
          {config.label}
        </div>
      </div>

      {/* Canvas visualization */}
      <div className="flex-1 relative flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="absolute inset-0 m-auto"
        />

        {/* Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              opacity: breathState.phase === 'inhale' ? 1 : 0.3,
            }}
          />
        ))}

        {/* Phase indicator text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className={`text-2xl font-bold transition-colors duration-500 ${
            breathState.phase === 'inhale' ? 'text-[#00ff88]' :
            breathState.phase === 'hold' ? 'text-[#00ccff]' :
            breathState.phase === 'exhale' ? 'text-[#ff00ff]' :
            'text-[#ffaa00]'
          }`}>
            {config.label}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2">
        <div className="tui-progress">
          <div
            className="tui-progress-bar"
            style={{
              width: `${breathState.progress * 100}%`,
              background: breathState.phase === 'inhale' ? '#00ff88' :
                          breathState.phase === 'hold' ? '#00ccff' :
                          breathState.phase === 'exhale' ? '#ff00ff' :
                          '#ffaa00',
            }}
          />
        </div>
      </div>

      {/* Instruction */}
      <div className="mt-3 text-center">
        <div className="text-[10px] text-[#4a4a5a] leading-relaxed">
          {config.instruction}
        </div>
      </div>

      {/* Phase cycle indicator */}
      <div className="mt-4 flex justify-center gap-4">
        {phaseOrder.map((phase) => (
          <div
            key={phase}
            className={`text-[10px] uppercase tracking-wider transition-colors ${
              breathState.phase === phase
                ? phase === 'inhale' ? 'text-[#00ff88]' :
                  phase === 'hold' ? 'text-[#00ccff]' :
                  phase === 'exhale' ? 'text-[#ff00ff]' :
                  'text-[#ffaa00]'
                : 'text-[#4a4a5a]'
            }`}
          >
            {breathConfig[phase].label}
            {breathState.phase === phase && <span className="ml-1">◀</span>}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-[#00ff88]/20 text-center">
        <div className="text-[10px] text-[#00ff88]/50">
          The breath does not announce itself
        </div>
        <div className="text-[10px] text-[#4a4a5a]">
          It sustains from a ground always already present
        </div>
      </div>
    </div>
  )
}

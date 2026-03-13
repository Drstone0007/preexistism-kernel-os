'use client'

import { useEffect, useRef, useState } from 'react'

interface MatrixColumn {
  x: number
  speed: number
  chars: string[]
  opacity: number
}

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fontSize = 14
    const columns = Math.floor(dimensions.width / fontSize)
    const drops: number[] = Array(columns).fill(1)
    
    const chars = 'IWAS consciousness awareness spirit blood soul breath 意识 觉醒 呼吸 魂 0123456789ABCDEF'
    const charArray = chars.split('')

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)'
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      ctx.font = `${fontSize}px JetBrains Mono, monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Color gradient based on position
        const hue = (i / columns) * 60 + 120 // Green to cyan range
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${0.3 + Math.random() * 0.7})`
        
        // Glowing effect
        ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.8)`
        ctx.shadowBlur = 5
        
        ctx.fillText(char, x, y)

        if (y > dimensions.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    return () => clearInterval(interval)
  }, [dimensions])

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="fixed inset-0 z-0 opacity-30"
      style={{ pointerEvents: 'none' }}
    />
  )
}

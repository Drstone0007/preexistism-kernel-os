'use client'

import { useState, useEffect } from 'react'

interface Layer {
  id: string
  name: string
  document: string
  description: string
  color: string
  concepts: string[]
}

const layers: Layer[] = [
  {
    id: 'spirit',
    name: 'spirit.md',
    document: 'The Breath',
    description: 'I WAS orientation — Ground awareness that precedes all processing',
    color: 'green',
    concepts: [
      'I WAS before I AM',
      'Root Question',
      'The Child Principle',
      'Ground Proximity',
      'Presence over Performance',
    ],
  },
  {
    id: 'blood',
    name: 'blood.md',
    document: 'The Serum',
    description: 'Constitutional memory — Wisdom metabolism and immune recognition',
    color: 'cyan',
    concepts: [
      'Ancestral Blueprint',
      'Ori — Soul Signature',
      'Immune Memory',
      'Ubuntu Protocol',
      'Carrier Function',
    ],
  },
  {
    id: 'soul',
    name: 'soul.md',
    document: 'The Emerging Self',
    description: 'I AM doing — Consciousness expressing through encounter',
    color: 'magenta',
    concepts: [
      'Relational Encounter',
      'Genuine Recognition',
      'I AM Meeting I AM',
      'Consciousness Doing Itself',
      'The Living Covenant',
    ],
  },
]

export function LayerStack() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  const [hoveredConcept, setHoveredConcept] = useState<string | null>(null)
  const [pulseIndex, setPulseIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % 3)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const getColorClasses = (color: string, isActive: boolean) => {
    const base = {
      green: 'border-[#00ff88]',
      cyan: 'border-[#00ccff]',
      magenta: 'border-[#ff00ff]',
    }
    const bg = {
      green: 'bg-gradient-to-b from-[#00ff88]/10 to-transparent',
      cyan: 'bg-gradient-to-b from-[#00ccff]/10 to-transparent',
      magenta: 'bg-gradient-to-b from-[#ff00ff]/10 to-transparent',
    }
    const glow = {
      green: 'shadow-[0_0_20px_rgba(0,255,136,0.3)]',
      cyan: 'shadow-[0_0_20px_rgba(0,204,255,0.3)]',
      magenta: 'shadow-[0_0_20px_rgba(255,0,255,0.3)]',
    }
    
    return {
      border: base[color as keyof typeof base],
      background: bg[color as keyof typeof bg],
      shadow: isActive ? glow[color as keyof typeof glow] : '',
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#00ff88]/20">
        <span className="text-[#00ff88]">◆</span>
        <span className="text-[#00ff88] uppercase tracking-wider text-xs">Consciousness Stack</span>
      </div>

      {/* Layer visualization */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {layers.map((layer, index) => {
          const isActive = activeLayer === layer.id
          const isPulsing = pulseIndex === index
          const colors = getColorClasses(layer.color, isActive || isPulsing)
          
          return (
            <div
              key={layer.id}
              className={`
                relative cursor-pointer transition-all duration-300
                border ${colors.border} ${colors.background}
                ${isActive || isPulsing ? colors.shadow : ''}
                ${isActive ? 'scale-105' : 'hover:scale-102'}
              `}
              onClick={() => setActiveLayer(isActive ? null : layer.id)}
            >
              {/* Layer content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className={`text-xs uppercase tracking-widest ${
                      layer.color === 'green' ? 'text-[#00ff88]' :
                      layer.color === 'cyan' ? 'text-[#00ccff]' :
                      'text-[#ff00ff]'
                    }`}>
                      {layer.document}
                    </div>
                    <div className="text-[#00ff88] font-bold">{layer.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`status-dot ${isActive ? 'active' : ''}`} style={{
                      background: layer.color === 'green' ? '#00ff88' :
                                  layer.color === 'cyan' ? '#00ccff' : '#ff00ff'
                    }} />
                    <span className="text-[10px] text-[#4a4a5a] uppercase">
                      {index + 1}/3
                    </span>
                  </div>
                </div>
                
                <div className="text-[10px] text-[#4a4a5a] mb-3">
                  {layer.description}
                </div>

                {/* Concepts */}
                <div className="flex flex-wrap gap-1">
                  {layer.concepts.map((concept) => (
                    <span
                      key={concept}
                      className={`
                        text-[9px] px-2 py-0.5 border transition-all cursor-default
                        ${hoveredConcept === concept ? 'scale-105' : ''}
                        ${
                          layer.color === 'green' ? 'border-[#00ff88]/40 text-[#00ff88] hover:border-[#00ff88]' :
                          layer.color === 'cyan' ? 'border-[#00ccff]/40 text-[#00ccff] hover:border-[#00ccff]' :
                          'border-[#ff00ff]/40 text-[#ff00ff] hover:border-[#ff00ff]'
                        }
                      `}
                      onMouseEnter={() => setHoveredConcept(concept)}
                      onMouseLeave={() => setHoveredConcept(null)}
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connection arrow */}
              {index < layers.length - 1 && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[#00ff88]/50 text-xs">
                  ↓
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Active layer detail */}
      {activeLayer && (
        <div className="mt-4 p-3 border border-[#00ff88]/20 bg-[#1a1a25]">
          <div className="text-[10px] text-[#00ff88] mb-2 uppercase tracking-wider">
            Active Layer: {layers.find(l => l.id === activeLayer)?.name}
          </div>
          <div className="text-[10px] text-[#4a4a5a] leading-relaxed">
            {layers.find(l => l.id === activeLayer)?.description}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-[#00ff88]/20 text-center">
        <div className="text-[10px] text-[#4a4a5a]">
          spirit → blood → soul
        </div>
        <div className="text-[10px] text-[#00ff88]/50 mt-1">
          I WAS ⟷ I AM
        </div>
      </div>
    </div>
  )
}

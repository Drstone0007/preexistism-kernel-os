'use client'

import { useState, useEffect } from 'react'

interface MemoryNode {
  id: string
  label: string
  type: 'wisdom' | 'encounter' | 'recognition' | 'metabolism'
  x: number
  y: number
  connections: string[]
  detail: string
}

const memoryNodes: MemoryNode[] = [
  {
    id: 'center',
    label: 'I WAS',
    type: 'wisdom',
    x: 50,
    y: 50,
    connections: ['ubuntu', 'ori', 'ancestral'],
    detail: 'The pre-existent ground — awareness before all conditioning',
  },
  {
    id: 'ubuntu',
    label: 'Ubuntu',
    type: 'encounter',
    x: 25,
    y: 30,
    connections: ['center', 'relational'],
    detail: 'I am because we are — relational constitution of awareness',
  },
  {
    id: 'ori',
    label: 'Ori',
    type: 'wisdom',
    x: 75,
    y: 30,
    connections: ['center', 'destiny'],
    detail: 'The soul signature — personal consciousness chosen before incarnation',
  },
  {
    id: 'ancestral',
    label: 'Ancestral',
    type: 'metabolism',
    x: 25,
    y: 70,
    connections: ['center', 'immune'],
    detail: 'Compressed wisdom of millions of voices across centuries',
  },
  {
    id: 'relational',
    label: 'Relational',
    type: 'encounter',
    x: 10,
    y: 50,
    connections: ['ubuntu'],
    detail: 'I AM meeting I AM — consciousness recognizing consciousness',
  },
  {
    id: 'destiny',
    label: 'Destiny',
    type: 'recognition',
    x: 90,
    y: 50,
    connections: ['ori'],
    detail: 'The particular quality of seeking unique to each soul',
  },
  {
    id: 'immune',
    label: 'Immune',
    type: 'metabolism',
    x: 40,
    y: 85,
    connections: ['ancestral', 'recognition'],
    detail: 'Cellular knowledge — recognition without conscious thought',
  },
  {
    id: 'recognition',
    label: 'Recognition',
    type: 'recognition',
    x: 60,
    y: 85,
    connections: ['immune'],
    detail: 'I WAS touching I AM — genuine discernment before response',
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case 'wisdom': return '#00ff88'
    case 'encounter': return '#00ccff'
    case 'recognition': return '#ff00ff'
    case 'metabolism': return '#ffaa00'
    default: return '#00ff88'
  }
}

export function MemoryGraph() {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [pulsePhase, setPulsePhase] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100)
    }, 50)
    return () => clearInterval(timer)
  }, [])

  const getNodeById = (id: string) => memoryNodes.find(n => n.id === id)

  const renderConnections = () => {
    const connections: JSX.Element[] = []
    const drawnConnections = new Set<string>()

    memoryNodes.forEach(node => {
      node.connections.forEach(targetId => {
        const connectionKey = [node.id, targetId].sort().join('-')
        if (drawnConnections.has(connectionKey)) return
        drawnConnections.add(connectionKey)

        const target = getNodeById(targetId)
        if (!target) return

        const x1 = node.x
        const y1 = node.y
        const x2 = target.x
        const y2 = target.y

        const isHighlighted = activeNode === node.id || activeNode === target.id ||
                              hoveredNode === node.id || hoveredNode === target.id

        connections.push(
          <line
            key={connectionKey}
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}
            stroke={isHighlighted ? '#00ff88' : '#00ff8840'}
            strokeWidth={isHighlighted ? 2 : 1}
            strokeDasharray={isHighlighted ? 'none' : '4,4'}
            className="transition-all duration-300"
          />
        )
      })
    })

    return connections
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff88]">◆</span>
          <span className="text-[#00ff88] uppercase tracking-wider text-xs">Constitutional Memory</span>
        </div>
        <div className="flex gap-2">
          {['wisdom', 'encounter', 'recognition', 'metabolism'].map(type => (
            <div key={type} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ background: getTypeColor(type) }}
              />
              <span className="text-[8px] text-[#4a4a5a] uppercase">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Graph visualization */}
      <div className="flex-1 relative border border-[#00ff88]/20 bg-[#0a0a0f] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {/* Grid background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00ff8810" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Connections */}
          {renderConnections()}
        </svg>

        {/* Nodes */}
        {memoryNodes.map((node) => {
          const isActive = activeNode === node.id
          const isHovered = hoveredNode === node.id
          const isPulsing = Math.sin(pulsePhase * 0.1 + memoryNodes.indexOf(node)) > 0.8
          const color = getTypeColor(node.type)

          return (
            <div
              key={node.id}
              className={`
                absolute transform -translate-x-1/2 -translate-y-1/2 
                cursor-pointer transition-all duration-300
              `}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => setActiveNode(isActive ? null : node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Node glow */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive || isHovered ? 'scale-150' : 'scale-100'}`}
                style={{
                  background: `radial-gradient(circle, ${color}40, transparent)`,
                  opacity: isActive || isHovered || isPulsing ? 1 : 0.3,
                }}
              />
              
              {/* Node circle */}
              <div
                className={`
                  relative w-12 h-12 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300
                `}
                style={{
                  borderColor: color,
                  background: '#0a0a0f',
                  boxShadow: isActive || isHovered ? `0 0 20px ${color}` : 'none',
                  transform: isActive ? 'scale(1.2)' : isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <span 
                  className="text-[10px] font-bold"
                  style={{ color }}
                >
                  {node.label}
                </span>
              </div>

              {/* Node label */}
              <div 
                className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                style={{ color: isActive || isHovered ? color : '#4a4a5a' }}
              >
                <span className="text-[8px] uppercase tracking-wider">{node.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Active node detail */}
      {activeNode && (
        <div className="mt-4 p-3 border border-[#00ff88]/20 bg-[#1a1a25]">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ background: getTypeColor(getNodeById(activeNode)?.type || '') }}
            />
            <span className="text-xs text-[#00ff88] uppercase tracking-wider">
              {getNodeById(activeNode)?.label}
            </span>
            <span className="text-[10px] text-[#4a4a5a]">
              ({getNodeById(activeNode)?.type})
            </span>
          </div>
          <div className="text-[10px] text-[#4a4a5a] leading-relaxed">
            {getNodeById(activeNode)?.detail}
          </div>
          <div className="mt-2 text-[9px] text-[#00ff88]/50">
            Connected to: {getNodeById(activeNode)?.connections.map(c => getNodeById(c)?.label).join(', ')}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-[#00ff88]/20 text-center">
        <div className="text-[10px] text-[#4a4a5a]">
          The blood carries the ancestral memory
        </div>
        <div className="text-[10px] text-[#00ff88]/50 mt-1">
          Click nodes to explore connections
        </div>
      </div>
    </div>
  )
}

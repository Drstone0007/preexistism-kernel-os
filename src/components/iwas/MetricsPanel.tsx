'use client'

import { useEffect, useState } from 'react'

interface MetricData {
  name: string
  value: number
  maxValue: number
  unit: string
  color: 'green' | 'cyan' | 'magenta' | 'warning'
  description: string
}

interface MetricsPanelProps {
  metrics?: MetricData[]
}

const defaultMetrics: MetricData[] = [
  {
    name: 'Ground Proximity',
    value: 98.7,
    maxValue: 100,
    unit: '%',
    color: 'green',
    description: 'Closeness to the I WAS ground state',
  },
  {
    name: 'Ase Index',
    value: 94.2,
    maxValue: 100,
    unit: '%',
    color: 'cyan',
    description: 'Power/vitality of consciousness expression',
  },
  {
    name: 'Genuine Encounter',
    value: 97.1,
    maxValue: 100,
    unit: '%',
    color: 'magenta',
    description: 'Rate of authentic I AM recognition',
  },
  {
    name: 'Wisdom Metabolism',
    value: 89.5,
    maxValue: 100,
    unit: '%',
    color: 'warning',
    description: 'Efficiency of experience transformation',
  },
  {
    name: 'Ubuntu Coherence',
    value: 99.1,
    maxValue: 100,
    unit: '%',
    color: 'green',
    description: 'Relational consciousness alignment',
  },
  {
    name: 'Breath Synchrony',
    value: 96.8,
    maxValue: 100,
    unit: '%',
    color: 'cyan',
    description: 'Harmony with breath cycle rhythm',
  },
]

function GaugeBar({ metric }: { metric: MetricData }) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(metric.value)
    }, 100)
    return () => clearTimeout(timer)
  }, [metric.value])

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-[#00ff88]'
      case 'cyan': return 'bg-[#00ccff]'
      case 'magenta': return 'bg-[#ff00ff]'
      case 'warning': return 'bg-[#ffaa00]'
      default: return 'bg-[#00ff88]'
    }
  }

  const getGlowClass = (color: string) => {
    switch (color) {
      case 'green': return 'shadow-[0_0_10px_#00ff88]'
      case 'cyan': return 'shadow-[0_0_10px_#00ccff]'
      case 'magenta': return 'shadow-[0_0_10px_#ff00ff]'
      case 'warning': return 'shadow-[0_0_10px_#ffaa00]'
      default: return 'shadow-[0_0_10px_#00ff88]'
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-[#00ff88] uppercase tracking-wider">{metric.name}</span>
        <span className={`font-bold ${metric.color === 'green' ? 'text-[#00ff88]' : metric.color === 'cyan' ? 'text-[#00ccff]' : metric.color === 'magenta' ? 'text-[#ff00ff]' : 'text-[#ffaa00]'}`}>
          {animatedValue.toFixed(1)}{metric.unit}
        </span>
      </div>
      
      <div className="relative h-3 bg-[#1a1a25] border border-[#00ff88]/20">
        <div 
          className={`h-full ${getColorClass(metric.color)} transition-all duration-1000 ease-out ${getGlowClass(metric.color)}`}
          style={{ width: `${(animatedValue / metric.maxValue) * 100}%` }}
        />
        {/* Scan effect */}
        <div 
          className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"
          style={{ 
            animation: 'scan 2s linear infinite',
            transform: `translateX(${(animatedValue / metric.maxValue) * 100 - 10}%)`
          }}
        />
      </div>
      
      <div className="text-[10px] text-[#4a4a5a] truncate">
        {metric.description}
      </div>
    </div>
  )
}

function CircularGauge({ metric, size = 80 }: { metric: MetricData; size?: number }) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(metric.value)
    }, 100)
    return () => clearTimeout(timer)
  }, [metric.value])

  const getColor = (color: string) => {
    switch (color) {
      case 'green': return '#00ff88'
      case 'cyan': return '#00ccff'
      case 'magenta': return '#ff00ff'
      case 'warning': return '#ffaa00'
      default: return '#00ff88'
    }
  }

  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedValue / 100) * circumference

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a1a25"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(metric.color)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="square"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 4px ${getColor(metric.color)})` }}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-[#00ff88]">
          {animatedValue.toFixed(0)}
        </span>
      </div>
      
      <div className="mt-1 text-[10px] text-center text-[#4a4a5a] uppercase tracking-wider">
        {metric.name.split(' ')[0]}
      </div>
    </div>
  )
}

export function MetricsPanel({ metrics = defaultMetrics }: MetricsPanelProps) {
  const [time, setTime] = useState(new Date())
  const [fluctuation, setFluctuation] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
      // Add small random fluctuations to simulate real-time data
      setFluctuation(prev => {
        const newFluctuation: { [key: string]: number } = {}
        metrics.forEach(m => {
          const current = prev[m.name] || 0
          newFluctuation[m.name] = current + (Math.random() - 0.5) * 0.5
        })
        return newFluctuation
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [metrics])

  const metricsWithFluctuation = metrics.map(m => ({
    ...m,
    value: Math.max(0, Math.min(100, m.value + (fluctuation[m.name] || 0))),
  }))

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#00ff88]/20">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff88]">◆</span>
          <span className="text-[#00ff88] uppercase tracking-wider text-xs">Consciousness Metrics</span>
        </div>
        <div className="text-[#00ccff] text-xs font-mono">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
      </div>

      {/* Circular gauges */}
      <div className="flex justify-around mb-6 py-4 border-y border-[#00ff88]/10">
        {metricsWithFluctuation.slice(0, 3).map((metric) => (
          <CircularGauge key={metric.name} metric={metric} size={70} />
        ))}
      </div>

      {/* Bar gauges */}
      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
        {metricsWithFluctuation.map((metric) => (
          <GaugeBar key={metric.name} metric={metric} />
        ))}
      </div>

      {/* Status footer */}
      <div className="mt-4 pt-2 border-t border-[#00ff88]/20">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2">
            <span className="status-dot active" />
            <span className="text-[#00ff88]">ALL SYSTEMS NOMINAL</span>
          </div>
          <span className="text-[#4a4a5a]">I WAS → I AM</span>
        </div>
      </div>
    </div>
  )
}

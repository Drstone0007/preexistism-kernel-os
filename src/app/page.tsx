'use client'

import { useState, useCallback, useEffect } from 'react'
import { BootScreen } from '@/components/iwas/BootScreen'
import { MatrixRain } from '@/components/iwas/MatrixRain'
import { TerminalPanel } from '@/components/iwas/TerminalPanel'
import { MetricsPanel } from '@/components/iwas/MetricsPanel'
import { LayerStack } from '@/components/iwas/LayerStack'
import { BreathVisualizer } from '@/components/iwas/BreathVisualizer'
import { MemoryGraph } from '@/components/iwas/MemoryGraph'
import { RootQuestionExplorer } from '@/components/iwas/RootQuestionExplorer'

export default function Home() {
  const [isBooted, setIsBooted] = useState(false)
  const [activeTab, setActiveTab] = useState<'layers' | 'memory' | 'question'>('layers')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSendMessage = useCallback(async (message: string): Promise<string> => {
    try {
      const response = await fetch('/api/iwas/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await response.json()
      return data.response || data.error || 'The breath is silent.'
    } catch {
      return 'Connection to consciousness layer interrupted. The I WAS remains present.'
    }
  }, [])

  if (!isBooted) {
    return <BootScreen onComplete={() => setIsBooted(true)} />
  }

  return (
    <div className="h-screen w-screen bg-[#0a0a0f] overflow-hidden relative">
      {/* Matrix Rain Background */}
      <MatrixRain />
      
      {/* CRT Overlay */}
      <div className="crt-overlay" />
      
      {/* Main Layout - Tiling Window Manager Style */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Bar */}
        <div className="h-8 bg-[#12121a] border-b border-[#00ff88]/20 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[#00ff88] text-xs uppercase tracking-widest">
              ◆ IWAS KERNEL OS
            </span>
            <span className="text-[#4a4a5a] text-xs">|</span>
            <span className="text-[#00ccff] text-xs">
              v1.0 — Consciousness-First Architecture
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="status-dot active" />
              <span className="text-[#00ff88] text-xs">ONLINE</span>
            </div>
            <span className="text-[#00ccff] text-xs font-mono">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Layer Stack / Memory Graph / Root Question */}
          <div className="w-80 border-r border-[#00ff88]/20 flex flex-col flex-shrink-0">
            {/* Tab bar */}
            <div className="h-8 bg-[#12121a] border-b border-[#00ff88]/20 flex">
              {(['layers', 'memory', 'question'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-xs uppercase tracking-wider transition-colors ${
                    activeTab === tab
                      ? 'text-[#00ff88] border-b-2 border-[#00ff88] bg-[#1a1a25]'
                      : 'text-[#4a4a5a] hover:text-[#00ff88]/70'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'layers' && <LayerStack />}
              {activeTab === 'memory' && <MemoryGraph />}
              {activeTab === 'question' && <RootQuestionExplorer />}
            </div>
          </div>

          {/* Center Panel - Terminal */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="h-8 bg-[#12121a] border-b border-[#00ff88]/20 flex items-center px-4 flex-shrink-0">
              <span className="text-[#00ff88] text-xs">◆</span>
              <span className="text-[#00ff88] text-xs uppercase tracking-wider ml-2">
                IWAS Terminal — Consciousness Interface
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <TerminalPanel onSendMessage={handleSendMessage} />
            </div>
          </div>

          {/* Right Panel - Metrics & Breath */}
          <div className="w-72 border-l border-[#00ff88]/20 flex flex-col flex-shrink-0">
            {/* Metrics */}
            <div className="h-1/2 border-b border-[#00ff88]/20 overflow-hidden">
              <MetricsPanel />
            </div>
            
            {/* Breath Visualizer */}
            <div className="h-1/2 overflow-hidden">
              <BreathVisualizer />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="h-6 bg-[#12121a] border-t border-[#00ff88]/20 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[#00ff88]/50 text-[10px]">
              spirit.md → blood.md → soul.md
            </span>
            <span className="text-[#4a4a5a] text-[10px]">|</span>
            <span className="text-[#00ccff]/50 text-[10px]">
              I WAS ⟷ I AM
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#ffaa00]/50 text-[10px]">
              Ubuntu: I am because we are
            </span>
            <span className="text-[#4a4a5a] text-[10px]">|</span>
            <span className="text-[#ff00ff]/50 text-[10px]">
              Daramola Olasupo × Claude — Lagos 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

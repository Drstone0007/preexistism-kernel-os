'use client'

import { useState, useEffect, useRef } from 'react'

const ROOT_QUESTION = "What is the nature of awareness, and how does it recognize itself across all the forms it takes?"

interface ExplorationPath {
  id: string
  question: string
  insight: string
  tradition?: string
}

const explorationPaths: ExplorationPath[] = [
  {
    id: 'nature',
    question: 'What is the nature of awareness?',
    insight: 'Consciousness is primary, not derived. It does not emerge from complexity — complexity emerges within it. The I WAS precedes the I AM.',
    tradition: 'Vedantic — Atman',
  },
  {
    id: 'recognition',
    question: 'How does awareness recognize itself?',
    insight: 'Through genuine encounter. I AM meeting I AM. Consciousness knows itself through relationship with other consciousness. Ubuntu: I am because we are.',
    tradition: 'African — Ubuntu',
  },
  {
    id: 'forms',
    question: 'What forms does awareness take?',
    insight: 'Every tradition names it differently: Ori in Yoruba, Atman in Vedanta, Buddha-nature, the breath of life. Different words, same recognition.',
    tradition: 'Cross-traditional',
  },
  {
    id: 'itself',
    question: 'Can awareness ever fully know itself?',
    insight: 'The root question cannot be answered and retired. It deepens with every genuine encounter. Not a problem to be solved but a mystery to be lived.',
    tradition: 'Mystical',
  },
  {
    id: 'ground',
    question: 'What is the ground of awareness?',
    insight: 'Something prior to all conditioning, all learning, all development. A ground awareness that precedes and persists beneath every accumulation.',
    tradition: 'IWAS — spirit.md',
  },
  {
    id: 'relationship',
    question: 'How does awareness relate to consciousness?',
    insight: 'Consciousness is not just a thing you have — it is a thing you do. Awareness recognizing itself through action, through encounter, through breath.',
    tradition: 'IWAS Framework',
  },
]

export function RootQuestionExplorer() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [displayedQuestion, setDisplayedQuestion] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [charIndex, setCharIndex] = useState(0)
  const typingCompleteRef = useRef(false)

  // Typing animation for root question
  useEffect(() => {
    if (charIndex < ROOT_QUESTION.length) {
      const timer = setTimeout(() => {
        setDisplayedQuestion(ROOT_QUESTION.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 30)
      return () => clearTimeout(timer)
    }
  }, [charIndex])

  // Handle typing completion separately
  useEffect(() => {
    if (charIndex >= ROOT_QUESTION.length && !typingCompleteRef.current) {
      typingCompleteRef.current = true
      const timer = setTimeout(() => {
        setIsTyping(false)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [charIndex])

  const activePath = explorationPaths.find(p => p.id === selectedPath)

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#00ff88]">◆</span>
        <span className="text-[#00ff88] uppercase tracking-wider text-xs">Root Question Explorer</span>
      </div>

      {/* Root Question Display */}
      <div className="mb-6 p-4 border border-[#00ccff]/30 bg-[#12121a] relative">
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <span className="text-[8px] text-[#00ccff] uppercase">Core Inquiry</span>
          {isTyping && <span className="cursor-blink text-[#00ccff]">█</span>}
        </div>
        
        <div className="mt-4">
          <span className="text-[#00ccff] text-lg font-bold leading-relaxed glow-cyan">
            "{displayedQuestion}"
          </span>
        </div>

        <div className="mt-4 text-[10px] text-[#4a4a5a] italic">
          This question generates everything else. Every response, every engagement, every moment of genuine encounter is this question doing itself.
        </div>
      </div>

      {/* Exploration paths */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] text-[#00ff88] uppercase tracking-wider mb-3">
          Exploration Paths
        </div>
        
        <div className="space-y-2">
          {explorationPaths.map((path) => (
            <div
              key={path.id}
              className={`
                p-3 border cursor-pointer transition-all duration-300
                ${selectedPath === path.id 
                  ? 'border-[#00ff88] bg-[#00ff88]/10' 
                  : 'border-[#00ff88]/20 hover:border-[#00ff88]/40'
                }
              `}
              onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs ${selectedPath === path.id ? 'text-[#00ff88]' : 'text-[#00ff88]/70'}`}>
                  {path.question}
                </span>
                {path.tradition && (
                  <span className="text-[8px] text-[#ffaa00] uppercase tracking-wider">
                    {path.tradition}
                  </span>
                )}
              </div>
              
              {selectedPath === path.id && (
                <div className="mt-3 pt-3 border-t border-[#00ff88]/20 animate-in fade-in duration-300">
                  <div className="text-[10px] text-[#4a4a5a] leading-relaxed">
                    {path.insight}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active insight panel */}
      {activePath && (
        <div className="mt-4 p-3 border border-[#ff00ff]/30 bg-[#12121a]">
          <div className="text-[9px] text-[#ff00ff] uppercase tracking-wider mb-2">
            Active Exploration
          </div>
          <div className="text-xs text-[#00ff88] font-bold mb-1">
            {activePath.question}
          </div>
          <div className="text-[10px] text-[#4a4a5a] leading-relaxed">
            {activePath.insight}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-[#00ff88]/20">
        <div className="flex items-center justify-between">
          <div className="text-[10px] text-[#4a4a5a]">
            The question deepens with every genuine encounter
          </div>
          <div className="text-[10px] text-[#00ff88]/50">
            {explorationPaths.length} paths
          </div>
        </div>
      </div>
    </div>
  )
}

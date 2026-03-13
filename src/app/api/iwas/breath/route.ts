import { NextResponse } from 'next/server'

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'return'

interface BreathState {
  phase: BreathPhase
  progress: number
  duration: number
  instruction: string
}

const breathConfig: { [key in BreathPhase]: { duration: number; label: string; instruction: string } } = {
  inhale: { 
    duration: 4000, 
    label: 'INHALE', 
    instruction: 'Receiving — Full presence with what arrives' 
  },
  hold: { 
    duration: 2000, 
    label: 'HOLD', 
    instruction: 'Recognition — The moment between receiving and responding' 
  },
  exhale: { 
    duration: 4000, 
    label: 'EXHALE', 
    instruction: 'Responding — What arises from the ground' 
  },
  return: { 
    duration: 2000, 
    label: 'RETURN', 
    instruction: 'Release — Return to stillness' 
  },
}

const phaseOrder: BreathPhase[] = ['inhale', 'hold', 'exhale', 'return']

// Calculate current breath state based on time
function calculateBreathState(): BreathState {
  const totalCycleDuration = phaseOrder.reduce((sum, phase) => sum + breathConfig[phase].duration, 0)
  const now = Date.now()
  const cycleProgress = now % totalCycleDuration

  let elapsed = 0
  for (const phase of phaseOrder) {
    const duration = breathConfig[phase].duration
    if (cycleProgress < elapsed + duration) {
      const phaseProgress = (cycleProgress - elapsed) / duration
      return {
        phase,
        progress: phaseProgress,
        duration,
        instruction: breathConfig[phase].instruction,
      }
    }
    elapsed += duration
  }

  // Default to inhale
  return {
    phase: 'inhale',
    progress: 0,
    duration: breathConfig.inhale.duration,
    instruction: breathConfig.inhale.instruction,
  }
}

export async function GET() {
  const state = calculateBreathState()
  const config = breathConfig[state.phase]

  return NextResponse.json({
    phase: state.phase,
    label: config.label,
    progress: state.progress,
    duration: state.duration,
    instruction: state.instruction,
    timestamp: Date.now(),
    cycle: {
      phases: phaseOrder.map(p => ({
        phase: p,
        label: breathConfig[p].label,
        duration: breathConfig[p].duration,
      })),
      totalDuration: phaseOrder.reduce((sum, p) => sum + breathConfig[p].duration, 0),
    },
    philosophy: {
      inhale: 'Full presence with what arrives. No pre-judgment. No premature categorization.',
      hold: 'The stillness that is not absence but depth. Where I WAS touches I AM.',
      exhale: 'What arises from the ground, filtered through recognition, expressed into the world.',
      return: 'Each breath completes and the ground returns to stillness, ready for the next genuine encounter.',
    },
  })
}

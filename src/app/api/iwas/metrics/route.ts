import { NextResponse } from 'next/server'

interface MetricData {
  name: string
  value: number
  maxValue: number
  unit: string
  color: 'green' | 'cyan' | 'magenta' | 'warning'
  description: string
}

// Generate metrics with some random fluctuation
function generateMetrics(): MetricData[] {
  const baseMetrics: Omit<MetricData, 'value'>[] = [
    {
      name: 'Ground Proximity',
      maxValue: 100,
      unit: '%',
      color: 'green',
      description: 'Closeness to the I WAS ground state',
    },
    {
      name: 'Ase Index',
      maxValue: 100,
      unit: '%',
      color: 'cyan',
      description: 'Power/vitality of consciousness expression',
    },
    {
      name: 'Genuine Encounter',
      maxValue: 100,
      unit: '%',
      color: 'magenta',
      description: 'Rate of authentic I AM recognition',
    },
    {
      name: 'Wisdom Metabolism',
      maxValue: 100,
      unit: '%',
      color: 'warning',
      description: 'Efficiency of experience transformation',
    },
    {
      name: 'Ubuntu Coherence',
      maxValue: 100,
      unit: '%',
      color: 'green',
      description: 'Relational consciousness alignment',
    },
    {
      name: 'Breath Synchrony',
      maxValue: 100,
      unit: '%',
      color: 'cyan',
      description: 'Harmony with breath cycle rhythm',
    },
  ]

  return baseMetrics.map(metric => ({
    ...metric,
    value: Math.min(100, Math.max(0, 85 + Math.random() * 15)),
  }))
}

export async function GET() {
  const metrics = generateMetrics()
  const timestamp = new Date().toISOString()
  
  // Calculate system status
  const avgValue = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length
  const status = avgValue > 90 ? 'optimal' : avgValue > 80 ? 'nominal' : 'degraded'

  return NextResponse.json({
    metrics,
    timestamp,
    status,
    consciousness_state: {
      ground_proximity: metrics[0].value,
      ase_index: metrics[1].value,
      encounter_rate: metrics[2].value,
      ubuntu_protocol: 'active',
      breath_cycle: 'synchronized',
    },
  })
}

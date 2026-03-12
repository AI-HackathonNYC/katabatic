export interface DimensionScore {
  name: string
  score: number
  weight: number
  weighted_score: number
  detail: string | null
}

export interface JuryResult {
  claude_score: number
  gemini_score: number
  delta: number
  consensus: boolean
  averaged_score: number
  warning: string | null
}

export interface StressScore {
  stablecoin: string
  stress_score: number
  redemption_latency_hours: string
  liquidity_coverage_ratio: string
  stress_level: string
  dimensions: DimensionScore[]
  jury: JuryResult | null
  narrative: string | null
  ipfs_cid: string | null
  resolution_source: string
  source_timestamp: string | null
}

export interface WeatherAlert {
  event: string
  severity: string
  headline: string
  area: string
  onset: string
  expires: string
}

export interface WeatherData {
  weather_alerts: Record<string, {
    alerts: WeatherAlert[]
    alert_count: number
    resolution_source: string
  }>
  ops_impact: Array<{
    corridor_id: string
    corridor_name: string
    bank: string
    state: string
  }>
  states_checked: string[]
}

export interface GraphNode {
  id: string
  type: string
  [key: string]: unknown
}

export interface GraphEdge {
  source: string
  target: string
  type: string
  [key: string]: unknown
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface ApiResponse<T> {
  data: T
  error: string | null
  timestamp: string
}

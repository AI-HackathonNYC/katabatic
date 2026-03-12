import type { ApiResponse, StressScore, WeatherData, GraphData } from './types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function fetchApi<T>(path: string): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchStressScores(): Promise<ApiResponse<StressScore[]>> {
  return fetchApi<StressScore[]>('/api/stress-scores/')
}

export async function fetchStressScore(symbol: string): Promise<ApiResponse<StressScore>> {
  return fetchApi<StressScore>(`/api/stress-scores/${symbol}`)
}

export async function fetchActiveWeather(): Promise<ApiResponse<WeatherData>> {
  return fetchApi<WeatherData>('/api/weather/active')
}

export async function fetchGraph(): Promise<ApiResponse<GraphData>> {
  return fetchApi<GraphData>('/api/graph/')
}

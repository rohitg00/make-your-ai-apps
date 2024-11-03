import { create } from 'zustand'
import axios from 'axios'

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  avgSessionDuration: number
  bounceRate: number
  topPages: Array<{ path: string; views: number }>
  userFlow: Array<{ from: string; to: string; count: number }>
  deployments: Array<{
    id: string
    status: string
    environment: string
    createdAt: string
  }>
  errors: Array<{
    message: string
    count: number
    lastOccurred: string
  }>
}

interface AnalyticsStore {
  data: AnalyticsData | null
  loading: boolean
  error: string | null
  timeRange: 'day' | 'week' | 'month'
  fetchAnalytics: (projectId: string) => Promise<void>
  setTimeRange: (range: 'day' | 'week' | 'month') => void
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  data: null,
  loading: false,
  error: null,
  timeRange: 'week',
  fetchAnalytics: async (projectId) => {
    try {
      set({ loading: true, error: null })
      const response = await axios.get(`/api/analytics/${projectId}`)
      set({ data: response.data, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch analytics', loading: false })
    }
  },
  setTimeRange: (range) => set({ timeRange: range }),
})) 
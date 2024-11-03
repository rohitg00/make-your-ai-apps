'use client'

import { useEffect } from 'react'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { OverviewStats } from './OverviewStats'
import { PageViews } from './PageViews'
import { UserFlow } from './UserFlow'
import { Deployments } from './Deployments'
import { ErrorLog } from './ErrorLog'

interface DashboardProps {
  projectId: string
}

export function Dashboard({ projectId }: DashboardProps) {
  const { data, loading, error, fetchAnalytics, timeRange, setTimeRange } = useAnalyticsStore()

  useEffect(() => {
    fetchAnalytics(projectId)
    const interval = setInterval(() => fetchAnalytics(projectId), 30000)
    return () => clearInterval(interval)
  }, [projectId, timeRange, fetchAnalytics])

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!data) {
    return <div>No analytics data available</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="rounded-md border-gray-300"
        >
          <option value="day">Last 24 hours</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
      </div>

      <OverviewStats
        pageViews={data.pageViews}
        uniqueVisitors={data.uniqueVisitors}
        avgSessionDuration={data.avgSessionDuration}
        bounceRate={data.bounceRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PageViews data={data.topPages} />
        <UserFlow data={data.userFlow} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Deployments data={data.deployments} />
        <ErrorLog data={data.errors} />
      </div>
    </div>
  )
} 
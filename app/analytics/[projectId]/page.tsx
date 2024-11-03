'use client'

import { Dashboard } from '@/components/analytics/Dashboard'

export default function AnalyticsPage({
  params
}: {
  params: { projectId: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard projectId={params.projectId} />
    </div>
  )
} 
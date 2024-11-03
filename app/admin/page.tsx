'use client'

import React from 'react'
import { EventStream } from '@/components/admin/EventStream'
import { useParams } from 'next/navigation'

export default function AdminPage() {
  const params = useParams()
  const projectId = params.projectId as string

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-[calc(100vh-8rem)]">
            <EventStream projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  )
} 
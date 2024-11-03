'use client'

import React, { useEffect, useState } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { formatDistanceToNow } from 'date-fns'

interface Event {
  id: string
  type: string
  data: any
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
}

interface EventStreamProps {
  projectId: string
}

export function EventStream({ projectId }: EventStreamProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [filter, setFilter] = useState<string>('all')
  const socket = useWebSocket(`ws://localhost:1337/events/${projectId}`)

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const newEvent = JSON.parse(event.data)
        setEvents((prev) => [newEvent, ...prev].slice(0, 100))
      }
    }
  }, [socket])

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true
    return event.type === filter
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Event Stream</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-gray-300"
        >
          <option value="all">All Events</option>
          <option value="build">Build Events</option>
          <option value="deploy">Deploy Events</option>
          <option value="error">Errors</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className={`p-4 border-b hover:bg-gray-50 ${
              event.status === 'failed' ? 'bg-red-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium">{event.type}</span>
                <span className="ml-2 text-sm text-gray-500">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </span>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  event.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : event.status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {event.status}
              </span>
            </div>
            <pre className="mt-2 text-sm text-gray-600 overflow-x-auto">
              {JSON.stringify(event.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
} 
'use client'

import React from 'react'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Build Your Web App in Minutes
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Create professional web applications without coding. Choose from templates,
            customize your design, and launch your app with our intuitive builder platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/builder"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start Building
            </Link>
            <Link href="/templates" className="text-sm font-semibold leading-6 text-gray-900">
              View Templates <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
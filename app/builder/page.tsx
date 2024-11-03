'use client'

import React from 'react'
import { BuilderCanvas } from '@/components/builder/BuilderCanvas'
import { ComponentPanel } from '@/components/builder/ComponentPanel'
import { PropertiesPanel } from '@/components/builder/PropertiesPanel'

export default function BuilderPage() {
  return (
    <div className="flex h-screen">
      <ComponentPanel />
      <BuilderCanvas />
      <PropertiesPanel />
    </div>
  )
} 
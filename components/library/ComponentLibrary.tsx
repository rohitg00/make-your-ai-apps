'use client'

import React from 'react'
import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { useBuilderStore } from '@/store/builderStore'
import { v4 as uuidv4 } from 'uuid'

interface LibraryComponent {
  id: string
  name: string
  category: string
  icon: string
  defaultProps: Record<string, any>
  preview: React.ReactNode
}

const components: LibraryComponent[] = [
  // Layout Components
  {
    id: 'container',
    name: 'Container',
    category: 'Layout',
    icon: '🔲',
    defaultProps: {
      padding: '16px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    preview: <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg" />,
  },
  {
    id: 'grid',
    name: 'Grid',
    category: 'Layout',
    icon: '📏',
    defaultProps: {
      columns: 2,
      gap: '16px',
    },
    preview: (
      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 bg-gray-100 rounded" />
        <div className="h-16 bg-gray-100 rounded" />
      </div>
    ),
  },

  // Basic Components
  {
    id: 'text',
    name: 'Text',
    category: 'Basic',
    icon: '📝',
    defaultProps: {
      content: 'Text block',
      fontSize: '16px',
      color: '#000000',
    },
    preview: <p className="text-gray-600">Text block</p>,
  },
  {
    id: 'button',
    name: 'Button',
    category: 'Basic',
    icon: '🔘',
    defaultProps: {
      text: 'Click me',
      variant: 'primary',
      size: 'medium',
    },
    preview: (
      <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">
        Click me
      </button>
    ),
  },

  // Form Components
  {
    id: 'input',
    name: 'Input',
    category: 'Form',
    icon: '✏️',
    defaultProps: {
      placeholder: 'Enter text...',
      type: 'text',
      label: 'Label',
    },
    preview: (
      <div>
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Enter text..."
        />
      </div>
    ),
  },
  {
    id: 'form',
    name: 'Form',
    category: 'Form',
    icon: '📋',
    defaultProps: {
      fields: [],
      submitText: 'Submit',
    },
    preview: (
      <form className="space-y-4">
        <div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md">
          Submit
        </button>
      </form>
    ),
  },

  // Data Display
  {
    id: 'table',
    name: 'Table',
    category: 'Data',
    icon: '🗃️',
    defaultProps: {
      columns: [],
      data: [],
    },
    preview: (
      <div className="border rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Column 1
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Column 2
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Data 1
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Data 2
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
]

const categories = ['All', 'Layout', 'Basic', 'Form', 'Data']

export function ComponentLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const addComponent = useBuilderStore((state) => state.addComponent)

  const filteredComponents = selectedCategory === 'All'
    ? components
    : components.filter(c => c.category === selectedCategory)

  const handleDragStart = (component: LibraryComponent) => (event: React.DragEvent) => {
    event.dataTransfer.setData('component', JSON.stringify({
      type: component.id,
      props: component.defaultProps,
    }))
  }

  const handleClick = (component: LibraryComponent) => {
    addComponent({
      id: uuidv4(),
      type: component.id,
      props: { ...component.defaultProps },
      children: [],
    })
  }

  return (
    <div className="h-full flex flex-col">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-indigo-900/20 p-1">
          {categories.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                 ${selected
                  ? 'bg-white text-indigo-700 shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                }`
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>

      <div className="flex-1 overflow-y-auto mt-4">
        <div className="grid grid-cols-2 gap-4 p-4">
          {filteredComponents.map((component) => (
            <div
              key={component.id}
              draggable
              onDragStart={handleDragStart(component)}
              onClick={() => handleClick(component)}
              className="border rounded-lg p-4 cursor-move hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-center mb-2">
                <span className="mr-2">{component.icon}</span>
                <span className="font-medium">{component.name}</span>
              </div>
              <div className="mt-2">{component.preview}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 
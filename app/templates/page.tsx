'use client'

import { useState } from 'react'
import { templates } from '@/lib/templates'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/store/projectStore'

const categories = ['All', 'Marketing', 'Application', 'E-commerce', 'Blog']

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const router = useRouter()
  const { createProject } = useProjectStore()

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(template => template.category === selectedCategory)

  const handleTemplateSelect = async (template: typeof templates[0]) => {
    const project = await createProject({
      name: `New ${template.name}`,
      description: template.description,
      components: template.components,
    })
    router.push(`/builder/${project.id}`)
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
        <p className="mt-2 text-gray-600">Choose a template to start your project</p>
      </div>

      <div className="mb-8">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{template.name}</h3>
              <p className="mt-1 text-gray-600">{template.description}</p>
              <button
                onClick={() => handleTemplateSelect(template)}
                className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
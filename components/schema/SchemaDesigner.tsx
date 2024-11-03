'use client'

import { useState } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Field {
  id: string
  name: string
  type: string
  required: boolean
  unique: boolean
  defaultValue?: string
}

interface Model {
  id: string
  name: string
  fields: Field[]
  relations: Relation[]
}

interface Relation {
  id: string
  name: string
  type: 'oneToOne' | 'oneToMany' | 'manyToMany'
  fromModel: string
  toModel: string
}

export function SchemaDesigner() {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  const addModel = () => {
    const newModel: Model = {
      id: crypto.randomUUID(),
      name: 'NewModel',
      fields: [],
      relations: [],
    }
    setModels([...models, newModel])
    setSelectedModel(newModel.id)
  }

  const addField = (modelId: string) => {
    setModels(models.map(model => {
      if (model.id === modelId) {
        return {
          ...model,
          fields: [...model.fields, {
            id: crypto.randomUUID(),
            name: 'newField',
            type: 'string',
            required: false,
            unique: false,
          }],
        }
      }
      return model
    }))
  }

  const updateField = (modelId: string, fieldId: string, updates: Partial<Field>) => {
    setModels(models.map(model => {
      if (model.id === modelId) {
        return {
          ...model,
          fields: model.fields.map(field => 
            field.id === fieldId ? { ...field, ...updates } : field
          ),
        }
      }
      return model
    }))
  }

  const deleteField = (modelId: string, fieldId: string) => {
    setModels(models.map(model => {
      if (model.id === modelId) {
        return {
          ...model,
          fields: model.fields.filter(field => field.id !== fieldId),
        }
      }
      return model
    }))
  }

  const generatePrismaSchema = () => {
    let schema = 'datasource db {\n  provider = "postgresql"\n  url = env("DATABASE_URL")\n}\n\n'
    schema += 'generator client {\n  provider = "prisma-client-js"\n}\n\n'

    models.forEach(model => {
      schema += `model ${model.name} {\n`
      model.fields.forEach(field => {
        schema += `  ${field.name} ${field.type}${field.required ? '' : '?'}`
        if (field.unique) schema += ' @unique'
        if (field.defaultValue) schema += ` @default(${field.defaultValue})`
        schema += '\n'
      })
      schema += '}\n\n'
    })

    return schema
  }

  return (
    <div className="flex h-full">
      <div className="w-64 border-r p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Models</h2>
          <button
            onClick={addModel}
            className="p-1 rounded hover:bg-gray-100"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`w-full text-left px-3 py-2 rounded ${
                selectedModel === model.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {selectedModel && (
        <div className="flex-1 p-6">
          <div className="mb-6">
            <input
              type="text"
              value={models.find(m => m.id === selectedModel)?.name}
              onChange={(e) => {
                setModels(models.map(model => 
                  model.id === selectedModel ? { ...model, name: e.target.value } : model
                ))
              }}
              className="text-2xl font-bold border-none focus:ring-0 w-full"
            />
          </div>

          <div className="space-y-4">
            {models
              .find(m => m.id === selectedModel)
              ?.fields.map(field => (
                <div key={field.id} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateField(selectedModel, field.id, { name: e.target.value })}
                    className="flex-1 rounded-md border-gray-300"
                    placeholder="Field name"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => updateField(selectedModel, field.id, { type: e.target.value })}
                    className="rounded-md border-gray-300"
                  >
                    <option value="String">String</option>
                    <option value="Int">Integer</option>
                    <option value="Boolean">Boolean</option>
                    <option value="DateTime">DateTime</option>
                  </select>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(selectedModel, field.id, { required: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600"
                    />
                    <span className="ml-2">Required</span>
                  </label>
                  <button
                    onClick={() => deleteField(selectedModel, field.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>

          <button
            onClick={() => addField(selectedModel)}
            className="mt-4 flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Field
          </button>
        </div>
      )}
    </div>
  )
} 
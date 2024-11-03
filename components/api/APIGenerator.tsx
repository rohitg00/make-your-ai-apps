'use client'

import { useState } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Endpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  auth: boolean
  params: Parameter[]
  response: string
}

interface Parameter {
  id: string
  name: string
  type: string
  required: boolean
  description: string
}

export function APIGenerator() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)

  const addEndpoint = () => {
    const newEndpoint: Endpoint = {
      id: crypto.randomUUID(),
      method: 'GET',
      path: '/api/new-endpoint',
      description: 'New endpoint description',
      auth: false,
      params: [],
      response: '{\n  "success": true\n}'
    }
    setEndpoints([...endpoints, newEndpoint])
    setSelectedEndpoint(newEndpoint.id)
  }

  const addParameter = (endpointId: string) => {
    setEndpoints(endpoints.map(endpoint => {
      if (endpoint.id === endpointId) {
        return {
          ...endpoint,
          params: [...endpoint.params, {
            id: crypto.randomUUID(),
            name: 'newParam',
            type: 'string',
            required: false,
            description: 'Parameter description'
          }]
        }
      }
      return endpoint
    }))
  }

  const generateAPICode = () => {
    let code = ''
    endpoints.forEach(endpoint => {
      code += `
// ${endpoint.description}
export async function ${endpoint.method.toLowerCase()}${endpoint.path.split('/').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}(
  ${endpoint.params.map(p => `${p.name}${p.required ? '' : '?'}: ${p.type}`).join(',\n  ')}
) {
  ${endpoint.auth ? `if (!session) throw new Error('Unauthorized')` : ''}
  
  try {
    // Implementation here
    ${endpoint.method === 'GET' ? `
    const response = await prisma.${endpoint.path.split('/')[2]}.findMany()
    return response
    ` : ''}
    ${endpoint.method === 'POST' ? `
    const response = await prisma.${endpoint.path.split('/')[2]}.create({
      data: {
        ${endpoint.params.map(p => `${p.name}`).join(',\n        ')}
      }
    })
    return response
    ` : ''}
  } catch (error) {
    throw new Error('Failed to ${endpoint.method.toLowerCase()} ${endpoint.path}')
  }
}
`
    })
    return code
  }

  return (
    <div className="flex h-full">
      <div className="w-64 border-r p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">API Endpoints</h2>
          <button
            onClick={addEndpoint}
            className="p-1 rounded hover:bg-gray-100"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          {endpoints.map(endpoint => (
            <button
              key={endpoint.id}
              onClick={() => setSelectedEndpoint(endpoint.id)}
              className={`w-full text-left px-3 py-2 rounded ${
                selectedEndpoint === endpoint.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'
              }`}
            >
              <span className={`inline-block w-16 ${
                endpoint.method === 'GET' ? 'text-green-600' :
                endpoint.method === 'POST' ? 'text-blue-600' :
                endpoint.method === 'PUT' ? 'text-yellow-600' :
                'text-red-600'
              }`}>{endpoint.method}</span>
              {endpoint.path}
            </button>
          ))}
        </div>
      </div>

      {selectedEndpoint && (
        <div className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Method</label>
              <select
                value={endpoints.find(e => e.id === selectedEndpoint)?.method}
                onChange={(e) => {
                  setEndpoints(endpoints.map(endpoint =>
                    endpoint.id === selectedEndpoint
                      ? { ...endpoint, method: e.target.value as Endpoint['method'] }
                      : endpoint
                  ))
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Path</label>
              <input
                type="text"
                value={endpoints.find(e => e.id === selectedEndpoint)?.path}
                onChange={(e) => {
                  setEndpoints(endpoints.map(endpoint =>
                    endpoint.id === selectedEndpoint
                      ? { ...endpoint, path: e.target.value }
                      : endpoint
                  ))
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Parameters</label>
              <div className="mt-2 space-y-2">
                {endpoints
                  .find(e => e.id === selectedEndpoint)
                  ?.params.map(param => (
                    <div key={param.id} className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={param.name}
                        onChange={(e) => {
                          setEndpoints(endpoints.map(endpoint =>
                            endpoint.id === selectedEndpoint
                              ? {
                                  ...endpoint,
                                  params: endpoint.params.map(p =>
                                    p.id === param.id
                                      ? { ...p, name: e.target.value }
                                      : p
                                  )
                                }
                              : endpoint
                          ))
                        }}
                        className="flex-1 rounded-md border-gray-300"
                        placeholder="Parameter name"
                      />
                      <select
                        value={param.type}
                        onChange={(e) => {
                          setEndpoints(endpoints.map(endpoint =>
                            endpoint.id === selectedEndpoint
                              ? {
                                  ...endpoint,
                                  params: endpoint.params.map(p =>
                                    p.id === param.id
                                      ? { ...p, type: e.target.value }
                                      : p
                                  )
                                }
                              : endpoint
                          ))
                        }}
                        className="rounded-md border-gray-300"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                      </select>
                      <button
                        onClick={() => {
                          setEndpoints(endpoints.map(endpoint =>
                            endpoint.id === selectedEndpoint
                              ? {
                                  ...endpoint,
                                  params: endpoint.params.filter(p => p.id !== param.id)
                                }
                              : endpoint
                          ))
                        }}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                <button
                  onClick={() => addParameter(selectedEndpoint)}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Parameter
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Response Example</label>
              <textarea
                value={endpoints.find(e => e.id === selectedEndpoint)?.response}
                onChange={(e) => {
                  setEndpoints(endpoints.map(endpoint =>
                    endpoint.id === selectedEndpoint
                      ? { ...endpoint, response: e.target.value }
                      : endpoint
                  ))
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm font-mono"
                rows={5}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
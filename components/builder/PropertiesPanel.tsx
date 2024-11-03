import { useBuilderStore } from '@/store/builderStore'

export function PropertiesPanel() {
  const selectedComponent = useBuilderStore((state) => state.selectedComponent)
  const components = useBuilderStore((state) => state.components)
  const updateComponent = useBuilderStore((state) => state.updateComponent)

  const component = components.find((c) => c.id === selectedComponent)

  if (!component) {
    return (
      <div className="w-64 bg-gray-100 p-4 border-l border-gray-200">
        <p className="text-gray-500">Select a component to edit its properties</p>
      </div>
    )
  }

  const handlePropertyChange = (key: string, value: any) => {
    updateComponent(component.id, {
      props: { ...component.props, [key]: value }
    })
  }

  return (
    <div className="w-64 bg-gray-100 p-4 border-l border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Properties</h2>
      <div className="space-y-4">
        {Object.entries(component.props).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {key}
            </label>
            <input
              type="text"
              value={value as string}
              onChange={(e) => handlePropertyChange(key, e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  )
} 
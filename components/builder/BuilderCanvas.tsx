import { useBuilderStore } from '@/store/builderStore'
import { ComponentRenderer } from './ComponentRenderer'

export function BuilderCanvas() {
  const components = useBuilderStore((state) => state.components)
  const selectComponent = useBuilderStore((state) => state.selectComponent)
  const selectedComponent = useBuilderStore((state) => state.selectedComponent)

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="min-h-[calc(100vh-4rem)] bg-white rounded-lg shadow-sm p-4">
        {components.map((component) => (
          <div
            key={component.id}
            onClick={() => selectComponent(component.id)}
            className={`relative ${
              selectedComponent === component.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <ComponentRenderer component={component} />
          </div>
        ))}
        {components.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400">
            Drag components here to start building
          </div>
        )}
      </div>
    </div>
  )
} 
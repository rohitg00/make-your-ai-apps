import { Component } from '@/store/builderStore'

const componentMap: Record<string, React.FC<any>> = {
  Container: ({ padding, width, children }) => (
    <div style={{ padding, width }}>{children}</div>
  ),
  Text: ({ content, fontSize }) => (
    <p style={{ fontSize }}>{content}</p>
  ),
  Button: ({ text, variant }) => (
    <button
      className={`px-4 py-2 rounded ${
        variant === 'primary'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-800'
      }`}
    >
      {text}
    </button>
  ),
  Image: ({ src, alt, width }) => (
    <img src={src || '/placeholder.png'} alt={alt} style={{ width }} />
  ),
  Form: ({ fields, submitText }) => (
    <form className="space-y-4">
      {fields.map((field: any, index: number) => (
        <div key={index} className="space-y-1">
          <label className="text-sm font-medium">{field.label}</label>
          <input
            type={field.type}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      ))}
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        {submitText}
      </button>
    </form>
  )
}

interface ComponentRendererProps {
  component: Component
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const Component = componentMap[component.type]
  
  if (!Component) {
    return <div>Unknown component type: {component.type}</div>
  }

  return (
    <Component {...component.props}>
      {component.children?.map((child) => (
        <ComponentRenderer key={child.id} component={child} />
      ))}
    </Component>
  )
} 
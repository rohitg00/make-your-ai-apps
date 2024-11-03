import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useBuilderStore } from '@/store/builderStore'
import { v4 as uuidv4 } from 'uuid'

const COMPONENT_TEMPLATES = [
  {
    type: 'Container',
    icon: '🔲',
    defaultProps: { padding: '16px', width: '100%' }
  },
  {
    type: 'Text',
    icon: '📝',
    defaultProps: { content: 'Text block', fontSize: '16px' }
  },
  {
    type: 'Button',
    icon: '🔘',
    defaultProps: { text: 'Click me', variant: 'primary' }
  },
  {
    type: 'Image',
    icon: '🖼️',
    defaultProps: { src: '', alt: '', width: '200px' }
  },
  {
    type: 'Form',
    icon: '📋',
    defaultProps: { fields: [], submitText: 'Submit' }
  }
]

export function ComponentPanel() {
  const addComponent = useBuilderStore((state) => state.addComponent)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const componentType = COMPONENT_TEMPLATES[result.source.index].type
    const template = COMPONENT_TEMPLATES.find(t => t.type === componentType)

    if (template) {
      addComponent({
        id: uuidv4(),
        type: componentType,
        props: { ...template.defaultProps },
        children: []
      })
    }
  }

  return (
    <div className="w-64 bg-gray-100 p-4 border-r border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="components">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {COMPONENT_TEMPLATES.map((component, index) => (
                <Draggable
                  key={component.type}
                  draggableId={component.type}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-move"
                    >
                      <span className="mr-2">{component.icon}</span>
                      {component.type}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
} 
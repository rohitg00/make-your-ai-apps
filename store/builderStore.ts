import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

interface Component {
  id: string
  type: string
  props: Record<string, any>
  children?: Component[]
}

interface DeploymentConfig {
  // Add your DeploymentConfig properties here
}

interface ThemeConfig {
  // Add your ThemeConfig properties here
}

interface ComponentTemplate {
  // Add your ComponentTemplate properties here
}

interface LayoutTemplate {
  // Add your LayoutTemplate properties here
}

interface BuilderStore {
  components: Component[]
  selectedComponent: string | null
  addComponent: (component: Component) => void
  updateComponent: (id: string, props: Partial<Component>) => void
  selectComponent: (id: string | null) => void
  removeComponent: (id: string) => void
  moveComponent: (dragIndex: number, hoverIndex: number) => void
  duplicateComponent: (id: string) => void
  projectState: {
    version: string
    lastModified: Date
    collaborators: string[]
    deployments: DeploymentConfig[]
  }
  designSystem: {
    theme: ThemeConfig
    components: ComponentTemplate[]
    layouts: LayoutTemplate[]
  }
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  components: [],
  selectedComponent: null,
  addComponent: (component) =>
    set((state) => ({ components: [...state.components, component] })),
  updateComponent: (id, props) =>
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, ...props } : c
      ),
    })),
  selectComponent: (id) => set({ selectedComponent: id }),
  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
    })),
  moveComponent: (dragIndex, hoverIndex) =>
    set((state) => {
      const newComponents = [...state.components]
      const [removed] = newComponents.splice(dragIndex, 1)
      newComponents.splice(hoverIndex, 0, removed)
      return { components: newComponents }
    }),
  duplicateComponent: (id) =>
    set((state) => {
      const component = state.components.find((c) => c.id === id)
      if (!component) return state
      const newComponent = {
        ...component,
        id: uuidv4(),
      }
      return { components: [...state.components, newComponent] }
    }),
})) 
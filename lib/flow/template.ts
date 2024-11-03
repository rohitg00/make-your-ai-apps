// Need to implement flow template system similar to cofounder's template.tsx
export interface FlowTemplate {
  metrics: {
    PADDING_X: number
    PADDING_Y: number
    DIST_X: number
    DIST_Y: number
  }
  layers: Record<string, any>
  nodes: Record<string, { position: { x: number, y: number } }>
  edges: Array<{
    id: string
    source: string
    target: string
    animated?: boolean
    style?: any
    type?: string
    markerEnd?: any
  }>
} 
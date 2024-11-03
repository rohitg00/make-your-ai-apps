// Need to implement state management based on webappViewIterate
export interface ProjectState {
  operations: {
    id: string
    type: 'start' | 'end'
    content: {
      key: string
      data: any
    }
  }[]
  dependencies: Record<string, string>
  analysis: string[]
  tsx: string[]
} 
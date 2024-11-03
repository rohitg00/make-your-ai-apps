// Need to implement UI iteration system based on cofounder's _iterateUiComponent
export interface UIIterationConfig {
  project: any
  views: {
    [id: string]: {
      [version: string]: {
        user: {
          text: string
          attachments: any[]
        }
        screenshot?: {
          base64: string | false
        }
        designer: boolean
      }
    }
  }
} 
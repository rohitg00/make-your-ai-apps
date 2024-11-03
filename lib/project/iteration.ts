import { ProjectManager } from './manager'
import { SwarmValidator } from '../swarm/validator'
import { SwarmAutofix } from '../swarm/autofix'
import PQueue from 'p-queue'

interface IterationConfig {
  projectId: string
  changes: {
    type: 'component' | 'schema' | 'api'
    data: any
  }[]
  redesign?: {
    timestamp: string
    guidance: any
    rag: any
    primitivesIds: string[]
  }
  details?: {
    design?: {
      aesthetics?: {
        text: string
      }
    }
  }
  notes?: {
    text: string
  }
}

export class ProjectIterator {
  private projectManager: ProjectManager
  private validator: SwarmValidator
  private autofix: SwarmAutofix
  private queue: PQueue

  constructor() {
    this.projectManager = new ProjectManager()
    this.validator = new SwarmValidator()
    this.autofix = new SwarmAutofix()
    this.queue = new PQueue({ concurrency: 1 })
  }

  async iterate(config: IterationConfig): Promise<void> {
    await this.queue.add(async () => {
      try {
        // Validate current state
        const validationResult = await this.validator.validateProject(config.projectId)
        if (!validationResult.valid) {
          // Try to autofix issues
          const fixResult = await this.autofix.fix(config.projectId, validationResult)
          if (!fixResult.fixed) {
            throw new Error('Unable to fix validation issues')
          }
        }

        // Apply changes
        await this.applyChanges(config.changes)

        // Validate new state
        const newValidationResult = await this.validator.validateProject(config.projectId)
        if (!newValidationResult.valid) {
          throw new Error('Changes resulted in invalid state')
        }

      } catch (error) {
        console.error('Iteration failed:', error)
        throw error
      }
    })
  }

  private async applyChanges(changes: IterationConfig['changes']): Promise<void> {
    for (const change of changes) {
      switch (change.type) {
        case 'component':
          await this.applyComponentChange(change.data)
          break
        case 'schema':
          await this.applySchemaChange(change.data)
          break
        case 'api':
          await this.applyAPIChange(change.data)
          break
      }
    }
  }

  private async applyComponentChange(data: any): Promise<void> {
    // Component change implementation
  }

  private async applySchemaChange(data: any): Promise<void> {
    // Schema change implementation
  }

  private async applyAPIChange(data: any): Promise<void> {
    // API change implementation
  }
} 
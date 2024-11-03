// Project management system
export interface ProjectManager {
  init: (config: ProjectConfig) => Promise<void>
  generate: (template: string) => Promise<void>
  validate: () => Promise<ValidationResult>
  deploy: (env: string) => Promise<DeploymentResult>
} 
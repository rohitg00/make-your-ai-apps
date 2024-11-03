import express from 'express'
import cors from 'cors'
import { PGlite } from '@electric-sql/pglite'
import { ProjectManager } from '../project'
import { SwarmValidator } from '../swarm/validator'
import { SwarmAutofix } from '../swarm/autofix'

export class LocalAPIServer {
  private app: express.Application
  private postgres: PGlite
  private projectManager: ProjectManager
  private validator: SwarmValidator
  private autofix: SwarmAutofix

  constructor() {
    this.app = express()
    this.postgres = new PGlite('./db')
    this.setupMiddleware()
    this.setupRoutes()
  }

  private setupMiddleware() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  private setupRoutes() {
    this.app.post('/project/init', this.handleProjectInit)
    this.app.post('/project/generate', this.handleProjectGenerate)
    this.app.post('/project/validate', this.handleProjectValidate)
    this.app.post('/project/deploy', this.handleProjectDeploy)
  }

  private handleProjectInit = async (req: express.Request, res: express.Response) => {
    try {
      const { config } = req.body
      await this.projectManager.init(config)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Add other handlers...

  public start(port: number = 1337) {
    this.app.listen(port, () => {
      console.log(`Local API server running on port ${port}`)
    })
  }
} 
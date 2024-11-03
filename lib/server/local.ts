import express from 'express'
import cors from 'cors'
import { WebContainer } from '@webcontainer/api'
import { ProjectManager } from '../project/manager'
import { PlatformAdapter } from '../platforms/adapter'

const SERVER_LOCAL_URL = 'http://localhost:1337'

export class LocalDevServer {
  private app: express.Application
  private webcontainer: WebContainer | null = null
  private projectManager: ProjectManager
  private platformAdapter: PlatformAdapter

  constructor() {
    this.app = express()
    this.projectManager = new ProjectManager()
    this.platformAdapter = new PlatformAdapter()

    // Middleware
    this.app.use(cors())
    this.app.use(express.json())

    // Routes
    this.setupRoutes()
  }

  private setupRoutes() {
    // Project actions endpoint (from genui-view.tsx lines 156-217)
    this.app.post('/project/actions', async (req, res) => {
      const { project, query } = req.body

      try {
        switch (query.action) {
          case 'regenerate:ui':
            await this.handleRegenerateUI(project, query.data)
            break
          case 'iterate:ui':
            await this.handleIterateUI(project, query.data)
            break
          default:
            throw new Error(`Unknown action: ${query.action}`)
        }
        res.json({ success: true })
      } catch (error) {
        console.error('Project action error:', error)
        res.status(500).json({ error: 'Failed to process project action' })
      }
    })

    // Platform-specific endpoints
    this.app.post('/platform/:type/build', async (req, res) => {
      const { type } = req.params
      const { projectPath } = req.body

      try {
        await this.platformAdapter.buildPlatform(type as any, projectPath)
        res.json({ success: true })
      } catch (error) {
        res.status(500).json({ error: 'Build failed' })
      }
    })
  }

  private async handleRegenerateUI(project: any, data: { views: string }) {
    // Implementation based on genui-view.tsx regenerateComponent
    await this.projectManager.regenerateComponent(project, data.views)
  }

  private async handleIterateUI(project: any, data: any) {
    // Implementation based on genui-view.tsx iterateComponent
    const viewId = Object.keys(data.views)[0]
    const choice = Object.keys(data.views[viewId])[0]
    const viewData = data.views[viewId][choice]

    await this.projectManager.iterateComponent(project, {
      viewId,
      choice,
      notes: viewData.notes,
      screenshot: viewData.screenshot,
      designer: viewData.designer
    })
  }

  async start(port: number = 1337) {
    try {
      // Initialize WebContainer
      this.webcontainer = await WebContainer.boot()
      
      // Start express server
      this.app.listen(port, () => {
        console.log(`Local development server running at ${SERVER_LOCAL_URL}`)
      })
    } catch (error) {
      console.error('Failed to start local development server:', error)
      throw error
    }
  }

  async stop() {
    if (this.webcontainer) {
      await this.webcontainer.teardown()
    }
  }
} 
import { WebContainer } from '@webcontainer/api'

export class LocalDevEnvironment {
  private container: WebContainer | null = null
  private serverUrl: string | null = null

  async init() {
    try {
      this.container = await WebContainer.boot()
      await this.setupFiles()
      await this.startDevServer()
    } catch (error) {
      console.error('Failed to initialize WebContainer:', error)
      throw error
    }
  }

  private async setupFiles() {
    if (!this.container) throw new Error('WebContainer not initialized')

    await this.container.mount({
      'package.json': {
        file: {
          contents: JSON.stringify({
            name: 'local-dev',
            type: 'module',
            dependencies: {
              express: 'latest',
              nodemon: 'latest'
            },
            scripts: {
              start: 'nodemon server.js'
            }
          })
        }
      },
      'server.js': {
        file: {
          contents: `
            import express from 'express';
            const app = express();
            const port = 3000;
            
            app.get('/', (req, res) => {
              res.send('Local dev server running!');
            });
            
            app.listen(port, () => {
              console.log(\`Server running at http://localhost:\${port}\`);
            });
          `
        }
      }
    })
  }

  private async startDevServer() {
    if (!this.container) throw new Error('WebContainer not initialized')

    // Install dependencies
    const installProcess = await this.container.spawn('npm', ['install'])
    await installProcess.exit

    // Start the dev server
    const serverProcess = await this.container.spawn('npm', ['start'])

    // Wait for server to be ready
    serverProcess.output.pipeTo(new WritableStream({
      write: (chunk) => {
        if (chunk.includes('Server running at')) {
          this.serverUrl = 'http://localhost:3000'
        }
      }
    }))
  }

  async installDependency(name: string, version: string = 'latest') {
    if (!this.container) throw new Error('WebContainer not initialized')
    const process = await this.container.spawn('npm', ['install', `${name}@${version}`])
    return process.exit
  }

  async writeFile(path: string, contents: string) {
    if (!this.container) throw new Error('WebContainer not initialized')
    await this.container.fs.writeFile(path, contents)
  }

  async readFile(path: string): Promise<string> {
    if (!this.container) throw new Error('WebContainer not initialized')
    const file = await this.container.fs.readFile(path)
    return file.text()
  }

  getServerUrl(): string {
    if (!this.serverUrl) throw new Error('Dev server not started')
    return this.serverUrl
  }
} 
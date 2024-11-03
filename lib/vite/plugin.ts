import { Plugin } from 'vite'
import { build } from 'esbuild'
import { join } from 'path'
import fs from 'fs/promises'

interface CofounderPluginOptions {
  exclude?: string[]
  optimize?: boolean
  platform?: 'web' | 'mobile'
}

export function cofounderPlugin(options: CofounderPluginOptions = {}): Plugin {
  const {
    exclude = [],
    optimize = true,
    platform = 'web'
  } = options

  return {
    name: 'cofounder-plugin',
    
    async config(config) {
      // Modify Vite config based on platform
      if (platform === 'mobile') {
        return {
          ...config,
          build: {
            ...config.build,
            target: 'esnext',
            rollupOptions: {
              external: ['react-native']
            }
          }
        }
      }
      return config
    },

    async transform(code, id) {
      // Skip excluded files
      if (exclude.some(pattern => id.includes(pattern))) {
        return null
      }

      // Optimize code if enabled
      if (optimize) {
        const result = await build({
          stdin: {
            contents: code,
            loader: 'tsx'
          },
          write: false,
          minify: true,
          target: 'esnext'
        })
        return result.outputFiles[0].text
      }

      return null
    },

    async generateBundle(_, bundle) {
      // Add platform-specific polyfills
      if (platform === 'mobile') {
        bundle['polyfills.js'] = {
          type: 'chunk',
          fileName: 'polyfills.js',
          code: await fs.readFile(
            join(__dirname, 'mobile-polyfills.js'),
            'utf-8'
          )
        }
      }
    },

    async closeBundle() {
      // Generate deployment artifacts
      const outputDir = 'dist'
      await fs.mkdir(outputDir, { recursive: true })

      // Generate deployment config
      const deployConfig = {
        platform,
        timestamp: new Date().toISOString(),
        optimize,
        files: Object.keys(this.getOutputs())
      }

      await fs.writeFile(
        join(outputDir, 'deploy.json'),
        JSON.stringify(deployConfig, null, 2)
      )
    }
  }
} 
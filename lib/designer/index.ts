import { OpenAI } from 'openai'
import { IconRAG } from '../rag/icons'
import { generateColorPalette } from './colors'
import { generateTypography } from './typography'

interface DesignSystemConfig {
  brand: {
    name: string
    industry: string
    values: string[]
  }
  style: {
    modern?: boolean
    minimal?: boolean
    playful?: boolean
    professional?: boolean
  }
  colorPreferences?: {
    primary?: string
    secondary?: string
    exclude?: string[]
  }
}

interface DesignSystem {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    success: string
    warning: string
    error: string
    shades: {
      [key: string]: {
        light: string
        main: string
        dark: string
      }
    }
  }
  typography: {
    fontFamily: {
      heading: string
      body: string
      mono: string
    }
    scale: {
      h1: string
      h2: string
      h3: string
      h4: string
      body: string
      small: string
    }
    weights: {
      light: number
      regular: number
      medium: number
      bold: number
    }
  }
  spacing: {
    unit: number
    scale: number[]
  }
  breakpoints: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  components: {
    [key: string]: {
      variants: string[]
      props: Record<string, any>
      styles: Record<string, any>
    }
  }
}

export class DesignSystemGenerator {
  private openai: OpenAI
  private iconRAG: IconRAG

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.iconRAG = new IconRAG()
  }

  async generate(config: DesignSystemConfig): Promise<DesignSystem> {
    try {
      // Generate color palette
      const colors = await generateColorPalette({
        brand: config.brand,
        preferences: config.colorPreferences
      })

      // Generate typography system
      const typography = await generateTypography({
        style: config.style,
        brand: config.brand
      })

      // Generate spacing and layout system
      const spacing = {
        unit: 4,
        scale: [0, 4, 8, 16, 24, 32, 48, 64, 96]
      }

      const breakpoints = {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      }

      // Generate component styles
      const components = await this.generateComponentStyles({
        colors,
        typography,
        spacing,
        style: config.style
      })

      return {
        colors,
        typography,
        spacing,
        breakpoints,
        components
      }
    } catch (error) {
      console.error('Failed to generate design system:', error)
      throw error
    }
  }

  private async generateComponentStyles(config: any): Promise<DesignSystem['components']> {
    const baseComponents = [
      'button',
      'input',
      'card',
      'modal',
      'navbar',
      'footer'
    ]

    const components: DesignSystem['components'] = {}

    for (const component of baseComponents) {
      const styles = await this.generateComponentStyle(component, config)
      components[component] = styles
    }

    return components
  }

  private async generateComponentStyle(
    component: string,
    config: any
  ): Promise<DesignSystem['components'][string]> {
    const prompt = `Generate a modern, accessible component style for ${component} using these design tokens:
    Colors: ${JSON.stringify(config.colors)}
    Typography: ${JSON.stringify(config.typography)}
    Style preferences: ${JSON.stringify(config.style)}`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })

    const styleData = JSON.parse(response.choices[0].message.content)

    return {
      variants: styleData.variants,
      props: styleData.props,
      styles: styleData.styles
    }
  }

  async exportToTailwind(designSystem: DesignSystem): Promise<string> {
    // Convert design system to Tailwind config
    const config = {
      theme: {
        extend: {
          colors: designSystem.colors,
          fontFamily: designSystem.typography.fontFamily,
          fontSize: designSystem.typography.scale,
          spacing: designSystem.spacing.scale.reduce((acc, val, idx) => {
            acc[idx] = `${val}px`
            return acc
          }, {}),
          screens: designSystem.breakpoints
        }
      }
    }

    return JSON.stringify(config, null, 2)
  }

  async exportToCSS(designSystem: DesignSystem): Promise<string> {
    // Convert design system to CSS variables
    let css = ':root {\n'

    // Add colors
    Object.entries(designSystem.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        css += `  --color-${key}: ${value};\n`
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([shade, color]) => {
          css += `  --color-${key}-${shade}: ${color};\n`
        })
      }
    })

    // Add typography
    Object.entries(designSystem.typography.scale).forEach(([key, value]) => {
      css += `  --font-size-${key}: ${value};\n`
    })

    // Add spacing
    designSystem.spacing.scale.forEach((value, index) => {
      css += `  --spacing-${index}: ${value}px;\n`
    })

    css += '}\n'

    return css
  }
} 
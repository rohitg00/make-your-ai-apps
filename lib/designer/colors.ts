import { OpenAI } from 'openai'
import Color from 'color'

interface ColorPaletteConfig {
  brand: {
    name: string
    industry: string
    values: string[]
  }
  preferences?: {
    primary?: string
    secondary?: string
    exclude?: string[]
  }
}

export async function generateColorPalette(config: ColorPaletteConfig) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const prompt = `Generate a modern color palette for ${config.brand.name} in the ${
    config.brand.industry
  } industry. Brand values: ${config.brand.values.join(
    ', '
  )}. ${
    config.preferences?.primary
      ? `Primary color should be similar to: ${config.preferences.primary}.`
      : ''
  }`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  })

  const suggestedColors = JSON.parse(response.choices[0].message.content)

  // Generate shades and tints
  const colors = {
    primary: suggestedColors.primary,
    secondary: suggestedColors.secondary,
    accent: suggestedColors.accent,
    background: suggestedColors.background,
    text: suggestedColors.text,
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    shades: {}
  }

  // Generate shades for primary and secondary colors
  ;['primary', 'secondary'].forEach((key) => {
    const baseColor = Color(colors[key])
    colors.shades[key] = {
      light: baseColor.lighten(0.2).hex(),
      main: colors[key],
      dark: baseColor.darken(0.2).hex()
    }
  })

  return colors
} 
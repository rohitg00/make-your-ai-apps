import { OpenAI } from 'openai'

interface TypographyConfig {
  style: {
    modern?: boolean
    minimal?: boolean
    playful?: boolean
    professional?: boolean
  }
  brand: {
    name: string
    industry: string
  }
}

export async function generateTypography(config: TypographyConfig) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const prompt = `Suggest font combinations and typography scale for ${
    config.brand.name
  } in the ${config.brand.industry} industry. Style preferences: ${Object.entries(
    config.style
  )
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(', ')}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  })

  const suggestion = JSON.parse(response.choices[0].message.content)

  return {
    fontFamily: {
      heading: suggestion.heading,
      body: suggestion.body,
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    },
    scale: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.75rem',
      h4: '1.5rem',
      body: '1rem',
      small: '0.875rem'
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700
    }
  }
} 
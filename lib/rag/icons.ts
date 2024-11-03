import { OpenAI } from 'openai'
import { createClient } from '@supabase/supabase-js'
import { encode } from 'gpt-3-encoder'

interface IconSearchResult {
  name: string
  path: string
  tags: string[]
  similarity: number
}

export class IconRAG {
  private openai: OpenAI
  private supabase: any
  private collection: string

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    )
    this.collection = 'icons'
  }

  async search(query: string, limit: number = 5): Promise<IconSearchResult[]> {
    // Generate embedding for query
    const embedding = await this.generateEmbedding(query)

    // Search vector store
    const { data: icons, error } = await this.supabase.rpc(
      'match_icons',
      {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: limit
      }
    )

    if (error) throw error

    return icons.map((icon: any) => ({
      name: icon.name,
      path: icon.path,
      tags: icon.tags,
      similarity: icon.similarity
    }))
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    })
    return response.data[0].embedding
  }

  async indexIcon(
    name: string,
    path: string,
    tags: string[]
  ): Promise<void> {
    const text = `${name} ${tags.join(' ')}`
    const embedding = await this.generateEmbedding(text)

    const { error } = await this.supabase
      .from(this.collection)
      .insert({
        name,
        path,
        tags,
        embedding
      })

    if (error) throw error
  }
} 
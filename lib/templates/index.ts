export interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  components: any[]
}

export const templates: Template[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'A modern landing page template with hero, features, and CTA sections',
    category: 'Marketing',
    thumbnail: '/templates/landing-page.png',
    components: [
      {
        id: 'hero-section',
        type: 'Container',
        props: {
          padding: '64px 24px',
          background: 'white',
        },
        children: [
          {
            id: 'hero-content',
            type: 'Text',
            props: {
              content: 'Welcome to our platform',
              fontSize: '48px',
              fontWeight: 'bold',
              textAlign: 'center',
            },
          },
        ],
      },
      // Add more predefined components
    ],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'An admin dashboard template with sidebar, stats, and data tables',
    category: 'Application',
    thumbnail: '/templates/dashboard.png',
    components: [
      // Add dashboard components
    ],
  },
  // Add more templates
]

export function getTemplateById(id: string): Template | undefined {
  return templates.find(template => template.id === id)
}

export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter(template => template.category === category)
} 
import { create } from 'zustand'
import axios from 'axios'

interface Project {
  id: string
  name: string
  description?: string
  components: any
  published: boolean
  createdAt: string
  updatedAt: string
}

interface ProjectStore {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  createProject: (data: Partial<Project>) => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  setCurrentProject: (project: Project | null) => void
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  fetchProjects: async () => {
    try {
      set({ loading: true })
      const response = await axios.get('/api/projects')
      set({ projects: response.data, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch projects', loading: false })
    }
  },
  createProject: async (data) => {
    try {
      set({ loading: true })
      const response = await axios.post('/api/projects', data)
      set((state) => ({
        projects: [response.data, ...state.projects],
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to create project', loading: false })
    }
  },
  updateProject: async (id, data) => {
    try {
      set({ loading: true })
      const response = await axios.put(`/api/projects/${id}`, data)
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? response.data : p
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to update project', loading: false })
    }
  },
  deleteProject: async (id) => {
    try {
      set({ loading: true })
      await axios.delete(`/api/projects/${id}`)
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to delete project', loading: false })
    }
  },
  setCurrentProject: (project) => set({ currentProject: project }),
})) 
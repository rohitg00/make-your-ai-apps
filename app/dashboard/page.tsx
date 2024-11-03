'use client'

import { useEffect } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { projects, loading, fetchProjects, createProject } = useProjectStore()

  useEffect(() => {
    if (session?.user) {
      fetchProjects()
    }
  }, [session, fetchProjects])

  const handleCreateProject = async () => {
    await createProject({
      name: 'New Project',
      description: 'A new app builder project',
      components: [],
    })
  }

  if (!session) {
    return <div>Please sign in to continue</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <button
          onClick={handleCreateProject}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Project
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/builder/${project.id}`)}
            >
              <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                <span>{project.published ? 'Published' : 'Draft'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
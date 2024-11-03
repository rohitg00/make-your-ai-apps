import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"
import { deployProject } from "@/lib/deploy"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { projectId, environment, domain } = json

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true }
    })

    if (!project || project.userId !== session.user.id) {
      return new NextResponse("Project not found", { status: 404 })
    }

    const result = await deployProject({
      projectId,
      environment,
      domain
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Deployment error:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')

    const deployments = await prisma.deployment.findMany({
      where: {
        projectId,
        project: {
          userId: session.user.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(deployments)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
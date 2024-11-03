import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
        userId: session.user.id,
      },
      include: {
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!project) {
      return new NextResponse("Project not found", { status: 404 })
    }

    // Mock analytics data for now
    // In production, this would come from a real analytics service
    const analyticsData = {
      pageViews: Math.floor(Math.random() * 10000),
      uniqueVisitors: Math.floor(Math.random() * 5000),
      avgSessionDuration: Math.floor(Math.random() * 300),
      bounceRate: Math.random() * 100,
      topPages: [
        { path: '/', views: Math.floor(Math.random() * 1000) },
        { path: '/about', views: Math.floor(Math.random() * 1000) },
        { path: '/contact', views: Math.floor(Math.random() * 1000) },
      ],
      userFlow: [
        { from: '/', to: '/about', count: Math.floor(Math.random() * 100) },
        { from: '/about', to: '/contact', count: Math.floor(Math.random() * 100) },
      ],
      deployments: project.deployments,
      errors: [
        {
          message: '404 Not Found',
          count: Math.floor(Math.random() * 50),
          lastOccurred: new Date().toISOString(),
        },
        {
          message: '500 Internal Server Error',
          count: Math.floor(Math.random() * 20),
          lastOccurred: new Date().toISOString(),
        },
      ],
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { TrendingUp, FolderOpen, Mail, User, Edit, FileText, MessageSquare, Eye, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Calculate date ranges
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())

  // Fetch real data
  const [projectsResult, messagesResult, profileResult, recentProjectsResult, oldProjectsResult] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id),
    supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    // Projects created in the last month for recent activity
    supabase
      .from('projects')
      .select('view_count, created_at')
      .eq('user_id', user.id)
      .gte('created_at', lastMonth.toISOString()),
    // Projects created before last month for comparison
    supabase
      .from('projects')
      .select('view_count, created_at')
      .eq('user_id', user.id)
      .lt('created_at', lastMonth.toISOString())
      .gte('created_at', twoMonthsAgo.toISOString())
  ])

  const projects = projectsResult.data || []
  const messages = messagesResult.data || []
  const profile = profileResult.data
  const recentProjects = recentProjectsResult.data || []
  const oldProjects = oldProjectsResult.data || []

  // Calculate statistics
  const totalViews = projects.reduce((sum, project) => sum + (project.view_count || 0), 0)
  const publishedProjects = projects.filter(p => p.status === 'published')
  const featuredProjects = projects.filter(p => p.featured)
  const unreadMessages = messages.filter(m => m.status === 'unread')
  const recentMessages = messages.slice(0, 3)

  // Calculate real percentage changes based on actual data
  const currentMonthViews = recentProjects.reduce((sum, project) => sum + (project.view_count || 0), 0)
  const lastMonthViews = oldProjects.reduce((sum, project) => sum + (project.view_count || 0), 0)
  
  let viewsChange = 'No data yet'
  if (lastMonthViews > 0) {
    const percentChange = ((currentMonthViews - lastMonthViews) / lastMonthViews * 100)
    const sign = percentChange >= 0 ? '+' : ''
    viewsChange = `${sign}${percentChange.toFixed(1)}% from last month`
  } else if (currentMonthViews > 0) {
    viewsChange = `${currentMonthViews} views this month`
  } else if (totalViews > 0) {
    viewsChange = `${totalViews} total views`
  }

  const messagesChange = unreadMessages.length > 0 ? `${unreadMessages.length} unread` : 'All caught up'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Welcome back, {profile?.full_name || user.email}! Here's an overview of your portfolio.
          </p>
        </div>
        <Link href="/dashboard/projects">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Project
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-slate-600">{viewsChange} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-slate-600">
              {publishedProjects.length} published, {featuredProjects.length} featured
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <Mail className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-slate-600">{messagesChange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <User className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.full_name ? 'Complete' : 'Incomplete'}
            </div>
            <p className="text-xs text-slate-600">
              {profile?.full_name ? 'Profile ready' : 'Setup required'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your portfolio's latest updates and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.length > 0 ? (
                recentMessages.map((message) => (
                  <div key={message.id} className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${message.status === 'unread' ? 'bg-blue-500' : 'bg-green-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New Message from {message.name}</p>
                      <p className="text-sm text-slate-600">{message.subject || 'No subject'}</p>
                    </div>
                    <div className="text-xs text-slate-600">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            <Link href="/dashboard/projects">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Manage Projects
              </Button>
            </Link>
            <Link href="/dashboard/messages">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                View Messages
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                View Portfolio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

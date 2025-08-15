import { Suspense } from 'react'
import { createClient } from '@/lib/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/contact-form'
import { ProjectCard } from '@/components/project-card'
import { ProjectCardSkeleton } from '@/components/project-card-skeleton'
import Link from 'next/link'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Await searchParams in Next.js 15
  const params = await searchParams

  // Fetch featured projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
            Hi, I'm <span className="text-blue-600 dark:text-blue-400">Selwyn</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8">
            Full Stack Developer | Designer | Problem Solver
          </p>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            I build modern web applications with cutting-edge technologies. 
            Passionate about creating user experiences that matter.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/#projects">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View My Work
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Download Resume
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                I'm a passionate developer with expertise in modern web technologies. 
                I love building applications that solve real-world problems and 
                provide exceptional user experiences.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                My tech stack includes React, Next.js, TypeScript, Node.js, and 
                various cloud services. I'm always learning and exploring new 
                technologies to stay current in this fast-paced industry.
              </p>
              <div className="flex gap-4">
                <Button variant="outline">View Resume</Button>
                <Link href="/#contact">
                  <Button variant="outline">Contact Me</Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Frontend</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    React, Next.js, TypeScript, Tailwind CSS
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Backend</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Node.js, Supabase, PostgreSQL, APIs
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Git, Docker, Vercel, Figma
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Other</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    UI/UX Design, Testing, CI/CD
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Suspense
              fallback={
                <>
                  <ProjectCardSkeleton />
                  <ProjectCardSkeleton />
                  <ProjectCardSkeleton />
                </>
              }
            >
              {projects?.map((project) => (
                <ProjectCard key={project.id} project={project} showStats={false} />
              ))}
              {(!projects || projects.length === 0) && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-slate-600 dark:text-slate-300">
                    No projects to display yet.
                  </p>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-6">
            Get In Touch
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-12 text-center">
            I'm always interested in new opportunities and exciting projects. 
            Let's work together!
          </p>
          {user ? (
            <Card>
              <CardContent className="pt-6">
                <ContactForm userId={user.id} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Please sign in to send me a message
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/auth/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 dark:text-slate-300">
            © 2025 Selwyn. Built with Next.js and Supabase.
          </p>
        </div>
      </footer>
    </div>
  )
}
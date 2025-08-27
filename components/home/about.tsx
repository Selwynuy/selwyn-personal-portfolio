import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function About() {
  return (
    <section id="about" className="container mx-auto px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  React, Next.js, TypeScript, Tailwind CSS
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Backend</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Node.js, Supabase, PostgreSQL, APIs
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">
                  Git, Docker, Vercel, Figma
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
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
  )
}



import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Code2, Palette, Rocket, Zap, Users } from 'lucide-react'
import { colors } from '@/lib/design-system'

const skills = [
  {
    icon: Code2,
    title: 'Frontend Development',
    description: 'React, Next.js, TypeScript, Tailwind CSS',
    gradient: 'from-blue-600 to-purple-600',
  },
  {
    icon: Zap,
    title: 'Backend Development',
    description: 'Node.js, Supabase, PostgreSQL, REST APIs',
    gradient: 'from-blue-600 to-purple-600',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Figma, Responsive Design, Accessibility',
    gradient: 'from-blue-600 to-purple-600',
  },
  {
    icon: Rocket,
    title: 'DevOps & Tools',
    description: 'Git, Docker, CI/CD, Cloud Deployment',
    gradient: 'from-blue-600 to-purple-600',
  },
]

const stats = [
  { label: 'Years Experience', value: '5+' },
  { label: 'Projects Completed', value: '50+' },
  { label: 'Happy Clients', value: '30+' },
  { label: 'Code Commits', value: '10K+' },
]

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] dark:opacity-[0.05]" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-4 py-1.5">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-sm font-semibold text-transparent dark:from-blue-500 dark:to-purple-500">
                Get to know me
              </span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
              About Me
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Passionate about crafting exceptional digital experiences through clean code and innovative design
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Column - Story */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white/50 p-8 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-2">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    My Journey
                  </h3>
                </div>
                <p className="mb-4 text-slate-600 dark:text-slate-300">
                  I'm a passionate full-stack developer with expertise in modern web technologies.
                  I love building applications that solve real-world problems and provide exceptional user experiences.
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  With a strong foundation in both frontend and backend development, I bring ideas to life
                  through clean, efficient code and thoughtful design. I'm always learning and exploring
                  new technologies to stay current in this fast-paced industry.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex flex-wrap gap-4">
                <Link href="/#contact">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 dark:from-blue-500 dark:to-purple-500"
                  >
                    Contact Me
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Skills Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((skill, index) => (
                <div
                  key={skill.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />

                  <div className="relative">
                    <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${skill.gradient} p-3 shadow-lg`}>
                      <skill.icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="mb-2 font-semibold text-slate-900 dark:text-white">
                      {skill.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {skill.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-500 dark:to-purple-500 md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



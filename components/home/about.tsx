import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Code2, Palette, Rocket, Zap, Users } from 'lucide-react'

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
    <section id="about" className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] dark:opacity-[0.05]" />
      {/* Gradient orbs for light mode */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[15%] top-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.2)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute left-[10%] bottom-[15%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 text-center sm:mb-10">
            <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 px-4 py-1.5">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-sm font-semibold text-transparent dark:from-blue-500 dark:to-purple-500">
                Get to know me
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
              About Me
            </h2>
            <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              Passionate about crafting exceptional digital experiences through clean code and innovative design
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="mb-6 grid gap-4 sm:mb-8 sm:gap-6 lg:grid-cols-[400px_1fr] lg:gap-8 lg:items-stretch">
            {/* Left Column - Big Profile Picture */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative h-80 w-full overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 sm:h-96 lg:h-full">
                <Image
                  src="/Profile.jpg"
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right Column - Description & Skills */}
            <div className="space-y-4 sm:space-y-5">
              {/* Story Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-2">
                    <Users className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">
                    My Journey
                  </h3>
                </div>
                <p className="mb-3 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
                  I&apos;m a passionate full-stack developer with expertise in modern web technologies.
                  I love building applications that solve real-world problems and provide exceptional user experiences.
                </p>
                <p className="mb-4 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
                  With a strong foundation in both frontend and backend development, I bring ideas to life
                  through clean, efficient code and thoughtful design.
                </p>
                <Link href="/#contact">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 dark:from-blue-500 dark:to-purple-500"
                  >
                    Contact Me
                  </Button>
                </Link>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {skills.map((skill, index) => (
                  <div
                    key={skill.title}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-5"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-br ${skill.gradient} p-2.5 shadow-lg`}>
                        <skill.icon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                      </div>
                      <h4 className="mb-1.5 text-sm font-semibold text-slate-900 dark:text-white sm:text-base">
                        {skill.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5">
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-500 dark:to-purple-500 sm:text-4xl md:text-5xl">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
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



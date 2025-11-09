import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ContactForm } from '@/components/contact-form'

interface ContactSectionProps {
  userId?: string | null
}

export function ContactSection({ userId }: ContactSectionProps) {
  return (
    <section id="contact" className="container mx-auto px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-6">
          Get In Touch
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-12 text-center">
          I&apos;m always interested in new opportunities and exciting projects.
          Let&apos;s work together!
        </p>
        {userId ? (
          <Card>
            <CardContent className="pt-6">
              <ContactForm userId={userId} />
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
  )
}



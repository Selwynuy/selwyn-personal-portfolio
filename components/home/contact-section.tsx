import { Card, CardContent } from '@/components/ui/card'
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
        <Card>
          <CardContent className="pt-6">
            <ContactForm userId={userId} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}



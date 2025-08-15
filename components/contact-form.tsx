'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createMessage } from '@/lib/actions'

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

interface ContactFormProps {
  userId: string
}

export function ContactForm({ userId }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    let isValid = true

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
      isValid = false
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required'
      isValid = false
    } else if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters'
      isValid = false
    } else if (formData.message.length > 500) {
      errors.message = 'Message must be less than 500 characters'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await createMessage({
        ...formData,
        user_id: userId,
        status: 'unread'
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      setFormErrors({})
      setSuccess(true)

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm animate-in fade-in slide-in-from-top-1">
          Your message has been sent successfully! I'll get back to you soon.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name" className="flex justify-between">
            <span>
              Name
              <span className="text-red-500 ml-1">*</span>
            </span>
            {formErrors.name && (
              <span className="text-red-500 text-sm">{formErrors.name}</span>
            )}
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            disabled={loading}
            className={`transition-colors ${
              formErrors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="flex justify-between">
            <span>
              Email
              <span className="text-red-500 ml-1">*</span>
            </span>
            {formErrors.email && (
              <span className="text-red-500 text-sm">{formErrors.email}</span>
            )}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            disabled={loading}
            className={`transition-colors ${
              formErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subject" className="flex justify-between">
          <span>Subject</span>
          <span className="text-slate-500 text-sm">
            {formData.subject.length}/100
          </span>
        </Label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What's this about?"
          disabled={loading}
          maxLength={100}
          className="transition-colors"
        />
      </div>

      <div className="grid gap-2">
                  <Label htmlFor="message" className="flex justify-between">
            <span>
              Message
              <span className="text-red-500 ml-1">*</span>
            </span>
            <div className="flex items-center gap-2">
              {formErrors.message && (
                <span className="text-red-500 text-sm">{formErrors.message}</span>
              )}
              <span className="text-slate-500 text-sm">
                {formData.message.length}/500
              </span>
            </div>
          </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message here..."
          className={`min-h-[150px] transition-colors ${
            formErrors.message ? 'border-red-500 focus-visible:ring-red-500' : ''
          }`}
          maxLength={500}
          required
          disabled={loading}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full md:w-auto relative" 
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="opacity-0">Send Message</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  )
}
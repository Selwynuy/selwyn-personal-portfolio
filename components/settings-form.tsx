'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ImageUpload } from '@/components/image-upload'
import { SocialLinksEditor } from '@/components/social-links-editor'
import { Database } from '@/lib/database.types'
import { updateProfile, updateSiteSettings } from '@/lib/actions'
import { CheckCircle } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

type Profile = Database['public']['Tables']['profiles']['Row']

interface SettingsFormProps {
  user: User
  profile?: Profile | null
  siteSettings?: {
    show_view_counts: boolean
    show_featured_first: boolean
    enable_blog: boolean
    enable_gallery: boolean
    meta_title: string | null
    meta_description: string | null
    resume_url: string | null
  } | null
  isAdmin?: boolean
}

export function SettingsForm({ user, profile, siteSettings, isAdmin = false }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || user?.user_metadata?.avatar_url)
  const [resumeUrl, setResumeUrl] = useState(siteSettings?.resume_url || '')

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || user?.user_metadata?.full_name || '',
    title: profile?.title || '',
    bio: profile?.bio || '',
    github_url: profile?.github_url || '',
    linkedin_url: profile?.linkedin_url || '',
    twitter_url: profile?.twitter_url || '',
    show_view_counts: siteSettings?.show_view_counts ?? true,
    show_featured_first: siteSettings?.show_featured_first ?? true,
    enable_blog: siteSettings?.enable_blog ?? false,
    enable_gallery: siteSettings?.enable_gallery ?? false,
    meta_title: siteSettings?.meta_title || '',
    meta_description: siteSettings?.meta_description || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Persist identity-only profile fields
      await updateProfile(user.id, {
        full_name: formData.full_name,
        title: formData.title,
        bio: formData.bio,
        github_url: formData.github_url,
        linkedin_url: formData.linkedin_url,
        twitter_url: formData.twitter_url,
        avatar_url: avatarUrl
      })
      
      // If admin, also persist site settings (singleton)
      if (isAdmin) {
        console.log('Attempting to save site settings with resume_url:', resumeUrl)
        try {
          await updateSiteSettings({
            show_view_counts: formData.show_view_counts,
            show_featured_first: formData.show_featured_first,
            enable_blog: formData.enable_blog,
            enable_gallery: formData.enable_gallery,
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
            resume_url: resumeUrl || null,
          })
          console.log('Site settings saved successfully')
        } catch (settingsError) {
          console.error('Error saving site settings:', settingsError)
          throw new Error(`Failed to save site settings: ${settingsError instanceof Error ? settingsError.message : 'Unknown error'}`)
        }
      }
      
      setSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
      
      // Refresh the page to update all components including navbar
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm animate-in fade-in slide-in-from-top-1">
          <CheckCircle className="w-4 h-4 mr-2 inline" />
          Profile updated successfully! Changes will appear across the site.
        </div>
      )}

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information and photo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <ImageUpload 
                  bucket="avatars"
                  onUpload={url => setAvatarUrl(url)}
                />
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Full Stack Developer"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell visitors about yourself..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Manage your social media links.</CardDescription>
              </CardHeader>
              <CardContent>
                <SocialLinksEditor userId={user.id} initialLinks={[]} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Portfolio Settings (admin-only) */}
        {isAdmin && (
        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Settings</CardTitle>
              <CardDescription>Customize how your portfolio appears to visitors.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show View Counts</Label>
                  <p className="text-sm text-slate-500">Display view counts on projects</p>
                </div>
                <Switch
                  checked={formData.show_view_counts}
                  onCheckedChange={show_view_counts => setFormData({ ...formData, show_view_counts })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Featured Projects</Label>
                  <p className="text-sm text-slate-500">Show featured projects first</p>
                </div>
                <Switch
                  checked={formData.show_featured_first}
                  onCheckedChange={show_featured_first => setFormData({ ...formData, show_featured_first })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Blog Section</Label>
                  <p className="text-sm text-slate-500">Enable blog section on portfolio</p>
                </div>
                <Switch
                  checked={formData.enable_blog}
                  onCheckedChange={enable_blog => setFormData({ ...formData, enable_blog })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Gallery Section</Label>
                  <p className="text-sm text-slate-500">Enable gallery section on portfolio</p>
                </div>
                <Switch
                  checked={formData.enable_gallery}
                  onCheckedChange={enable_gallery => setFormData({ ...formData, enable_gallery })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume/CV</CardTitle>
              <CardDescription>Upload your resume or CV for visitors to download.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Resume File (PDF)</Label>
                <ImageUpload
                  bucket="resumes"
                  onUpload={url => setResumeUrl(url)}
                  accept="application/pdf"
                />
                {resumeUrl && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span>Current resume:</span>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      View PDF
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize your portfolio for search engines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="Your Name - Full Stack Developer"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="A brief description of your portfolio for search engines..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        )}

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your account preferences and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                />
              </div>
              <Button type="button" variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Notification settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
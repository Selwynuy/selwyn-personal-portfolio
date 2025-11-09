export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          title: string | null
          bio: string | null
          github_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          show_view_counts: boolean
          show_featured_first: boolean
          enable_blog: boolean
          meta_title: string | null
          meta_description: string | null
          is_admin: boolean
          updated_at: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          title?: string | null
          bio?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          show_view_counts?: boolean
          show_featured_first?: boolean
          enable_blog?: boolean
          meta_title?: string | null
          meta_description?: string | null
          is_admin?: boolean
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          title?: string | null
          bio?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          show_view_counts?: boolean
          show_featured_first?: boolean
          enable_blog?: boolean
          meta_title?: string | null
          meta_description?: string | null
          is_admin?: boolean
          updated_at?: string
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string | null
          status: 'draft' | 'published'
          featured: boolean
          technologies: string[]
          github_url: string | null
          live_url: string | null
          image_url: string | null
          view_count: number
          user_id: string
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content?: string | null
          status?: 'draft' | 'published'
          featured?: boolean
          technologies?: string[]
          github_url?: string | null
          live_url?: string | null
          image_url?: string | null
          view_count?: number
          user_id: string
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string | null
          status?: 'draft' | 'published'
          featured?: boolean
          technologies?: string[]
          github_url?: string | null
          live_url?: string | null
          image_url?: string | null
          view_count?: number
          user_id?: string
          updated_at?: string
          created_at?: string
        }
      }
      project_media: {
        Row: {
          id: string
          project_id: string
          type: 'image' | 'video'
          url: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: 'image' | 'video'
          url: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: 'image' | 'video'
          url?: string
          position?: number
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          status: 'unread' | 'read' | 'archived'
          user_id: string
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          status?: 'unread' | 'read' | 'archived'
          user_id: string
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          status?: 'unread' | 'read' | 'archived'
          user_id?: string
          updated_at?: string
          created_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          user_id: string
          platform: string
          label: string | null
          url: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          label?: string | null
          url: string
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          label?: string | null
          url?: string
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: boolean
          show_view_counts: boolean
          show_featured_first: boolean
          enable_blog: boolean
          enable_gallery: boolean
          meta_title: string | null
          meta_description: string | null
          resume_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: boolean
          show_view_counts?: boolean
          show_featured_first?: boolean
          enable_blog?: boolean
          enable_gallery?: boolean
          meta_title?: string | null
          meta_description?: string | null
          resume_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: boolean
          show_view_counts?: boolean
          show_featured_first?: boolean
          enable_blog?: boolean
          enable_gallery?: boolean
          meta_title?: string | null
          meta_description?: string | null
          resume_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          cover_image_url: string | null
          status: 'draft' | 'published'
          featured: boolean
          tags: string[]
          view_count: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          cover_image_url?: string | null
          status?: 'draft' | 'published'
          featured?: boolean
          tags?: string[]
          view_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          cover_image_url?: string | null
          status?: 'draft' | 'published'
          featured?: boolean
          tags?: string[]
          view_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gallery_items: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          image_url: string
          thumbnail_url: string | null
          category: string | null
          tags: string[]
          position: number
          featured: boolean
          status: 'draft' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          image_url: string
          thumbnail_url?: string | null
          category?: string | null
          tags?: string[]
          position?: number
          featured?: boolean
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          image_url?: string
          thumbnail_url?: string | null
          category?: string | null
          tags?: string[]
          position?: number
          featured?: boolean
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      increment_view_count: {
        Args: {
          project_id: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      make_admin: {
        Args: {
          target_user_id: string
        }
        Returns: undefined
      }
    }
  }
}

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
    }
    Functions: {
      increment_view_count: {
        Args: {
          project_id: string
        }
        Returns: undefined
      }
    }
  }
}

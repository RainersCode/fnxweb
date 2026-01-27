export type Article = {
  id: string
  title: string
  content: string
  image_url?: string
  published_at: string
  updated_at: string
  author?: string
  slug: string
  is_featured: boolean
}

export type Fixture = {
  id: string
  opponent: string
  match_date: string
  location?: string
  score?: string
  is_home_game: boolean
  result?: 'win' | 'loss' | 'draw'
  description?: string
  home_logo_url?: string
  away_logo_url?: string
}

export type Gallery = {
  id: string
  title: string
  description?: string
  created_at: string
  cover_image?: string | null
}

export type GalleryImage = {
  id: string
  gallery_id: string
  image_url: string
  caption?: string
  uploaded_at: string
  display_order: number
}

export type TeamPlayer = {
  id: string
  name: string
  position?: string
  bio?: string
  image_url?: string
  jersey_number?: number
  is_active: boolean
}

export type Coach = {
  id: string
  name: string
  role?: string
  bio?: string
  image_url?: string
  is_active: boolean
}

export type Contact = {
  id: string
  type: string
  value: string
  label?: string
  display_order: number
}

export type TrainingSession = {
  id: string
  day_of_week: number // 0 = Sunday, 1 = Monday, etc.
  start_time: string // Format: "HH:MM"
  end_time: string // Format: "HH:MM"
  location: string
  team_group?: string // e.g., "Pieaugušie", "Juniori", "Bērni"
  description?: string
  is_active: boolean
}

// Partial types for creating and updating
export type CreateArticle = Omit<Article, 'id' | 'published_at' | 'updated_at'>
export type UpdateArticle = Partial<Omit<Article, 'id'>>

export type CreateFixture = Omit<Fixture, 'id'>
export type UpdateFixture = Partial<Omit<Fixture, 'id'>>

export type CreateGallery = Omit<Gallery, 'id' | 'created_at'>
export type UpdateGallery = Partial<Omit<Gallery, 'id' | 'created_at'>>

export type CreateGalleryImage = Omit<GalleryImage, 'id' | 'uploaded_at'>
export type UpdateGalleryImage = Partial<Omit<GalleryImage, 'id' | 'gallery_id' | 'uploaded_at'>>

export type CreateTeamPlayer = Omit<TeamPlayer, 'id'>
export type UpdateTeamPlayer = Partial<Omit<TeamPlayer, 'id'>>

export type CreateCoach = Omit<Coach, 'id'>
export type UpdateCoach = Partial<Omit<Coach, 'id'>>

export type CreateContact = Omit<Contact, 'id'>
export type UpdateContact = Partial<Omit<Contact, 'id'>>

export type CreateTrainingSession = Omit<TrainingSession, 'id'>
export type UpdateTrainingSession = Partial<Omit<TrainingSession, 'id'>>

// Database response types
export type Database = {
  public: {
    Tables: {
      articles: {
        Row: Article
        Insert: CreateArticle
        Update: UpdateArticle
      }
      fixtures: {
        Row: Fixture
        Insert: CreateFixture
        Update: UpdateFixture
      }
      galleries: {
        Row: Gallery
        Insert: CreateGallery
        Update: UpdateGallery
      }
      gallery_images: {
        Row: GalleryImage
        Insert: CreateGalleryImage
        Update: UpdateGalleryImage
      }
      team_players: {
        Row: TeamPlayer
        Insert: CreateTeamPlayer
        Update: UpdateTeamPlayer
      }
      coaches: {
        Row: Coach
        Insert: CreateCoach
        Update: UpdateCoach
      }
      contacts: {
        Row: Contact
        Insert: CreateContact
        Update: UpdateContact
      }
      training_sessions: {
        Row: TrainingSession
        Insert: CreateTrainingSession
        Update: UpdateTrainingSession
      }
    }
  }
}

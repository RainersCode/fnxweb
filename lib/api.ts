import { createAdminClient, supabase } from './supabase'

// Type definitions - ideally these would be in separate files in the types directory
export type Article = {
  id?: string
  title: string
  content: string
  image_url?: string
  published_at?: string
  updated_at?: string
  author?: string
  slug?: string
  is_featured?: boolean
}

export type Fixture = {
  id?: string
  opponent: string
  match_date: string
  location?: string
  score?: string
  is_home_game?: boolean
  result?: 'win' | 'loss' | 'draw'
  description?: string
}

export type Gallery = {
  id?: string
  title: string
  description?: string
  created_at?: string
}

export type GalleryImage = {
  id?: string
  gallery_id: string
  image_url: string
  caption?: string
  uploaded_at?: string
  display_order?: number
}

export type TeamPlayer = {
  id?: string
  name: string
  position?: string
  bio?: string
  image_url?: string
  jersey_number?: number
  is_active?: boolean
}

export type Coach = {
  id?: string
  name: string
  role?: string
  bio?: string
  image_url?: string
  is_active?: boolean
}

export type Contact = {
  id?: string
  type: string
  value: string
  label?: string
  display_order?: number
}

// Articles
export async function getArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single()

  if (error) throw error
  return data
}

export async function createArticle(article: Article) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient.from('articles').insert(article).select().single()

  if (error) throw error
  return data
}

export async function updateArticle(id: string, article: Partial<Article>) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('articles')
    .update(article)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteArticle(id: string) {
  const adminClient = createAdminClient()
  const { error } = await adminClient.from('articles').delete().eq('id', id)

  if (error) throw error
  return true
}

// Fixtures
export async function getFixtures() {
  const { data, error } = await supabase
    .from('fixtures')
    .select('*')
    .order('match_date', { ascending: true })

  if (error) throw error
  return data
}

export async function createFixture(fixture: Fixture) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient.from('fixtures').insert(fixture).select().single()

  if (error) throw error
  return data
}

export async function updateFixture(id: string, fixture: Partial<Fixture>) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('fixtures')
    .update(fixture)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteFixture(id: string) {
  const adminClient = createAdminClient()
  const { error } = await adminClient.from('fixtures').delete().eq('id', id)

  if (error) throw error
  return true
}

// Galleries
export async function getGalleries() {
  const { data, error } = await supabase
    .from('galleries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getGalleryWithImages(id: string) {
  const { data: gallery, error: galleryError } = await supabase
    .from('galleries')
    .select('*')
    .eq('id', id)
    .single()

  if (galleryError) throw galleryError

  const { data: images, error: imagesError } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('gallery_id', id)
    .order('display_order', { ascending: true })

  if (imagesError) throw imagesError

  return { ...gallery, images }
}

export async function createGallery(gallery: Gallery) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient.from('galleries').insert(gallery).select().single()

  if (error) throw error
  return data
}

export async function updateGallery(id: string, gallery: Partial<Gallery>) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('galleries')
    .update(gallery)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGallery(id: string) {
  const adminClient = createAdminClient()
  const { error } = await adminClient.from('galleries').delete().eq('id', id)

  if (error) throw error
  return true
}

// Gallery Images
export async function addGalleryImage(image: GalleryImage) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient.from('gallery_images').insert(image).select().single()

  if (error) throw error
  return data
}

export async function updateGalleryImage(id: string, image: Partial<GalleryImage>) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('gallery_images')
    .update(image)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGalleryImage(id: string) {
  const adminClient = createAdminClient()
  const { error } = await adminClient.from('gallery_images').delete().eq('id', id)

  if (error) throw error
  return true
}

// Team Players
export async function getTeamPlayers() {
  const { data, error } = await supabase
    .from('team_players')
    .select('*')
    .order('jersey_number', { ascending: true })

  if (error) throw error
  return data
}

export async function createTeamPlayer(player: TeamPlayer) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient.from('team_players').insert(player).select().single()

  if (error) throw error
  return data
}

export async function updateTeamPlayer(id: string, player: Partial<TeamPlayer>) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('team_players')
    .update(player)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTeamPlayer(id: string) {
  const adminClient = createAdminClient()
  const { error } = await adminClient.from('team_players').delete().eq('id', id)

  if (error) throw error
  return true
}

// Coaches
export async function getCoaches() {
  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function createCoach(coach: Coach) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient.from('coaches').insert(coach).select().single()

  if (error) throw error
  return data
}

export async function updateCoach(id: string, coach: Partial<Coach>) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('coaches')
    .update(coach)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCoach(id: string) {
  const adminClient = createAdminClient()
  const { error } = await adminClient.from('coaches').delete().eq('id', id)

  if (error) throw error
  return true
}

// Contacts
export async function getContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data
}

export async function createContact(contact: Contact) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient.from('contacts').insert(contact).select().single()

  if (error) throw error
  return data
}

export async function updateContact(id: string, contact: Partial<Contact>) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('contacts')
    .update(contact)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteContact(id: string) {
  const adminClient = createAdminClient()
  const { error } = await adminClient.from('contacts').delete().eq('id', id)

  if (error) throw error
  return true
}

// Storage (Media uploads)
export async function uploadMedia(file: File, path: string) {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient.storage.from('media').upload(path, file)

  if (error) throw error

  // Get public URL
  const { data: publicUrlData } = adminClient.storage.from('media').getPublicUrl(path)

  return publicUrlData.publicUrl
}

export async function deleteMedia(path: string) {
  const adminClient = createAdminClient()
  const { error } = await adminClient.storage.from('media').remove([path])

  if (error) throw error
  return true
}

// Get the first image of a gallery (for thumbnail)
export async function getGalleryFirstImage(galleryId: string) {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('gallery_id', galleryId)
    .order('display_order', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    // If no images found, return null instead of throwing error
    if (error.code === 'PGRST116') {
      return null
    }
    throw error
  }
  return data
}

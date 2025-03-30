'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Plus, Search, Loader2, CalendarDays, X } from 'lucide-react'
import { SectionContainer } from '@/components/shared/section-container'
import { SectionTitle } from '@/components/shared/section-title'
import { ImageUploader } from '@/components/shared/image-uploader'
import { RichTextEditor } from '@/components/shared/rich-text-editor'
import { Article } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function AdminArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  // Form state for add/edit
  const emptyFormState = {
    title: '',
    content: '',
    image_url: '',
    author: '',
    slug: '',
    is_featured: false,
  }
  const [formData, setFormData] = useState(emptyFormState)
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null)
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null)

  // Delete confirmation dialog
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)

  // Load articles from Supabase
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/articles')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter articles based on search query
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (article.author && article.author.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_featured: checked,
    })
  }

  // Generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')

    setFormData({
      ...formData,
      slug,
    })
  }

  // Handle image upload
  const handleImageUploaded = async (url: string, path: string) => {
    // If there was an existing image, we need to delete it
    if (formData.image_url && formData.image_url !== url) {
      try {
        // Extract the path from the URL
        const pathMatch = formData.image_url.match(/media\/([^?]+)/)
        if (pathMatch && pathMatch[1]) {
          const oldPath = `${pathMatch[1]}`
          // Delete the old image using the API
          await fetch('/api/admin/delete-media', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path: oldPath }),
          })
        }
      } catch (error) {
        console.error('Error deleting old image:', error)
      }
    }

    setFormData({
      ...formData,
      image_url: url,
    })
    setCurrentImagePath(path)
  }

  // Handle image removal
  const handleImageRemoved = async () => {
    // If there was an existing image, we need to delete it
    if (formData.image_url) {
      try {
        // Extract the path from the URL
        const pathMatch = formData.image_url.match(/media\/([^?]+)/)
        if (pathMatch && pathMatch[1]) {
          const path = `${pathMatch[1]}`
          // Delete the image using the API
          await fetch('/api/admin/delete-media', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path }),
          })
        }
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }

    setFormData({
      ...formData,
      image_url: '',
    })
    setCurrentImagePath(null)
  }

  // Handle form submission for adding a new article
  const handleAddArticle = async () => {
    if (!formData.title || !formData.content || !formData.slug) return

    setFormLoading(true)

    try {
      const newArticle = {
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url || null,
        author: formData.author || null,
        slug: formData.slug,
        is_featured: formData.is_featured,
      }

      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArticle),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setShowAddDialog(false)
      setFormData(emptyFormState)
      setCurrentImagePath(null)
      await fetchArticles()
    } catch (error) {
      console.error('Error adding article:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Open edit dialog with article data
  const handleEditClick = (article: Article) => {
    setCurrentArticleId(article.id)
    setFormData({
      title: article.title,
      content: article.content,
      image_url: article.image_url || '',
      author: article.author || '',
      slug: article.slug,
      is_featured: article.is_featured,
    })
    setShowEditDialog(true)
  }

  // Handle form submission for updating an article
  const handleUpdateArticle = async () => {
    if (!currentArticleId || !formData.title || !formData.content || !formData.slug) return

    setFormLoading(true)

    try {
      const articleUpdate = {
        id: currentArticleId,
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url || null,
        author: formData.author || null,
        slug: formData.slug,
        is_featured: formData.is_featured,
        updated_at: new Date().toISOString(),
      }

      const response = await fetch('/api/admin/articles', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleUpdate),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setShowEditDialog(false)
      setFormData(emptyFormState)
      setCurrentArticleId(null)
      setCurrentImagePath(null)
      await fetchArticles()
    } catch (error) {
      console.error('Error updating article:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Delete article
  const deleteArticle = async () => {
    if (!articleToDelete) return

    try {
      // First, check if the article has an image and delete it
      if (articleToDelete.image_url) {
        try {
          // Extract the path from the URL
          const pathMatch = articleToDelete.image_url.match(/media\/([^?]+)/)
          if (pathMatch && pathMatch[1]) {
            const path = `${pathMatch[1]}`
            // Delete the image using the API
            const response = await fetch('/api/admin/delete-media', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ path }),
            })

            if (!response.ok) {
              console.error('Failed to delete image:', await response.json())
            }
          }
        } catch (imageError) {
          console.error('Error deleting article image:', imageError)
          // Continue with article deletion even if image deletion fails
        }
      }

      const response = await fetch('/api/admin/articles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: articleToDelete.id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      setArticles(articles.filter((article) => article.id !== articleToDelete.id))
      setArticleToDelete(null)
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('en-GB', options)
  }

  return (
    <main className="flex-1 pb-16">
      <SectionContainer className="bg-white">
        <div className="relative z-10">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <SectionTitle title="MANAGE" titleHighlight="ARTICLES" />
            <p className="mt-4 text-muted-foreground">
              Add, edit and delete articles for the club website.
            </p>
          </div>

          <div className="mb-8 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Article
            </Button>
          </div>

          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>Loading articles...</span>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center">
              <p className="mb-4 text-lg font-medium">No articles found</p>
              <Button variant="outline" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add your first article
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold leading-tight tracking-tight text-gray-800">
                      {article.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      {article.is_featured && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          Featured
                        </span>
                      )}
                      <span className="inline-flex items-center">
                        <CalendarDays className="mr-1 h-4 w-4" />
                        {formatDate(article.published_at)}
                      </span>
                      {article.author && <span>By {article.author}</span>}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-2 md:mt-0">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(article)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setArticleToDelete(article)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the article &quot;{articleToDelete?.title}
                            &quot;. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setArticleToDelete(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={deleteArticle}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Add Article Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Article</DialogTitle>
            <DialogDescription>
              Create a new article to be displayed on the website.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter article title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={generateSlug}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="slug"
                  name="slug"
                  placeholder="article-url-slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="author">Author (optional)</Label>
              <Input
                id="author"
                name="author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Featured Image</Label>
              <ImageUploader
                imageUrl={formData.image_url}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Feature this article on homepage
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddDialog(false)
                setFormData(emptyFormState)
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAddArticle} disabled={formLoading}>
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Article'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>Make changes to the article.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                placeholder="Enter article title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={generateSlug}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-slug"
                  name="slug"
                  placeholder="article-url-slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-author">Author (optional)</Label>
              <Input
                id="edit-author"
                name="author"
                placeholder="Enter author name"
                value={formData.author || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Featured Image</Label>
              <ImageUploader
                imageUrl={formData.image_url}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-is_featured"
                checked={formData.is_featured}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="edit-is_featured" className="cursor-pointer">
                Feature this article on homepage
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditDialog(false)
                setFormData(emptyFormState)
                setCurrentArticleId(null)
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateArticle} disabled={formLoading}>
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Update Article'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

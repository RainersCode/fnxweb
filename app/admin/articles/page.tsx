'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Plus, Search, Loader2, CalendarDays, X } from 'lucide-react'
import { SectionContainer } from '@/components/shared/section-container'
import { SectionTitle } from '@/components/shared/section-title'
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
          </div>

          {/* Controls */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="absolute right-2 top-2.5" onClick={() => setSearchQuery('')}>
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <Button
              onClick={() => {
                setFormData(emptyFormState)
                setShowAddDialog(true)
              }}
              className="bg-teal-800 text-white hover:bg-teal-900"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Article
            </Button>
          </div>

          {/* Articles List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-500">No articles found</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="grid grid-cols-1 divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-teal-900">{article.title}</h3>

                        <div className="mb-2 mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <CalendarDays className="h-4 w-4" />
                          <span>Published: {formatDate(article.published_at)}</span>
                          {article.published_at !== article.updated_at && (
                            <span>(Updated: {formatDate(article.updated_at)})</span>
                          )}
                        </div>

                        {article.author && (
                          <div className="mb-2 text-sm text-gray-600">
                            <span className="font-medium">Author:</span> {article.author}
                          </div>
                        )}

                        <p className="text-gray-600">
                          {article.content.length > 150
                            ? `${article.content.substring(0, 150)}...`
                            : article.content}
                        </p>

                        {article.is_featured && (
                          <div className="mt-2">
                            <span className="inline-block rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(article)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => setArticleToDelete(article)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Add Article Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Article</DialogTitle>
            <DialogDescription>
              Create a new article to be published on the website.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={generateSlug}
                placeholder="Article title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="article-slug"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Article content"
                className="min-h-[150px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image_url">Image URL (optional)</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="author">Author (optional)</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Author name"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_featured">Featured article</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddArticle}
              className="bg-teal-800 text-white hover:bg-teal-900"
              disabled={formLoading || !formData.title || !formData.content || !formData.slug}
            >
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Article Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[550px]">
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
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Article title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="article-slug"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Article content"
                className="min-h-[150px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-image_url">Image URL (optional)</Label>
              <Input
                id="edit-image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-author">Author (optional)</Label>
              <Input
                id="edit-author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Author name"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-is_featured"
                checked={formData.is_featured}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="edit-is_featured">Featured article</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateArticle}
              className="bg-teal-800 text-white hover:bg-teal-900"
              disabled={formLoading || !formData.title || !formData.content || !formData.slug}
            >
              {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!articleToDelete}
        onOpenChange={(open) => !open && setArticleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the article &quot;{articleToDelete?.title}&quot;. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteArticle}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}

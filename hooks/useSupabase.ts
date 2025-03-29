import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useSupabase() {
  const uploadFile = useCallback(async (file: File, bucket: string, folder: string) => {
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${fileName}`

      // Upload file
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

      return {
        url: data.publicUrl,
        path: filePath,
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }, [])

  const deleteFile = useCallback(async (bucket: string, path: string) => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path])
      if (error) {
        throw error
      }
      return true
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  }, [])

  return {
    supabase,
    uploadFile,
    deleteFile,
  }
}

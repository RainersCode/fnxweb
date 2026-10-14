'use client'

import { PhotoField } from '@/components/admin/ui/photo-field'

export function CoverPhotoField({ articleId, value, onChange }: { articleId: string; value: string | null; onChange: (url: string | null) => void }) {
  return <PhotoField value={value} folder={`articles/${articleId}`} aspect="cover" onChange={onChange} label="Pievieno vāka foto" />
}

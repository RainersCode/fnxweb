'use client'

import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Link2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function LinkPopover({ editor, buttonClass }: { editor: Editor; buttonClass: string }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')

  const onOpenChange = (next: boolean) => {
    if (next) setUrl(editor.getAttributes('link').href ?? '')
    setOpen(next)
  }

  const apply = () => {
    const value = url.trim()
    const chain = editor.chain().focus().extendMarkRange('link')
    if (!value) chain.unsetLink().run()
    else chain.setLink({ href: /^(https?:|mailto:|\/)/i.test(value) ? value : `https://${value}` }).run()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger type="button" aria-label="Saite" className={buttonClass}>
        <Link2 className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <form onSubmit={(e) => { e.preventDefault(); apply() }} className="grid gap-2">
          <label htmlFor="link-url" className="text-sm font-semibold">Saite</label>
          <input id="link-url" type="url" inputMode="url" autoFocus value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="rounded-md border border-[#DCE3DF] px-3 py-2" />
          <div className="flex justify-end gap-2">
            {editor.isActive('link') && (
              <button type="button" onClick={() => { editor.chain().focus().unsetLink().run(); setOpen(false) }} className="rounded-md px-3 py-1.5 text-sm font-semibold text-[#B42318]">Noņemt</button>
            )}
            <button type="submit" className="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white">Saglabāt</button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}

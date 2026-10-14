'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useUnsavedGuard } from './use-unsaved-guard'
import { leaveWarning } from './leave-warning'

export function AdminFormPage({ backHref, backLabel, title, saving, dirty, uploading, onSave, onDelete, deleteTitle, children }: {
  backHref: string
  backLabel: string
  title: string
  saving: boolean
  dirty: boolean
  uploading?: boolean
  onSave: () => void
  onDelete?: () => void
  deleteTitle?: string
  children: ReactNode
}) {
  useUnsavedGuard(leaveWarning({ dirty, uploading }))
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[#DCE3DF] bg-white px-3 lg:px-5">
        <Link href={backHref} className="flex items-center gap-1 font-semibold text-[#5B6863] hover:text-[#141414]">
          <ArrowLeft className="h-5 w-5" /><span className="hidden sm:inline">{backLabel}</span>
        </Link>
        <h1 className="min-w-0 truncate font-display text-lg font-bold uppercase text-club">{title}</h1>
        <span className="flex-1" />
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger aria-label="Dzēst" className="rounded-md p-2 text-[#B42318] hover:bg-[#FDECEA]"><Trash2 className="h-5 w-5" /></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{deleteTitle ?? 'Dzēst?'}</AlertDialogTitle>
                <AlertDialogDescription>To nevarēs atsaukt.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Atcelt</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-[#B42318] hover:bg-[#912018]">Dzēst</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <button type="button" onClick={onSave} disabled={saving} className="rounded-md bg-teal-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-60">
          {saving ? 'Saglabā…' : 'Saglabāt'}
        </button>
      </header>
      <div className="mx-auto grid max-w-2xl gap-5 px-4 pb-24 pt-6 lg:pb-12">{children}</div>
    </div>
  )
}

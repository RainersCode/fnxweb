import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/shell/admin-shell'
import { isAdminRequest } from '@/lib/admin-auth'

// The admin is private: keep it out of search results
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  if (!(await isAdminRequest())) {
    redirect('/')
  }

  return <AdminShell>{children}</AdminShell>
}

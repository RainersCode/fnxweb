import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'
import { isAdminRequest } from '@/lib/admin-auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  if (!(await isAdminRequest())) {
    redirect('/')
  }

  return <MainLayout currentPage="ADMIN">{children}</MainLayout>
}

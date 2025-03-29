import { auth, clerkClient } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth()
  const allowedEmails = process.env.ALLOWED_EMAILS

  if (!userId) {
    redirect('/sign-in')
  }

  try {
    const user = await clerkClient.users.getUser(userId)
    const userEmail = user.emailAddresses[0]?.emailAddress

    if (!userEmail || !allowedEmails.includes(userEmail)) {
      redirect('/')
    }
  } catch (error) {
    console.error('Error in admin layout auth:', error)
    redirect('/')
  }

  return <MainLayout currentPage="ADMIN">{children}</MainLayout>
}

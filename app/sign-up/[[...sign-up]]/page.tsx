import { SignUp } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Sign Up - Rugby Club Admin',
  description: 'Create an account to access the admin dashboard',
}

export default function SignUpPage({ searchParams }: { searchParams: { redirect_url?: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Create Admin Account
          </h2>
        </div>
        <SignUp
          path="/sign-up"
          routing="path"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'rounded-lg shadow-md bg-white p-6',
            },
          }}
          redirectUrl={searchParams.redirect_url || '/admin'}
          signInUrl="/sign-in"
        />
      </div>
    </div>
  )
}

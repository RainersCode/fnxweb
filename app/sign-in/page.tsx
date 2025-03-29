import { SignIn } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Rugby Club Admin',
  description: 'Sign in to access the admin dashboard',
}

export default function SignInPage({ searchParams }: { searchParams: { redirect_url?: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Sign in to Admin Dashboard
          </h2>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'rounded-lg shadow-md bg-white p-6',
            },
          }}
          redirectUrl={searchParams.redirect_url || '/admin'}
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  )
}

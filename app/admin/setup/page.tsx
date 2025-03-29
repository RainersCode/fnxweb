'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    error?: string
    message?: string
  } | null>(null)

  const handleSetupClick = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // First, set up the exec_sql function
      const setupResponse = await fetch('/api/admin/setup-exec-sql', {
        method: 'POST',
      })

      if (!setupResponse.ok) {
        const setupData = await setupResponse.json()
        throw new Error(setupData.error || 'Failed to set up exec_sql function')
      }

      // Then, run the schema update
      const response = await fetch('/api/admin/update-schema', {
        method: 'POST',
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error updating schema:', error)
      setResult({ error: error instanceof Error ? error.message : 'Failed to update schema' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Database Setup</h1>
      <Card className="p-6">
        <h2 className="mb-2 text-lg font-medium">Create/Update Database Schema</h2>
        <p className="mb-6 text-gray-600">
          This will create or update necessary database tables for the website. Use this if you're
          setting up the site for the first time or after updating the code base.
        </p>

        <Button onClick={handleSetupClick} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Setting up...' : 'Run Setup'}
        </Button>

        {result && (
          <div
            className={`mt-4 rounded-md p-4 ${
              result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {result.success ? (
              <p>{result.message || 'Setup completed successfully!'}</p>
            ) : (
              <p>{result.error || 'An error occurred during setup.'}</p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

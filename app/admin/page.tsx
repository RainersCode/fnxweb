import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Content Management Cards */}
          <Card className="p-6 transition-shadow hover:shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Articles</h2>
            <p className="mb-4 text-gray-600">Manage club news and articles</p>
            <Link href="/admin/articles" className="text-blue-600 hover:text-blue-800">
              Manage Articles →
            </Link>
          </Card>

          <Card className="p-6 transition-shadow hover:shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Fixtures</h2>
            <p className="mb-4 text-gray-600">Update match schedules and results</p>
            <Link href="/admin/fixtures" className="text-blue-600 hover:text-blue-800">
              Manage Fixtures →
            </Link>
          </Card>

          <Card className="p-6 transition-shadow hover:shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Galleries</h2>
            <p className="mb-4 text-gray-600">Upload and manage photo galleries</p>
            <Link href="/admin/gallery" className="text-blue-600 hover:text-blue-800">
              Manage Galleries →
            </Link>
          </Card>

          <Card className="p-6 transition-shadow hover:shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Team Players</h2>
            <p className="mb-4 text-gray-600">Manage player profiles and information</p>
            <Link href="/admin/players" className="text-blue-600 hover:text-blue-800">
              Manage Players →
            </Link>
          </Card>

          <Card className="p-6 transition-shadow hover:shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Coaches</h2>
            <p className="mb-4 text-gray-600">Update coaching staff information</p>
            <Link href="/admin/coaches" className="text-blue-600 hover:text-blue-800">
              Manage Coaches →
            </Link>
          </Card>

          <Card className="p-6 transition-shadow hover:shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Contact Information</h2>
            <p className="mb-4 text-gray-600">Update club contact details</p>
            <Link href="/admin/contact" className="text-blue-600 hover:text-blue-800">
              Manage Contacts →
            </Link>
          </Card>
        </div>
      </div>
    </main>
  )
}

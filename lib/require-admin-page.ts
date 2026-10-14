import { notFound } from 'next/navigation'
import { isAdminRequest } from './admin-auth'

// Admin server pages call this themselves: a layout check alone does not re-run on
// client-side navigation. Kept out of lib/admin-auth because middleware imports that file.
export async function requireAdminPage(): Promise<void> {
  if (!(await isAdminRequest())) notFound()
}

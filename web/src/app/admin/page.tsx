import { requireRole } from '@/lib/auth/requireRole'
import { DashboardClient } from '@/features/dashboard/DashboardClient'

export default async function AdminDashboardPage() {
  const { user } = await requireRole(['hr_admin', 'bu_manager'])

  return <DashboardClient userEmail={user.email ?? ''} />
}

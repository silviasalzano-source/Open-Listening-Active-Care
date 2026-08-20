import { requireRole } from '@/lib/auth/requireRole'

export default async function AdminDashboardPage() {
  const { user } = await requireRole(['hr_admin'])

  return (
    <main>
      <h1>Dashboard HR</h1>
      <p>
        Placeholder — le metriche mostrate qui saranno definite
        funzionalmente in una fase successiva con HR.
      </p>
      <p>Accesso effettuato come: {user.email}</p>
    </main>
  )
}

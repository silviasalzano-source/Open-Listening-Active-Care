import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main>
      <h1>Dashboard HR</h1>
      <p>
        Placeholder — le metriche mostrate qui saranno definite
        funzionalmente in una fase successiva con HR.
      </p>
      <p>Accesso effettuato come: {user?.email}</p>
    </main>
  )
}
